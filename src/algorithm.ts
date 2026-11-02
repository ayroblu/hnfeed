import type { Story } from "./hn.ts";

export type Algorithm = {
  describe: string;
  lookbackSeconds: number;
  minPoints: number;
  qualifies: (story: Story, now: number) => boolean;
};

export function rateSinceCreation(options: { points: number; minutes: number; lookbackHours: number }): Algorithm {
  const pointsPerSecond = options.points / (options.minutes * 60);
  return {
    describe: `${options.points} points within ${options.minutes} minutes of creation (or the same average rate), stories from the last ${options.lookbackHours}h`,
    lookbackSeconds: options.lookbackHours * 3600,
    minPoints: options.points,
    qualifies: (story, now) =>
      story.points >= options.points && story.points >= pointsPerSecond * Math.max(now - story.createdAt, 1),
  };
}

export const algorithm = rateSinceCreation({ points: 50, minutes: 30, lookbackHours: 12 });
