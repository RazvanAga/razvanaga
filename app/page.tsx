import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans" style={{ backgroundColor: '#FEFAE0' }}>
      <main className="flex items-center justify-center">
        <Link
          href="/kasiia"
          className="flex h-32 w-80 items-center justify-center rounded-2xl text-4xl font-bold shadow-2xl transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(to right, #5F6F52, #A9B388)',
            color: '#FEFAE0'
          }}
        >
          Nunta
        </Link>
      </main>
    </div>
  );
}
