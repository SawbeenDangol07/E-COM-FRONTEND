import { z } from "zod";

export const BannerDTO = z.object({
  title: z
    .string()
    .min(3, "At least 3 characters are required for title")
    .nonempty("Title is required"),
  url: z
    .string()
    .url("Please enter a valid URL (e.g. https://...)")
    .nonempty("URL is required"),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Status must be either Published (active) or Un-Published (inactive)" }),
  }),
  image: z.any().refine((file) => file instanceof File, {
    message: "Banner image file is required",
  }),
});

export const BannerEditDTO = z.object({
  title: z
    .string()
    .min(3, "At least 3 characters are required for title")
    .nonempty("Title is required"),
  url: z
    .string()
    .url("Please enter a valid URL (e.g. https://...)")
    .nonempty("URL is required"),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Status must be either Published (active) or Un-Published (inactive)" }),
  }),
  image: z.any().optional().nullable(),
});
