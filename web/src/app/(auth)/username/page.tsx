"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, ChevronLeft, User, Terminal } from "lucide-react";

// Define the form schema with Zod
const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username cannot exceed 20 characters" })
    .regex(/^[A-Z0-9_]+$/, {
      message:
        "Username can only contain uppercase letters, numbers, and underscores",
    }),
  handle: z
    .string()
    .min(3, { message: "Handle must be at least 3 characters" })
    .max(20, { message: "Handle cannot exceed 20 characters" })
    .regex(/^[a-z0-9_]+$/, {
      message:
        "Handle can only contain lowercase letters, numbers, and underscores",
    }),
});

export default function UsernameOnboardingPage() {
  const router = useRouter();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      handle: "",
    },
  });

  // Watch form values for preview
  const username = form.watch("username");
  const handle = form.watch("handle");

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would store this data or send it to your backend
    console.log(values);

    // Navigate to the next step
    router.push("/onboarding/personal-info");
  }

  const getInitials = () => {
    if (!username) return "?";
    return username.substring(0, 2);
  };

  // Handle uppercase for username
  const handleUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    onChange(e.target.value.toUpperCase());
  };

  // Handle lowercase for handle
  const handleHandleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    onChange(e.target.value.toLowerCase());
  };

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
        <div className="w-full max-w-md bg-black border border-cyan-900 rounded-sm p-6 relative">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-sm opacity-50 blur-[2px] -z-10"></div>

          {/* Progress indicator */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-400 font-mono">
                1
              </div>
              <span className="text-cyan-400 font-mono text-sm">IDENTITY</span>
            </div>
            <div className="flex gap-1">
              <div className="w-8 h-1 bg-cyan-500"></div>
              <div className="w-8 h-1 bg-gray-800"></div>
              <div className="w-8 h-1 bg-gray-800"></div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2 font-mono tracking-wide">
            CREATE YOUR IDENTITY
          </h1>
          <p className="text-center text-gray-400 mb-6">
            Choose how you'll be known in the digital realm
          </p>

          {/* Avatar preview */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 opacity-75 blur-sm"></div>
              <Avatar className="h-24 w-24 border-2 border-cyan-500 relative">
                <AvatarFallback className="bg-black text-cyan-400 text-2xl font-mono">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Username field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-cyan-400 font-mono text-xs tracking-wider flex items-center">
                      <Terminal className="h-3 w-3 mr-1" /> USERNAME
                    </FormLabel>
                    <div className="relative">
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px]"></div>
                      <div className="relative flex items-center">
                        <User className="absolute left-3 h-4 w-4 text-cyan-500" />
                        <FormControl>
                          <Input
                            placeholder="ENTER_USERNAME"
                            {...field}
                            onChange={(e) =>
                              handleUsernameChange(e, field.onChange)
                            }
                            className="bg-black border-cyan-900 text-white font-mono pl-10 relative focus-visible:ring-cyan-500"
                          />
                        </FormControl>
                      </div>
                    </div>
                    <FormDescription className="text-xs text-gray-500">
                      Use uppercase letters, numbers, and underscores
                    </FormDescription>
                    <FormMessage className="text-xs text-red-400 font-mono flex items-center">
                      {form.formState.errors.username && (
                        <>
                          <Terminal className="h-3 w-3 mr-1" />{" "}
                          {form.formState.errors.username.message}
                        </>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* Handle field */}
              <FormField
                control={form.control}
                name="handle"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-fuchsia-400 font-mono text-xs tracking-wider flex items-center">
                      <Terminal className="h-3 w-3 mr-1" /> HANDLE
                    </FormLabel>
                    <div className="relative">
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-sm opacity-50 blur-[1px]"></div>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-fuchsia-400 font-mono">
                          @
                        </span>
                        <FormControl>
                          <Input
                            placeholder="your_handle"
                            {...field}
                            onChange={(e) =>
                              handleHandleChange(e, field.onChange)
                            }
                            className="bg-black border-fuchsia-900 text-white font-mono pl-8 relative focus-visible:ring-fuchsia-500"
                          />
                        </FormControl>
                      </div>
                    </div>
                    <FormDescription className="text-xs text-gray-500">
                      Lowercase letters, numbers, and underscores only
                    </FormDescription>
                    <FormMessage className="text-xs text-red-400 font-mono flex items-center">
                      {form.formState.errors.handle && (
                        <>
                          <Terminal className="h-3 w-3 mr-1" />{" "}
                          {form.formState.errors.handle.message}
                        </>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* Preview */}
              {(username || handle) && (
                <div className="bg-black/50 border border-cyan-900 p-3 rounded-sm">
                  <p className="text-center text-sm">Preview:</p>
                  <div className="text-center">
                    <p className="text-white font-bold font-mono">
                      {username || "USERNAME"}
                    </p>
                    <p className="text-cyan-400 font-mono text-sm">
                      @{handle || "handle"}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-sm border-gray-700 text-gray-400 hover:bg-gray-900 hover:text-gray-300"
                  onClick={() => router.back()}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  BACK
                </Button>
                <Button
                  type="submit"
                  className="rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                >
                  NEXT
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Terminal-like footer text */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 font-mono text-xs">
            <span className="text-cyan-500">sys:</span>{" "}
            initializing_user_identity.exe
          </p>
          <p className="text-gray-600 font-mono text-xs animate-pulse">
            <span className="text-fuchsia-500">`&gt;`</span> awaiting_input...
          </p>
        </div>
      </div>
    </div>
  );
}
