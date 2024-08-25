import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const iconFieldVariants = cva(
  "flex items-center bg-[#FFFFFF] rounded-xl border border-[#D0D0D0]",
  {
    variants: {
      iconPosition: {
        left: "flex-row c-icon-field-left",
        right: "flex-row-reverse c-icon-field-right",
      },
      invalid: {
        true: "border-[#FF5151]",
        false: "focus-within:border-[#1DC48D]",
      }
    },
    defaultVariants: {
      iconPosition: "right",
      invalid: false,
    },
  },
);

interface IconFieldProps extends React.HtmlHTMLAttributes<HTMLDivElement>, VariantProps<typeof iconFieldVariants> { }

const IconField = ({
  iconPosition,
  invalid,
  className,
  children,
  ...props
}: IconFieldProps) => {
  return (
    <div
      className={cn(iconFieldVariants({ invalid, iconPosition, className }))}
      {...props}
    >
      {children}
    </div>
  );
};

export default IconField;
