"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Crop, Images, Sparkles, Hash, ArrowUp, Check } from "lucide-react";

export type AspectRatio =
  | "1:1"
  | "3:2"
  | "2:3"
  | "4:3"
  | "3:4"
  | "16:9"
  | "9:16";

export interface PromptComposerProps {
  className?: string;
  onSubmit?: (payload: {
    prompt: string;
    aspectRatio: AspectRatio;
    numImages: number;
    enhance: boolean;
    seed: number | null;
  }) => void;
}

export function PromptComposer({ className, onSubmit }: PromptComposerProps) {
  const [prompt, setPrompt] = React.useState("");
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>("3:2");
  const [numImages, setNumImages] = React.useState<number>(4);
  const [enhance, setEnhance] = React.useState<boolean>(true);
  const [seed, setSeed] = React.useState<number | null>(null);

  const handleSubmit = () => {
    if (!prompt.trim()) return;

    const payload = {
      prompt,
      aspectRatio,
      numImages,
      enhance,
      seed,
    };

    console.log("Submit payload ->", payload);
    onSubmit?.(payload);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "border border-white/10 bg-neutral-900 text-white p-4",
          className
        )}
      >
        {/* Textarea + Send */}
        <div className="flex items-start gap-3 border border-white/10 bg-neutral-900/60 px-4 py-3">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe an image…"
            className="min-h-[56px] max-h-[200px] resize-none outline-0 border-0 bg-transparent focus-visible:ring-0 text-white placeholder:text-neutral-400"
          />

          <button
            type="button"
            onClick={handleSubmit}
            aria-label="Send"
            className="mt-1 shrink-0 rounded-full p-2 hover:bg-white/10 transition disabled:opacity-40"
            disabled={!prompt.trim()}
          >
            <ArrowUp className="h-5 w-5 text-white/80" />
          </button>
        </div>

        {/* Controls */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {/* 1) Aspect ratio */}
          <TooltipWrap label="Aspect ratio">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-black border border-white/10 text-white hover:bg-white/10 gap-2"
                >
                  <Crop className="w-4 h-4" />
                  {aspectRatio}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuLabel>Aspect Ratio</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(
                  ["1:1", "3:2", "2:3", "4:3", "3:4", "16:9", "9:16"] as AspectRatio[]
                ).map((a) => (
                  <DropdownMenuItem
                    key={a}
                    onClick={() => setAspectRatio(a)}
                    className="flex items-center justify-between"
                  >
                    {a} {a === aspectRatio && <Check className="w-4 h-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipWrap>

          {/* 2) Number of images */}
          <TooltipWrap label="How many images to generate">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-black border border-white/10 text-white hover:bg-white/10 gap-2"
                >
                  <Images className="w-4 h-4" />
                  {numImages} {numImages === 1 ? "image" : "images"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-24">
                <DropdownMenuLabel>Images</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[1, 2, 4, 8].map((n) => (
                  <DropdownMenuItem
                    key={n}
                    onClick={() => setNumImages(n)}
                    className="flex items-center justify-between"
                  >
                    {n} {n === numImages && <Check className="w-4 h-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipWrap>

          {/* 3) Enhance toggle */}
          <TooltipWrap label="Enhance prompt / upscaling">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEnhance((v) => !v)}
              className={cn(
                "bg-black border border-white/10 text-white hover:bg-white/10 gap-2",
                enhance ? "opacity-100" : "opacity-60"
              )}
            >
              <Sparkles className="w-4 h-4" />
              {enhance ? "Enhance on" : "Enhance off"}
            </Button>
          </TooltipWrap>

          {/* 4) Seed popover */}
          <TooltipWrap label="Set a fixed seed (sent as steps)">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-black border border-white/10 text-white hover:bg-white/10 gap-2"
                >
                  <Hash className="w-4 h-4" />
                  {seed != null ? seed : "Seed"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-40 bg-neutral-900 text-white border border-white/10"
              >
                <label className="text-xs mb-1 block">Seed</label>
                <Input
                  type="number"
                  placeholder="seed"
                  value={seed ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSeed(v === "" ? null : Number(v));
                  }}
                  className="bg-black border-white/10 text-white placeholder:text-neutral-400"
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" onClick={() => console.log("Seed set to:", seed)}>
                    Set
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </TooltipWrap>
        </div>
      </div>
    </TooltipProvider>
  );
}

function TooltipWrap({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
