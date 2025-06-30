import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center hover:cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        cyan: "hover:shadow-[0_0_15px_rgba(219,39,119,0.6)] hover:translate-y-[-2px] rounded-sm font-mono border border-cyan-500 text-cyan-400 hover:bg-cyan-950 hover:text-cyan-300",
        fuchsia:
          "hover:shadow-[0_0_15px_rgba(219,39,119,0.6)] hover:translate-y-[-2px] rounded-sm font-mono border border-fuchsia-500/50 bg-black/80 text-fuchsia-300 hover:bg-fuchsia-900/30 hover:border-fuchsia-400 transition-all duration-300",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

{
  /* <Button
          variant="outline"
          className="relative  group border-cyan-500/50 bg-[#121620] text-cyan-400 hover:bg-[#1a1e2e] hover:text-cyan-300"
          style={{ clipPath }}
        >
          <div className="absolute  inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 opacity-50" />
          <div
            className="absolute inset-0  bg-[radial-gradient(#3dd1c4_1px,transparent_1px)] opacity-10 mix-blend-overlay"
            style={{ backgroundSize: "16px 16px" }}
          ></div>
          <div className="relative z-10 flex items-center">
            <Send className="mr-2 h-4 w-4" />
            Create Post
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform translate-y-0 group-hover:opacity-100 transition-all duration-300"></div>
        </Button> */
}
