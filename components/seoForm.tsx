"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { TextResult } from "@/app/type/text";
import {
  contentTypeOptions,
  platformOptions,
  styleOptions,
} from "@/data/mock-option";

export default function SEOForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [platform, setPlatform] = useState("");
  const [contentType, setContentType] = useState("");
  const [style, setStyle] = useState("direct_selling");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generateCopy = async () => {
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !platform ||
      !contentType ||
      !style
    )
      return;
    setLoading(true);
    setResult("");

    const prompt = `
สร้าง${contentType} สไตล์ "${
      styleOptions.find((s) => s.value === style)?.label
    }" สำหรับ Platform: ${platform}
โดยมีจุดประสงค์เพื่อเน้น SEO และกระตุ้นยอดขายอย่างมีประสิทธิภาพ

ชื่อสินค้า: ${name}
รายละเอียด: ${description}
ราคา: ${price} บาท
ประเภทสินค้า: ${category}

เนื้อหาที่ได้ควรดึงดูดความสนใจ และทำให้ผู้อ่านอยากคลิก/ซื้อทันที พร้อมแนะนำให้แชร์ต่อได้ง่าย
`;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data: TextResult = await res.json();
    setResult(data.output);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="ชื่อสินค้า"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Textarea
        placeholder="รายละเอียดสินค้า (ฟีเจอร์, จุดเด่น, วัตถุประสงค์)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        placeholder="ราคา เช่น 990"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <Input
        placeholder="ประเภทสินค้า เช่น สกินแคร์ / อาหารเสริม"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <select
        className="w-full px-3 py-2 border rounded-md"
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      >
        <option value="">เลือก Platform</option>
        {platformOptions.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      <select
        className="w-full px-3 py-2 border rounded-md"
        value={contentType}
        onChange={(e) => setContentType(e.target.value)}
      >
        <option value="">เลือกประเภทคอนเทนต์</option>
        {contentTypeOptions.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        className="w-full px-3 py-2 border rounded-md"
        value={style}
        onChange={(e) => setStyle(e.target.value)}
      >
        <option value="">เลือกสไตล์การเขียน</option>
        {styleOptions.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <Button onClick={generateCopy} disabled={loading}>
        {loading ? "กำลังสร้าง..." : "สร้างเนื้อหา"}
      </Button>

      {result && (
        <Card>
          <CardContent className="p-4 whitespace-pre-line">
            {result}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
