import { z } from "zod";

export const BrandDTO = z.object({
  name: z
    .string()
    .min(2, "Brand name must be at least 2 characters")
    .max(40, "Brand name cannot exceed 40 characters")
    .nonempty("Brand name is required"),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Status must be either Published (active) or Un-Published (inactive)" }),
  }),
  logo: z.any().refine((file) => file instanceof File, {
    message: "Brand logo image is required",
  }),
});

export const BrandEditDTO = z.object({
  name: z
    .string()
    .min(2, "Brand name must be at least 2 characters")
    .max(40, "Brand name cannot exceed 40 characters")
    .nonempty("Brand name is required"),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Status must be either Published (active) or Un-Published (inactive)" }),
  }),
  logo: z.any().optional().nullable(),
});
