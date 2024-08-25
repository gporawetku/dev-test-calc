import { cn } from "@/lib/utils";
import { ErrorMessage } from "@hookform/error-message";
import { FieldErrors, FieldValues } from "react-hook-form";

interface InputFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  label: React.ReactNode;
  errors: FieldErrors<FieldValues>;
  labelClassName?: string;
}

const InputField = ({
  children,
  name,
  label,
  className,
  labelClassName,
  errors,
  ...props
}: InputFieldProps) => {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      <label
        htmlFor={name}
        className={cn("text-sm font-medium leading-6", {
          "text-[#FF5151]": errors[name],
          labelClassName,
        })}
      >
        {label}
      </label>
      {children}
      {errors && (
        <ErrorMessage
          errors={errors}
          name={name}
          className="text-xs font-normal leading-5 text-[#FF5151] text-nowrap lg:text-wrap"
          as="small"
        />
      )}
    </div>
  );
};

export default InputField;
