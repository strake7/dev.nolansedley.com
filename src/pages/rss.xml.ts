import { getCollection } from "astro:content"
import { postPath, postSummary, sortPosts } from "../lib/posts"

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    }
    return entities[character]
  })

export async function GET({ site }: { site: URL }) {
  const posts = sortPosts(await getCollection("posts"))
  const items = posts
    .map((post) => {
      const url = new URL(postPath(post), site)
      return `<item>
        <title>${escapeXml(post.data.title)}</title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${post.data.date.toUTCString()}</pubDate>
        <description>${escapeXml(postSummary(post))}</description>
      </item>`
    })
    .join("\n")

  const body = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Nolan Sedley — Software notes</title>
        <link>${site}</link>
        <description>Notes and a public development journal on software systems, engineering leadership, and the ideas between them.</description>
        <language>en-us</language>
        ${items}
      </channel>
    </rss>`

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
