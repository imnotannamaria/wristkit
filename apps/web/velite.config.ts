import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { defineConfig, s } from "velite";

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6][ext]",
    clean: true,
  },
  collections: {
    docs: {
      name: "Doc",
      pattern: "docs/**/*.mdx",
      schema: s.object({
        title: s.string(),
        description: s.string().optional(),
        slug: s.path(),
        body: s.mdx(),
      }),
    },
  },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: "vesper", keepBackground: false, defaultLang: "plaintext" }],
    ],
  },
});
