"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Church, Utensils, Phone, MapPin, ImageUp, X, ChevronDown, Beef, Leaf, Fish, Baby, UtensilsCrossed } from "lucide-react";

// --- Date mese ---
type MenuType = "MS" | "MV" | "MVP" | "MC";
interface Guest { name: string; menu: MenuType }
interface Table { label: string; guests: Guest[] }

const MENU_INFO: Record<MenuType, { label: string; icon: React.ReactNode; color: string }> = {
  MS:  { label: "Meniu standard",     icon: <Beef  className="h-4 w-4" />, color: "text-amber-700" },
  MV:  { label: "Meniu vegetarian",   icon: <Leaf  className="h-4 w-4" />, color: "text-green-600" },
  MVP: { label: "Meniu pescatarian",  icon: <Fish  className="h-4 w-4" />, color: "text-blue-500"  },
  MC:  { label: "Meniu copil",        icon: <Baby  className="h-4 w-4" />, color: "text-pink-400"  },
};

const TABLES: Table[] = [
  { label: "Masa 1", guests: [
    { name: "Boghiu Carolina", menu: "MS" }, { name: "Dumitriu David", menu: "MS" },
    { name: "Grama Eduard", menu: "MS" }, { name: "Stancu David", menu: "MS" },
    { name: "Ogica Cristian", menu: "MS" }, { name: "Ogica Andreea", menu: "MV" },
    { name: "Toader Malina", menu: "MV" }, { name: "Tanul Christian", menu: "MS" },
    { name: "Tanul Ana", menu: "MS" }, { name: "Tanul Alexandru", menu: "MS" },
    { name: "Toma Narcis", menu: "MV" }, { name: "Tutunaru Leonard", menu: "MS" },
  ]},
  { label: "Masa 2", guests: [
    { name: "Cernicica Daniela", menu: "MS" }, { name: "Cernicica Daria", menu: "MV" },
    { name: "Sisu Andrei", menu: "MS" }, { name: "Dimoiu Cezar", menu: "MS" },
    { name: "Dimoiu Odette", menu: "MVP" }, { name: "Durlanu Dorina", menu: "MVP" },
    { name: "Durlanu Daniel", menu: "MS" }, { name: "Durlanu Catalin", menu: "MS" },
    { name: "Gura Naiana", menu: "MS" }, { name: "Românu Margareta", menu: "MVP" },
    { name: "Românu Octavian", menu: "MS" },
  ]},
  { label: "Masa 3", guests: [
    { name: "Argirova Mariia", menu: "MVP" }, { name: "Laslo Alin", menu: "MS" },
    { name: "Laslo Yana", menu: "MS" }, { name: "Laslo Florin", menu: "MS" },
    { name: "Laslo Lăcrămioara", menu: "MS" }, { name: "Burkan Anushka", menu: "MS" },
    { name: "Burkan Igor", menu: "MS" }, { name: "Eibatova Yuliia", menu: "MS" },
    { name: "Eibatova Rosaliia", menu: "MC" }, { name: "Eibatova Samira", menu: "MC" },
    { name: "Voinovici Viktoria", menu: "MS" }, { name: "Voinovici Narcis", menu: "MS" },
  ]},
  { label: "Masa 4", guests: [
    { name: "Aga Diana", menu: "MS" }, { name: "Macovei Alexandra", menu: "MS" },
    { name: "Micu Sara", menu: "MV" }, { name: "Șalapa Ana Maria", menu: "MV" },
    { name: "Murariu Nesia", menu: "MV" }, { name: "Cernicica Bogdan", menu: "MS" },
    { name: "Ban Ruana", menu: "MS" }, { name: "Maghiari Oana", menu: "MS" },
    { name: "Maghiari Călin", menu: "MV" }, { name: "Bejera Florin", menu: "MV" },
    { name: "Marc Gherzan", menu: "MVP" }, { name: "Cozma Maria", menu: "MS" },
  ]},
  { label: "Masa 5", guests: [
    { name: "Albrich Philip", menu: "MV" }, { name: "Jîrcan Bianca", menu: "MV" },
    { name: "Nasui Simon", menu: "MS" }, { name: "Prundeanu Luis", menu: "MS" },
    { name: "Șova Bianca", menu: "MVP" }, { name: "Ion Amalia", menu: "MS" },
    { name: "Ion Cosmin", menu: "MS" }, { name: "Tolbaru Daniela", menu: "MS" },
    { name: "Sas Gabriela", menu: "MS" }, { name: "Ionașcu Denis", menu: "MS" },
    { name: "Radu Andrei", menu: "MS" }, { name: "Forgo Larisa", menu: "MVP" },
  ]},
  { label: "Masa 6", guests: [
    { name: "Burkan Nelia", menu: "MS" }, { name: "Burkan Eugen", menu: "MS" },
    { name: "Burkan Sofia", menu: "MS" }, { name: "Burkan Yan", menu: "MS" },
    { name: "Burkan Vera", menu: "MS" }, { name: "Burkan Lida", menu: "MC" },
    { name: "Kiron Oleksii Jr", menu: "MS" }, { name: "Kiron Vladyslav", menu: "MS" },
    { name: "Kiron Oleksii", menu: "MS" }, { name: "Kiron Svitlana", menu: "MS" },
    { name: "Kiron Heorhii", menu: "MS" }, { name: "Kiron Nina", menu: "MS" },
  ]},
  { label: "Masa 7", guests: [
    { name: "Dumitraș Cristian", menu: "MS" }, { name: "Dumitraș Violeta", menu: "MS" },
    { name: "Dumitraș Victor", menu: "MC" }, { name: "Gorun Cristi", menu: "MS" },
    { name: "Gorun Lidia", menu: "MS" }, { name: "Radu Lucian", menu: "MS" },
    { name: "Radu Olivia", menu: "MS" }, { name: "Șipoș Mihai", menu: "MS" },
    { name: "Șipoș Medana", menu: "MS" }, { name: "Ursica Ionel", menu: "MS" },
    { name: "Ursica Lucica", menu: "MS" },
  ]},
  { label: "Masa 8", guests: [
    { name: "Balasa Alina", menu: "MS" }, { name: "Balasa Iosif", menu: "MS" },
    { name: "Grama Bujor", menu: "MS" }, { name: "Grama Maria", menu: "MS" },
    { name: "Onița Lucian", menu: "MS" }, { name: "Onița Maria", menu: "MS" },
    { name: "Sas Stefan", menu: "MS" }, { name: "Sas Livia", menu: "MS" },
    { name: "Toader Adrian", menu: "MVP" }, { name: "Toader Edith", menu: "MS" },
    { name: "Puțureanu Eugen", menu: "MV" }, { name: "Puțureanu Daria", menu: "MV" },
  ]},
  { label: "Masa 9", guests: [
    { name: "Aga Dorin", menu: "MS" }, { name: "Aga Ana", menu: "MV" },
    { name: "Aga Florin", menu: "MS" }, { name: "Aga Simona", menu: "MS" },
    { name: "Ghinghie Ioan", menu: "MVP" }, { name: "Ghinghie Adi", menu: "MS" },
    { name: "Ghinghie Andreea", menu: "MS" }, { name: "Martin Rodica", menu: "MVP" },
    { name: "Martin Viorel", menu: "MS" }, { name: "Martin Loredana", menu: "MS" },
    { name: "Marta Popovici", menu: "MS" }, { name: "Petrică Popovici", menu: "MS" },
  ]},
  { label: "Masa 10", guests: [
    { name: "Cozma Vasile", menu: "MS" }, { name: "Cozma Estera", menu: "MS" },
    { name: "Demeter Robert", menu: "MVP" }, { name: "Demeter Ramona", menu: "MS" },
    { name: "Demeter Melissa", menu: "MC" }, { name: "Demeter Matthias", menu: "MC" },
    { name: "Hora Doru", menu: "MS" }, { name: "Hora Luminița", menu: "MS" },
    { name: "Hora Laura", menu: "MC" }, { name: "Murariu Eleonora", menu: "MS" },
  ]},
  { label: "Masa 11", guests: [
    { name: "Ghinghie Andrei", menu: "MS" }, { name: "Ghinghie Adriana", menu: "MS" },
    { name: "Onița Alexandra", menu: "MS" }, { name: "Onița Robert", menu: "MS" },
    { name: "Orleanu Cornelia", menu: "MS" }, { name: "Martin Gabriel", menu: "MS" },
    { name: "Martin Cristina", menu: "MS" }, { name: "Martin Filip", menu: "MS" },
    { name: "Martin George", menu: "MS" }, { name: "Martin Monica", menu: "MS" },
  ]},
  { label: "Masa 12", guests: [
    { name: "Barbonța Corina", menu: "MS" }, { name: "Barbonța Andrei", menu: "MS" },
    { name: "Cioloș Alexandru", menu: "MS" }, { name: "Cioloș Sebastian", menu: "MS" },
    { name: "Cioloș Cătălina", menu: "MS" }, { name: "Cioloș Danina", menu: "MS" },
    { name: "Ghinghie Gabriel", menu: "MS" }, { name: "Ghinghie Loredana", menu: "MS" },
    { name: "Nicoara Andrei", menu: "MS" }, { name: "Nicoara Ingrid", menu: "MS" },
    { name: "Sava Andreea", menu: "MS" }, { name: "Sava Alin", menu: "MS" },
  ]},
];

