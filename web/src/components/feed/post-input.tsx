"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Bomb, WormIcon as Virus, CuboidIcon as Cube } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { LoadingIndicator } from "@/components/loading-indicator";
import {
  AllyMentionPopover,
  type Ally,
} from "@/components/chats/mention-ally-popover";

// Define the form schema with Zod
const postFormSchema = z.object({
  postContent: z.string().min(1, { message: "Post content cannot be empty" }),
  arType: z.string().optional(),
  neuralDepth: z.string().optional(),
  permissions: z.string().optional(),
  // We don't validate the file here as it's handled separately
});

type PostFormValues = z.infer<typeof postFormSchema>;

// Default values for the form
const defaultValues: Partial<PostFormValues> = {
  postContent: "",
  arType: "hologram",
  neuralDepth: "1",
  permissions: "public",
};

interface PostInputProps {
  onSubmit?: (values: PostFormValues, arModel?: File) => void;
}

// Mock allies data - in a real app, this would come from an API
const mockAllies: Ally[] = [
  {
    id: "1",
    username: "neuro_hacker",
    name: "Alex Chen",
    avatar: "/placeholder.svg?height=40&width=40&text=AC",
    specialization: "Neural Interface Specialist",
  },
  {
    id: "2",
    username: "cyber_ghost",
    name: "Maya Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40&text=MR",
    specialization: "Stealth Systems Engineer",
  },
  {
    id: "3",
    username: "quantum_flux",
    name: "Darius Webb",
    avatar: "/placeholder.svg?height=40&width=40&text=DW",
    specialization: "Quantum Computing Expert",
  },
  {
    id: "4",
    username: "neon_blade",
    name: "Kira Nakamura",
    avatar: "/placeholder.svg?height=40&width=40&text=KN",
    specialization: "Combat Systems Developer",
  },
  {
    id: "5",
    username: "data_wraith",
    name: "Elijah Stone",
    avatar: "/placeholder.svg?height=40&width=40&text=ES",
    specialization: "Data Extraction Specialist",
  },
];

