import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(_req: NextRequest) {
  try {
    const modelsDir = path.join(process.cwd(), "public", "models");
    const entries = await fs.readdir(modelsDir, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => name.toLowerCase().endsWith(".glb"))
      .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

    return NextResponse.json({ files });
  } catch (error) {
    console.error("list models error", error);
    return NextResponse.json({ files: [] });
  }
}
