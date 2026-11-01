"use client";

import { useState } from "react";

import { content, pageTitles } from "../../content";
import { useAction } from "../../hooks/use-action";
import { useSession } from "../../hooks/use-session";
import { useTeam } from "../../hooks/use-venue-data";
import { venueData } from "../../services/venue-data.service";
import type { MemberRole, TeamMember, TeamResponse } from "../../types";
import { VenuePage } from "../shell/venue-page";
import { Badge } from "../ui/badges";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { SelectField, TextField } from "../ui/controls";
import { Icon } from "../ui/icon";
import { Modal } from "../ui/modal";
import { QueryBoundary } from "../ui/query-boundary";
import { Banner, UnavailableBox } from "../ui/states";
import { Table, TableWrap, Td, Th } from "../ui/table";

const copy = content.team;

export function TeamScreen() {
  const query = useTeam();
  return (
    <VenuePage title={pageTitles.team} scenarioPage="team">
      <QueryBoundary query={query}>
        {(data) =>
          data.enabled ? (
            <TeamBody data={data} onChanged={query.refresh} />
          ) : (
            <UnavailableBox
              badge={<Badge tone="line">{copy.unavailableBadge}</Badge>}
              title={copy.unavailableTitle}
              body={copy.unavailableBody}
            />
          )
        }
      </QueryBoundary>
    </VenuePage>
  );
}

function InviteModal({
  onClose,
  onInvited,
}: {
  onClose: () => void;
  onInvited: () => void;
}) {
  const { run, isBusy } = useAction();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("Manager");
  const [tried, setTried] = useState(false);
  const isValid = /^\S+@\S+\.\S+$/.test(email);

  const send = async () => {
    setTried(true);
    if (!isValid) return;
    if (
      await run(() => venueData.inviteMember(email, role), copy.invited(email))
    ) {
      onInvited();
    }
  };

  return (
    <Modal
      title={copy.inviteTitle}
      closable
      onClose={onClose}
      actions={
        <>
          <Button onClick={onClose}>{content.common.cancel}</Button>
          <Button variant="dark" icon="send" disabled={isBusy} onClick={send}>
            {copy.sendInvite}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <TextField
          label={copy.email}
          type="email"
          value={email}
          error={tried && !isValid ? copy.emailError : undefined}
          onChange={(event) => setEmail(event.target.value)}
        />
        <SelectField
          label={copy.role}
          options={copy.roles}
          value={role}
          onChange={(event) => setRole(event.target.value as MemberRole)}
        />
        <span className="text-[13px] text-muted">{copy.inviteNote}</span>
      </div>
    </Modal>
  );
}

function TeamBody({
  data,
  onChanged,
}: {
  data: TeamResponse;
  onChanged: () => void;
}) {
  const venueName = useSession().data?.session.venueName ?? "";
  const { run, isBusy } = useAction();
  const [inviting, setInviting] = useState(false);
  const [removing, setRemoving] = useState<TeamMember | null>(null);
  const c = copy.columns;
  const permissionCell = (allowed: boolean) => (
    <Td>
      {allowed ? (
        <span role="img" aria-label={copy.allowed}>
          <Icon name="check" size={16} />
        </span>
      ) : (
        <span aria-label={copy.notAllowed} className="text-muted">
          —
        </span>
      )}
    </Td>
  );

  return (
    <>
      <Banner
        tone="info"
        icon="info"
        title={copy.noticeTitle}
        body={copy.noticeBody}
      />
      <Card className="gap-0 p-0">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <h2 className="m-0 flex-1 text-base font-bold">
            {copy.members(data.members.length)}
          </h2>
          <Button
            variant="dark"
            size="sm"
            icon="plus"
            onClick={() => setInviting(true)}
          >
            {copy.invite}
          </Button>
        </div>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>{c.person}</Th>
                <Th>{c.role}</Th>
                <Th className="max-sm:hidden">{c.status}</Th>
                <Th className="max-sm:hidden">{c.last}</Th>
                <Th>
                  <span className="sr-only">{c.actions}</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {data.members.map((member) => (
                <tr key={member.id}>
                  <Td>
                    <span className="flex items-center gap-2">
                      <span className="grid size-7 flex-none place-items-center rounded-full bg-block text-xs font-semibold uppercase">
                        {member.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")}
                      </span>
                      <span className="min-w-0">
                        <b className="block text-sm">
                          {member.name}
                          {member.isYou && copy.you}
                        </b>
                        <span className="text-xs text-muted">
                          {member.email}
                        </span>
                      </span>
                    </span>
                  </Td>
                  <Td>{member.role}</Td>
                  <Td className="max-sm:hidden">
                    <Badge tone={member.status === "Active" ? "soft" : "line"}>
                      {member.status}
                    </Badge>
                  </Td>
                  <Td className="text-[13px] text-muted max-sm:hidden">
                    {member.lastActive}
                  </Td>
                  <Td className="text-right">
                    {!member.isYou && (
                      <Button
                        variant="text"
                        size="sm"
                        onClick={() => setRemoving(member)}
                      >
                        {member.status === "Invited"
                          ? copy.revoke
                          : copy.remove}
                      </Button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Card>
      <Card className="p-0">
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>{c.permission}</Th>
                <Th>{c.owner}</Th>
                <Th>{c.manager}</Th>
                <Th>{c.employee}</Th>
                <Th>{c.support}</Th>
              </tr>
            </thead>
            <tbody>
              {data.permissions.map((permission) => (
                <tr key={permission.label}>
                  <Td className="text-sm">{permission.label}</Td>
                  {permissionCell(permission.owner)}
                  {permissionCell(permission.manager)}
                  {permissionCell(permission.employee)}
                  {permissionCell(permission.support)}
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Card>
      {inviting && (
        <InviteModal
          onClose={() => setInviting(false)}
          onInvited={() => {
            setInviting(false);
            onChanged();
          }}
        />
      )}
      {removing && (
        <Modal
          title={copy.removeTitle(removing.name)}
          icon="alert"
          danger
          onClose={() => setRemoving(null)}
          actions={
            <>
              <Button onClick={() => setRemoving(null)}>
                {content.common.cancel}
              </Button>
              <Button
                variant="dangerSolid"
                disabled={isBusy}
                onClick={async () => {
                  if (
                    await run(
                      () => venueData.removeMember(removing.id),
                      copy.removed,
                    )
                  ) {
                    setRemoving(null);
                    onChanged();
                  }
                }}
              >
                {copy.remove}
              </Button>
            </>
          }
        >
          <p className="m-0 text-muted">
            {removing.status === "Invited"
              ? copy.removeInvited
              : copy.removeActive(venueName)}
          </p>
        </Modal>
      )}
    </>
  );
}
