SURAT HARI GURU — UNTUK BU DEA

Isi folder:
- index.html : struktur surat digital
- style.css  : desain dan animasi amplop/surat
- script.js  : interaksi, efek mengetik, dan musik instrumental original
- server.py  : server lokal Python

CARA MENJALANKAN (Windows):
1. Pastikan Python sudah terpasang.
2. Buka folder ini di VS Code.
3. Buka Terminal > New Terminal.
4. Jalankan:
   python server.py
   Jika perintah python tidak dikenali, gunakan:
   py server.py
   atau jalankan dengan path Python yang terpasang di PC.
5. Browser akan membuka http://127.0.0.1:8000

Bisa juga membuka index.html langsung, tetapi server.py direkomendasikan.

CATATAN:
- Musik instrumental dibuat secara sintetis oleh Web Audio API, bukan mengambil lagu dari internet.
- Browser meminta interaksi pengguna sebelum musik diputar.
- Tombol Musik bisa digunakan untuk menyalakan/mematikan musik.
- Volume musik dibuat pelan.
- Server hanya mendengarkan di 127.0.0.1 (komputer sendiri).
