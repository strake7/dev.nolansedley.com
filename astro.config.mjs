import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"

export default defineConfig({
  site: "https://dev.nolansedley.com",
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
      wrap: true,
    },
  },
})
