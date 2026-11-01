"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/cn";

import { content, pageTitles } from "../../content";
import { useAction } from "../../hooks/use-action";
import { useReviews } from "../../hooks/use-venue-data";
import { venueData } from "../../services/venue-data.service";
import type { Review, ReviewStatus, ReviewsResponse } from "../../types";
import { VenuePage } from "../shell/venue-page";
import { Badge, InfoTip, Meter, Stars, ValueMeter } from "../ui/badges";
import { Button } from "../ui/button";
import { Card, Overline, SectionHead, SideGrid } from "../ui/card";
import { Chip } from "../ui/controls";
import { Icon } from "../ui/icon";
import { QueryBoundary } from "../ui/query-boundary";
import { EmptyState } from "../ui/states";

const copy = content.reviews;

export function ReviewsScreen() {
  const query = useReviews();
  return (
    <VenuePage title={pageTitles.reviews} scenarioPage="reviews">
      <QueryBoundary query={query}>
        {(data) =>
          data.total === 0 ? (
            <EmptyState
              icon="star"
              title={copy.emptyTitle}
              body={copy.emptyBody}
            />
          ) : (
            <ReviewsBody data={data} onChanged={query.refresh} />
          )
        }
      </QueryBoundary>
    </VenuePage>
  );
}

function ReviewsBody({
  data,
  onChanged,
}: {
  data: ReviewsResponse;
  onChanged: () => void;
}) {
  const [stars, setStars] = useState(0);
  const [status, setStatus] = useState<ReviewStatus | "all">("all");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const list = data.reviews.filter(
    (review) =>
      (!stars || review.stars === stars) &&
      (status === "all" || review.status === status),
  );
  const peakTopic = Math.max(1, ...data.topics.map((item) => item.count));
  const countFor = (value: string) =>
    value === "all"
      ? data.reviews.length
      : data.reviews.filter((review) => review.status === value).length;

  return (
    <SideGrid side="left">
      <div className="flex flex-col gap-4">
        <Card>
          <Overline>{copy.summary}</Overline>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-[44px]">{data.average}</span>
            <span className="flex flex-col">
              <Stars value={data.average} size={16} />
              <span className="text-[13px] text-muted">
                {copy.ratingsCount(data.total)}
              </span>
            </span>
          </div>
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2.5 gap-y-1.5 text-[13px]">
            {data.distribution.map((item) => (
              <div key={item.stars} className="contents">
                <Chip
                  selected={stars === item.stars}
                  aria-label={copy.filterStars(item.stars)}
                  className="h-[26px] px-2"
                  onClick={() =>
                    setStars(stars === item.stars ? 0 : item.stars)
                  }
                >
                  {item.stars} <Icon name="star" size={11} />
                </Chip>
                <Meter percent={(item.count / data.total) * 100} />
                <span className="font-mono text-muted">{item.count}</span>
              </div>
            ))}
          </div>
          <span className="text-xs text-muted">{copy.summaryNote}</span>
        </Card>
        <Card>
          <SectionHead title={copy.topicsTitle}>
            <InfoTip text={copy.topicsTip} />
          </SectionHead>
          {data.topics.map((item) => (
            <ValueMeter
              key={item.topic}
              label={item.topic}
              value={String(item.count)}
              percent={(item.count / peakTopic) * 100}
            />
          ))}
        </Card>
        <Card className="gap-2">
          <SectionHead title={copy.googleTitle}>
            <Badge tone="line">{copy.googleStatus}</Badge>
          </SectionHead>
          <span className="text-sm text-muted">{copy.googleBody}</span>
          <Button size="sm" icon="link" disabled className="self-start">
            {copy.googleCta}
          </Button>
          <span className="text-xs text-muted">{copy.googleNote}</span>
        </Card>
      </div>
      <Card className="gap-0 p-0">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3.5">
          {copy.filters.map((filter) => (
            <Chip
              key={filter.value}
              selected={status === filter.value}
              count={countFor(filter.value)}
              onClick={() => setStatus(filter.value)}
            >
              {filter.label}
            </Chip>
          ))}
          {stars > 0 && (
            <Button variant="text" icon="x" onClick={() => setStars(0)}>
              {copy.starsOnly(stars)}
            </Button>
          )}
        </div>
        <div className="flex flex-col px-4 pb-2">
          {list.length ? (
            list.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                replying={replyingTo === review.id}
                onReply={setReplyingTo}
                onChanged={onChanged}
              />
            ))
          ) : (
            <div className="flex flex-col items-start gap-3 border-t border-line py-8">
              <b>{copy.noMatch}</b>
              <Button
                size="sm"
                onClick={() => {
                  setStars(0);
                  setStatus("all");
                }}
              >
                {copy.clearFilters}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </SideGrid>
  );
}

function ReviewItem({
  review,
  replying,
  onReply,
  onChanged,
}: {
  review: Review;
  replying: boolean;
  onReply: (id: string | null) => void;
  onChanged: () => void;
}) {
  const [text, setText] = useState("");
  const { run, isBusy } = useAction();

  const post = async () => {
    const done = await run(
      () =>
        venueData.replyToReview(
          review.id,
          text.trim().slice(0, copy.replyLimit),
        ),
      copy.replyPosted,
    );
    if (done) {
      setText("");
      onReply(null);
      onChanged();
    }
  };

  return (
    <div className="flex flex-col gap-2 border-t border-line py-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <Stars value={review.stars} />
        <span className="font-mono text-xs text-muted">{review.guestId}</span>
        <Badge className="h-5 text-[11px]">{review.source}</Badge>
        <span className="ml-auto text-xs text-muted">{review.whenLabel}</span>
      </div>
      <span
        className={cn("text-[15px]", !review.message && "text-sm text-muted")}
      >
        {review.message || copy.ratingOnly}
      </span>
      <div className="flex flex-wrap gap-1">
        {review.topics.map((topic) => (
          <Badge key={topic} tone="line" className="h-[22px] text-[11px]">
            {topic}
          </Badge>
        ))}
      </div>
      {review.reply && (
        <div className="border-l-2 border-ink py-1 pl-3 text-sm">
          <Overline className="mb-1 block text-xs">{copy.yourReply}</Overline>
          {review.reply}
        </div>
      )}
      {review.status === "needs" && !replying && (
        <div>
          <Button size="sm" icon="chat" onClick={() => onReply(review.id)}>
            {copy.reply}
          </Button>
        </div>
      )}
      {replying && (
        <div className="flex flex-col gap-2">
          <textarea
            rows={3}
            autoFocus
            aria-label={copy.replyLabel}
            placeholder={copy.replyPlaceholder}
            maxLength={copy.replyLimit}
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="min-h-22 w-full rounded-[10px] bg-card px-3.5 py-3 text-[15px] leading-normal shadow-[inset_0_0_0_1px_rgb(15_15_20/0.16)] outline-none focus:shadow-[inset_0_0_0_2px_var(--ink)]"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="dark"
              size="sm"
              disabled={!text.trim() || isBusy}
              onClick={post}
            >
              {copy.post}
            </Button>
            <Button variant="text" size="sm" onClick={() => onReply(null)}>
              {content.common.cancel}
            </Button>
            <span className="ml-auto text-xs text-muted">
              {text.length} / {copy.replyLimit}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
