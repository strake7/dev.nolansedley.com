import type { CollectionEntry } from "astro:content"

export type Post = CollectionEntry<"posts">

export const postPath = (post: Post) =>
  `/${post.id.replace(/\/index$/, "")}/`

const tagLabels: Record<string, string> = {
  architecture: "Architecture",
  devx: "DevX",
  dotnet: ".NET",
  emacs: "Emacs",
  javascript: "JavaScript",
  kubernetes: "Kubernetes",
  operations: "Operations",
  performance: "Performance",
  reliability: "Reliability",
  ruby: "Ruby",
  sql: "SQL",
  windows: "Windows",
}

export const postTags = (post: Post) =>
  post.data.tags.map((tag) => tagLabels[tag] ?? tag)

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
