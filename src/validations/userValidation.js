import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Uername must be at least 3 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 charactors long"),
    company: z
      .string()
      .min(3, "Company name must be at least 3 characters long"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 charactors long"),
  }),
});
