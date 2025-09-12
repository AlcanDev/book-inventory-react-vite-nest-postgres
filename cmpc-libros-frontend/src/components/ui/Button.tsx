import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import Icon from "../AppIcon";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 rounded-md",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// Tipado laxo para que compile hoy mismo
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  loading?: boolean;
  iconName?: string | null;
  iconPosition?: "left" | "right";
  iconSize?: number | null;
  fullWidth?: boolean;
  variant?: any;
  size?: any;
  className?: string;
  children?: React.ReactNode;
};

const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("mr-2 h-4 w-4 animate-spin", className)}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
    <path
      d="M22 12a10 10 0 0 1-10 10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    className,
    variant = "default",
    size = "md",
    asChild = false,
    children,
    loading = false,
    iconName = null,
    iconPosition = "left",
    iconSize = null,
    fullWidth = false,
    disabled = false,
    ...rest
  } = props;

  const Comp: any = asChild ? Slot : "button";

  const renderIcon = () =>
    iconName ? <Icon name={iconName as any} size={iconSize ?? 16} /> : null;

  return (
    <Comp
      ref={ref as any}
      className={cn(
        buttonVariants({ variant, size }),
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...(rest as any)}
    >
      {loading && <LoadingSpinner />}
      {iconName && iconPosition === "left" && renderIcon()}
      {children}
      {iconName && iconPosition === "right" && renderIcon()}
    </Comp>
  );
});

Button.displayName = "Button";
export default Button;
export { buttonVariants };
