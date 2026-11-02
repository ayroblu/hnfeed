import { parseArgs } from "node:util";
import { algorithm } from "./algorithm.ts";
import { FEED_SIZE, readFeed, toFeedItem, writeFeed } from "./feed.ts";
import { fetchStories, type Story } from "./hn.ts";

const { values } = parseArgs({
  options: {
    feed: { type: "string", default: "feed.jsonl" },
    "dry-run": { type: "boolean", default: false },
  },
});

const now = Math.floor(Date.now() / 1000);
const existing = await readFeed(values.feed);
const seen = new Set(existing.map((item) => item.id));
const stories = await fetchStories({ since: now - algorithm.lookbackSeconds, minPoints: algorithm.minPoints });
const added = stories
  .filter((story) => !seen.has(story.id) && algorithm.qualifies(story, now))
  .sort((a, b) => b.createdAt - a.createdAt);

if (values["dry-run"]) {
  printCandidates(stories);
} else if (added.length > 0) {
  await writeFeed(values.feed, [...added.map((story) => toFeedItem(story, now)), ...existing].slice(0, FEED_SIZE));
}
console.log(`${added.length} new of ${stories.length} candidates`);

function printCandidates(candidates: Story[]) {
  console.log(`Algorithm: ${algorithm.describe}`);
  for (const story of candidates) {
    const ageMinutes = Math.max((now - story.createdAt) / 60, 1);
    const status = seen.has(story.id) ? "in feed" : algorithm.qualifies(story, now) ? "NEW" : "-";
    console.log(
      [
        status.padEnd(7),
        `${Math.round(ageMinutes)}m`.padStart(6),
        `${story.points}pts`.padStart(7),
        `${(story.points / ageMinutes).toFixed(2)}/min`.padStart(10),
        story.title,
      ].join("  "),
    );
  }
}
