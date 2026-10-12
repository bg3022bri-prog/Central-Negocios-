import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, r, g, b) {
  // PNG signature
  const signature = Buffer.from([138, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(2, 9); // color type 2 (Truecolor RGB)
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data with filter byte 0 at start of each scanline
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      // Simple icon drawing: dark background #171717 with a subtle emerald accent in center
      const dx = x - width / 2;
      const dy = y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = width * 0.38;

      if (dist < radius) {
        // Inner circle
        rawData[pxOffset] = 23;     // R
        rawData[pxOffset + 1] = 23; // G
        rawData[pxOffset + 2] = 23; // B
      } else {
        rawData[pxOffset] = r;
        rawData[pxOffset + 1] = g;
        rawData[pxOffset + 2] = b;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressedData);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crc >>> 0, 8 + len);
  return buf;
}

// CRC32 implementation
function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ -1;
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Generate 192x192, 512x512, apple-touch-icon 180x180
fs.writeFileSync('public/pwa-192x192.png', createPNG(192, 192, 23, 23, 23));
fs.writeFileSync('public/pwa-512x512.png', createPNG(512, 512, 23, 23, 23));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPNG(512, 512, 23, 23, 23));
fs.writeFileSync('public/apple-touch-icon.png', createPNG(180, 180, 23, 23, 23));
console.log('Icons generated successfully in public/');
