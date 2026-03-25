"use client";

import React, { useState, useRef } from "react";
import { ChevronDown, X } from "lucide-react";
import { TABLES, type Table } from "./data";

const TableCard = React.forwardRef<HTMLDivElement, { table: Table; isOpen: boolean; onToggle: () => void }>(
  ({ table, isOpen, onToggle }, ref) => {
    const sorted = [...table.guests].sort((a, b) => a.localeCompare(b, "ro"));
    return (
      <div ref={ref} className="rounded-2xl border border-[#c7c3b0]/50 bg-white overflow-hidden shadow-sm">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <span className="font-serif text-lg font-bold text-[#664e44]">{table.label}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#b08b7f]">{table.guests.length} pers.</span>
            <ChevronDown className={`h-4 w-4 text-[#b08b7f] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {isOpen && (
          <div className="border-t border-[#c7c3b0]/30">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className={`px-4 py-2 text-sm text-[#664e44] font-medium ${i % 2 === 0 ? "bg-[#faf4e5]/60" : "bg-white"}`}
              >
                {sorted[i] ?? "\u00A0"}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
TableCard.displayName = "TableCard";

const normalize = (s: string) =>
  s.toLowerCase()
    .replace(/[șş]/g, "s").replace(/[țţ]/g, "t")
    .replace(/[ăâ]/g, "a").replace(/î/g, "i")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const left  = TABLES.filter((_, i) => i % 2 === 0);
const right = TABLES.filter((_, i) => i % 2 !== 0);

const SeatingSection = () => {
  const [query, setQuery] = useState("");
  const [openTables, setOpenTables] = useState<Set<string>>(new Set());
  const tableRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleResultClick = (tableLabel: string) => {
    setOpenTables((prev) => new Set([...prev, tableLabel]));
    setQuery("");
    setTimeout(() => {
      tableRefs.current[tableLabel]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const toggleTable = (label: string) => {
    setOpenTables((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const results = query.trim().length >= 2
    ? TABLES.flatMap((t) =>
        t.guests
          .filter((g) => normalize(g).includes(normalize(query)))
          .map((g) => ({ name: g, table: t.label }))
      )
    : [];

  return (
    <div className="mt-4">
      <div className="relative mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Caută numele tău..."
          className="w-full rounded-full border border-[#c7c3b0]/60 bg-white px-5 py-3 text-sm text-[#664e44] placeholder-[#b08b7f]/60 focus:border-[#664e44] focus:outline-none shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b08b7f] hover:text-[#664e44]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {query.trim().length >= 2 && (
        <div className="mb-4 rounded-2xl border border-[#c7c3b0]/50 bg-white overflow-hidden shadow-sm">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-[#b08b7f] text-center">Niciun rezultat găsit.</p>
          ) : (
            results.map((r, i) => (
              <button
                key={i}
                onClick={() => handleResultClick(r.table)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors hover:bg-[#664e44]/10 active:bg-[#664e44]/20 ${i % 2 === 0 ? "bg-[#faf4e5]/60" : "bg-white"}`}
              >
                <span className="font-medium text-[#664e44]">{r.name}</span>
                <span className="font-bold text-[#b08b7f]">{r.table}</span>
              </button>
            ))
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {left.map((t) => (
            <TableCard
              key={t.label}
              ref={(el) => { tableRefs.current[t.label] = el; }}
              table={t}
              isOpen={openTables.has(t.label)}
              onToggle={() => toggleTable(t.label)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {right.map((t) => (
            <TableCard
              key={t.label}
              ref={(el) => { tableRefs.current[t.label] = el; }}
              table={t}
              isOpen={openTables.has(t.label)}
              onToggle={() => toggleTable(t.label)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatingSection;