export default function PostInput({ onSubmit }: PostInputProps) {
  const [isARPostEnabled, setIsARPostEnabled] = useState(false);
  const [arModel, setArModel] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mention popover state
  const [mentionState, setMentionState] = useState({
    isActive: false,
    searchTerm: "",
    position: null as { top: number; left: number } | null,
    startPosition: 0,
  });

  const queryClient = useQueryClient();
  const { mutate: postMutation, isPending: isPosting } = useMutation({
    mutationFn: async (data: { content: string }) => {
      const response = await axiosInstance.post("/posts", {
        content: data.content,
        image: null, // We'll add image handling later
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post-feed"],
      });
    },
  });

  // Initialize the form
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues,
  });

  // Toggle AR post mode
  const toggleARPost = () => {
    setIsARPostEnabled(!isARPostEnabled);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArModel(file);
    }
  };

  // Handle form submission
  const handleSubmitForm = (values: PostFormValues) => {
    if (onSubmit) {
      onSubmit(values, arModel || undefined);
    }
    postMutation(
      {
        content: values.postContent,
      },
      {
        onSuccess: () => {
          // Reset form
          form.reset(defaultValues);
          setIsARPostEnabled(false);
          setArModel(null);
        },
      }
    );
  };

  // Handle textarea input to detect @ mentions
  const handleTextareaInput = useCallback((value: string) => {
    if (!textareaRef.current) return;

    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');

    // Check if we're in a mention context (after @ and no space after it)
    if (lastAtSymbol !== -1 && !textBeforeCursor.slice(lastAtSymbol).includes(' ')) {
      const searchTerm = textBeforeCursor.slice(lastAtSymbol + 1);
      setMentionState({
        isActive: true,
        searchTerm,
        position: { top: 0, left: 0 },
        startPosition: lastAtSymbol,
      });
    } else {
      setMentionState({
        isActive: false,
        searchTerm: '',
        position: null,
        startPosition: 0,
      });
    }
  }, []);

  // Handle key events in the textarea
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Close mention popover on Escape
      if (e.key === "Escape" && mentionState.isActive) {
        e.preventDefault();
        setMentionState({
          isActive: false,
          searchTerm: "",
          position: null,
          startPosition: 0,
        });
      }
    },
    [mentionState.isActive]
  );

  // Handle ally selection from popover
  const handleAllySelect = (ally: Ally) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const currentValue = form.getValues('postContent');
    const cursorPosition = textarea.selectionStart;

    // Insert the mention
    const newText =
      currentValue.substring(0, mentionState.startPosition) +
      `@${ally.username} ` +
      currentValue.substring(cursorPosition);

    // Update form and textarea
    form.setValue('postContent', newText);
    textarea.value = newText;

    // Calculate new cursor position
    const newPosition = mentionState.startPosition + ally.username.length + 2;

    // Update cursor position
    textarea.setSelectionRange(newPosition, newPosition);
    textarea.focus();

    // Close popover
    setMentionState({
      isActive: false,
      searchTerm: '',
      position: null,
      startPosition: 0,
    });
  };

  // Close the mention popover
  const closeMentionPopover = () => {
    setMentionState({
      isActive: false,
      searchTerm: "",
      position: null,
      startPosition: 0,
    });
  };

  // Listen for key events in the textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Initial check on mount, in case there's already content
    if (textarea.value) {
      handleTextareaInput(textarea.value);
    }

    const handleInput = () => {
      if (textareaRef.current) {
        handleTextareaInput(textareaRef.current.value);
      }
    };
    
    const handleClick = () => {
      if (textareaRef.current) {
        handleTextareaInput(textareaRef.current.value);
      }
    };

    // These native events help catch any changes that might be missed by React's onChange
    textarea.addEventListener("input", handleInput);
    textarea.addEventListener("click", handleClick);

    return () => {
      textarea.removeEventListener("input", handleInput);
      textarea.removeEventListener("click", handleClick);
    };
  }, [handleTextareaInput]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)}>
        <div className="mb-6 bg-black border border-cyan-900 rounded-sm p-4 relative">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-30 blur-[1px] -z-10"></div>
          <div className="flex space-x-4">
            <Avatar className="h-10 w-10 border border-cyan-500">
              <AvatarImage
                src="/placeholder.svg?height=40&width=40&text=JD"
                alt="Your avatar"
              />
              <AvatarFallback className="bg-black text-cyan-400">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3 relative">
              <textarea
                {...form.register('postContent')}
                placeholder={
                  isARPostEnabled
                    ? "DESCRIBE YOUR AR EXPERIENCE..."
                    : "SHARE_YOUR_THOUGHTS.SYS"
                }
                className="flex min-h-[80px] w-full rounded-md bg-black/50 border border-cyan-900 px-3 py-2 text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500"
                ref={(e) => {
                  textareaRef.current = e;
                }}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  form.setValue('postContent', e.target.value);
                  handleTextareaInput(e.target.value);
                }}
              />
              <FormMessage className="text-xs text-red-400" />

              {/* Ally Mention Popover */}
              {mentionState.isActive && (
                <div className="absolute left-0 right-0 z-50">
                  <div className="fixed max-w-sm transform -translate-x-1/2 bg-black border border-cyan-900 rounded-sm shadow-lg"
                       style={{
                         top: textareaRef.current ? 
                           textareaRef.current.getBoundingClientRect().bottom + window.scrollY + 4 : 0,
                         left: textareaRef.current ? 
                           textareaRef.current.getBoundingClientRect().left + window.scrollX : 0
                       }}>
                    <AllyMentionPopover
                      allies={mockAllies.filter(ally => 
                        ally.username.toLowerCase().includes(mentionState.searchTerm.toLowerCase()) ||
                        ally.name.toLowerCase().includes(mentionState.searchTerm.toLowerCase())
                      )}
                      searchTerm={mentionState.searchTerm}
                      position={{ top: 0, left: 0 }}
                      onSelect={handleAllySelect}
                      onClose={closeMentionPopover}
                    />
                  </div>
                </div>
              )}

              {isARPostEnabled && (
                <div className="p-3 border border-cyan-900 bg-cyan-950/20 rounded-sm">
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className="bg-black/50 border-cyan-500 text-cyan-400"
                    >
                      <Cube className="h-3 w-3 mr-1" />
                      AR POST
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={toggleARPost}
                      className="h-6 text-xs text-gray-400 hover:text-gray-300"
                    >
                      CANCEL AR
                    </Button>
                  </div>

                  <label className="flex items-center justify-center h-32 border border-dashed border-cyan-700 rounded-sm bg-black/50 cursor-pointer">
                    <input
                      type="file"
                      accept=".glb,.gltf,.obj,.fbx"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <div className="text-center">
                      <Cube className="h-8 w-8 mx-auto mb-2 text-cyan-500 opacity-50" />
                      <p className="text-xs text-gray-400">
                        {arModel
                          ? arModel.name
                          : "DRAG & DROP AR MODEL OR CLICK TO UPLOAD"}
                      </p>
                    </div>
                  </label>

                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        AR TYPE
                      </label>
                      <FormField
                        control={form.control}
                        name="arType"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <select
                                className="w-full bg-black border border-cyan-900 rounded-sm text-white text-xs p-1"
                                {...field}
                              >
                                <option value="hologram">HOLOGRAM</option>
                                <option value="overlay">OVERLAY</option>
                                <option value="fullspace">FULLSPACE</option>
                              </select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        NEURAL DEPTH
                      </label>
                      <FormField
                        control={form.control}
                        name="neuralDepth"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <select
                                className="w-full bg-black border border-cyan-900 rounded-sm text-white text-xs p-1"
                                {...field}
                              >
                                <option value="1">LEVEL 1</option>
                                <option value="2">LEVEL 2</option>
                                <option value="3">LEVEL 3</option>
                              </select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        PERMISSIONS
                      </label>
                      <FormField
                        control={form.control}
                        name="permissions"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <select
                                className="w-full bg-black border border-cyan-900 rounded-sm text-white text-xs p-1"
                                {...field}
                              >
                                <option value="public">PUBLIC</option>
                                <option value="allies">ALLIES ONLY</option>
                                <option value="private">PRIVATE</option>
                              </select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={toggleARPost}
                          className={`h-8 w-8 rounded-sm ${
                            isARPostEnabled
                              ? "bg-cyan-950/30 text-cyan-300 border border-cyan-500"
                              : "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                          }`}
                        >
                          <Cube className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Create AR Post</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-sm text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                        >
                          <Virus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add Emoji</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                        >
                          <Bomb className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add Poll</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button
                  type="submit"
                  disabled={!form.watch("postContent").trim() || isPosting}
                  className="rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)] relative"
                >
                  {isPosting ? (
                    <div className="flex items-center space-x-2">
                      <LoadingIndicator size="sm" showText={false} />
                      <span>TRANSMITTING...</span>
                    </div>
                  ) : (
                    "TRANSMIT"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
