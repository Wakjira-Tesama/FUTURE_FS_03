import { Router } from "express";
import { z } from "zod";

import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { badRequest, notFound } from "../utils/httpError.js";
import { BlogPost } from "../models/BlogPost.js";

export const blogRouter = Router();

blogRouter.get(
  "/blog/posts",
  asyncHandler(async (_req, res) => {
    const posts = await BlogPost.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .select("title slug excerpt tags publishedAt")
      .limit(50);

    res.json({ posts });
  }),
);

blogRouter.get(
  "/blog/posts/:slug",
  asyncHandler(async (req, res) => {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      status: "published",
    });
    if (!post) throw notFound("Post not found");
    res.json({ post });
  }),
);

const PostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional(),
  body: z.string().min(1),
  tags: z.array(z.string().min(1).max(40)).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

blogRouter.post(
  "/blog/posts",
  auth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const parsed = PostSchema.safeParse(req.body);
    if (!parsed.success)
      throw badRequest("Invalid payload", parsed.error.flatten());

    const { status } = parsed.data;
    const post = await BlogPost.create({
      ...parsed.data,
      slug: parsed.data.slug.toLowerCase(),
      authorId: req.user._id,
      ...(status === "published" ? { publishedAt: new Date() } : {}),
    });

    res.status(201).json({ post });
  }),
);

blogRouter.patch(
  "/blog/posts/:id",
  auth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const parsed = PostSchema.partial().safeParse(req.body);
    if (!parsed.success)
      throw badRequest("Invalid payload", parsed.error.flatten());

    const post = await BlogPost.findById(req.params.id);
    if (!post) throw notFound("Post not found");

    const oldStatus = post.status;
    Object.assign(post, parsed.data);
    if (
      oldStatus !== "published" &&
      post.status === "published" &&
      !post.publishedAt
    ) {
      post.publishedAt = new Date();
    }

    await post.save();
    res.json({ post });
  }),
);

blogRouter.delete(
  "/blog/posts/:id",
  auth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    if (!post) throw notFound("Post not found");
    await post.deleteOne();
    res.json({ ok: true });
  }),
);
