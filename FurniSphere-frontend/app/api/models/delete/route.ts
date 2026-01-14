import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { fileName } = (await req.json()) as { fileName?: string };
    if (!fileName || typeof fileName !== "string") {
      return NextResponse.json({ error: "fileName is required" }, { status: 400 });
    }

    const sanitizedName = path.basename(fileName);
    if (!sanitizedName.toLowerCase().endsWith(".glb")) {
      return NextResponse.json({ error: "Only .glb files can be deleted" }, { status: 400 });
    }

    const modelsDir = path.join(process.cwd(), "public", "models");
    const targetPath = path.join(modelsDir, sanitizedName);

    await fs.unlink(targetPath);

    return NextResponse.json({ ok: true, fileName: sanitizedName });
  } catch (error) {
    console.error("delete model error", error);
    return NextResponse.json({ error: "Failed to delete model" }, { status: 500 });
  }
}
