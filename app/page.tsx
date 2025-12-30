import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex items-center justify-center">
        <Link
          href="/kasiia"
          className="flex h-32 w-80 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-4xl font-bold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-pink-500/50"
        >
          Nunta
        </Link>
      </main>
    </div>
  );
}
