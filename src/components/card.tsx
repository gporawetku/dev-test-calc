import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[#D0D0D0] bg-[#FCFCFD] p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
