import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { GenerationLog } from "../type/text";

export async function saveGenerationLog(log: GenerationLog) {
  try {
    const ref = collection(db, "generationLogs", log.userId, "contents");
    await addDoc(ref, log);
  } catch (error) {
    console.error("Error saving generation log:", error);
  }
}
