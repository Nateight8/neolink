"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Terminal,
  LogIn,
  UserPlus,
} from "lucide-react";

// Define the form schema with Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().default(false).optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Form submission handler
  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);

    // Simulate API call
    console.log(values);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);

    // Navigate to profile page on successful login
    router.push("/profile");
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
                ACCESS.SYS
              </h1>
              <p className="text-gray-400">Enter your credentials to connect</p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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

                {/* Password field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-fuchsia-400 font-mono text-xs tracking-wider flex items-center">
                        <Lock className="h-3 w-3 mr-1" /> PASSWORD
                      </FormLabel>
                      <div className="relative">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-sm opacity-50 blur-[1px]"></div>
                        <div className="relative flex items-center">
                          <Lock className="absolute left-3 h-4 w-4 text-fuchsia-500" />
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                              className="bg-black border-fuchsia-900 text-white font-mono pl-10 pr-10 relative focus-visible:ring-fuchsia-500"
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 text-gray-400 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <FormMessage className="text-xs text-red-400 font-mono flex items-center">
                        {form.formState.errors.password && (
                          <>
                            <Terminal className="h-3 w-3 mr-1" />{" "}
                            {form.formState.errors.password.message}
                          </>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* Remember me checkbox */}
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-gray-300 font-mono cursor-pointer">
                        REMEMBER ACCESS CREDENTIALS
                      </FormLabel>
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
                      <LogIn className="h-4 w-4 mr-2" />
                      LOGIN.SYS
                    </div>
                  )}
                </Button>

                {/* Forgot password link */}
                <div className="text-center">
                  <Link
                    href="/forgot-password"
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-mono hover-glitch"
                  >
                    RESET_ACCESS_CREDENTIALS.EXE
                  </Link>
                </div>
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
              CREATE_NEW_IDENTITY.SYS
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
            awaiting_credentials...
          </p>
        </div>
      </div>
    </div>
  );
}
