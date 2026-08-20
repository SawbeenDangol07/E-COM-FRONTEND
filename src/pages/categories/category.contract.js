import { z } from "zod";

export const CategoryDTO = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters")
    .nonempty("Category name is required"),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Status must be either Published (active) or Un-Published (inactive)" }),
  }),
  parent: z.string().optional().nullable(),
  brands: z.array(z.string()).optional().nullable(),
  image: z.any().refine((file) => file instanceof File, {
    message: "Category image is required",
  }),
});

export const CategoryEditDTO = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters")
    .nonempty("Category name is required"),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Status must be either Published (active) or Un-Published (inactive)" }),
  }),
  parent: z.string().optional().nullable(),
  brands: z.array(z.string()).optional().nullable(),
  image: z.any().optional().nullable(),
});
