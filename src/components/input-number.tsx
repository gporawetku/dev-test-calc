import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { NumericFormat, NumericFormatProps } from "react-number-format";

const inputNumberVariants = cva(
  "w-full rounded-xl font-normal border border-[#D0D0D0] p-3",
  {
    variants: {
      invalid: {
        true: "border-[#FF5151]",
        false: "",
      },
    },
    defaultVariants: {
      invalid: false,
    },
  },
);

interface InputNumberProps
  extends NumericFormatProps,
    VariantProps<typeof inputNumberVariants> {}

const InputNumber = ({ className, invalid, ...props }: InputNumberProps) => {
  return (
    <NumericFormat
      className={cn(inputNumberVariants({ invalid, className }))}
      {...props}
    />
  );
};

export default InputNumber;
