import { hnLink, type Story } from "./hn.ts";

export const FEED_SIZE = 100;

export type FeedItem = {
  id: number;
  title: string;
  link: string;
  hnlink: string;
  author: string;
  ts: number;
};

export async function readFeed(path: string): Promise<FeedItem[]> {
  const file = Bun.file(path);
  if (!(await file.exists())) {
    return [];
  }
  return (await file.text())
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as FeedItem);
}

export async function writeFeed(path: string, items: FeedItem[]): Promise<void> {
  await Bun.write(path, items.map((item) => JSON.stringify(item) + "\n").join(""));
}

export function toFeedItem(story: Story, ts: number): FeedItem {
  const hnlink = hnLink(story.id);
  return {
    id: story.id,
    title: story.title,
    link: story.url ?? hnlink,
    hnlink,
    author: story.author,
    ts,
  };
}
