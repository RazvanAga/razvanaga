"use client";

import { useState } from "react";
import { TABLES } from "../kasiia/data";

export default function GuestsPage() {
  const [count, setCount] = useState(1);
  const [highlighted, setHighlighted] = useState<Record<string, Set<string>>>({});

  const handleShuffle = () => {
    const result: Record<string, Set<string>> = {};
    for (const table of TABLES) {
      const shuffled = [...table.guests].sort(() => Math.random() - 0.5);
      result[table.label] = new Set(shuffled.slice(0, count));
    }
    setHighlighted(result);
  };

  const handleReset = () => setHighlighted({});

  const hasHighlights = Object.keys(highlighted).length > 0;

  return (
    <main className="min-h-screen bg-[#ffe8d6] p-8 font-sans text-[#664e44]">
      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <label className="text-sm font-bold uppercase tracking-widest text-[#b08b7f]">
            Număr invitați per masă
          </label>
          <input
            type="number"
            min={1}
            max={12}
            value={count}
            onChange={(e) => setCount(Math.min(12, Math.max(1, Number(e.target.value))))}
            className="w-16 rounded-lg border border-[#c7c3b0] bg-white px-3 py-2 text-center text-lg font-bold text-[#664e44] focus:border-[#664e44] focus:outline-none"
          />
        </div>
        <button
          onClick={handleShuffle}
          className="rounded-full bg-[#664e44] px-6 py-2.5 text-sm font-black uppercase tracking-widest text-[#ffe8d6] shadow transition-all hover:bg-[#4d3a33] hover:scale-105"
        >
          Shuffle
        </button>
        {hasHighlights && (
          <button
            onClick={handleReset}
            className="rounded-full border-2 border-[#664e44] px-6 py-2.5 text-sm font-black uppercase tracking-widest text-[#664e44] transition-all hover:bg-[#664e44] hover:text-[#ffe8d6]"
          >
            Reset
          </button>
        )}
      </div>

      {/* Tables grid */}
      <div className="grid grid-cols-6 gap-4 max-w-[75vw] mx-auto">
        {TABLES.map((table) => {
          const sorted = [...table.guests].sort((a, b) => a.localeCompare(b, "ro"));
          const tableHighlights = highlighted[table.label] ?? new Set();
          return (
            <div key={table.label} className="rounded-xl border border-[#c7c3b0]/50 bg-white overflow-hidden shadow-sm">
              <div className="bg-[#664e44] px-4 py-2 text-center">
                <span className="font-serif text-base font-bold text-[#ffe8d6]">{table.label}</span>
                <span className="ml-2 text-xs text-[#ffe8d6]/70">{table.guests.length} pers.</span>
              </div>
              <table className="w-full">
                <tbody>
                  {Array.from({ length: 12 }, (_, i) => {
                    const guest = sorted[i];
                    const isHighlighted = guest && tableHighlights.has(guest);
                    return (
                      <tr
                        key={i}
                        className={isHighlighted ? "bg-[#664e44]" : i % 2 === 0 ? "bg-[#faf4e5]/60" : "bg-white"}
                      >
                        <td className={`px-3 py-1.5 text-sm font-medium ${isHighlighted ? "text-[#ffe8d6] font-bold" : "text-[#664e44]"}`}>
                          {guest ?? ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </main>
  );
}
