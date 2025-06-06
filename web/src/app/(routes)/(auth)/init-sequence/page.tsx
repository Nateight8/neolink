"use client";

import { useState, useEffect } from "react";
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
import {
  ChevronRight,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Terminal,
  Shield,
  User2,
} from "lucide-react";
import { axiosInstance } from "@/lib/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "@/hooks/use-auth";

// Define the form schema with Zod
const formSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name cannot exceed 50 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  //

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch the password field to calculate strength
  const password = form.watch("password");

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 25;
    // Contains number
    if (/\d/.test(password)) strength += 25;
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;
    // Contains uppercase or special char (simplified for kids)
    if (/[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;

    setPasswordStrength(strength);
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength < 50) return "from-red-500 to-red-500";
    if (passwordStrength < 75) return "from-yellow-500 to-yellow-500";
    return "from-green-500 to-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 50) return "WEAK";
    if (passwordStrength < 75) return "MEDIUM";
    return "STRONG";
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (userData: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      const response = await axiosInstance.post("/auth/signup", userData);
      return response.data;
    },
    onSuccess: async () => {
      // Invalidate the auth user query to refetch the user data
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      // Wait a small amount of time to ensure the auth state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      // Then redirect
      form.reset();
      router.push("/");
    },
    onError: (error: Error) => {
      console.error("Signup error:", error);
      // You can add error handling here, like showing a toast notification
    }
  });

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    const userData = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    };

    mutate(userData);

    // Navigate to the username page
  }

  // Check if the user is already authenticated
  const { user, isLoading } = useAuthUser();

  if (isLoading) {
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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Neon header */}
        <div className="w-full max-w-md h-2 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-full mb-8 shadow-[0_0_15px_rgba(0,255,255,0.7)] animate-pulse"></div>

        {/* Onboarding card */}
        <div className="w-full max-w-md bg-black border border-fuchsia-900 rounded-sm p-6 relative">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[2px] -z-10"></div>

          {/* Progress indicator */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-fuchsia-950 border border-fuchsia-500 flex items-center justify-center text-fuchsia-400 font-mono">
                2
              </div>
              <span className="text-fuchsia-400 font-mono text-sm">
                SECURITY
              </span>
            </div>
            <div className="flex gap-1">
              <div className="w-8 h-1 bg-cyan-500"></div>
              <div className="w-8 h-1 bg-fuchsia-500"></div>
              <div className="w-8 h-1 bg-gray-800"></div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2 font-mono tracking-wide">
            SECURE YOUR IDENTITY
          </h1>
          <p className="text-center text-gray-400 mb-6">
            Protect your digital presence with encryption
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            placeholder="ENTER FULL NAME"
                            {...field}
                            className="bg-black border-fuchsia-900 text-white font-mono pl-10 relative focus-visible:ring-fuchsia-500"
                          />
                        </FormControl>
                      </div>
                    </div>
                    <FormMessage className="text-xs text-red-400 font-mono flex items-center">
                      {form.formState.errors.fullName && (
                        <>
                          <Terminal className="h-3 w-3 mr-1" />{" "}
                          {form.formState.errors.fullName.message}
                        </>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

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

                    {/* Password strength indicator */}
                    {password && (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 font-mono">
                            PASSWORD STRENGTH
                          </span>
                          <span
                            className={`text-xs font-mono ${
                              passwordStrength >= 75
                                ? "text-green-400"
                                : passwordStrength >= 50
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {getStrengthText()}
                          </span>
                        </div>
                        <div className="relative h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {/* Confirm Password field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-cyan-400 font-mono text-xs tracking-wider flex items-center">
                      <Shield className="h-3 w-3 mr-1" /> CONFIRM PASSWORD
                    </FormLabel>
                    <div className="relative">
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px]"></div>
                      <div className="relative flex items-center">
                        <Shield className="absolute left-3 h-4 w-4 text-cyan-500" />
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="bg-black border-cyan-900 text-white font-mono pl-10 relative focus-visible:ring-cyan-500"
                          />
                        </FormControl>
                      </div>
                    </div>
                    <FormMessage className="text-xs text-red-400 font-mono flex items-center">
                      {form.formState.errors.confirmPassword && (
                        <>
                          <Terminal className="h-3 w-3 mr-1" />{" "}
                          {form.formState.errors.confirmPassword.message}
                        </>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* Security tips */}
              <div className="bg-black/50 border border-fuchsia-900 p-3 rounded-sm">
                <p className="text-fuchsia-400 font-mono text-xs mb-2 flex items-center">
                  <Shield className="h-3 w-3 mr-1" /> SECURITY PROTOCOLS
                </p>
                <ul className="text-xs text-gray-400 space-y-1 pl-5 list-disc">
                  <li>Use at least 8 characters</li>
                  <li>Include numbers and letters</li>
                  <li>Add uppercase letters or symbols for extra security</li>
                  <li>Never share your password with anyone</li>
                </ul>
              </div>

              <div className="">
                <Button
                  type="submit"
                  className="rounded-sm w-full bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500 text-white shadow-[0_0_10px_rgba(219,39,119,0.3)]"
                >
                  Explore Venus
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>

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
                  type="button"
                  onClick={() => router.push("/login")}
                  variant="outline"
                  className="w-full rounded-sm border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-950 hover:text-fuchsia-300 font-mono tracking-wider"
                >
                  <User2 className="h-4 w-4 mr-2" />
                  ACCESS_EXISITING_INDENTITY.SYS
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Terminal-like footer text */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 font-mono text-xs">
            <span className="text-fuchsia-500">sys:</span>{" "}
            encrypting_user_credentials.exe
          </p>
          <p className="text-gray-600 font-mono text-xs animate-pulse">
            <span className="text-cyan-500">`&gt;`</span> securing_connection...
          </p>
        </div>
      </div>
    </div>
  );
}
