"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

// --- Types ---
type Guest = {
  firstName: string;
  lastName: string;
  ageCategory: "adult" | "copil";
  menu: "carne" | "vegetarian";
};

// --- Components ---

// 1. Elegant Input Field
const InputField = ({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) => (
  <div className="group relative w-full">
    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#5F6F52] opacity-70 transition-opacity group-focus-within:opacity-100">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border-b border-[#A9B388] bg-transparent py-2 text-lg text-[#2A3B28] placeholder-neutral-300 transition-all focus:border-[#5F6F52] focus:outline-none focus:ring-0"
    />
  </div>
);

// 2. Modern Toggle/Selector
const SelectionGroup = ({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (val: any) => void;
}) => (
  <div className="mt-4">
    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#5F6F52] opacity-70">
      {label}
    </span>
    <div className="flex w-full gap-2 rounded-xl bg-[#F0F2E8] p-1">
      {options.map((opt) => {
        const isActive = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-300 ${
              isActive
                ? "bg-white text-[#5F6F52] shadow-sm"
                : "text-[#8BA085] hover:bg-white/50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

// 3. Modern Swipe Counter
const SwipeCounter = ({ count, onChange }: { count: number; onChange: (n: number) => void }) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const itemWidth = 80; // Slightly wider for better spacing

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;
    setSwipeOffset(diff);
  };

  const handleTouchEnd = () => {
    const swipedItems = -Math.round(swipeOffset / itemWidth);
    const newCount = Math.max(1, Math.min(9, count + swipedItems));

    onChange(newCount);
    setSwipeOffset(0);
    setIsSwiping(false);
  };

  return (
    <div className="flex flex-col items-center select-none">
      <span className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-[#B99470]">
        Selectează numărul de persoane
      </span>

      <div className="relative w-full max-w-md">
        {/* Soft Background Track */}
        <div className="absolute inset-0 -mx-4 h-full rounded-[2rem] bg-white/40 shadow-inner blur-[2px]" />

        {/* Side Gradients for Fade Effect */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-[#FEFAE0] via-[#FEFAE0]/40 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-[#FEFAE0] via-[#FEFAE0]/40 to-transparent" />

        <div
          className="relative z-10 cursor-grab active:cursor-grabbing overflow-hidden px-8 py-10"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Active Circle Indicator (Static background) */}
          <div className="absolute left-1/2 top-1/2 -z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_10px_30px_-5px_rgba(95,111,82,0.2)] border border-[#E8E6D1]" />

          <div
            className="flex items-center"
            style={{
              transform: `translateX(calc(50% - ${(count - 1) * itemWidth}px - ${itemWidth/2}px + ${swipeOffset}px))`,
              transition: isSwiping ? "none" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => {
              const isActive = num === count;
              const distance = Math.abs(num - count);

              // Calculate subtle scale and opacity based on distance
              const scale = Math.max(0.7, 1.2 - distance * 0.25);
              const opacity = Math.max(0.2, 1 - distance * 0.4);

              return (
                <div
                  key={num}
                  onClick={() => onChange(num)}
                  className="flex h-20 w-20 shrink-0 items-center justify-center font-serif text-4xl transition-all duration-300 cursor-pointer"
                  style={{
                    width: `${itemWidth}px`,
                    opacity,
                    transform: `scale(${scale})`,
                    color: isActive ? '#5F6F52' : '#A9B388',
                    fontWeight: isActive ? '600' : '400'
                  }}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>

        {/* Subtle Indicator Dots */}
        <div className="mt-4 flex justify-center gap-1.5 opacity-30">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
            <div
              key={num}
              className={`h-1 rounded-full transition-all duration-300 ${num === count ? 'w-4 bg-[#B99470]' : 'w-1 bg-[#A9B388]'}`}
            />
          ))}
        </div>
      </div>

      <p className="mt-6 text-[10px] uppercase tracking-widest text-[#8BA085] opacity-50">
        Glisează pentru a alege
      </p>
    </div>
  );
};

// --- Main Page ---

export default function KasiiaPage() {
  const [guestCount, setGuestCount] = useState(2);
  const [guests, setGuests] = useState<Guest[]>(
    Array.from({ length: 2 }, () => ({
      firstName: "",
      lastName: "",
      ageCategory: "adult",
      menu: "carne",
    }))
  );

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const formRef = useRef<HTMLDivElement>(null);

  // Sync guests array with count
  useEffect(() => {
    setGuests((prev) => {
      const newGuests = Array.from({ length: guestCount }, (_, i) =>
        prev[i] || {
          firstName: "",
          lastName: prev[0]?.lastName || "",
          ageCategory: "adult" as const,
          menu: "carne" as const
        }
      );
      return newGuests;
    });
  }, [guestCount]);

  const updateGuest = (index: number, field: keyof Guest, value: string) => {
    setGuests((prev) =>
      prev.map((guest, i) => {
        if (i === index) {
          return { ...guest, [field]: value };
        }
        if (index === 0 && field === "lastName") {
          return { ...guest, lastName: value };
        }
        return guest;
      })
    );
  };

  const validateGuests = () => {
    return guests.every((guest) => guest.firstName.trim() !== "" && guest.lastName.trim() !== "");
  };

  const handleSubmit = async () => {
    if (!validateGuests()) {
      alert("Te rugăm să completezi toate numele!");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("submitting");

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbwOBKQ4Vwpl2e5ds23gf7-MvLbCF7a7QPARbG60A5ZNnA0YOCnII0mEj4_KcYuV0dQH/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guests }),
          mode: "no-cors",
        }
      );
      setSubmitStatus("success");
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#FEFAE0] font-sans text-[#2A3B28] selection:bg-[#B99470] selection:text-white">

      {/* --- HERO SECTION --- */}
      <header className="relative h-[85vh] w-full overflow-hidden">
        <Image
          src="/Images/Thumbnail.jpeg"
          alt="Răzvan & Kasiia"
          fill
          className="object-cover brightness-[0.85] filter transition-all duration-1000 ease-in-out hover:scale-105"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A3B28]/90 via-[#2A3B28]/20 to-transparent" />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-16 text-center text-[#FEFAE0]">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] opacity-90">
            Save the Date
          </p>
          <h1 className="font-serif text-5xl font-medium tracking-tight sm:text-7xl">
            Răzvan <span className="text-[#B99470] italic">&</span> Kasiia
          </h1>

          <div className="mt-8 flex items-center gap-6 text-sm font-medium uppercase tracking-widest sm:text-base">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold">29</span>
              <span>Martie</span>
            </div>
            <div className="h-12 w-[1px] bg-[#B99470]/50" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold">2026</span>
              <span>Duminică</span>
            </div>
          </div>

          <a
            href="https://www.google.com/maps/place/LakeSide+Pool+%26+Ballroom"
            target="_blank"
            className="mt-8 flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all hover:bg-white/20"
          >
            <span>📍 Lakeside Flonta</span>
          </a>
        </div>
      </header>

      {/* --- CONTENT SECTION --- */}
      <div className="relative z-10 -mt-6 rounded-t-[2.5rem] bg-[#FEFAE0] px-4 pt-12 pb-24 shadow-2xl sm:px-8">

        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-medium text-[#5F6F52]">
              Confirmare Prezență
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[#8BA085]">
              Suntem onorați să vă avem alături. Vă rugăm să ne confirmați prezența completând detaliile de mai jos.
            </p>
          </div>

          {/* GUEST COUNTER */}
          <div className="mb-12">
            <SwipeCounter count={guestCount} onChange={setGuestCount} />
          </div>

          {/* FORMS GRID */}
          <div ref={formRef} className="grid gap-6 md:grid-cols-2">
            {guests.map((guest, index) => (
              <div
                key={index}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="group relative h-full overflow-hidden rounded-2xl bg-white p-6 shadow-[0_4px_20px_-4px_rgba(95,111,82,0.1)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(95,111,82,0.15)] border border-transparent hover:border-[#A9B388]/30">
                  <div className="absolute right-0 top-0 -mr-4 -mt-4 h-16 w-16 rounded-full bg-[#FEFAE0] opacity-50 blur-xl transition-all group-hover:bg-[#E8E6D1]" />

                  <h3 className="mb-6 flex items-center gap-2 font-serif text-lg font-medium text-[#5F6F52]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F0F2E8] text-xs font-bold">
                      {index + 1}
                    </span>
                    Invitat
                  </h3>

                  <div className="space-y-6">
                    <InputField
                      label="Nume de familie"
                      placeholder="ex: Popescu"
                      value={guest.lastName}
                      onChange={(val) => updateGuest(index, "lastName", val)}
                    />
                    <InputField
                      label="Prenume"
                      placeholder="ex: Andrei"
                      value={guest.firstName}
                      onChange={(val) => updateGuest(index, "firstName", val)}
                    />

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <SelectionGroup
                        label="Vârstă"
                        selected={guest.ageCategory}
                        options={[
                          { value: "adult", label: "Adult" },
                          { value: "copil", label: "Copil" }
                        ]}
                        onSelect={(val) => updateGuest(index, "ageCategory", val)}
                      />
                      <SelectionGroup
                        label="Meniu"
                        selected={guest.menu}
                        options={[
                          { value: "carne", label: "Carne" },
                          { value: "vegetarian", label: "Veg." }
                        ]}
                        onSelect={(val) => updateGuest(index, "menu", val)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SUBMIT AREA */}
          <div className="mt-16 text-center">
            {submitStatus === "success" ? (
              <div className="animate-in zoom-in duration-500 rounded-2xl bg-[#E8E6D1] p-8 text-[#5F6F52]">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#5F6F52] text-3xl text-white">
                  ✓
                </div>
                <h3 className="font-serif text-2xl font-bold">Mulțumim!</h3>
                <p className="mt-2">Confirmarea a fost trimisă cu succes.</p>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="mt-6 text-sm font-bold uppercase tracking-wider underline hover:opacity-70"
                >
                  Trimite încă o confirmare
                </button>
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group relative w-full max-w-sm overflow-hidden rounded-full bg-[#5F6F52] px-8 py-5 text-lg font-bold tracking-widest text-[#FEFAE0] shadow-xl transition-all hover:bg-[#4A5A3E] hover:scale-105 hover:shadow-2xl disabled:opacity-70 disabled:hover:scale-100"
              >
                <div className={`flex items-center justify-center gap-3 transition-transform duration-300 ${isSubmitting ? '-translate-y-16' : 'translate-y-0'}`}>
                  CONFIRMĂ PREZENȚA
                </div>

                {/* Loading Spinner Absolute Center */}
                <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isSubmitting ? 'translate-y-0' : 'translate-y-16'}`}>
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FEFAE0] border-t-transparent" />
                </div>
              </button>
            )}

            {submitStatus === "error" && (
              <p className="mt-4 text-red-500">Ceva nu a funcționat. Te rugăm să încerci din nou.</p>
            )}
          </div>
        </div>

        <footer className="mt-24 text-center text-xs text-[#8BA085] opacity-60">
          <p>© 2026 Răzvan & Kasiia Wedding</p>
        </footer>
      </div>
    </main>
  );
}
