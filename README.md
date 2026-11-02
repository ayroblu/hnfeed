# hnfeed

A Hacker News feed of stories that gain points quickly. A GitHub Action runs every 5 minutes. It asks the [Algolia HN API](https://hn.algolia.com/api) for recent stories and adds the ones that pass the algorithm in `src/algorithm.ts`. Then it publishes the newest 100 to GitHub Pages:

https://ayroblu.github.io/hnfeed/feed.jsonl

Each line is one story, newest first:

```json
{"id":50333339,"title":"Show HN: ...","link":"https://example.com","hnlink":"https://news.ycombinator.com/item?id=50333339","author":"aizk","ts":1793615429}
```

`ts` is the Unix time in seconds when the story entered the feed. `link` is the HN link for posts without a URL, such as Ask HN.

## Tuning

Change `algorithm` in `src/algorithm.ts`, then preview which current stories would qualify:

```sh
bun install
bun run preview
```

The feed is stored on the `gh-pages` branch, and the workflow (`.github/workflows/update-feed.yml`) commits to that branch.
