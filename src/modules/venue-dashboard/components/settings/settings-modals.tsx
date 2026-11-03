"use client";

import { useState } from "react";

import { content } from "../../content";
import { useAction } from "../../hooks/use-action";
import { venueData } from "../../services/venue-data.service";
import { Button } from "../ui/button";
import { TextField } from "../ui/controls";
import { Modal } from "../ui/modal";

const copy = content.settings;

export function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const labels = copy.passwordModal;
  const { run, isBusy } = useAction();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [tried, setTried] = useState(false);

  const save = async () => {
    setTried(true);
    if (!current || next.length < labels.minLength || next !== again) return;
    if (await run(() => venueData.changePassword(current, next), labels.done)) {
      onClose();
    }
  };

  return (
    <Modal
      title={labels.title}
      closable
      onClose={onClose}
      actions={
        <>
          <Button onClick={onClose}>{content.common.cancel}</Button>
          <Button variant="dark" disabled={isBusy} onClick={save}>
            {labels.title}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <TextField
          label={labels.current}
          type="password"
          autoComplete="current-password"
          value={current}
          error={tried && !current ? labels.currentError : undefined}
          onChange={(event) => setCurrent(event.target.value)}
        />
        <TextField
          label={labels.next}
          type="password"
          autoComplete="new-password"
          hint={labels.nextHint}
          value={next}
          error={
            tried && next.length < labels.minLength
              ? labels.nextError
              : undefined
          }
          onChange={(event) => setNext(event.target.value)}
        />
        <TextField
          label={labels.again}
          type="password"
          autoComplete="new-password"
          value={again}
          error={tried && again !== next ? labels.againError : undefined}
          onChange={(event) => setAgain(event.target.value)}
        />
        <span className="text-[13px] text-muted">{labels.note}</span>
      </div>
    </Modal>
  );
}

export function ChangeEmailModal({
  onClose,
  onChanged,
}: {
  onClose: () => void;
  onChanged: (email: string) => void;
}) {
  const labels = copy.emailModal;
  const { run, isBusy } = useAction();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [tried, setTried] = useState(false);
  const emailValid = /^\S+@\S+\.\S+$/.test(email);
  const codeValid = /^\d{6}$/.test(code);

  const submit = async () => {
    setTried(true);
    if (step === 1) {
      if (!emailValid || !password) return;
      if (await run(() => venueData.requestEmailChange(email, password))) {
        setStep(2);
        setTried(false);
      }
      return;
    }
    if (!codeValid) return;
    if (await run(() => venueData.confirmEmailChange(code), labels.done)) {
      onChanged(email);
    }
  };

  return (
    <Modal
      title={step === 1 ? labels.title : labels.codeTitle}
      closable
      onClose={onClose}
      actions={
        <>
          <Button onClick={onClose}>{content.common.cancel}</Button>
          <Button variant="dark" disabled={isBusy} onClick={submit}>
            {step === 1 ? labels.sendCode : labels.confirm}
          </Button>
        </>
      }
    >
      {step === 1 ? (
        <div className="flex flex-col gap-3">
          <TextField
            label={labels.next}
            type="email"
            value={email}
            error={tried && !emailValid ? labels.nextError : undefined}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label={labels.password}
            type="password"
            autoComplete="current-password"
            value={password}
            error={tried && !password ? labels.passwordError : undefined}
            onChange={(event) => setPassword(event.target.value)}
          />
          <span className="text-[13px] text-muted">{labels.note}</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <span className="text-sm text-muted">{labels.sentTo(email)}</span>
          <TextField
            label={labels.code}
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            error={tried && !codeValid ? labels.codeError : undefined}
            onChange={(event) => setCode(event.target.value)}
          />
        </div>
      )}
    </Modal>
  );
}

export function DeleteVenueModal({
  venueName,
  onClose,
}: {
  venueName: string;
  onClose: () => void;
}) {
  const labels = copy.deleteModal;
  const { run, isBusy } = useAction();
  const [typed, setTyped] = useState("");
  return (
    <Modal
      title={labels.title(venueName)}
      icon="alert"
      danger
      onClose={onClose}
      actions={
        <>
          <Button onClick={onClose}>{content.common.cancel}</Button>
          <Button
            variant="dangerSolid"
            disabled={typed !== venueName || isBusy}
            onClick={async () => {
              if (await run(venueData.requestVenueDeletion, labels.done))
                onClose();
            }}
          >
            {labels.request}
          </Button>
        </>
      }
    >
      <p className="m-0 text-muted">{labels.body}</p>
      <TextField
        label={labels.confirmLabel}
        value={typed}
        onChange={(event) => setTyped(event.target.value)}
      />
    </Modal>
  );
}
