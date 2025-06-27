import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const beveledButtonVariants = cva(
  "relative inline-flex hover:cursor-pointer items-center justify-center bg-[#121212] group text-gray-400 font-mono uppercase tracking-wider text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "hover:text-cyan-300",
        cyan: "hover:text-cyan-300",
        fuchsia: "hover:text-fuchsia-300",
      },
      size: {
        default: "px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
        "icon-lsm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BeveledButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof beveledButtonVariants> {
  asChild?: boolean;
}

const BeveledButton = React.forwardRef<HTMLButtonElement, BeveledButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const clipPath =
      "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))";

    return (
      <button
        className={cn(beveledButtonVariants({ variant, size, className }))}
        ref={ref}
        style={{ clipPath }}
        {...props}
      >
        {/* Gradient border */}
        <div
          className={cn("absolute inset-0", {
            "bg-gradient-to-r from-cyan-500 to-fuchsia-500":
              variant === "default" || !variant,
            "bg-cyan-500": variant === "cyan",
            "bg-fuchsia-500": variant === "fuchsia",
          })}
          style={{ clipPath }}
        />

        {/* Background with beveled edge */}
        <div
          className={cn(
            "absolute inset-[1px] bg-[#121212] transition-colors duration-300",
            {
              "group-hover:bg-cyan-900/40":
                variant === "cyan" || variant === "default" || !variant,
              "group-hover:bg-fuchsia-900/40": variant === "fuchsia",
            }
          )}
          style={{ clipPath }}
        />

        {/* Scan line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Glow effect on hover */}
        <div
          className={cn(
            "absolute -inset-[1.5px] opacity-0 group-hover:opacity-75 blur-sm transition-opacity duration-300",
            {
              "bg-gradient-to-r from-cyan-500 to-fuchsia-500":
                variant === "default" || !variant,
              "bg-cyan-500": variant === "cyan",
              "bg-fuchsia-500": variant === "fuchsia",
            }
          )}
          style={{ zIndex: -1 }}
        />

        {/* Content */}
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

BeveledButton.displayName = "BeveledButton";

export { BeveledButton };
