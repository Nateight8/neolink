"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Terminal, UserPlus, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { useAuth } from "@/contexts/auth-context";

// Define the form schema with Zod
const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function EmailSubmit() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const redirectPath = searchParams.get("redirect") || "/";
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  // Form submission handler

  const { mutate: emailSubmitMutation } = useMutation({
    mutationFn: async (signupData: { fullName: string; email: string }) => {
      const response = await axiosInstance.post("/auth/email-verification", signupData);
      return response.data;
    },
    onSuccess: (data) => {
      // Redirect to verification page with email and sessionId
      const email = form.getValues("email");
      const sessionId = data?.sessionId;
      
      if (!sessionId) {
        console.error("No sessionId in response");
        form.setError("root", {
          type: "manual",
          message: "Failed to start verification. Please try again.",
        });
        return;
      }
      
      router.push(
        `/verify-email?email=${encodeURIComponent(email)}&sessionId=${sessionId}`
      );
    },
    onError: (error: {
      response?: { data?: { message?: string } };
      message?: string;
    }) => {
      console.error("Signup error:", error);
      setIsLoading(false);

      // Extract error message from the API response or use a default message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred during signup. Please try again.";

      form.setError("root", {
        type: "manual",
        message: errorMessage,
      });
    },
  });

  // Form submission handler
  function onSubmit(values: SignupFormValues) {
    try {
      setIsLoading(true);
      // Clear any previous errors
      form.clearErrors("root");
      emailSubmitMutation({
        fullName: values.fullName.trim(),
        email: values.email.toLowerCase().trim(),
      });
    } catch (error) {
      // Error is already handled by the mutation's onError
      console.error("Signup error:", error);
    }
  }

  // Check if the user is already authenticated
  const { user, isLoading: checkingAuthUser } = useAuth();

  if (checkingAuthUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 font-mono text-xs animate-pulse">
          <span className="text-cyan-500">`&gt;`</span> loading...
        </p>
      </div>
    );
  }

  if (user) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen overflow-hidden relative bg-black text-white">
      {/* Fixed Cyberpunk background with grid lines */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-10">
        {/* Neon header */}
        <div className="w-full max-w-md h-2 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-full mb-8 shadow-[0_0_15px_rgba(0,255,255,0.7)] animate-pulse"></div>

        {/* Login card */}
        <div className="w-full max-w-md bg-black border border-cyan-900 rounded-sm p-6 relative">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-sm opacity-50 blur-[2px] -z-10"></div>

          {/* Animated circuit lines in background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2 font-mono tracking-wide">
                IDENTITY.SYS
              </h1>
              <p className="text-gray-400">Enter your details to begin</p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {form.formState.errors.root && (
                  <div className="p-3 bg-red-900/30 border border-red-700 rounded-sm text-red-400 text-sm font-mono flex items-center">
                    <Terminal className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span>{form.formState.errors.root.message}</span>
                  </div>
                )}
                {/* Email field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-cyan-400 font-mono text-xs tracking-wider flex items-center">
                        <Mail className="h-3 w-3 mr-1" /> EMAIL
                      </FormLabel>
                      <div className="relative">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px]"></div>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-3 h-4 w-4 text-cyan-500" />
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your.email@domain.com"
                              {...field}
                              className="bg-black border-cyan-900 text-white font-mono pl-10 relative focus-visible:ring-cyan-500"
                            />
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage className="text-xs text-red-400 font-mono flex items-center">
                        {form.formState.errors.email && (
                          <>
                            <Terminal className="h-3 w-3 mr-1" />{" "}
                            {form.formState.errors.email.message}
                          </>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* Full Name field */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-fuchsia-400 font-mono text-xs tracking-wider flex items-center">
                        <User className="h-3 w-3 mr-1" /> FULL NAME
                      </FormLabel>
                      <div className="relative">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-sm opacity-50 blur-[1px]"></div>
                        <div className="relative flex items-center">
                          <User className="absolute left-3 h-4 w-4 text-fuchsia-500" />
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="John Doe"
                              {...field}
                              className="bg-black border-fuchsia-900 text-white font-mono pl-10 relative focus-visible:ring-fuchsia-500"
                            />
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage className="text-xs text-red-400 font-mono flex items-center">
                        {form.formState.errors.fullName && (
                          <>
                            <Terminal className="h-3 w-3 mr-1" />
                            {form.formState.errors.fullName.message}
                          </>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* Login button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)] font-mono tracking-wider"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      CONNECTING...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <UserPlus className="h-4 w-4 mr-2" />
                      SUBMIT_IDENTITY.SYS
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-black px-4 text-xs text-gray-500 font-mono">
                  OR
                </span>
              </div>
            </div>

            {/* Sign up button */}
            <Button
              variant="outline"
              className="w-full rounded-sm border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-950 hover:text-fuchsia-300 font-mono tracking-wider"
              onClick={() => router.push("/init-sequence")}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              ACCESS_EXISITING_INDENTITY.SYS
            </Button>
          </div>
        </div>

        {/* Terminal-like footer text */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 font-mono text-xs">
            <span className="text-cyan-500">sys:</span> authenticating_user.exe
          </p>
          <p className="text-gray-600 font-mono text-xs animate-pulse">
            <span className="text-fuchsia-500">&gt;</span>{" "}
            awaiting_identity_data...
          </p>
        </div>
      </div>
    </div>
  );
}
