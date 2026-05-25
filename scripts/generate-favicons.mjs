import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const source = path.join(root, "public", "logo.png");

const sizes = [16, 32, 48];
const pngPaths = [];

for (const size of sizes) {
  const out = path.join(root, "public", `favicon-${size}.png`);
  await sharp(source)
    .resize(size, size, { fit: "cover", position: "centre" })
    .png()
    .toFile(out);
  pngPaths.push(out);
}

const ico = await pngToIco(pngPaths);
writeFileSync(path.join(root, "public", "favicon.ico"), ico);

for (const size of [192, 512]) {
  await sharp(source)
    .resize(size, size, { fit: "cover" })
    .png()
    .toFile(path.join(root, "public", `icon-${size}.png`));
}

console.log("Favicons generated successfully.");
