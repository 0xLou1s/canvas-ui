import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.join(process.cwd(), "public");

function inner(svg: string) {
  return svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
}

async function render(svg: string, file: string) {
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  await writeFile(path.join(publicDir, file), png);
  console.log(`wrote public/${file} (${png.length} bytes)`);
}

const logo = inner(await readFile(path.join(publicDir, "logo.svg"), "utf8"));
const icon = inner(
  await readFile(path.join(publicDir, "logo-icon.svg"), "utf8"),
);

const og = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <g transform="translate(250 241) scale(1.8919)">${logo}</g>
</svg>`;

const touch = `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" fill="#0a0a0a"/>
  <g transform="translate(39 41) scale(1.2439)">${icon}</g>
</svg>`;

await render(og, "og.png");
await render(touch, "apple-touch-icon.png");
