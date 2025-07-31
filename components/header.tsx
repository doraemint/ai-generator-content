"use client";

import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { LogoutButton } from "./ui/logoutButton";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("FREE");
  const [tokens, setTokens] = useState<number | string>("");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, "users", u.uid));
        const data = snap.data();
        if (data) {
          setRole(data.role || "FREE");
          setTokens(data.role === "VIP" ? "∞" : data.tokens);
        }
      } else {
        setUser(null);
        setRole("FREE");
        setTokens("");
      }
    });

    return () => unsub();
  }, []);

  return (
    <header className="w-full bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <div
        onClick={() => router.push("/create-content")}
        className="text-xl font-bold tracking-tight flex items-center gap-2 cursor-pointer"
      >
        🤖 AI Content Helper by นัก dev ฝึกหัด
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-sm text-right">
            <div>👤 {user.displayName || user.email}</div>
            <div className="flex gap-2 items-center justify-end">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  role === "VIP"
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {role}
              </span>
              <span>
                💎 tokens: <b className="text-white">{tokens}</b>
              </span>
            </div>
          </div>
          <LogoutButton
            onClick={() => {
              signOut(auth);
              router.push("/login");
            }}
            className="border border-white/40 hover:bg-white/10 text-white text-sm px-3 py-1 rounded-md transition"
          >
            ออกจากระบบ
          </LogoutButton>
        </div>
      )}
    </header>
  );
}
