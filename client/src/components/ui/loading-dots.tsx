interface LoadingDotsProps {
  delay?: number;
}

export default function LoadingDots({ delay = 0 }: LoadingDotsProps) {
  return (
    <div 
      className="w-2 h-2 bg-primary rounded-full animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
