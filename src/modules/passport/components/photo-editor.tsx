"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";

import { ApiError } from "@/shared/lib/api-client";

import { profileContent } from "../content";
import { errorCode, errorMessage, removePhoto, uploadPhoto } from "../lib/api";
import { Avatar } from "./avatar";
import { useMe } from "./me-context";
import { ConfirmRow, PillButton } from "./ui";

const copy = profileContent.photo;

const TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

/** Why a chosen file can't be sent, or null when it's fine. */
function checkFile(file: File) {
  if (!TYPES.includes(file.type)) return copy.wrongType;
  if (file.size > MAX_BYTES) return copy.tooBig;
  return null;
}

/**
 * The profile picture with Add, Change and Remove. A chosen picture is checked
 * here first, then shown round before it's sent.
 */
export function PhotoEditor({ onExpired }: { onExpired: () => void }) {
  const { me, setMe } = useMe();
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState<"upload" | "remove" | null>(null);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Uploads are off where the API has no picture storage yet.
  const [unavailable, setUnavailable] = useState(false);

  // Frees the preview's memory when it's replaced or the page closes.
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  function choose(event: ChangeEvent<HTMLInputElement>) {
    const chosen = event.target.files?.[0];
    event.target.value = "";
    if (!chosen) return;
    const problem = checkFile(chosen);
    setError(problem);
    if (problem) return;
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  }

  function cancel() {
    setFile(null);
    setPreview(null);
  }

  function failed(caught: unknown) {
    const code = errorCode(caught);
    if (code === "passport.photo_storage_not_configured") {
      setUnavailable(true);
      setError(null);
      cancel();
      return;
    }
    if (caught instanceof ApiError && caught.status === 413)
      setError(copy.tooBig);
    else setError(errorMessage(caught, copy.failed));
  }

  async function upload() {
    if (!file || busy) return;
    setBusy("upload");
    setError(null);
    try {
      setMe(await uploadPhoto(file));
      cancel();
    } catch (caught) {
      failed(caught);
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    setBusy("remove");
    setError(null);
    try {
      setMe(await removePhoto());
      setAsking(false);
    } catch (caught) {
      failed(caught);
    } finally {
      setBusy(null);
    }
  }

  const avatarClass = "size-24 text-[1.75rem] sm:size-28 sm:text-[2rem]";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-4">
        {preview ? (
          // A plain <img> of the file on this device; nothing is uploaded yet.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={copy.previewAlt}
            width={112}
            height={112}
            className={`${avatarClass} flex-none rounded-full object-cover ring-2 ring-volt`}
          />
        ) : (
          <Avatar
            name={me.name}
            photoUrl={unavailable ? null : me.photo_url}
            alt={me.photo_url ? copy.alt : ""}
            onExpired={onExpired}
            className={avatarClass}
          />
        )}

        {!unavailable && (
          <div className="flex flex-col gap-2">
            {preview ? (
              <div className="flex flex-wrap gap-2">
                <PillButton
                  variant="solid"
                  onClick={upload}
                  disabled={busy !== null}
                >
                  {busy === "upload" ? copy.uploading : copy.use}
                </PillButton>
                <PillButton onClick={cancel} disabled={busy !== null}>
                  {copy.cancel}
                </PillButton>
              </div>
            ) : (
              !asking && (
                <div className="flex flex-wrap gap-2">
                  <PillButton
                    onClick={() => inputRef.current?.click()}
                    aria-describedby={hintId}
                    disabled={busy !== null}
                  >
                    {me.photo_url ? copy.change : copy.add}
                  </PillButton>
                  {me.photo_url && (
                    <PillButton
                      variant="quiet"
                      onClick={() => setAsking(true)}
                      disabled={busy !== null}
                    >
                      {copy.remove}
                    </PillButton>
                  )}
                </div>
              )
            )}
            <p id={hintId} className="text-[.8125rem] text-muted">
              {copy.hint}
            </p>
          </div>
        )}
      </div>

      {asking && (
        <ConfirmRow
          question={copy.removeQuestion}
          confirm={busy === "remove" ? copy.removing : copy.removeYes}
          cancel={copy.cancel}
          busy={busy !== null}
          onConfirm={remove}
          onCancel={() => setAsking(false)}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept={TYPES.join(",")}
        onChange={choose}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {error && (
        <p role="alert" className="text-sm font-semibold">
          {error}
        </p>
      )}
    </div>
  );
}
