#!/usr/bin/env node
/**
 * Claude Code PreToolUse hook for Bash (see .claude/settings.json and CLAUDE.md §2).
 *
 * Blocks, with a message Claude sees:
 * - committing, merging, rebasing, cherry-picking or reverting while on main/development
 * - pushing to main/development, whether named or implied by the current branch
 * - force pushes, --all/--mirror pushes, and deleting main/development
 * - pushes whose new commits contain design references, PDFs or .env files (this repo is
 *   public, so anything pushed is public)
 * - merging pull requests and changing the repository (gh pr merge, gh repo edit/delete/...)
 *
 * Exit 0 lets the command run; exit 2 blocks it and shows stderr to Claude.
 */
import { execFileSync } from "node:child_process";

const PROTECTED = new Set(["main", "development"]);
const COMMITTING = new Set([
  "commit",
  "merge",
  "rebase",
  "cherry-pick",
  "revert",
  "am",
]);
const ALLOWED_FLAGS = new Set(["--abort", "--continue", "--quit", "--skip"]);
const HOW =
  "Work on your own branch (feature/<name>-module or fix/<name>) and open a PR into development; a teammate other than the author reviews it before merging.";

function block(reason) {
  process.stderr.write(
    `Blocked by Notchs team rules (CLAUDE.md §2): ${reason}. ${HOW}\n`,
  );
  process.exit(2);
}

function currentBranch(dir) {
  try {
    return execFileSync(
      "git",
      ["-C", dir, "rev-parse", "--abbrev-ref", "HEAD"],
      {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    ).trim();
  } catch {
    return "";
  }
}

/** Files that must never reach GitHub. `.env.example` is fine. */
const NEVER_PUSH = /^All pages designs\/|\.pdf$|(^|\/)\.env($|\.(?!example$))/;

/** Files touched by commits in `refs` that no remote branch has yet. */
function outgoingFiles(dir, refs) {
  try {
    return execFileSync(
      "git",
      [
        "-C",
        dir,
        "log",
        "--name-only",
        "--format=",
        ...refs,
        "--not",
        "--remotes",
      ],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    )
      .split("\n")
      .filter(Boolean);
  } catch {
    return [];
  }
}

/** "refs/heads/main" -> "main"; "HEAD" -> the current branch. */
function branchName(ref, current) {
  const name = ref.replace(/^refs\/heads\//, "");
  return name === "HEAD" ? current : name;
}

function checkGit(words, cwd) {
  // Skip global options such as `-C <dir>` and `-c key=value` before the subcommand.
  let dir = cwd;
  let i = 1;
  while (i < words.length && words[i].startsWith("-")) {
    if (words[i] === "-C") dir = words[i + 1] ?? dir;
    i += words[i] === "-C" || words[i] === "-c" ? 2 : 1;
  }
  const sub = words[i];
  const args = words.slice(i + 1);
  const branch = currentBranch(dir);

  if (COMMITTING.has(sub) && PROTECTED.has(branch)) {
    if (args.some((arg) => ALLOWED_FLAGS.has(arg))) return;
    block(`"git ${sub}" while on ${branch}`);
  }

  if (sub === "push") {
    const flags = args.filter((arg) => arg.startsWith("-"));
    const positional = args.filter((arg) => !arg.startsWith("-"));
    if (
      flags.some((f) =>
        /^(-f|--force|--force-with-lease|--force-if-includes)/.test(f),
      )
    ) {
      block("force push");
    }
    if (flags.some((f) => f === "--all" || f === "--mirror"))
      block(`"git push ${flags.join(" ")}"`);
    const deleting = flags.some((f) => f === "-d" || f === "--delete");

    const refspecs = positional.slice(1); // the first one is the remote

    // What would be uploaded: HEAD, or the source side of each refspec.
    const sources = deleting
      ? []
      : refspecs.length === 0
        ? ["HEAD"]
        : refspecs
            .map((spec) => spec.replace(/^\+/, "").split(":")[0])
            .filter(Boolean);
    const unsafe = [
      ...new Set(outgoingFiles(dir, sources).filter((f) => NEVER_PUSH.test(f))),
    ];
    if (unsafe.length > 0) {
      block(
        `these files would be uploaded to the public repo: ${unsafe.slice(0, 5).join(", ")}${unsafe.length > 5 ? ` and ${unsafe.length - 5} more` : ""}. Remove them from your branch's history first (ask the team)`,
      );
    }

    if (refspecs.length === 0) {
      if (PROTECTED.has(branch)) block(`pushing while on ${branch}`);
      return;
    }
    for (const spec of refspecs) {
      if (spec.startsWith("+")) block("force push (+refspec)");
      const target = branchName(
        spec.includes(":") ? spec.split(":")[1] : spec,
        branch,
      );
      if (PROTECTED.has(target))
        block(`${deleting ? "deleting" : "pushing to"} ${target}`);
    }
  }
}

function checkGh(words) {
  const [, area, action] = words;
  if (area === "pr" && action === "merge") block("merging a pull request");
  if (
    area === "repo" &&
    ["edit", "delete", "rename", "archive", "unarchive"].includes(action)
  ) {
    block(`"gh repo ${action}"`);
  }
}

let input = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) input += chunk;

let payload = {};
try {
  payload = JSON.parse(input);
} catch {
  process.exit(0);
}
const command = payload?.tool_input?.command ?? "";
const cwd = payload?.cwd || process.cwd();
if (!/\b(git|gh)\b/.test(command)) process.exit(0);

// Check every part of chained commands: a && b; c | d
for (const part of command.split(/&&|\|\||;|\||\n/)) {
  const words = part.trim().split(/\s+/).filter(Boolean);
  while (words.length && /^[A-Z_][A-Z0-9_]*=/.test(words[0])) words.shift(); // FOO=bar git ...
  if (words[0] === "git") checkGit(words, cwd);
  if (words[0] === "gh") checkGh(words);
}
process.exit(0);
