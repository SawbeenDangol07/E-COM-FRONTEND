import { z } from "zod";

export const ProductDTO = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name cannot exceed 200 characters")
    .nonempty("Product name is required"),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a valid number" })
    .min(1, "Price must be at least $1"),
  discount: z.coerce
    .number({ invalid_type_error: "Discount must be a number" })
    .min(0, "Discount cannot be negative")
    .max(90, "Discount cannot exceed 90%")
    .default(0),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .nonempty("Description is required"),
  brand: z.string().optional().nullable(),
  category: z
    .array(z.string())
    .min(1, "At least one category must be selected"),
  stock: z.coerce
    .number({ invalid_type_error: "Stock must be a number" })
    .min(0, "Stock cannot be negative")
    .default(0),
  sku: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Status must be either Published (active) or Un-Published (inactive)" }),
  }),
  images: z.any().refine(
    (files) =>
      (Array.isArray(files) && files.length > 0 && files.some((f) => f instanceof File)) ||
      files instanceof File,
    { message: "At least one product image is required" }
  ),
});

export const ProductEditDTO = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name cannot exceed 200 characters")
    .nonempty("Product name is required"),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a valid number" })
    .min(1, "Price must be at least $1"),
  discount: z.coerce
    .number({ invalid_type_error: "Discount must be a number" })
    .min(0, "Discount cannot be negative")
    .max(90, "Discount cannot exceed 90%")
    .default(0),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .nonempty("Description is required"),
  brand: z.string().optional().nullable(),
  category: z
    .array(z.string())
    .min(1, "At least one category must be selected"),
  stock: z.coerce
    .number({ invalid_type_error: "Stock must be a number" })
    .min(0, "Stock cannot be negative")
    .default(0),
  sku: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Status must be either Published (active) or Un-Published (inactive)" }),
  }),
  images: z.any().optional().nullable(),
});
