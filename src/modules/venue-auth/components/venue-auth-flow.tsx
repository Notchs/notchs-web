"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { routes } from "@/config/routes";
import { ButtonLink } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";

import { flowContent } from "../content";
import { getVenueMe, type VenueMember } from "../lib/api";
import { ApplicationPath } from "./application-path";
import { DonePanel } from "./done-panel";
import { LoggedInPanel } from "./logged-in-panel";
import { ForgotForm, LoginForm } from "./login-screens";
import { ApplyEmailForm, CodeForm, VenueForm } from "./signup-screens";
import { ScreenFrame } from "./venue-auth-shell";

export type VenueAuthScreen =
  | "login"
  | "forgot"
  | "forgotSent"
  | "loggedIn"
  | "apply"
  | "code"
  | "venue"
  | "applied";

const applyScreens: VenueAuthScreen[] = ["apply", "code", "venue", "applied"];

/** How many of the three application steps are complete on this screen. */
const stepOf = (screen: VenueAuthScreen) =>
  screen === "venue" ? 1 : screen === "applied" ? 3 : 0;

/** `?view=` values that open a screen other than log in. */
const linkedScreens: Record<string, VenueAuthScreen> = {
  apply: "apply",
  /** Older links. */
  signup: "apply",
  forgot: "forgot",
};

/**
 * Venue owner log in, password reset request and venue application,
 * as one page that swaps screens in place. `?view=apply` or `?view=forgot`
 * opens that screen first. A logged-in owner goes on to `dashboardHref`, or
 * sees the logged-in panel on builds without the dashboard.
 */
export function VenueAuthFlow({ dashboardHref }: { dashboardHref?: string }) {
  const view = useSearchParams().get("view");
  const [screen, setScreen] = useState<VenueAuthScreen>(
    () => (view && linkedScreens[view]) || "login",
  );
  const [email, setEmail] = useState("");
  const [member, setMember] = useState<VenueMember>();
  const [verificationToken, setVerificationToken] = useState("");
  const [application, setApplication] = useState<{
    venueName: string;
    reference?: string;
  }>();

  const applying = applyScreens.includes(screen);
  const swap = flowContent.swap[applying ? "apply" : "login"];
  /** The log in / apply switch sits under the form, not on end screens. */
  const showSwap = screen === "login" || (applying && screen !== "applied");

  // Someone who is still logged in skips the form.
  useEffect(() => {
    let live = true;
    getVenueMe().then(
      (response) => {
        if (!live) return;
        setMember(response.data);
        setScreen((current) => (current === "login" ? "loggedIn" : current));
      },
      () => {},
    );
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (screen === "loggedIn" && dashboardHref) {
      window.location.replace(dashboardHref);
    }
  }, [screen, dashboardHref]);

  function body() {
    switch (screen) {
      case "login":
        return (
          <LoginForm
            email={email}
            onEmailChange={setEmail}
            onForgot={() => setScreen("forgot")}
            onLoggedIn={(data) => {
              setMember(data);
              setScreen("loggedIn");
            }}
          />
        );
      case "forgot":
        return (
          <ForgotForm
            email={email}
            onEmailChange={setEmail}
            onBack={() => setScreen("login")}
            onSent={() => setScreen("forgotSent")}
          />
        );
      case "forgotSent":
        return (
          <DonePanel
            stamp={flowContent.forgot.sentStamp}
            title={flowContent.forgot.sentTitle}
            body={flowContent.forgot.sentBody(email.trim().toLowerCase())}
          >
            <button
              type="button"
              onClick={() => setScreen("login")}
              className="h-12 cursor-pointer font-semibold underline underline-offset-[3px]"
            >
              {flowContent.forgot.sentCta}
            </button>
          </DonePanel>
        );
      case "loggedIn":
        return (
          <LoggedInPanel
            stamp={flowContent.done.loginStamp}
            member={member}
            fallbackEmail={email}
            onLoggedOut={() => {
              setMember(undefined);
              setScreen("login");
            }}
          />
        );
      case "apply":
        return (
          <ApplyEmailForm
            email={email}
            onEmailChange={setEmail}
            onSent={() => setScreen("code")}
          />
        );
      case "code":
        return (
          <CodeForm
            email={email}
            onBack={() => setScreen("apply")}
            onVerified={(token) => {
              setVerificationToken(token);
              setScreen("venue");
            }}
          />
        );
      case "venue":
        return (
          <VenueForm
            verificationToken={verificationToken}
            onBack={() => setScreen("apply")}
            onApplied={(venueName, reference) => {
              setApplication({ venueName, reference });
              setScreen("applied");
            }}
          />
        );
      case "applied":
        return (
          <DonePanel
            stamp={flowContent.done.appliedStamp}
            title={flowContent.done.appliedTitle(application?.venueName ?? "")}
            body={flowContent.done.appliedBody(email.trim().toLowerCase())}
          >
            {application?.reference && (
              <span className="font-mono text-sm text-muted uppercase">
                {flowContent.done.appliedRef} {application.reference}
              </span>
            )}
            <ApplicationPath current={1} />
            <ButtonLink href={routes.mainSite} className="w-full">
              {flowContent.done.home}
            </ButtonLink>
          </DonePanel>
        );
    }
  }

  return (
    <>
      <ScreenFrame screenKey={screen}>
        {applying && (
          <ol aria-label="Application progress" className="flex gap-2">
            {flowContent.steps.map((step, i) => {
              const completed = stepOf(screen);
              const done = i < completed;
              return (
                <li
                  key={step}
                  aria-current={i === completed ? "step" : undefined}
                  className="flex flex-1 flex-col gap-2"
                >
                  <span
                    className={cn(
                      "h-1 rounded-full transition-colors duration-250",
                      done ? "bg-foreground" : "bg-line",
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      done || i === completed
                        ? "text-foreground"
                        : "text-muted",
                    )}
                  >
                    {step}
                    {done && <span className="sr-only"> (done)</span>}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
        {body()}
        {showSwap && (
          <p className="text-center text-muted">
            {swap.question}{" "}
            <button
              type="button"
              onClick={() => setScreen(applying ? "login" : "apply")}
              className="cursor-pointer py-3 font-semibold text-foreground underline underline-offset-[3px] hover:text-muted"
            >
              {swap.cta}
            </button>
          </p>
        )}
      </ScreenFrame>
    </>
  );
}
