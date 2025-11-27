interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6 border-b-2",
    md: "h-12 w-12 border-b-2",
    lg: "h-16 w-16 border-b-2",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-indigo-600 ${sizeClasses[size]}`}
      ></div>
    </div>
  );
}
