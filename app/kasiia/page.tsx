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
    const itemWidth = 76;
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
    <div className="min-h-screen font-sans overflow-x-hidden w-full" style={{ backgroundColor: '#FEFAE0' }}>
      <div className="relative h-[70vh] w-full overflow-hidden max-w-full">
        <Image
          src="/Images/Thumbnail.jpeg"
          alt="Răzvan & Kasiia"
          fill
          className="object-cover"
          priority
        />

        {/* Gradient overlay with gradual blur effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none">
          {/* Multiple blur layers for gradual effect */}
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={{
              maskImage: 'linear-gradient(to top, black 0%, transparent 50%)',
              WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 50%)'
            }}
          />
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{
              maskImage: 'linear-gradient(to top, black 0%, transparent 70%)',
              WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 70%)'
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(95, 111, 82, 0.8) 0%, rgba(95, 111, 82, 0.5) 30%, rgba(95, 111, 82, 0.2) 60%, transparent 100%)'
            }}
          />
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center" style={{ color: '#FEFAE0' }}>
          <h1 className="text-4xl font-bold tracking-wide sm:text-5xl">
            Răzvan & Kasiia
          </h1>
          <p className="mt-2 text-xl font-medium sm:text-2xl">
            29 MARTIE 2026
          </p>
          <p className="mt-1 text-xl font-medium sm:text-2xl">
            <a
              href="https://www.google.com/maps/place/LakeSide+Pool+%26+Ballroom/@45.6841759,21.2345571,17.25z/data=!4m6!3m5!1s0x47455ea63ec2c3d1:0x64833cc2c242e0e4!8m2!3d45.684881!4d21.2377256!16s%2Fg%2F11gb3yskz2?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80 transition-opacity"
            >
              Lakeside Flonta, Giroc
            </a>
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center px-6 py-12 select-none w-full max-w-full overflow-x-hidden">
        <h2 className="text-3xl font-bold" style={{ color: '#5F6F52' }}>
          Confirmă Prezența Ta!
        </h2>

        <p className="mt-8 text-lg" style={{ color: '#5F6F52' }}>
          Selectează numărul de persoane
        </p>

        <div className="mt-4 flex items-center justify-center w-full max-w-full">
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
                  transform: `translateX(calc(50% - ${(guestCount - 1) * 76}px - 38px + ${swipeOffset}px))`,
                  transition: isSwiping ? "none" : "transform 0.3s ease-out",
                }}
              >
                {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => {
                  const isActive = num === guestCount;
                  const distance = Math.abs(num - guestCount);

                  return (
                    <div
                      key={num}
                      onClick={() => setGuestCount(num)}
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-3xl font-bold transition-all cursor-pointer ${
                        isActive
                          ? "border-3 scale-110 shadow-lg"
                          : distance === 1
                          ? "scale-90 opacity-60"
                          : "scale-75 opacity-40"
                      }`}
                      style={{
                        borderColor: isActive ? '#B99470' : 'transparent',
                        borderWidth: isActive ? '3px' : '0',
                        backgroundColor: '#FEFAE0',
                        color: isActive ? '#B99470' : '#A9B388'
                      }}
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
              className="rounded-2xl border-2 p-6 shadow-sm"
              style={{ borderColor: '#A9B388', backgroundColor: '#FEFAE0' }}
            >
              <h3 className="mb-4 text-lg font-semibold text-center" style={{ color: '#5F6F52' }}>
                Invitat {index + 1}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: '#5F6F52' }}>
                      Nume
                    </label>
                    <input
                      type="text"
                      value={guest.lastName}
                      onChange={(e) =>
                        updateGuest(index, "lastName", e.target.value)
                      }
                      className="w-full rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none"
                      style={{
                        borderColor: '#A9B388',
                        backgroundColor: '#FEFAE0',
                        color: '#5F6F52'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#5F6F52'}
                      onBlur={(e) => e.target.style.borderColor = '#A9B388'}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: '#5F6F52' }}>
                      Prenume
                    </label>
                    <input
                      type="text"
                      value={guest.firstName}
                      onChange={(e) =>
                        updateGuest(index, "firstName", e.target.value)
                      }
                      className="w-full rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none"
                      style={{
                        borderColor: '#A9B388',
                        backgroundColor: '#FEFAE0',
                        color: '#5F6F52'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#5F6F52'}
                      onBlur={(e) => e.target.style.borderColor = '#A9B388'}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium" style={{ color: '#5F6F52' }}>
                    Categorie
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => updateGuest(index, "ageCategory", "adult")}
                      className="flex-1 rounded-lg border-2 px-6 py-3 font-medium transition-all shadow-lg"
                      style={{
                        borderColor: guest.ageCategory === "adult" ? '#B99470' : '#A9B388',
                        backgroundColor: guest.ageCategory === "adult" ? '#B99470' : '#FEFAE0',
                        color: guest.ageCategory === "adult" ? '#FEFAE0' : '#5F6F52'
                      }}
                    >
                      Adult
                    </button>
                    <button
                      type="button"
                      onClick={() => updateGuest(index, "ageCategory", "copil")}
                      className="flex-1 rounded-lg border-2 px-6 py-3 font-medium transition-all shadow-lg"
                      style={{
                        borderColor: guest.ageCategory === "copil" ? '#B99470' : '#A9B388',
                        backgroundColor: guest.ageCategory === "copil" ? '#B99470' : '#FEFAE0',
                        color: guest.ageCategory === "copil" ? '#FEFAE0' : '#5F6F52'
                      }}
                    >
                      Copil
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium" style={{ color: '#5F6F52' }}>
                    Meniu
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => updateGuest(index, "menu", "carne")}
                      className="flex-1 rounded-lg border-2 px-6 py-3 font-medium transition-all shadow-lg"
                      style={{
                        borderColor: guest.menu === "carne" ? '#B99470' : '#A9B388',
                        backgroundColor: guest.menu === "carne" ? '#B99470' : '#FEFAE0',
                        color: guest.menu === "carne" ? '#FEFAE0' : '#5F6F52'
                      }}
                    >
                      Carne
                    </button>
                    <button
                      type="button"
                      onClick={() => updateGuest(index, "menu", "vegetarian")}
                      className="flex-1 rounded-lg border-2 px-6 py-3 font-medium transition-all shadow-lg"
                      style={{
                        borderColor: guest.menu === "vegetarian" ? '#B99470' : '#A9B388',
                        backgroundColor: guest.menu === "vegetarian" ? '#B99470' : '#FEFAE0',
                        color: guest.menu === "vegetarian" ? '#FEFAE0' : '#5F6F52'
                      }}
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
              className="w-full max-w-md rounded-2xl px-8 py-4 text-xl font-bold shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              style={{
                backgroundColor: '#B99470',
                color: '#FEFAE0'
              }}
            >
              {isSubmitting ? "Se trimite..." : "Trimite Confirmarea"}
            </button>

            {submitStatus === "success" && (
              <div className="w-full max-w-md rounded-xl border-2 p-4 text-center" style={{ borderColor: '#A9B388', backgroundColor: '#FEFAE0' }}>
                <p className="font-semibold" style={{ color: '#5F6F52' }}>
                  ✓ Confirmarea a fost trimisă cu succes!
                </p>
                <p className="mt-1 text-sm" style={{ color: '#5F6F52' }}>
                  Mulțumim pentru confirmarea prezenței!
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="w-full max-w-md rounded-xl border-2 p-4 text-center" style={{ borderColor: '#B99470', backgroundColor: '#FEFAE0' }}>
                <p className="font-semibold" style={{ color: '#B99470' }}>
                  ✗ A apărut o eroare!
                </p>
                <p className="mt-1 text-sm" style={{ color: '#B99470' }}>
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
