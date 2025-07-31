"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  contentTypeOptions,
  platformOptions,
  styleOptions,
} from "@/data/mock-option";
import { Copy } from "lucide-react";
import Header from "@/components/header";
import SelectDropdown from "@/components/ui/dropdown";

export default function CreateContentPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<number | string>(0);
  const [role, setRole] = useState("FREE");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [platform, setPlatform] = useState(platformOptions[0].value);
  const [contentType, setContentType] = useState(contentTypeOptions[0].value);
  const [style, setStyle] = useState(styleOptions[0].value);

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login"); // ✅ redirect ถ้ายังไม่ได้ login
        return;
      }

      setUser(u);

      const userRef = doc(db, "users", u.uid);
      const snap = await getDoc(userRef);
      const today = new Date().toISOString().split("T")[0];

      if (snap.exists()) {
        const data = snap.data();
        setRole(data.role || "FREE");

        if (data.role === "VIP") {
          setTokens("∞");
        } else {
          if (data.lastClaim !== today) {
            await updateDoc(userRef, { tokens: 5, lastClaim: today });
            setTokens(5);
          } else {
            setTokens(data.tokens);
          }
        }
      } else {
        await setDoc(userRef, {
          tokens: 5,
          lastClaim: today,
          role: "FREE",
        });
        setTokens(5);
      }
    });

    return () => unsub();
  }, [router]);

  const generate = async () => {
    if (!user) return;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !platform ||
      !contentType ||
      !style
    ) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (tokens !== "∞" && +tokens <= 0) {
      alert("คุณใช้ token หมดแล้ววันนี้");
      return;
    }

    setLoading(true);
    setResult("");

    const payload = {
      uid: user.uid,
      name,
      description,
      price,
      category,
      platform:
        platformOptions.find((p) => p.value === platform)?.label || platform,
      contentType:
        contentTypeOptions.find((c) => c.value === contentType)?.label ||
        contentType,
      style: styleOptions.find((s) => s.value === style)?.label || style,
    };

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setResult(data.result);

    if (tokens !== "∞") {
      const newToken = +tokens - 1;
      await updateDoc(doc(db, "users", user.uid), { tokens: newToken });
      setTokens(newToken);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#0a192f] text-white px-6 py-10">
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-xl text-center max-w-sm w-full border border-gray-200 dark:border-neutral-800">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              ⏳ กำลังสร้างเนื้อหา...
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              กรุณารอสักครู่ เรากำลังสร้างคอนเทนต์ที่ดีที่สุดให้คุณอยู่
            </p>
          </div>
        </div>
      )}
      {user && (
        <>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT SIDE - ฟอร์ม */}
            <div className="lg:w-1/2 space-y-6 bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                🔧 กรอกข้อมูลสินค้าที่ต้องการขาย / โปรโมท
              </h2>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ชื่อสินค้า
                </label>
                <Input
                  placeholder="ชื่อสินค้า"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  รายละเอียดสินค้า
                </label>
                <Textarea
                  placeholder="รายละเอียดสินค้า"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ราคา
                </label>
                <Input
                  placeholder="ราคา"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ประเภทสินค้า
                </label>
                <Input
                  placeholder="ประเภทสินค้า"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Platform
                </label>
                <SelectDropdown
                  options={platformOptions}
                  defaultValue={platform}
                  onSelect={(val) => setPlatform(val)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ประเภทคอนเทนต์
                </label>
                <SelectDropdown
                  options={contentTypeOptions}
                  defaultValue={contentType}
                  onSelect={(val) => setContentType(val)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  สไตล์
                </label>
                <SelectDropdown
                  options={styleOptions}
                  defaultValue={style}
                  onSelect={(val) => setStyle(val)}
                />
              </div>
              <div className="text-center pt-4">
                <Button onClick={generate} disabled={loading} className="w-1/2">
                  {loading ? "กำลังสร้าง..." : "สร้างเนื้อหา"}
                </Button>
              </div>
            </div>

            {/* RIGHT SIDE - ผลลัพธ์ */}
            <div className="lg:w-1/2 space-y-4">
              <h3 className="font-bold text-2xl">✨ Content Generated</h3>
              <Card className="min-h-[320px] bg-[#111927] border border-cyan-700/40 rounded-2xl shadow-xl">
                <CardContent className="p-6 text-cyan-100 whitespace-pre-line font-mono">
                  {result ? (
                    <>{result}</>
                  ) : (
                    <div className="text-gray-500 text-sm italic">
                      ✨ ผลลัพธ์จะปรากฏที่นี่หลังจาก Generate
                    </div>
                  )}
                </CardContent>

                {result && (
                  <div className="p-4 border-t dark:border-neutral-800">
                    <Button
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        navigator.clipboard.writeText(result);
                        alert("คัดลอกข้อความเรียบร้อยแล้ว!");
                      }}
                    >
                      <Copy className="w-4 h-4" />
                      คัดลอกข้อความ
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