// --- Table Card Component ---
const TableCard = React.forwardRef<HTMLDivElement, { table: Table; isOpen: boolean; onToggle: () => void }>(
  ({ table, isOpen, onToggle }, ref) => (
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
          {Array.from({ length: 12 }, (_, i) => {
            const sorted = [...table.guests].sort((a, b) => a.name.localeCompare(b.name, "ro"));
            const guest = sorted[i];
            return (
              <div
                key={i}
                className={`px-4 py-2 text-sm text-[#664e44] font-medium ${i % 2 === 0 ? "bg-[#faf4e5]/60" : "bg-white"}`}
              >
                {guest ? guest.name : "\u00A0"}
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
);
TableCard.displayName = "TableCard";

// --- Seating Section ---
const SeatingSection = () => {
  const [query, setQuery] = useState("");
  const [openTables, setOpenTables] = useState<Set<string>>(new Set());
  const tableRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const left  = TABLES.filter((_, i) => i % 2 === 0);
  const right = TABLES.filter((_, i) => i % 2 !== 0);

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

  const normalize = (s: string) =>
    s.toLowerCase()
      .replace(/[șş]/g, "s").replace(/[țţ]/g, "t")
      .replace(/[ăâ]/g, "a").replace(/î/g, "i")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const results = query.trim().length >= 2
    ? TABLES.flatMap((t) =>
        t.guests
          .filter((g) => normalize(g.name).includes(normalize(query)))
          .map((g) => ({ name: g.name, table: t.label }))
      )
    : [];

  return (
    <div className="mt-4">
      {/* Search bar */}
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

      {/* Search results */}
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

      {/* Tables grid */}
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

// Schimbă în true pentru a reactiva funcționalitatea de upload
const SHOW_UPLOAD = true;

// --- Countdown Component ---
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const targetDate = new Date("2026-03-29T14:00:00").getTime();

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

  if (!isMounted) return null;

  return (
    <div className="flex items-center gap-5 sm:gap-10">
      {[
        { value: timeLeft.days, label: "Zile" },
        { value: timeLeft.hours, label: "Ore" },
        { value: timeLeft.minutes, label: "Min" },
        { value: timeLeft.seconds, label: "Sec" },
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

// --- Upload Modal ---
const UploadModal = ({ onClose }: { onClose: () => void }) => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;
    setFiles((prev) => [...prev, ...Array.from(selected)]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!lastName.trim() || !firstName.trim()) { setErrorMsg("Te rugăm să introduci numele și prenumele."); return; }
    if (files.length === 0) { setErrorMsg("Te rugăm să selectezi cel puțin o imagine."); return; }

    setStatus("uploading");
    setErrorMsg("");

    const folder = `wedding_images/${lastName.trim()}_${firstName.trim()}`;

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Wedding");
        formData.append("folder", folder);

        const res = await fetch("https://api.cloudinary.com/v1_1/dca06eoom/image/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Eroare la upload");
      }
      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-[2rem] bg-[#faf4e5] p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {status === "success" ? (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#664e44] text-3xl text-white shadow-lg">✓</div>
            <h3 className="font-serif text-2xl font-bold text-[#664e44]">Mulțumim!</h3>
            <p className="text-[#b08b7f]">Pozele au fost încărcate cu succes.</p>
            <button onClick={onClose} className="mt-2 rounded-full bg-[#664e44] px-8 py-3 text-sm font-bold uppercase tracking-widest text-[#ffe8d6]">
              Închide
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-medium text-[#664e44]">Încarcă poze</h2>
              <button onClick={onClose} className="text-[#b08b7f] hover:text-[#664e44] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Name inputs */}
            <div className="mb-5 flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#664e44] opacity-60">
                  Nume
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setErrorMsg(""); }}
                  placeholder="ex: Popescu"
                  className="w-full rounded-t-lg border-b-2 border-[#c7c3b0]/40 bg-white/60 px-3 py-3 text-lg text-[#664e44] placeholder-neutral-400/50 focus:border-[#664e44] focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#664e44] opacity-60">
                  Prenume
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setErrorMsg(""); }}
                  placeholder="ex: Andrei"
                  className="w-full rounded-t-lg border-b-2 border-[#c7c3b0]/40 bg-white/60 px-3 py-3 text-lg text-[#664e44] placeholder-neutral-400/50 focus:border-[#664e44] focus:outline-none"
                />
              </div>
            </div>

            {/* File drop zone */}
            <div
              className="mb-5 cursor-pointer rounded-2xl border-2 border-dashed border-[#c7c3b0] bg-white/40 p-6 text-center transition-colors hover:border-[#664e44] hover:bg-white/60"
              onClick={() => inputRef.current?.click()}
            >
              <ImageUp className="mx-auto mb-2 h-8 w-8 text-[#b08b7f]" />
              <p className="text-sm font-bold text-[#664e44]">Apasă pentru a selecta poze</p>
              <p className="mt-1 text-xs text-[#b08b7f]">JPG, PNG, HEIC — multiple fișiere</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {/* File list */}
            {files.length > 0 && (
              <ul className="mb-5 max-h-36 overflow-y-auto space-y-1.5 rounded-xl bg-white/50 p-3">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 text-sm text-[#664e44]">
                    <span className="truncate">{f.name}</span>
                    <button onClick={() => removeFile(i)} className="shrink-0 text-[#b08b7f] hover:text-red-400 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {errorMsg && (
              <p className="mb-4 text-sm font-bold text-red-400">{errorMsg}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === "uploading"}
              className="w-full rounded-full bg-[#664e44] py-4 text-sm font-black uppercase tracking-[0.3em] text-[#ffe8d6] shadow-lg transition-all hover:bg-[#4d3a33] hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            >
              {status === "uploading" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#ffe8d6] border-t-transparent" />
                  Se încarcă...
                </span>
              ) : (
                `Încarcă ${files.length > 0 ? `(${files.length})` : ""}`
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// --- Main Page ---
const PHOTO_CHALLENGES = [
  "Selfie cu mirii",
  "Poză cu un invitat necunoscut",
  "Poză de grup (minim 4 persoane)",
  "Un moment amuzant",
  "Fotografie romantică",
  "Detaliu al nunții (flori, decorațiuni, etc.)",
  "Poză cu o persoană îmbrăcată în aceeași culoare ca tine",
  "Față amuzantă",
  "Selfie cu persoanele de la masa ta",
  "Mirii în timp ce își șoptesc",
  "Poză de revistă",
  "Poză în mișcare",
  "Poză dintr-un unghi neobișnuit",
  "Colaj înainte/după",
  "Poză alb-negru",
  "Reflexie",
  "Cea mai estetică poză",
];

export default function KasiiaPage() {
  const [showUpload, setShowUpload] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showSeating, setShowSeating] = useState(false);
  const weddingPassed = new Date() >= new Date("2026-03-29T14:00:00");
  const [showButtons, setShowButtons] = useState(weddingPassed);
  const [secretDigits, setSecretDigits] = useState([2, 9, 0, 3]);
  const challengesRef = useRef<HTMLDivElement>(null);
  const seatingRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen w-full bg-[#ffe8d6] font-sans text-[#664e44] selection:bg-[#b08b7f] selection:text-white">

      {SHOW_UPLOAD && showUpload && <UploadModal onClose={() => setShowUpload(false)} />}

      {/* --- HERO SECTION --- */}
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

      {/* --- CONTENT SECTION --- */}
      <div className="relative z-10 mt-2 bg-[#ffe8d6] px-6 pt-2 pb-24 shadow-[0_-20px_50px_-10px_rgba(102, 78, 68,0.2)] sm:px-12">
        <div className="mx-auto max-w-4xl">

          {/* Locatii */}
          <div className="mb-6 text-center">
            <div className="mt-6 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              <a
                href="https://www.google.com/maps/place/Biserica+Adventist%C4%83+Maranatha/@45.7466411,21.2154907,17z/data=!3m1!4b1!4m6!3m5!1s0x47455d59d1680c25:0x712f6dbdb60dbab1!8m2!3d45.7466411!4d21.2154907!16s%2Fg%2F11xvz5_8v2?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-[calc(50%-0.5rem)] snap-start flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm border border-[#c7c3b0]/50 transition-all hover:-translate-y-1 hover:shadow-lg"
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
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-[calc(50%-0.5rem)] flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm border border-[#c7c3b0]/50 transition-all hover:shadow-md"
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

          {/* Seating + Upload */}
          {showButtons && (
            <div className="flex flex-col items-center gap-10 mb-10">
              <div className="w-full flex flex-col items-center">
                <button
                  onClick={() => {
                    setShowSeating((v) => !v);
                    if (!showSeating) setTimeout(() => seatingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                  }}
                  className="w-full flex items-center justify-center gap-3 rounded-full bg-[#664e44] px-10 py-5 text-sm font-black uppercase tracking-[0.3em] text-[#ffe8d6] shadow-[0_20px_40px_-10px_rgba(102,78,68,0.4)] transition-all hover:bg-[#4d3a33] hover:scale-105 hover:shadow-[0_25px_55px_-10px_rgba(102,78,68,0.65)]"
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

              {SHOW_UPLOAD && (
                <div className="w-full flex flex-col items-center gap-3">
                  <button
                    onClick={() => setShowUpload(true)}
                    className="w-full flex items-center justify-center gap-3 rounded-full bg-[#664e44] px-10 py-5 text-sm font-black uppercase tracking-[0.3em] text-[#ffe8d6] shadow-[0_20px_40px_-10px_rgba(102,78,68,0.4)] transition-all hover:bg-[#4d3a33] hover:scale-105 hover:shadow-[0_25px_55px_-10px_rgba(102,78,68,0.65)]"
                  >
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
              )}
            </div>
          )}

        </div>

        <footer className="mt-8 border-t border-[#c7c3b0]/20 pt-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#c7c3b0]/50">
              <QRCodeSVG
                value="https://www.razvanaga.com/kasiia"
                size={160}
                fgColor="#664e44"
                bgColor="#ffffff"
                level="M"
              />
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
              {[0, 1, 2, 3].map((i) => {
                const secret = [2, 3, 0, 8];
                const display = [2, 9, 0, 3];
                return (
                  <React.Fragment key={i}>
                    <span
                      onClick={() => {
                        const newDigits = [...secretDigits];
                        newDigits[i] = (newDigits[i] + 1) % 10;
                        setSecretDigits(newDigits);
                        if (newDigits.join("") === secret.join("")) {
                          setShowButtons((v) => !v);
                          setSecretDigits([...display]);
                        }
                      }}
                      className="cursor-default"
                    >
                      {secretDigits[i]}
                    </span>
                    {i === 1 && <span>.</span>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
