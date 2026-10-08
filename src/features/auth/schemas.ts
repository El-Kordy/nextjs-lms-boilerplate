import { z } from "zod";

export const onboardingSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  bio: z.string().max(500).optional(),
});
