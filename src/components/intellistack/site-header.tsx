import { BrandLockup } from "./brand";
import { BackgroundPicker } from "./background-picker";
import type { useBackground } from "@/hooks/use-background";

export function SiteHeader({ background }: { background: ReturnType<typeof useBackground> }) {
  return (
    <header className="relative z-10 border-b border-env-accent/25 bg-background/55 backdrop-blur-md env-transition">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center lg:px-10">
        <BrandLockup />
        <div className="md:ml-auto">
          <BackgroundPicker background={background} />
        </div>
      </div>
    </header>
  );
}
