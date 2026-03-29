"use client";

import Image from "next/image";
import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Church, Utensils, Phone, MapPin, ImageUp, UtensilsCrossed, MessageCircleHeart } from "lucide-react";
import { PHOTO_CHALLENGES } from "./data";
import UploadModal from "./UploadModal";
import SeatingSection from "./SeatingSection";

const SECRET_CODE = [2, 3, 0, 8];
const INITIAL_DIGITS = [2, 9, 0, 3];
const WEDDING_DATE = new Date("2026-03-29T14:00:00");

const CARD_CLASS = "flex-shrink-0 w-[calc(50%-0.5rem)] snap-start flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm border border-[#c7c3b0]/50 transition-all hover:-translate-y-1 hover:shadow-lg";
const BTN_CLASS = "w-full flex items-center justify-center gap-3 rounded-full bg-[#664e44] px-10 py-5 text-sm font-black uppercase tracking-[0.3em] text-[#ffe8d6] shadow-[0_20px_40px_-10px_rgba(102,78,68,0.4)] transition-all hover:bg-[#4d3a33] hover:scale-105 hover:shadow-[0_25px_55px_-10px_rgba(102,78,68,0.65)]";

// --- Countdown Component ---
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const target = WEDDING_DATE.getTime();
    const interval = setInterval(() => {
      const diff = target - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex items-center gap-5 sm:gap-10">
      {[
        { value: timeLeft.days,    label: "Zile" },
        { value: timeLeft.hours,   label: "Ore"  },
        { value: timeLeft.minutes, label: "Min"  },
        { value: timeLeft.seconds, label: "Sec"  },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="relative">
            <span className="font-serif text-[2rem] font-medium tabular-nums sm:text-[2.75rem] text-[#ffe8d6]">
              {String(item.value).padStart(2, "0")}
            </span>
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

// --- Main Page ---
export default function KasiiaPage() {
  const [showUpload, setShowUpload]     = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showSeating, setShowSeating]   = useState(false);
  const [showButtons, setShowButtons]   = useState(Date.now() >= WEDDING_DATE.getTime());
  const [secretDigits, setSecretDigits] = useState(INITIAL_DIGITS);
  const challengesRef = useRef<HTMLDivElement>(null);
  const seatingRef    = useRef<HTMLDivElement>(null);

  const handleDigitClick = (i: number) => {
    const next = [...secretDigits];
    next[i] = (next[i] + 1) % 10;
    setSecretDigits(next);
    if (next.join("") === SECRET_CODE.join("")) {
      setShowButtons((v) => !v);
      setSecretDigits([...INITIAL_DIGITS]);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#ffe8d6] font-sans text-[#664e44] selection:bg-[#b08b7f] selection:text-white">

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}

      {/* Header compact (hero-ul original e commented out mai jos) */}
      <header className="w-full bg-[#664e44] py-8 text-center text-[#ffe8d6]">
        <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-6xl">
          Răzvan <span className="italic">&</span> Kasiia
        </h1>
      </header>

      {/* Hero - TEMPORARILY HIDDEN
      <header className="relative h-[67vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Images/Thumbnail.jpeg"
            alt="Răzvan & Kasiia"
            fill
            className="object-cover brightness-[0.85] filter transition-all duration-1000 ease-in-out hover:scale-105"
            priority
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#664e44]/95 via-[#664e44]/30 to-transparent" />
        <div className="relative z-20 flex h-full flex-col items-center justify-end pb-8 text-center text-[#ffe8d6] sm:pb-20">
          <h1 className="font-serif text-5xl font-medium tracking-tight sm:text-8xl">
            Răzvan <span className="italic">&</span> Kasiia
          </h1>
          <div className="mt-4 flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em] sm:mt-8 sm:text-sm">
            <div className="flex flex-col items-center gap-1">
              <span className="font-serif text-3xl font-bold">29</span>
              <span className="opacity-70">Martie</span>
            </div>
            <div className="h-14 w-[1px] bg-[#b08b7f]/40" />
            <div className="flex flex-col items-center gap-1">
              <span className="font-serif text-3xl font-bold">2026</span>
              <span className="opacity-70">Duminică</span>
            </div>
          </div>
          <div className="mt-4 sm:mt-8">
            <CountdownTimer />
          </div>
        </div>
      </header>
      */}

      {/* Content */}
      <div className="relative z-10 mt-2 bg-[#ffe8d6] px-6 pt-2 pb-24 shadow-[0_-20px_50px_-10px_rgba(102,78,68,0.2)] sm:px-12">
        <div className="mx-auto max-w-4xl">

          {/* Locații - TEMPORARILY HIDDEN
          <div className="mb-6 text-center">
            <div className="mt-6 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              <a
                href="https://www.google.com/maps/place/Biserica+Adventist%C4%83+Maranatha/@45.7466411,21.2154907,17z/data=!3m1!4b1!4m6!3m5!1s0x47455d59d1680c25:0x712f6dbdb60dbab1!8m2!3d45.7466411!4d21.2154907!16s%2Fg%2F11xvz5_8v2?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank" rel="noopener noreferrer" className={CARD_CLASS}
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#faf4e5]">
                  <Church className="h-7 w-7 text-[#664e44]" />
                </div>
                <span className="text-lg font-bold text-[#664e44]">Cununia</span>
                <span className="mt-1 flex items-center gap-1 text-sm text-[#b08b7f] whitespace-nowrap"><MapPin className="h-3.5 w-3.5 shrink-0" />Biserica Maranatha</span>
                <span className="mt-2 font-serif text-3xl font-bold text-[#664e44]">14:00</span>
              </a>
              <a
                href="https://www.google.com/maps/place/LakeSide+Pool+%26+Ballroom/@45.6876066,21.2375553,15z/data=!4m6!3m5!1s0x47455ea63ec2c3d1:0x64833cc2c242e0e4!8m2!3d45.684881!4d21.2377256!16s%2Fg%2F11gb3yskz2?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank" rel="noopener noreferrer" className={CARD_CLASS}
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#faf4e5]">
                  <Utensils className="h-7 w-7 text-[#664e44]" />
                </div>
                <span className="text-lg font-bold text-[#664e44]">Restaurant</span>
                <span className="mt-1 flex items-center gap-1 text-sm text-[#b08b7f] whitespace-nowrap"><MapPin className="h-3.5 w-3.5 shrink-0" />Lakeside Flonta</span>
                <span className="mt-2 font-serif text-3xl font-bold text-[#664e44]">16:00</span>
              </a>
            </div>
          </div>
          */}

          {/* Formular invitați */}
          <div className="flex flex-col items-center gap-3 mb-10">
            <p className="text-center text-sm leading-relaxed text-[#b08b7f] max-w-xs">
              Ajută-ne să facem nunta cât mai amuzantă! Completează formularul cu răspunsurile tale.
            </p>
            <a
              href="https://forms.gle/TA32kCoAHvTDtm9A8"
              target="_blank"
              rel="noopener noreferrer"
              className={BTN_CLASS}
            >
              <MessageCircleHeart className="h-5 w-5 shrink-0" />
              <span className="whitespace-nowrap">Ce Spun Invitații?</span>
            </a>
          </div>

          {/* Butoane */}
          {showButtons && (
            <div className="flex flex-col items-center gap-10 mb-10">
              <div className="w-full flex flex-col items-center">
                <button
                  onClick={() => {
                    setShowSeating((v) => !v);
                    if (!showSeating) setTimeout(() => seatingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                  }}
                  className={BTN_CLASS}
                >
                  <UtensilsCrossed className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap">Aranjarea Meselor</span>
                </button>
                {showSeating && (
                  <div ref={seatingRef} className="w-full">
                    <SeatingSection />
                  </div>
                )}
              </div>

              <div className="w-full flex flex-col items-center gap-3">
                <button onClick={() => setShowUpload(true)} className={BTN_CLASS}>
                  <ImageUp className="h-5 w-5" />
                  Încarcă poze
                </button>
                <button
                  onClick={() => {
                    setShowChallenges((v) => !v);
                    if (!showChallenges) setTimeout(() => challengesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                  }}
                  className="text-xs font-bold uppercase tracking-[0.15em] text-[#664e44] underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity"
                >
                  {showChallenges ? "Ascunde lista" : "Participa la Vernisaj"}
                </button>
                {showChallenges && (
                  <div ref={challengesRef} className="w-full max-w-sm rounded-2xl bg-white border border-[#c7c3b0]/50 p-6 shadow-sm">
                    <p className="mb-4 text-sm leading-relaxed text-[#b08b7f] text-center">
                      Surprinde unul sau mai multe din aceste ipostaze și încarcă-le mai sus pentru miri.
                    </p>
                    <ol className="space-y-3">
                      {PHOTO_CHALLENGES.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-[#664e44]">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#faf4e5] text-xs font-bold text-[#b08b7f]">
                            {i + 1}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        <footer className="mt-8 border-t border-[#c7c3b0]/20 pt-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#c7c3b0]/50">
              <QRCodeSVG value="https://www.razvanaga.com/kasiia" size={160} fgColor="#664e44" bgColor="#ffffff" level="M" />
            </div>
            <a href="https://wa.me/40774580663" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#664e44] opacity-80 hover:opacity-100 transition-opacity">
              <Phone className="h-4 w-4" />
              <span className="text-sm font-bold">Răzvan - 0774580663</span>
            </a>
            <a href="https://wa.me/40724685936" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#664e44] opacity-80 hover:opacity-100 transition-opacity">
              <Phone className="h-4 w-4" />
              <span className="text-sm font-bold">Kasiia - 0724685936</span>
            </a>
            <div className="mt-4 select-none text-[#664e44] text-sm font-bold tracking-widest">
              {INITIAL_DIGITS.map((_, i) => (
                <React.Fragment key={i}>
                  <span onClick={() => handleDigitClick(i)} className="cursor-default">
                    {secretDigits[i]}
                  </span>
                  {i === 1 && <span>.</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
