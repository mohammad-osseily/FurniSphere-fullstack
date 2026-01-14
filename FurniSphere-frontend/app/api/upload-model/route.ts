import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const normalizedName = file.name.trim().replace(/\s+/g, "-");
    if (!normalizedName.toLowerCase().endsWith(".glb")) {
      return NextResponse.json({ error: "Only .glb files are allowed" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const modelsDir = path.join(process.cwd(), "public", "models");
    await fs.mkdir(modelsDir, { recursive: true });

    const filePath = path.join(modelsDir, normalizedName);
    await fs.writeFile(filePath, buffer);

    const baseName = normalizedName.replace(/\.glb$/i, "");

    return NextResponse.json({ fileName: normalizedName, baseName });
  } catch (error) {
    console.error("upload-model error", error);
    return NextResponse.json({ error: "Failed to upload model" }, { status: 500 });
  }
}
