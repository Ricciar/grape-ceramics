// client/src/components/Container.tsx
import React from "react";

type Props = React.PropsWithChildren<{ className?: string }>;

export default function Container({ children, className = "" }: Props) {
  // 30px gutter on both sides, but never wider than 1200px overall
  return (
    <div className={`mx-auto w-full max-w-[min(1200px,calc(100%-60px))] px-0 ${className}`}>
      {children}
    </div>
  );
}
