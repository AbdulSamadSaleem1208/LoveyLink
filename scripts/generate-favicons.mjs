import sharp from "sharp";
import toIco from "to-ico";
import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const source = path.join(root, "public", "logo.png");

const icoSizes = [16, 32, 48];
const pngBuffers = await Promise.all(
  icoSizes.map((size) =>
    sharp(source).resize(size, size, { fit: "cover" }).png().toBuffer()
  )
);

const ico = await toIco(pngBuffers);
for (const dest of [
  path.join(root, "public", "favicon.ico"),
  path.join(root, "src", "app", "favicon.ico"),
]) {
  writeFileSync(dest, ico);
}

for (const size of [192, 512]) {
  await sharp(source)
    .resize(size, size, { fit: "cover" })
    .png()
    .toFile(path.join(root, "public", `icon-${size}.png`));
}

console.log("Favicons generated.");
