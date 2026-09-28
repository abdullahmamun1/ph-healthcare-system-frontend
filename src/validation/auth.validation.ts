import z from "zod";

export const loginSehema = z.object({
  email: z.email("Email must be a proper email"),
  password: z
    .string()
    .min(8, "Name should contain at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character.",
    ),
});

export const patientRegistrationSchema = z
  .object({
    name: z
      .string("Name must be a string")
      .min(3, "Name should contain at least 3 characters")
      .max(100, "Name should contain maximum 100 characters"),
    email: z.email("Email must be a proper email"),
    password: z
      .string()
      .min(8, "Name should contain at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character.",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    contactNumber: z
      .string()
      .refine((val) => val === "" || /^(?:\+880|880|0)1[3-9]\d{8}$/.test(val), {
        message: "Please provide a valid phone number",
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });
