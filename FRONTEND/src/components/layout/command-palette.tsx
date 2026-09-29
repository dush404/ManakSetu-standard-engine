"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Table2, FileText, CornerDownLeft } from "lucide-react";
import { useUIStore } from "@/lib/store";
import { NAV_ITEMS } from "@/lib/nav";

interface SearchResult {
  type: "standard" | "tender";
  title: string;
  subtitle: string;
  href: string;
}

async function fetchSearch(q: string): Promise<SearchResult[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();
  return data.results;
}

export function CommandPalette() {
  const open = useUIStore((s) => s.paletteOpen);
  const setOpen = useUIStore((s) => s.setPaletteOpen);
  const router = useRouter();

  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  const { data, isFetching } = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => fetchSearch(debounced),
    enabled: open,
    staleTime: 5_000,
  });

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (!o) setQ("");
  };

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      className="rounded"
    >
      <CommandInput
        placeholder="Search standards, tender IDs, reports…"
        value={q}
        onValueChange={setQ}
      />
      <CommandList className="thin-scroll">
        {isFetching && (
          <div className="px-4 py-3 text-xs text-muted-foreground" role="status">
            Searching…
          </div>
        )}
        {!isFetching && data && data.length === 0 && (
          <CommandEmpty>No matches for “{q}”.</CommandEmpty>
        )}

        <CommandGroup heading="Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.href}
                value={`nav ${item.label}`}
                onSelect={() => go(item.href)}
                className="rounded"
              >
                <Icon className="mr-2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} aria-hidden />
                {item.label}
              </CommandItem>
            );
          })}
        </CommandGroup>

        {data && data.length > 0 && (
          <>
            <CommandSeparator />
            {data.some((r) => r.type === "standard") && (
              <CommandGroup heading="Standards">
                {data
                  .filter((r) => r.type === "standard")
                  .map((r) => (
                    <CommandItem
                      key={r.href + r.title}
                      value={`std ${r.title} ${r.subtitle}`}
                      onSelect={() => go(r.href)}
                      className="rounded"
                    >
                      <Table2 className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
                      <span className="font-mono text-xs font-medium tabular-nums">{r.title}</span>
                      <span className="ml-2 truncate text-xs text-muted-foreground">{r.subtitle}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
            {data.some((r) => r.type === "tender") && (
              <CommandGroup heading="Tender Audits">
                {data
                  .filter((r) => r.type === "tender")
                  .map((r) => (
                    <CommandItem
                      key={r.href + r.title}
                      value={`tender ${r.title} ${r.subtitle}`}
                      onSelect={() => go(r.href)}
                      className="rounded"
                    >
                      <FileText className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
                      <span className="font-mono text-xs font-medium tabular-nums">{r.title}</span>
                      <span className="ml-2 truncate text-xs text-muted-foreground">{r.subtitle}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
      <div className="flex items-center gap-3 border-t border-border px-3 py-1.5 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          ↑↓ Navigate
        </span>
        <span className="flex items-center gap-1">
          <CornerDownLeft className="h-3 w-3" strokeWidth={1.5} aria-hidden /> Open
        </span>
        <span>Esc Close</span>
      </div>
    </CommandDialog>
  );
}
