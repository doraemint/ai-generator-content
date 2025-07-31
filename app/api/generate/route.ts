import { NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import axios from "axios";
import { AIInstructor } from "@/data/mock-data-text";

// ✅ init Firebase
if (!getApps().length) {
  initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}
const db = getFirestore();

export async function POST(req: Request) {
  try {
    const {
      uid,
      name,
      description,
      price,
      category,
      platform,
      contentType,
      style,
    } = await req.json();

    // ✅ ตรวจสอบผู้ใช้
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userSnap.data();

    // ✅ ตรวจ token
    if (user?.role === "FREE") {
      if (user.tokens <= 0) {
        return NextResponse.json({ error: "No tokens left" }, { status: 403 });
      }
      await updateDoc(userRef, { tokens: user.tokens - 1 });
    }

    // ✅ เตรียมข้อความเพื่อส่งให้ AI
    const userInput = `
สินค้า: ${name}
รายละเอียด: ${description}
ราคา: ${price}
หมวดหมู่: ${category}
โพสต์ลงใน: ${platform}
ประเภทเนื้อหา: ${contentType}
สไตล์ที่ต้องการ: ${style}
เน้น SEO และปิดการขายให้ได้
`;

    // ✅ เรียก AI จาก OpenRouter
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: AIInstructor,
          },
          {
            role: "user",
            content: userInput,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText: string = response.data.choices[0].message.content;

    // ✅ บันทึก log ลง Firestore แบบ nested: generationLogs > uid > contents > [log]
    const contentsRef = collection(db, "generationLogs", uid, "contents");
    await addDoc(contentsRef, {
      name,
      description,
      price,
      category,
      platform,
      contentType,
      style,
      result: generatedText,
      generatedAt: new Date(),
    });

    return NextResponse.json({ result: generatedText });
  } catch (err) {
    console.error("🔥 API Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
