import zlib
import struct
import os

def make_png(width, height, color_rgb=(5, 150, 105)):
  # PNG signature
  png_sig = b'\x89PNG\r\n\x1a\n'

  # IHDR chunk
  ihdr_data = struct.pack('!IIBBBBB', width, height, 8, 2, 0, 0, 0)
  ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
  ihdr_chunk = struct.pack('!I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('!I', ihdr_crc)

  # IDAT chunk (raw pixel rows: filter byte 0 + RGB bytes)
  r, g, b = color_rgb
  row = b'\x00' + bytes([r, g, b]) * width
  raw_data = row * height
  compressed = zlib.compress(raw_data)
  idat_crc = zlib.crc32(b'IDAT' + compressed)
  idat_chunk = struct.pack('!I', len(compressed)) + b'IDAT' + compressed + struct.pack('!I', idat_crc)

  # IEND chunk
  iend_crc = zlib.crc32(b'IEND')
  iend_chunk = struct.pack('!I', 0) + b'IEND' + struct.pack('!I', iend_crc)

  return png_sig + ihdr_chunk + idat_chunk + iend_chunk

os.makedirs('assets/icons', exist_ok=True)
with open('assets/icons/icon-192.png', 'wb') as f:
  f.write(make_png(192, 192, (5, 150, 105)))

with open('assets/icons/icon-512.png', 'wb') as f:
  f.write(make_png(512, 512, (5, 150, 105)))

print("PWA PNG icons generated successfully!")
