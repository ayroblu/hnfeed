export type Story = {
  id: number;
  title: string;
  url: string | null;
  author: string;
  points: number;
  createdAt: number;
};

export async function fetchStories(options: { since: number; minPoints: number }): Promise<Story[]> {
  const params = new URLSearchParams({
    tags: "story",
    numericFilters: `created_at_i>${options.since},points>=${options.minPoints}`,
    hitsPerPage: "1000",
    attributesToRetrieve: "title,url,author,points,created_at_i",
    attributesToHighlight: "",
  });
  const res = await fetch(`https://hn.algolia.com/api/v1/search_by_date?${params}`);
  if (!res.ok) {
    throw new Error(`Algolia request failed: ${res.status} ${await res.text()}`);
  }
  const body = (await res.json()) as { hits: AlgoliaHit[] };
  return body.hits.map((hit) => ({
    id: Number(hit.objectID),
    title: hit.title,
    url: hit.url || null,
    author: hit.author,
    points: hit.points,
    createdAt: hit.created_at_i,
  }));
}

export function hnLink(id: number): string {
  return `https://news.ycombinator.com/item?id=${id}`;
}

type AlgoliaHit = {
  objectID: string;
  title: string;
  url?: string | null;
  author: string;
  points: number;
  created_at_i: number;
};
