import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,25}$/;

export const LoginDTO = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export const RegisterDTO = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    role: z
      .enum(["customer", "seller", "admin"])
      .default("customer"),
    storeName: z.string().optional(),
    password: z
      .string()
      .regex(
        passwordRegex,
        "Password must be 8-25 characters and include uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    image: z.any().optional(),
    agreeTerms: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ForgotPasswordDTO = z.object({
  email: z.string().email("Please enter a valid email address"),
});
