"use client";

import { useState, useRef } from "react";
import { ImageUp, X } from "lucide-react";

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

export default UploadModal;
