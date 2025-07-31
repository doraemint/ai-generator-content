"use client";

import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    signInWithPopup(auth, googleProvider).then(() => {
      router.push("/create-content");
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#0a192f] text-white relative overflow-hidden">
      {/* BACKGROUND AI GLOW */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-cyan-400 rounded-full opacity-20 blur-[180px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-blue-500 rounded-full opacity-20 blur-[160px]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 gap-10">
        <Image
          src="/img/nakdev-profile.png"
          alt="นัก dev ฝึกหัด profile"
          width={260}
          height={260}
          className="rounded-xl shadow-xl border-4 border-[#3a506b]"
        />

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-500">
          AI Content Helper
        </h1>

        <h3 className="text-xl md:text-2xl text-gray-300">by นัก dev ฝึกหัด</h3>

        <p className="max-w-2xl text-lg md:text-xl text-gray-300">
          เครื่องมือสร้างข้อความขายของและโปรโมทสินค้าแบบอัจฉริยะ
          พร้อมให้คุณปิดการขายได้ในไม่กี่คลิก ✨
        </p>

        <Button
          onClick={handleLogin}
          className="bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white px-8 py-4 text-lg rounded-full shadow-lg transition-all duration-300"
        >
          เริ่มใช้งานฟรีด้วย Google Account
        </Button>
      </div>
    </main>
  );
}
