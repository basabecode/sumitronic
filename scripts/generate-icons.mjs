import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(ROOT, 'public/logos/logo_sumitronic_3.png');
const PUBLIC = join(ROOT, 'public');

const icons = [
  // Favicons
  { file: 'favicon-16x16.png',         width: 16,   height: 16   },
  { file: 'favicon-32x32.png',         width: 32,   height: 32   },
  { file: 'favicon-48x48.png',         width: 48,   height: 48   },
  // Apple
  { file: 'apple-touch-icon.png',      width: 180,  height: 180  },
  // Android / PWA
  { file: 'android-chrome-192x192.png', width: 192, height: 192  },
  { file: 'android-chrome-512x512.png', width: 512, height: 512  },
  // Open Graph / Social
  { file: 'og-image.png',              width: 1200, height: 630, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } },
  // Logo para header (fondo transparente)
  { file: 'logos/logo-header.png',     width: 160,  height: 160  },
];

async function run() {
  const src = readFileSync(SOURCE);

  for (const icon of icons) {
    const { file, width, height, fit = 'cover', background } = icon;
    const dest = join(PUBLIC, file);

    const pipeline = sharp(src).resize({
      width,
      height,
      fit,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    });

    await pipeline.png().toFile(dest);
    console.log(`✓ ${file} (${width}x${height})`);
  }

  // Generar favicon.ico con múltiples tamaños embebidos (16, 32, 48)
  // Sharp no genera .ico nativo; usamos el PNG de 32x32 renombrado como fallback
  // y el .ico real lo construimos manualmente con los buffers
  const sizes = [16, 32, 48];
  const buffers = await Promise.all(
    sizes.map(s =>
      sharp(src)
        .resize({ width: s, height: s, fit: 'cover', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );

  writeFileSync(join(PUBLIC, 'favicon.ico'), buildIco(buffers, sizes));
  console.log('✓ favicon.ico (16x16 + 32x32 + 48x48)');

  console.log('\nTodos los iconos generados exitosamente.');
}

/**
 * Construye un archivo .ico multi-tamaño con los buffers PNG dados.
 * Formato ICO: https://en.wikipedia.org/wiki/ICO_(file_format)
 */
function buildIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = headerSize + dirEntrySize * count;

  let offset = dirSize;
  const offsets = pngBuffers.map(buf => {
    const o = offset;
    offset += buf.length;
    return o;
  });

  const total = offset;
  const ico = Buffer.alloc(total);

  // ICONDIR header
  ico.writeUInt16LE(0, 0);      // reserved
  ico.writeUInt16LE(1, 2);      // type: 1 = ICO
  ico.writeUInt16LE(count, 4);  // image count

  // Directory entries
  pngBuffers.forEach((buf, i) => {
    const base = headerSize + i * dirEntrySize;
    const size = sizes[i];
    ico.writeUInt8(size === 256 ? 0 : size, base);      // width (0 = 256)
    ico.writeUInt8(size === 256 ? 0 : size, base + 1);  // height
    ico.writeUInt8(0, base + 2);   // color count
    ico.writeUInt8(0, base + 3);   // reserved
    ico.writeUInt16LE(1, base + 4); // color planes
    ico.writeUInt16LE(32, base + 6); // bits per pixel
    ico.writeUInt32LE(buf.length, base + 8);   // image data size
    ico.writeUInt32LE(offsets[i], base + 12);  // image data offset
  });

  // Image data
  pngBuffers.forEach((buf, i) => {
    buf.copy(ico, offsets[i]);
  });

  return ico;
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
