import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const inputVariants = cva(
  "w-full rounded-xl border border-[#D0D0D0] p-3",
  {
    variants: {
      invalid: {
        true: "border-red-500",
        false: "",
      },
    },
    defaultVariants: {
      invalid: false,
    },
  },
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> { }

const Input = ({ className, invalid, ...props }: InputProps) => {
  return (
    <input
      className={cn(inputVariants({ invalid, className }))}
      {...props}
    />
  );
};

export default Input;
