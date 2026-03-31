"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type AvatarStatus = "idle" | "loaded" | "error";

const AvatarContext = React.createContext<{
  status: AvatarStatus;
  setStatus: React.Dispatch<React.SetStateAction<AvatarStatus>>;
} | null>(null);

const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const [status, setStatus] = React.useState<AvatarStatus>("idle");

    return (
      <AvatarContext.Provider value={{ status, setStatus }}>
        <div
          ref={ref}
          className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
          )}
          {...props}
        />
      </AvatarContext.Provider>
    );
  }
);
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, alt = "", onLoad, onError, ...props }, ref) => {
  const avatar = React.useContext(AvatarContext);

  return (
    <img
      ref={ref}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      onLoad={(event) => {
        avatar?.setStatus("loaded");
        onLoad?.(event);
      }}
      onError={(event) => {
        avatar?.setStatus("error");
        onError?.(event);
      }}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  const avatar = React.useContext(AvatarContext);
  if (avatar?.status === "loaded") return null;

  return (
    <span
      ref={ref}
      className={cn(
        "absolute inset-0 flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  );
});
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
