"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Church, Utensils, Soup, Salad, UtensilsCrossed, Cake } from "lucide-react";

// --- Types ---
type Guest = {
  firstName: string;
  lastName: string;
  ageCategory: "adult" | "copil";
  menu: "carne" | "vegetarian";
};

// --- Components ---

// 1. Elegant Input Field (Updated with Named Groups for Isolation)
const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  error
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: boolean;
}) => (
  <div className="group/input relative w-full">
    <label className={`mb-1 block text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${error ? "text-red-400" : "text-[#664e44] opacity-60 group-focus-within/input:opacity-100"}`}>
      {label}
    </label>
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-t-lg border-b-2 bg-[#faf4e5]/30 px-3 py-3 text-lg text-[#664e44] placeholder-neutral-400/50 transition-all focus:bg-[#faf4e5]/60 focus:outline-none focus:ring-0 ${
          error 
            ? "border-red-300 focus:border-red-500" 
            : "border-[#c7c3b0]/40 focus:border-[#664e44]"
        }`}
      />
      {/* Animated underline focus effect - scoped strictly to this input */}
      <div className={`absolute bottom-0 left-0 h-0.5 w-0 bg-[#664e44] transition-all duration-300 group-focus-within/input:w-full ${error ? "bg-red-500" : ""}`} />
    </div>
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
    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#664e44] opacity-60">
      {label}
    </span>
    <div className="flex w-full gap-1.5 rounded-xl bg-[#faf4e5]/60 p-1.5">
      {options.map((opt) => {
        const isActive = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`flex-1 rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              isActive
                ? "bg-white text-[#664e44] shadow-sm"
                : "text-[#b08b7f] hover:bg-white/40"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

// 3. Modern Swipe Counter with Buttons
const SwipeCounter = ({ count, onChange }: { count: number; onChange: (n: number) => void }) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const itemWidth = 80; 
  
  const minCount = 1;
  const maxCount = 9;

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
    const newCount = Math.max(minCount, Math.min(maxCount, count + swipedItems));

    onChange(newCount);
    setSwipeOffset(0);
    setIsSwiping(false);
  };
  
  const decrement = () => {
    if (count > minCount) onChange(count - 1);
  };
  
  const increment = () => {
    if (count < maxCount) onChange(count + 1);
  };

  return (
    <div className="flex flex-col items-center select-none">
      <h2 className="mb-8 text-center font-serif text-4xl font-medium text-[#664e44] sm:text-5xl">
        Numărul de Persoane
      </h2>

      <div className="flex w-full items-center justify-center gap-2 sm:gap-6">
        {/* Decrement Button */}
        <button 
          onClick={decrement}
          disabled={count <= minCount}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-[#c7c3b0] text-[#664e44] transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
          aria-label="Scade numărul de persoane"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
        </button>

        <div className="relative w-full max-w-[280px] sm:max-w-md">
          {/* Soft Background Track */}
          <div className="absolute inset-0 -mx-2 h-full rounded-[2.5rem] bg-white/40 shadow-inner blur-[1px]" />

          {/* Side Gradients for Fade Effect */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-[#ffe8d6] via-[#ffe8d6]/40 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-[#ffe8d6] via-[#ffe8d6]/40 to-transparent" />

          <div
            className="relative z-10 cursor-grab active:cursor-grabbing overflow-hidden px-4 py-10"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Active Circle Indicator */}
            <div className="absolute left-1/2 top-1/2 -z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_10px_30px_-5px_rgba(102, 78, 68,0.15)] border border-[#c7c3b0]" />

            <div
              className="flex items-center"
              style={{
                transform: `translateX(calc(50% - ${(count - 1) * itemWidth}px - ${itemWidth/2}px + ${swipeOffset}px))`,
                transition: isSwiping ? "none" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
            >
              {Array.from({ length: maxCount }, (_, i) => i + 1).map((num) => {
                const isActive = num === count;
                const distance = Math.abs(num - count);

                const scale = Math.max(0.7, 1.2 - distance * 0.25);
                const opacity = Math.max(0.2, 1 - distance * 0.4);

                return (
                  <div
                    key={num}
                    onClick={() => onChange(num)}
                    className="flex h-20 w-20 shrink-0 items-center justify-center font-serif text-4xl transition-all duration-300 cursor-pointer leading-none pb-3"
                    style={{
                      width: `${itemWidth}px`,
                      opacity,
                      transform: `scale(${scale})`,
                      color: isActive ? '#664e44' : '#c7c3b0',
                      fontWeight: isActive ? '600' : '400'
                    }}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Increment Button */}
        <button
          onClick={increment}
          disabled={count >= maxCount}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-[#c7c3b0] text-[#664e44] transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
          aria-label="Crește numărul de persoane"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    </div>
  );
};

// 4. Countdown Component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const targetDate = new Date("2026-03-29T14:00:00").getTime(); // Setting 2 PM as ceremony time

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    // Increased gap from 4/8 to 5/10 to widen the component
    <div className="flex items-center gap-5 sm:gap-10">
      {[
        { value: timeLeft.days, label: "Zile" },
        { value: timeLeft.hours, label: "Ore" },
        { value: timeLeft.minutes, label: "Min" },
        { value: timeLeft.seconds, label: "Sec" },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="relative">
             {/* Increased font size slightly from text-3xl/4xl to custom scale for ~5% bump */}
             <span className="font-serif text-[2rem] font-medium tabular-nums sm:text-[2.75rem] text-[#ffe8d6]">
              {String(item.value).padStart(2, "0")}
            </span>
            {/* Subtle glow/shadow for better readability over image */}
            <span className="absolute inset-0 font-serif text-[2rem] font-medium tabular-nums blur-[1px] sm:text-[2.75rem] text-black/20" aria-hidden="true">
              {String(item.value).padStart(2, "0")}
            </span>
          </div>
          <span className="mt-1 text-[8px] font-bold uppercase tracking-widest opacity-60 sm:text-[10px]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// 5. Program Timeline with Scroll Progress
const ProgramTimeline = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(33.33);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const totalPages = 3;
    const currentPage = maxScroll > 0 ? Math.round((scrollLeft / maxScroll) * (totalPages - 1)) : 0;
    const progress = ((currentPage + 1) / totalPages) * 100;
    setScrollProgress(progress);
  };

  const activities = [
    { time: "15:00", label: "Cununia Religioasă", icon: Church },
    { time: "16:30", label: "Aperitivul", icon: Utensils },
    { time: "18:00", label: "Supa", icon: Soup },
    { time: "19:30", label: "Antreul", icon: Salad },
    { time: "21:00", label: "Felul Principal", icon: UtensilsCrossed },
    { time: "22:00", label: "Tortul", icon: Cake },
  ];

  return (
    <div className="mb-8">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
      >
        {activities.map((item, idx) => (
          <div
            key={idx}
            className={`flex-shrink-0 w-[calc(50%-0.5rem)] ${idx % 2 === 0 ? 'snap-start' : ''}`}
          >
            <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm border border-[#c7c3b0]/50 transition-all hover:shadow-md h-full">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#faf4e5]">
                <item.icon className="h-7 w-7 text-[#664e44]" />
              </div>
              <span className="text-lg font-bold text-[#664e44]">{item.time}</span>
              <span className="mt-1 text-center text-sm text-[#b08b7f]">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Progress Bar */}
      <div className="mt-4 mx-auto w-32 h-1.5 rounded-full bg-[#c7c3b0]">
        <div
          className="h-full rounded-full bg-[#664e44] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
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
  const [showValidation, setShowValidation] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLDivElement>(null);

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
    if (showValidation) setShowValidation(false);
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
      setShowValidation(true);
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
    <main className="min-h-screen w-full bg-[#ffe8d6] font-sans text-[#664e44] selection:bg-[#b08b7f] selection:text-white">

      {/* --- HERO SECTION --- */}
      <header className="relative h-[90vh] w-full overflow-hidden">
        {/* Layer 1: Image (Base) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Images/Thumbnail.jpeg"
            alt="Răzvan & Kasiia"
            fill
            className="object-cover brightness-[0.85] filter transition-all duration-1000 ease-in-out hover:scale-105"
            priority
          />
        </div>

        {/* Layer 2: Gradient Overlay (Middle) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#664e44]/95 via-[#664e44]/30 to-transparent" />

        {/* Layer 3: Content (Top) */}
        <div className="relative z-20 flex h-full flex-col items-center justify-end pb-8 text-center text-[#ffe8d6] sm:pb-20">
          <h1 className="font-serif text-5xl font-medium tracking-tight sm:text-8xl">
            Răzvan <span className="text-[#b08b7f] italic">&</span> Kasiia
          </h1>

          <div className="mt-4 flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em] sm:mt-8 sm:text-sm">
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold">29</span>
              <span className="opacity-70">Martie</span>
            </div>
            <div className="h-14 w-[1px] bg-[#b08b7f]/40" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold">2026</span>
              <span className="opacity-70">Duminică</span>
            </div>
          </div>
          
          {/* Countdown Timer */}
          <div className="mt-4 sm:mt-8">
            <CountdownTimer />
          </div>

          <div className="mt-6 flex flex-col items-center gap-4 sm:mt-10">
            <a
              href="https://www.google.com/maps/place/LakeSide+Pool+%26+Ballroom/@45.6876066,21.2375553,15z/data=!4m6!3m5!1s0x47455ea63ec2c3d1:0x64833cc2c242e0e4!8m2!3d45.684881!4d21.2377256!16s%2Fg%2F11gb3yskz2?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              className="flex w-[240px] items-center justify-center gap-2 rounded-full bg-white/10 py-4 text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md transition-all hover:bg-white/20"
            >
              <span>📍 Lakeside Flonta</span>
            </a>
          </div>
        </div>
      </header>

      {/* --- CONTENT SECTION --- */}
      <div
        ref={startRef}
        className="relative z-10 mt-2 bg-[#ffe8d6] px-6 pt-10 pb-24 shadow-[0_-20px_50px_-10px_rgba(102, 78, 68,0.2)] sm:px-12"
      >

        <div className="mx-auto max-w-4xl">
          {/* Program Timeline */}
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl font-medium text-[#664e44] sm:text-5xl">Program</h2>
            <p className="mx-auto mt-5 max-w-[280px] sm:max-w-lg leading-relaxed text-[#b08b7f] text-balance">
              Ceremonia și petrecerea vor avea loc la <br className="hidden sm:block" /> Lakeside Flonta.
            </p>
            <div className="mt-6">
              <ProgramTimeline />
            </div>
          </div>

          <div className="mb-12 text-center">
            <h2 className="font-serif text-4xl font-medium text-[#664e44] sm:text-5xl">
              Confirmă prezența
            </h2>

            <p className="mx-auto mt-5 max-w-[280px] sm:max-w-lg leading-relaxed text-[#b08b7f] text-balance">
              Vă rugăm să ne confirmați prezența <br className="hidden sm:block" /> până la data de 1 Martie.
            </p>
          </div>

          {/* GUEST COUNTER */}
          <div className="mb-16">
            <SwipeCounter count={guestCount} onChange={setGuestCount} />
          </div>

          {/* FORMS GRID */}
          <div ref={formRef} className="grid gap-8 md:grid-cols-2">
            {guests.map((guest, index) => (
              <div
                key={index}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* CARD GROUP - Named to avoid conflicts */}
                <div className="group/card relative h-full overflow-hidden rounded-[2rem] bg-white p-8 shadow-[0_10px_40px_-10px_rgba(102, 78, 68,0.12)] transition-all hover:shadow-[0_20px_50px_-10px_rgba(102, 78, 68,0.18)] border border-[#c7c3b0]/50">
                  <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-[#ffe8d6] opacity-40 blur-2xl transition-all group-hover/card:scale-150 group-hover/card:bg-[#c7c3b0]" />

                  <h3 className="mb-8 flex items-center gap-3 font-serif text-xl font-medium text-[#664e44]">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#faf4e5] text-sm font-bold shadow-inner">
                      {index + 1}
                    </span>
                    Invitat
                  </h3>

                  <div className="space-y-8">
                    <InputField
                      label="Nume de familie"
                      placeholder="ex: Popescu"
                      value={guest.lastName}
                      onChange={(val) => updateGuest(index, "lastName", val)}
                      error={showValidation && guest.lastName.trim() === ""}
                    />
                    <InputField
                      label="Prenume"
                      placeholder="ex: Andrei"
                      value={guest.firstName}
                      onChange={(val) => updateGuest(index, "firstName", val)}
                      error={showValidation && guest.firstName.trim() === ""}
                    />

                    <div className="grid grid-cols-2 gap-4">
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
          <div className="mt-20 text-center">
            {submitStatus === "success" ? (
              <div className="animate-in zoom-in duration-500 rounded-[2.5rem] bg-white border border-[#c7c3b0] p-12 shadow-xl">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#664e44] text-4xl text-white shadow-lg">
                  ✓
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#664e44]">Mulțumim!</h3>
                <p className="mt-4 text-lg text-[#b08b7f]">Confirmarea a fost trimisă cu succes. Vă așteptăm!</p>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#b08b7f] hover:opacity-70 transition-opacity"
                >
                  Trimite încă o confirmare
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                 {showValidation && (
                    <p className="animate-in fade-in slide-in-from-top-2 text-sm font-bold text-red-400 tracking-wide">
                      ⚠️ Te rugăm să completezi câmpurile marcate cu roșu.
                    </p>
                  )}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="group relative w-full max-md overflow-hidden rounded-full bg-[#664e44] px-10 py-6 text-sm font-black uppercase tracking-[0.3em] text-[#ffe8d6] shadow-[0_20px_40px_-10px_rgba(102, 78, 68,0.4)] transition-all hover:bg-[#4d3a33] hover:scale-105 hover:shadow-[0_25px_50px_-12px_rgba(102, 78, 68,0.5)] disabled:opacity-70 disabled:hover:scale-100"
                >
                  <div className={`flex items-center justify-center gap-3 transition-transform duration-500 ${isSubmitting ? '-translate-y-20' : 'translate-y-0'}`}>
                    CONFIRMĂ PREZENȚA
                  </div>

                  {/* Loading Spinner */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${isSubmitting ? 'translate-y-0' : 'translate-y-20'}`}>
                    <div className="h-7 w-7 animate-spin rounded-full border-3 border-[#ffe8d6] border-t-transparent" />
                  </div>
                </button>
              </div>
            )}

            {submitStatus === "error" && (
              <p className="mt-6 font-bold text-red-500">A apărut o eroare. Te rugăm să încerci din nou sau să ne contactezi direct.</p>
            )}
          </div>
        </div>

        <footer className="mt-32 border-t border-[#c7c3b0]/20 pt-12 text-center">
          <p className="font-serif text-xl italic text-[#664e44] opacity-80">Răzvan & Kasiia</p>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#b08b7f] opacity-50">
            © 29 Martie 2026
          </p>
        </footer>
      </div>
    </main>
  );
}
