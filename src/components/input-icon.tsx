import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputIconVariants = cva(
  "px-3 text-[#545454] font-normal text-sm leading-6",
  {
    variants: {
      invalid: {
        true: "text-[#FF5151]",
        false: "",
      },
    },
    defaultVariants: {
      invalid: false,
    },
  },
);

interface InputIconProps
  extends React.HtmlHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputIconVariants> {}

const InputIcon = ({
  children,
  className,
  invalid,
  ...props
}: InputIconProps) => {
  return (
    <div className={cn(inputIconVariants({ invalid, className }))} {...props}>
      {children}
    </div>
  );
};

export default InputIcon;
