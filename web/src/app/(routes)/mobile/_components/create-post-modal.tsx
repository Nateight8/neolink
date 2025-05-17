"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  X,
  Plus,
  Clock,
  BarChart2,
  Send,
  Settings,
  Users,
  Globe,
  Lock,
  ImageIcon,
  Smile,
  CuboidIcon as Cube,
  Bomb,
  WormIcon as Virus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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
});

type PostFormValues = z.infer<typeof postFormSchema>;

// Default values for the form
const defaultValues: Partial<PostFormValues> = {
  postContent: "",
  arType: "hologram",
  neuralDepth: "1",
  permissions: "public",
};

interface SearchUser {
  _id: string;
  username: string;
  name?: string;
  avatar?: string;
  specialization?: string;
}

// Add type for post data
interface PostData {
  content: string;
  poll?: {
    question: string;
    options: string[];
    visibility: "public" | "friends" | "private";
    expiresAt: Date;
    showResultsBeforeVoting: boolean;
    anonymousVoting: boolean;
    allowMultipleVotes: boolean;
  };
  image: File | null;
}

export function CreatePostDialog() {
  // Existing state
  const [isPollActive, setIsPollActive] = useState(false);
  const [showPollSettings, setShowPollSettings] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollDuration, setPollDuration] = useState(24);
  const [pollVisibility, setPollVisibility] = useState("everyone");

  // New state from post-input
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

  // Initialize form with Zod
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues,
  });

  // User search query
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["userSearch", mentionState.searchTerm],
    queryFn: async () => {
      if (!mentionState.searchTerm || mentionState.searchTerm.length < 3) {
        return [];
      }
      const response = await axiosInstance.get(
        `/users/search?q=${mentionState.searchTerm}`
      );
      return response.data.map((user: SearchUser) => ({
        id: user._id,
        username: user.username,
        name: user.name || user.username,
        avatar:
          user.avatar ||
          `/placeholder.svg?height=40&width=40&text=${user.username[0]}`,
        specialization: user.specialization || "User",
      }));
    },
    enabled: mentionState.isActive && mentionState.searchTerm.length >= 3,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const queryClient = useQueryClient();
  const { mutate: postMutation, isPending: isPosting } = useMutation({
    mutationFn: async (data: PostData) => {
      const response = await axiosInstance.post("/posts", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post-feed"],
      });
      // Reset form and states
      form.reset();
      setIsPollActive(false);
      setPollOptions(["", ""]);
      setPollDuration(24);
      setPollVisibility("everyone");
    },
  });

  // Existing poll functions
  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const isSearching =
    mentionState.isActive && (mentionState.searchTerm.length < 3 || isLoading);
  const filteredAllies = searchResults || [];

  // Handle textarea input for mentions
  const handleTextareaInput = useCallback((value: string) => {
    if (!textareaRef.current) return;

    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf("@");

    // Check if we're in a mention context (after @ and no space after it)
    if (
      lastAtSymbol !== -1 &&
      !textBeforeCursor.slice(lastAtSymbol).includes(" ")
    ) {
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
        searchTerm: "",
        position: null,
        startPosition: 0,
      });
    }
  }, []);

  // Add useEffect for native event listeners
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

    textarea.addEventListener("input", handleInput);
    textarea.addEventListener("click", handleClick);

    return () => {
      textarea.removeEventListener("input", handleInput);
      textarea.removeEventListener("click", handleClick);
    };
  }, [handleTextareaInput]);

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
    const currentValue = form.getValues("postContent");
    const cursorPosition = textarea.selectionStart;

    // Insert the mention
    const newText =
      currentValue.substring(0, mentionState.startPosition) +
      `@${ally.username} ` +
      currentValue.substring(cursorPosition);

    // Update form and textarea
    form.setValue("postContent", newText);
    textarea.value = newText;

    // Calculate new cursor position
    const newPosition = mentionState.startPosition + ally.username.length + 2;

    // Update cursor position
    textarea.setSelectionRange(newPosition, newPosition);
    textarea.focus();

    // Close popover
    setMentionState({
      isActive: false,
      searchTerm: "",
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

  // Update the form submission handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const values = form.getValues();

    // Validate poll options if poll is active
    if (isPollActive) {
      const validOptions = pollOptions.filter((option) => option.trim() !== "");
      if (validOptions.length < 2) {
        // You might want to show an error message to the user
        return;
      }
    }

    // Calculate poll expiration - default to 24 hours if not set
    const expiresAt = new Date(
      Date.now() + (pollDuration || 24) * 60 * 60 * 1000
    );

    // Map frontend visibility to backend visibility
    const mapVisibility = (
      frontendVisibility: string
    ): "public" | "friends" | "private" => {
      const visibilityMap: Record<string, "public" | "friends" | "private"> = {
        everyone: "public",
        allies: "friends",
        clan: "private",
        selected: "private",
      };
      return visibilityMap[frontendVisibility] || "public";
    };

    // Construct the payload exactly as backend expects
    const postData: PostData = {
      content: values.postContent.trim(),
      poll: isPollActive
        ? {
            question: values.postContent.trim(),
            options: pollOptions.filter((option) => option.trim() !== ""),
            visibility: mapVisibility(pollVisibility),
            expiresAt,
            showResultsBeforeVoting: false,
            anonymousVoting: false,
            allowMultipleVotes: false,
          }
        : undefined,
      image: null,
    };

    postMutation(postData);
  };

  // Beveled edge clip path
  const clipPath =
    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))";
  const buttonClipPath =
    "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))";

  // Get visibility icon and text
  const getVisibilityInfo = () => {
    switch (pollVisibility) {
      case "everyone":
        return { icon: <Globe className="h-4 w-4" />, text: "Everyone" };
      case "allies":
        return { icon: <Users className="h-4 w-4" />, text: "Allies only" };
      case "clan":
        return { icon: <Lock className="h-4 w-4" />, text: "Clan only" };
      default:
        return { icon: <Globe className="h-4 w-4" />, text: "Everyone" };
    }
  };

  const visibilityInfo = getVisibilityInfo();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative overflow-hidden group border-cyan-500/50 bg-[#121620] text-cyan-400 hover:bg-[#1a1e2e] hover:text-cyan-300"
          style={{ clipPath }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 opacity-50" />
          <div
            className="absolute inset-0 bg-[radial-gradient(#3dd1c4_1px,transparent_1px)] opacity-10 mix-blend-overlay"
            style={{ backgroundSize: "16px 16px" }}
          ></div>
          <div className="relative z-10 flex items-center">
            <Send className="mr-2 h-4 w-4" />
            Create Post
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform translate-y-0 group-hover:opacity-100 transition-all duration-300"></div>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px] border-cyan-900/50 bg-[#121620] p-0 overflow-hidden"
        style={{ clipPath }}
      >
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 opacity-50" />

              <DialogHeader className="relative border-b border-cyan-900/30 px-6 py-4">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                <DialogTitle className="text-xl font-bold tracking-wider">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                    DROP YOUR THOUGHTS
                  </span>
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Share your galaxy brain ideas or create a poll for the
                  mainframe.
                </DialogDescription>
              </DialogHeader>

              <div className="p-6 space-y-4">
                <div
                  className="relative bg-[#1a1e2e] rounded-sm overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                  }}
                >
                  <FormField
                    control={form.control}
                    name="postContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            ref={(e) => {
                              textareaRef.current = e;
                              field.ref(e);
                            }}
                            placeholder="What's the vibe today? Share your thoughts with the grid..."
                            className="resize-none min-h-[120px] bg-transparent border border-border focus-visible:ring-1 focus-visible:ring-[#3dd1c4] text-white"
                            onKeyDown={handleKeyDown}
                            onChange={(e) => {
                              form.setValue("postContent", e.target.value);
                              handleTextareaInput(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-400 px-2" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Ally Mention Popover */}
                {mentionState.isActive && (
                  <div className="absolute left-0 right-0 z-50">
                    <div
                      className="fixed w-[280px] transform h-fit -translate-x-1/2 bg-black border border-cyan-900 rounded-sm shadow-lg"
                      style={{
                        top: textareaRef.current
                          ? textareaRef.current.getBoundingClientRect().bottom +
                            window.scrollY +
                            4
                          : 0,
                        left: textareaRef.current
                          ? textareaRef.current.getBoundingClientRect().left +
                            window.scrollX
                          : 0,
                      }}
                    >
                      {isSearching ? (
                        <div className="p-4 text-center text-sm text-gray-400">
                          <div className="w-4 h-4 mx-auto mb-2">
                            <LoadingIndicator showText={false} />
                          </div>
                        </div>
                      ) : filteredAllies.length > 0 ? (
                        <AllyMentionPopover
                          allies={filteredAllies}
                          searchTerm={mentionState.searchTerm}
                          position={{ top: 0, left: 0 }}
                          onSelect={handleAllySelect}
                          onClose={closeMentionPopover}
                        />
                      ) : mentionState.searchTerm.length >= 3 ? (
                        <div className="p-4 text-center text-sm text-gray-400">
                          No matches found
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {/* AR Post button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setIsARPostEnabled(!isARPostEnabled)}
                            className={cn(
                              "border-cyan-900/50 bg-[#1a1e2e] hover:bg-[#2a3547] relative overflow-hidden h-9 w-9",
                              isARPostEnabled &&
                                "bg-[#1a2a30] border-cyan-500/50 text-cyan-400"
                            )}
                            style={{ clipPath: buttonClipPath }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 opacity-50" />
                            <div className="relative z-10 flex items-center justify-center">
                              <Cube className="h-4 w-4" />
                            </div>
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Create AR Post</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Existing poll button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setIsPollActive(!isPollActive)}
                            className={cn(
                              "border-cyan-900/50 bg-[#1a1e2e] hover:bg-[#2a3547] relative overflow-hidden h-9 w-9",
                              isPollActive &&
                                "bg-[#1a2a30] border-cyan-500/50 text-cyan-400"
                            )}
                            style={{ clipPath: buttonClipPath }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 opacity-50" />
                            <div className="relative z-10 flex items-center justify-center">
                              <BarChart2 className="h-4 w-4" />
                            </div>
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Add Poll</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Existing image button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="border-cyan-900/50 bg-[#1a1e2e] hover:bg-[#2a3547] relative overflow-hidden h-9 w-9"
                            style={{ clipPath: buttonClipPath }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 opacity-50" />
                            <div className="relative z-10 flex items-center justify-center">
                              <ImageIcon className="h-4 w-4" />
                            </div>
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Add Image</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Existing emoji button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={cn(
                              "border-cyan-900/50 bg-[#1a1e2e] hover:bg-[#2a3547] relative overflow-hidden h-9 w-9",
                              showEmojiPicker &&
                                "bg-[#1a2a30] border-cyan-500/50 text-cyan-400"
                            )}
                            style={{ clipPath: buttonClipPath }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 opacity-50" />
                            <div className="relative z-10 flex items-center justify-center">
                              <Smile className="h-4 w-4" />
                            </div>
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Add Emoji</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {isPollActive && (
                    <div className="text-xs text-gray-400 flex items-center ml-auto">
                      <Clock className="h-3 w-3 mr-1 text-cyan-400" />
                      <span>Expires in {pollDuration} hours</span>
                    </div>
                  )}
                </div>

                {/* AR Post section */}
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
                        onClick={() => setIsARPostEnabled(false)}
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
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setArModel(file);
                        }}
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

                {/* Existing poll section */}
                {isPollActive && (
                  <div className="relative">
                    <div
                      className="space-y-3 border border-cyan-900/30 rounded-sm p-4 bg-[#1a1e2e]/50 relative overflow-hidden"
                      style={{ clipPath }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-cyan-400 flex items-center">
                          <BarChart2 className="h-4 w-4 mr-1" />
                          POLL OPTIONS
                        </div>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() => setShowPollSettings(true)}
                                className="h-7 w-7 rounded-sm text-gray-400 hover:text-cyan-400 hover:bg-[#2a3547]"
                              >
                                <Settings className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>Poll Settings</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {pollOptions.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <Input
                              value={option}
                              onChange={(e) =>
                                updatePollOption(index, e.target.value)
                              }
                              placeholder={`Option ${index + 1}`}
                              className="bg-[#2a3547] border border-border focus-visible:ring-1 focus-visible:ring-[#3dd1c4] text-white rounded-sm w-full"
                              style={{
                                clipPath:
                                  "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                              }}
                            />
                          </div>
                          {pollOptions.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removePollOption(index)}
                              className="h-8 w-8 rounded-full text-gray-400 hover:text-fuchsia-400 hover:bg-fuchsia-950/30"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}

                      {pollOptions.length < 4 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addPollOption}
                          className="w-full mt-2 border border-dashed border-gray-800 text-gray-400 hover:text-cyan-400 hover:border-cyan-900 hover:bg-gray-900/50 rounded-sm"
                          style={{ clipPath: buttonClipPath }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Option
                        </Button>
                      )}
                    </div>

                    {/* Slide-in settings panel */}
                    <AnimatePresence>
                      {showPollSettings && (
                        <motion.div
                          initial={{ x: "100%", opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: "100%", opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                          className="absolute inset-0 z-10"
                        >
                          <div
                            className="h-full space-y-3 border border-cyan-900/30 rounded-sm p-4 bg-[#1a1e2e] relative overflow-hidden"
                            style={{ clipPath }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-cyan-400 flex items-center">
                                <Settings className="h-4 w-4 mr-1" />
                                POLL SETTINGS
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() => setShowPollSettings(false)}
                                className="h-7 w-7 rounded-full text-gray-400 hover:text-fuchsia-400 hover:bg-fuchsia-950/30"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-4 mt-4">
                              <div className="space-y-2">
                                <label className="text-sm text-white flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-cyan-400" />
                                  Poll Duration
                                </label>
                                <select
                                  value={pollDuration}
                                  onChange={(e) =>
                                    setPollDuration(Number(e.target.value))
                                  }
                                  className="w-full bg-[#2a3547] border border-border rounded text-sm text-gray-300 p-2"
                                  style={{
                                    clipPath:
                                      "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                                  }}
                                >
                                  <option value={1}>1 hour</option>
                                  <option value={6}>6 hours</option>
                                  <option value={12}>12 hours</option>
                                  <option value={24}>24 hours</option>
                                  <option value={48}>48 hours</option>
                                  <option value={72}>72 hours</option>
                                  <option value={168}>7 days</option>
                                </select>
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm text-white flex items-center">
                                  {visibilityInfo.icon}
                                  <span className="ml-2">Who Can Vote</span>
                                </label>
                                <select
                                  value={pollVisibility}
                                  onChange={(e) =>
                                    setPollVisibility(e.target.value)
                                  }
                                  className="w-full bg-[#2a3547] border border-border rounded text-sm text-gray-300 p-2"
                                  style={{
                                    clipPath:
                                      "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                                  }}
                                >
                                  <option value="everyone">Everyone</option>
                                  <option value="allies">Allies only</option>
                                  <option value="clan">Clan only</option>
                                </select>
                              </div>

                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowPollSettings(false)}
                                className="w-full mt-4 bg-[#2a3547] text-cyan-400 hover:bg-[#3a4557] hover:text-cyan-300 border-cyan-900/50"
                                style={{ clipPath: buttonClipPath }}
                              >
                                Apply Settings
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <DialogFooter className="bg-[#1a1e2e]/30 border-t border-cyan-900/30 p-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    disabled={!form.watch("postContent").trim() || isPosting}
                    className="relative overflow-hidden bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white border-none"
                    style={{ clipPath }}
                  >
                    {isPosting ? (
                      <div className="flex items-center space-x-2">
                        <LoadingIndicator size="sm" showText={false} />
                        <span>TRANSMITTING...</span>
                      </div>
                    ) : (
                      <span className="relative z-10">
                        Drop{" "}
                        {isARPostEnabled
                          ? "AR"
                          : isPollActive
                          ? "Poll"
                          : "Post"}
                      </span>
                    )}
                  </Button>
                </motion.div>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
