# Safar Kitobi — arxitektura

## 1. Texnologiyalar

| Qism | Tanlov | Nima uchun |
|---|---|---|
| Frontend | React 18 + Vite 5 (JavaScript) | Tez, zamonaviy, kengaytirish oson |
| Dizayn | Tailwind CSS 3 + CSS o'zgaruvchilar | Bir joyda boshqariladigan ranglar, yorug' va qorong'i rejim |
| Xarita | Leaflet + OpenStreetMap | Bepul, haqiqiy xarita, kalit kerak emas |
| Backend | **Supabase** (Postgres) | Ierarxik ma'lumot, GPS tekshiruvi serverda, RLS xavfsizligi |
| QR | `qrcode` (Node skript) | Har bir joyga maxfiy kalitli QR va chop etiladigan taxtacha |

Firebase ishlatilmaydi: ikkita backend bir xil ishni qiladi va murakkablikni ikki barobar oshiradi.

## 2. Papkalar

```
safar-kitobi/
├── index.html
├── src/
│   ├── main.jsx, App.jsx        ← kirish va marshrutlar
│   ├── index.css                ← dizayn tizimi (ranglar)
│   ├── components/              ← Header, Logo, Xarita, Darajalar
│   ├── pages/                   ← Bosh, Tuman, Joy, Pasport
│   └── lib/                     ← data, geo (GPS), sahifalar, supabase, i18n (3 til)
├── public/
│   ├── data/
│   │   ├── hududlar.json        ← 14 ta hudud
│   │   └── <hudud>/<tuman>/
│   │       ├── tuman.json       ← tuman + darajalar
│   │       └── joylar.json      ← joylar (3 tilda, GPS bilan)
│   (QR bu yerda emas — saytga chiqmasligi kerak)
├── chop-etish/qr/               ← QR va taxtachalar (MAXFIY, saytga yuklanmaydi)
├── scripts/make-qr.mjs          ← QR generator
├── supabase/
│   ├── schema.sql               ← jadvallar, xavfsizlik, funksiyalar
│   └── seed.sql                 ← boshlang'ich ma'lumotlar
└── docs/ARXITEKTURA.md
```

## 3. Marshrutlar (sahifalar)

| Manzil | Sahifa |
|---|---|
| `#/` | O'zbekiston xaritasi, 14 hudud |
| `#/qashqadaryo/kitob` | Tuman: xarita, joylar, darajalar |
| `#/joy/qashqadaryo/kitob/<joy>?k=<kalit>` | Joy sahifasi — **QR shu yerga olib keladi** |
| `#/pasport` | Turistning barcha sahifalari |

`#` (HashRouter) tufayli sayt istalgan oddiy hostingda ishlaydi, masalan `royalfix.uz/safar/`.

## 4. Yangi tuman qo'shish (kod yozmasdan)

1. `public/data/<hudud>/<tuman>/` papkasini yarating.
2. `tuman.json` (nom, markaz, darajalar) va `joylar.json` (joylar) qo'ying — Kitob fayllarini namuna qiling.
3. `hududlar.json` da hudud `holat: "faol"` va `tumanlar` ro'yxatiga tuman ID'sini qo'shing.
4. `npm run qr` → taxtachalar tayyor.

## 5. Darajalar

Har bir tuman o'zi belgilaydi (`tuman.json`):

```json
"darajalar": [
  { "id": "bronza", "joylar": 3,          "sovga": { "uz": "5% chegirma" } },
  { "id": "kumush", "joylar": 5,          "sovga": { "uz": "10% + choy" } },
  { "id": "oltin",  "joylar": "hammasi",  "sovga": { "uz": "15% + suvenir + sertifikat" } }
]
```

## 6. Aldovdan himoya (Supabase ulanganda)

`claim_stamp` funksiyasi serverda tekshiradi:
- **QR kaliti** to'g'rimi (har bir joyda maxfiy kalit, istalgan vaqtda almashtirish mumkin);
- **GPS**: turist joydan `radius_m` (150 m) ichidami;
- **Tezlik**: oldingi sahifadan 120 km/soat'dan tez ko'chib bo'lmaydi;
- bitta qurilma — bitta joydan bitta sahifa.

Sovg'a kodlari bir martalik (`sovga_ol`), hamkor ularni `kod_ishlat` bilan tekshiradi, kod 7 kun amal qiladi.

## 7. Supabase'ni ulash (2-bosqich)

1. supabase.com → yangi loyiha.
2. SQL Editor → `supabase/schema.sql`, keyin `seed.sql`, keyin `qr_kalitlar.sql` (maxfiy) ni ishga tushiring.
3. `.env` fayl: `VITE_SUPABASE_URL` va `VITE_SUPABASE_ANON_KEY` (Project Settings → API).
4. `npm run build` va `dist/` ni yuklang.

Kalitlar bo'lmasa sayt **namuna rejimida** ishlaydi: sahifalar telefonning o'zida saqlanadi.

## 8. Ranglar

| Nom | Yorug' | Ma'nosi |
|---|---|---|
| Qog'oz | `#F6F2E9` | Sahifa foni — kitob varag'i |
| Varaq | `#FFFDF8` | Kartochkalar |
| Siyoh | `#182220` | Asosiy matn |
| Firuza | `#0F6F6C` | Asosiy brend rangi — koshinlar firuzasi |
| Lojuvard | `#1C3D6E` | Qo'shimcha — gumbazlar lojuvardi |
| Oltin | `#C9972B` | Darajalar, tugmalar — 39° chizig'i |
| Muhr | `#B3261E` | Olingan sahifa muhri |

Shriftlar: **Lora** (sarlavhalar, kitob ruhi) + **Manrope** (matn).

## 9. Diqqat

- Kitobdagi 7 ta joy hozircha **namuna** (`tasdiqlangan: false`). Haqiqiy nom, matn va GPS hokimiyat bilan kelishilgach kiritiladi.
- Kenglik stansiyasi koordinatasi taxminiy — joyida telefon GPS bilan aniqlab, yangilang.
- Ziyoratgohlarga taxtacha qo'yishdan oldin mutasaddilar bilan kelishiladi.
- `chop-etish/qr/` ichidagi QR'larda maxfiy kalit bor — faqat bosmaxonaga beriladi, saytga yoki internetga joylanmaydi.
