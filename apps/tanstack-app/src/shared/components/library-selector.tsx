import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface Library {
  name: string;
  icon: string;
}

const LIBRARIES: Library[] = [
  { name: "React 19", icon: "⚛️" },
  { name: "Vue 3", icon: "💚" },
  { name: "Svelte 5", icon: "🔥" },
  { name: "SolidJS", icon: "🟦" },
  { name: "Preact", icon: "🏎️" },
  { name: "Angular", icon: "🅰️" },
];

export function LibrarySelector() {
  const [selected, setSelected] = useState(LIBRARIES[0] as Library);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-between gap-4 h-full w-40 rounded-lg px-3 py-1.5 text-sm hover:bg-muted/60 transition-colors cursor-pointer outline-none"
        >
          <div className="flex flex-col items-start min-w-0">
            <span className="text-xs text-muted-foreground">Your library</span>
            <div className="flex items-center gap-1.5">
              <span className="shrink-0">{selected.icon}</span>
              <span className="font-medium truncate">{selected.name}</span>
            </div>
          </div>
          <ChevronsUpDown size={14} className="text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={8} className="w-44">
        {LIBRARIES.map((lib) => (
          <DropdownMenuItem key={lib.name} className="cursor-pointer" onClick={() => setSelected(lib)}>
            <span className="mr-2">{lib.icon}</span>
            {lib.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
