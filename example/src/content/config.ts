import { defineCollection, z } from "astro:content";

export const BlogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.date().optional(),
  heroImage: z.string().optional(),
});

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: BlogSchema,
});

export const collections = { blog };
