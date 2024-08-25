import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-medium leading-7 disabled:pointer-events-none disabled:opacity-50 lg:px-2",
  {
    variants: {
      variant: {
        primary: "bg-[#E82583] text-[#FCFCFD]",
        transparent: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  label?: React.ReactNode;
}

const Button = ({
  label,
  variant,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button className={cn(buttonVariants({ variant, className }))} {...props}>
      {label || children}
    </button>
  );
};

export default Button;
