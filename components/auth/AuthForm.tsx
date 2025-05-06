"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { getSupabase } from "../../lib/supabase/client";

// Define form schemas using Zod
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, "Name must be at least 2 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormType = "login" | "register" | "forgotPassword" | "resetPassword";

type AuthFormProps = {
  type: FormType;
};

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  // Initialize Supabase client
  const [supabase] = useState(() => getSupabase()); // Use useState to initialize Supabase
  // We always redirect to the admin dashboard after login

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Using the singleton Supabase client imported from lib/supabase/client

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    try {
      if (type === "login") {
        loginSchema.parse(formData);
      } else if (type === "register") {
        registerSchema.parse(formData);
      } else if (type === "forgotPassword") {
        forgotPasswordSchema.parse(formData);
      } else if (type === "resetPassword") {
        resetPasswordSchema.parse(formData);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset message
    setMessage(null);

    // Validate form
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (type === "login") {
        // Handle login
        console.log("Login attempt:", { email: formData.email });

        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error("Login error:", error);
          throw error;
        }

        // Log successful authentication details
        console.log("Authentication successful:", {
          user: {
            id: data.user?.id,
            email: data.user?.email,
            role: data.user?.role,
            metadata: data.user?.user_metadata,
          },
          session: {
            expires_at: data.session?.expires_at,
            token_type: data.session?.token_type,
          },
        });

        // Get and log user roles/claims
        const {
          data: { user },
        } = await supabase.auth.getUser();
        console.log("User details:", {
          id: user?.id,
          email: user?.email,
          app_metadata: user?.app_metadata,
          user_metadata: user?.user_metadata,
        });

        // Redirect to homepage after successful login
        console.log("Login successful, redirecting to homepage...");
        
        // Use window.location for a hard redirect instead of the Next.js router
        // This ensures a complete page refresh and proper session handling
        window.location.href = '/';
      } else if (type === "register") {
        // Handle registration
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
          },
        });

        if (error) throw error;

        // Check if email confirmation is required
        if (
          signUpData.user &&
          signUpData.user.identities &&
          signUpData.user.identities.length === 0
        ) {
          setMessage({
            type: "error",
            text: "This email is already registered. Please log in instead.",
          });
          return;
        }

        setMessage({
          type: "success",
          text: "Registration successful! Please check your email to confirm your account.",
        });

        // Clear form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else if (type === "forgotPassword") {
        // Handle forgot password
        const { error } = await supabase.auth.resetPasswordForEmail(
          formData.email,
          {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          }
        );

        if (error) throw error;

        setMessage({
          type: "success",
          text: "Password reset link sent to your email!",
        });

        // Clear form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else if (type === "resetPassword") {
        // Handle password reset
        const { error } = await supabase.auth.updateUser({
          password: formData.password,
        });

        if (error) throw error;

        setMessage({
          type: "success",
          text: "Password updated successfully!",
        });

        // Redirect to login after a delay
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during authentication.";
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form title and description based on type
  const formConfig = {
    login: {
      title: "Log in to your account",
      description: "Enter your email and password to access your account",
      submitText: "Log in",
      footerText: "Don't have an account?",
      footerLink: "/auth/register",
      footerLinkText: "Create an account",
    },
    register: {
      title: "Create an account",
      description: "Fill in the form below to create your account",
      submitText: "Register",
      footerText: "Already have an account?",
      footerLink: "/auth/login",
      footerLinkText: "Log in",
    },
    forgotPassword: {
      title: "Forgot your password?",
      description: "Enter your email and we'll send you a reset link",
      submitText: "Send reset link",
      footerText: "Remember your password?",
      footerLink: "/auth/login",
      footerLinkText: "Log in",
    },
    resetPassword: {
      title: "Reset your password",
      description: "Enter your new password below",
      submitText: "Reset password",
      footerText: "",
      footerLink: "",
      footerLinkText: "",
    },
  };

  const config = formConfig[type];

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{config.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {config.description}
        </p>
      </div>

      {/* Status message */}
      {message && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name field - only for registration */}
        {type === "register" && (
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
        )}

        {/* Email field - for all except reset password */}
        {type !== "resetPassword" && (
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="your.email@example.com"
              autoComplete="username"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        )}

        {/* Password field - for all except forgot password */}
        {type !== "forgotPassword" && (
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter your password"
              autoComplete={type === "login" ? "current-password" : "new-password"}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
        )}

        {/* Confirm Password field - for register and reset password */}
        {(type === "register" || type === "resetPassword") && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter your password"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        )}

        {/* Forgot password link - only for login */}
        {type === "login" && (
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : config.submitText}
        </button>
      </form>

      {/* Footer with link to other auth pages */}
      {config.footerText && (
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {config.footerText}{" "}
            <Link
              href={config.footerLink}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {config.footerLinkText}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}