import { Check, ImagePlus, Images, Trash2 } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { useBackground } from "@/hooks/use-background";
import { BACKGROUND_PRESETS, CUSTOM_BACKGROUND_ID, MAX_CUSTOM_BACKGROUND_BYTES } from "@/lib/intellistack/backgrounds";
import { cn } from "@/lib/utils";

export function BackgroundPicker({ background }: { background: ReturnType<typeof useBackground> }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { selectedId, customSrc, select, setCustom, clearCustom } = background;

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_CUSTOM_BACKGROUND_BYTES) {
      toast.error("Please choose a photo under 3 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        setCustom(String(reader.result));
        toast.success("Background updated on this device.");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Couldn't save this photo.");
      }
    };
    reader.readAsDataURL(file);
  }

  const options = [
    ...BACKGROUND_PRESETS,
    ...(customSrc ? [{ id: CUSTOM_BACKGROUND_ID, name: "Your photo", src: customSrc }] : []),
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-env-accent/50 bg-background/40 text-foreground hover:bg-env-base hover:text-foreground">
          <Images className="text-env-accent" aria-hidden="true" />
          Background
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 border-env-accent/40 bg-popover">
        <p className="font-display text-sm font-bold text-foreground">Background photo</p>
        <p className="mb-3 text-xs text-muted-foreground">Your choice is saved on this device.</p>
        <div className="grid grid-cols-2 gap-2">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => select(o.id)}
              aria-pressed={selectedId === o.id}
              className={cn(
                "relative overflow-hidden rounded-md border text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-env-accent",
                selectedId === o.id ? "border-env-accent shadow-env-glow" : "border-border hover:border-env-accent/70",
              )}
            >
              <img src={o.src} alt="" className="h-20 w-full object-cover" loading="lazy" />
              <span className="block truncate bg-background/80 px-2 py-1 text-[0.7rem] text-foreground">{o.name}</span>
              {selectedId === o.id && (
                <Check className="absolute right-1.5 top-1.5 h-4 w-4 rounded-full bg-env-accent p-0.5 text-env-deep" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Button type="button" size="sm" className="flex-1" onClick={() => fileRef.current?.click()}>
            <ImagePlus aria-hidden="true" />
            Upload photo
          </Button>
          {customSrc && (
            <Button type="button" size="sm" variant="outline" onClick={clearCustom} aria-label="Remove your photo">
              <Trash2 aria-hidden="true" />
            </Button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
