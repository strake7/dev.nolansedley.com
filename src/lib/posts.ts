import type { CollectionEntry } from "astro:content"

export type Post = CollectionEntry<"posts">

export const postPath = (post: Post) =>
  `/${post.id.replace(/\/index$/, "")}/`

export const postTopic = (post: Post) => {
  const topic = post.id.split("/")[0]
  const labels: Record<string, string> = {
    dotnet: ".NET",
    kubernetes: "Kubernetes",
    ruby: "Ruby",
    "windows-containers": "Containers",
    "windows-terminals": "Developer tools",
  }

  return labels[topic] ?? "Engineering"
}

export const postSummary = (post: Post) => {
  if (post.data.description) return post.data.description

  const plainText = post.body
    ?.replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>`]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  return `${plainText?.slice(0, 155).trim() ?? ""}${
    (plainText?.length ?? 0) > 155 ? "…" : ""
  }`
}

export const sortPosts = (posts: Post[]) =>
  posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
