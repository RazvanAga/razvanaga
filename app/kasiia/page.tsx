"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

type Guest = {
  firstName: string;
  lastName: string;
  ageCategory: "adult" | "copil";
  menu: "carne" | "vegetarian";
};

export default function WeddingPage() {
  const [guestCount, setGuestCount] = useState(2);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const [guests, setGuests] = useState<Guest[]>(
    Array.from({ length: 2 }, () => ({
      firstName: "",
      lastName: "",
      ageCategory: "adult",
      menu: "carne",
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

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
    const itemWidth = 92;
    const swipedItems = -Math.round(swipeOffset / itemWidth);
    const newCount = Math.max(1, Math.min(9, guestCount + swipedItems));

    setGuestCount(newCount);
    setSwipeOffset(0);
    setIsSwiping(false);
  };

  const validateGuests = () => {
    return guests.every(
      (guest) => guest.firstName.trim() !== "" && guest.lastName.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!validateGuests()) {
      alert("Te rugăm să completezi numele și prenumele pentru toți invitații!");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwOBKQ4Vwpl2e5ds23gf7-MvLbCF7a7QPARbG60A5ZNnA0YOCnII0mEj4_KcYuV0dQH/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ guests }),
          mode: "no-cors",
        }
      );

      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden w-full">
      <div className="relative h-[70vh] w-full overflow-hidden max-w-full">
        <Image
          src="/Images/Thumbnail.jpeg"
          alt="Kasiia & Razvan"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm">
          <div className="absolute bottom-8 left-0 right-0 text-center text-white">
            <h1 className="text-4xl font-bold tracking-wide sm:text-5xl">
              Kasiia & Razvan
            </h1>
            <p className="mt-2 text-xl font-medium sm:text-2xl">
              29 MARTIE 2026
            </p>
            <p className="mt-1 text-lg sm:text-xl">
              Lakeside Flonta
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center px-6 py-12 select-none w-full max-w-full overflow-x-hidden">
        <h2 className="text-3xl font-bold text-black">
          Confirma Prezenta Ta!
        </h2>

        <p className="mt-8 text-lg text-zinc-700">
          Selecteaza numarul de persoane
        </p>

        <div className="mt-10 flex items-center justify-center w-full max-w-full">
          <div
            className="relative cursor-grab active:cursor-grabbing overflow-hidden w-full max-w-md px-8"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="overflow-hidden py-8 max-w-full">
              <div
                className="flex gap-3"
                style={{
                  transform: `translateX(calc(50% - ${(guestCount - 1) * 92}px - 46px + ${swipeOffset}px))`,
                  transition: isSwiping ? "none" : "transform 0.3s ease-out",
                }}
              >
                {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => {
                  const isActive = num === guestCount;
                  const distance = Math.abs(num - guestCount);

                  return (
                    <div
                      key={num}
                      className={`flex h-24 w-20 shrink-0 items-center justify-center rounded-2xl text-5xl font-bold transition-all ${
                        isActive
                          ? "border-4 border-black bg-white text-black scale-110 shadow-xl"
                          : distance === 1
                          ? "bg-white text-zinc-400 scale-90 opacity-60"
                          : "bg-white text-zinc-300 scale-75 opacity-40"
                      }`}
                    >
                      {num}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 w-full max-w-2xl space-y-6 px-6">
          {guests.map((guest, index) => (
            <div
              key={index}
              className="rounded-2xl border-2 border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-4 text-lg font-semibold text-zinc-800">
                Invitat {index + 1}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Nume
                    </label>
                    <input
                      type="text"
                      value={guest.lastName}
                      onChange={(e) =>
                        updateGuest(index, "lastName", e.target.value)
                      }
                      className="w-full rounded-lg border-2 border-zinc-300 px-4 py-3 text-zinc-900 transition-colors focus:border-black focus:outline-none"
                      placeholder="Popescu"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Prenume
                    </label>
                    <input
                      type="text"
                      value={guest.firstName}
                      onChange={(e) =>
                        updateGuest(index, "firstName", e.target.value)
                      }
                      className="w-full rounded-lg border-2 border-zinc-300 px-4 py-3 text-zinc-900 transition-colors focus:border-black focus:outline-none"
                      placeholder="Ion"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Categorie
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => updateGuest(index, "ageCategory", "adult")}
                      className={`flex-1 rounded-lg border-2 px-6 py-3 font-medium transition-all ${
                        guest.ageCategory === "adult"
                          ? "border-black bg-black text-white shadow-lg"
                          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      Adult
                    </button>
                    <button
                      type="button"
                      onClick={() => updateGuest(index, "ageCategory", "copil")}
                      className={`flex-1 rounded-lg border-2 px-6 py-3 font-medium transition-all ${
                        guest.ageCategory === "copil"
                          ? "border-black bg-black text-white shadow-lg"
                          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      Copil
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Meniu
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => updateGuest(index, "menu", "carne")}
                      className={`flex-1 rounded-lg border-2 px-6 py-3 font-medium transition-all ${
                        guest.menu === "carne"
                          ? "border-black bg-black text-white shadow-lg"
                          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      Carne
                    </button>
                    <button
                      type="button"
                      onClick={() => updateGuest(index, "menu", "vegetarian")}
                      className={`flex-1 rounded-lg border-2 px-6 py-3 font-medium transition-all ${
                        guest.menu === "vegetarian"
                          ? "border-black bg-black text-white shadow-lg"
                          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      Vegetarian
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full max-w-md rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-4 text-xl font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-pink-500/50 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? "Se trimite..." : "Trimite RSVP"}
            </button>

            {submitStatus === "success" && (
              <div className="w-full max-w-md rounded-xl border-2 border-green-500 bg-green-50 p-4 text-center">
                <p className="font-semibold text-green-800">
                  ✓ RSVP-ul a fost trimis cu succes!
                </p>
                <p className="mt-1 text-sm text-green-700">
                  Mulțumim pentru confirmarea prezenței!
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="w-full max-w-md rounded-xl border-2 border-red-500 bg-red-50 p-4 text-center">
                <p className="font-semibold text-red-800">
                  ✗ A apărut o eroare!
                </p>
                <p className="mt-1 text-sm text-red-700">
                  Te rugăm să încerci din nou.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
