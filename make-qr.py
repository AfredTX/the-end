"""
Generate a QR code PNG that points at the live site.

Usage:
    py -m pip install segno      (one time)
    py make-qr.py https://USERNAME.github.io/REPO/

Writes qr.png next to this script.
"""
import sys
import segno

if len(sys.argv) < 2:
    sys.exit("Usage: py make-qr.py <url>")

url = sys.argv[1]
qr = segno.make(url, error="h")  # high error correction
qr.save("qr.png", scale=12, border=4)
print("Wrote qr.png ->", url)
