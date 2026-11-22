# Safar Kitobi — loyiha bo'yicha ko'rsatmalar

## Egasi va muloqot
- Egasi: Sardor Rafiev, Royal Fix (@royalfix.uz), Kitob tumani, Qashqadaryo.
- Javoblar **o'zbek tilida (lotin)**, qisqa va aniq bo'lsin. Egasi telefonda (Android, Termux) ishlaydi, shuning uchun buyruqlarni bittadan, nusxalashga qulay qilib bering.

## Yangi sessiya boshlanganda
Avval faqat loyihani topib tanigan-tanimaganingni 2–3 qatorda ayt (nomi, hozirgi holat), keyin **hech narsa qilmasdan egasining buyrug'ini kut**. O'zingdan ish boshlama.

## G'oya
"Safar Kitobi — Har bir joy, bir sahifa". Turizm veb-ilovasi, keyinchalik APK.
- Har bir ziyoratgoh, tarixiy yoki tabiiy joyda QR kodli taxtacha turadi. Turist uni skanerlaydi va "sahifa" (muhr) oladi.
- Sahifalar yig'ilsa daraja ochiladi (Bronza 3, Kumush 5, Oltin "hammasi"). Daraja ochilganda bir martalik sovg'a kodi beriladi (`SK-xxxxxx`, 7 kun amal qiladi).
- Kitob tumanidan boshlanadi, papka tuzilishi butun O'zbekistonga mo'ljallangan (14 hudud).
- Platforma Royal Fix'niki. Hokimiyat hamkor. Ishlar faqat ochiq va rasmiy bo'ladi.
- 1-versiyaga kirmaydi: "Men Kitobda bo'ldim", "Yaqin atrofda".

## Texnologiya
- React 18 + Vite 5 (JavaScript), react-router-dom HashRouter, Tailwind 3 (ranglar `src/index.css` dagi CSS o'zgaruvchilarda, yorug' va qorong'i rejim bor).
- Leaflet + react-leaflet, OpenStreetMap.
- Backend: **faqat Supabase** (Firebase ishlatilmaydi). `.env` bo'lmasa sayt "namuna rejimi"da ishlaydi: ma'lumotlar localStorage'da (`safar_sahifalar`, `safar_sovgalar`, `safar_qurilma`).
- Deploy: GitHub Actions (`.github/workflows/deploy.yml`) orqali GitHub Pages. `main` ga push qilinsa avtomatik chiqadi: https://sardorrafiyofficial.github.io/safar-kitobi/
- Vite `base: './'`, shuning uchun sayt istalgan papkada ishlaydi (keyinchalik `safarkitobi.uz`).

## Papkalar
- `src/pages/` — Bosh, Tuman, Joy, Pasport
- `src/components/` — Header, Logo, Xarita, Darajalar
- `src/lib/` — data, geo (haversine, joylashuv), sahifalar (sahifaOl, sovgaOl), supabase, i18n (uz/ru/en)
- `public/data/hududlar.json` va `public/data/<hudud>/<tuman>/{tuman.json, joylar.json}`
- `scripts/make-qr.mjs` — QR va A5 taxtachalar (`SAYT_URL=... npm run qr`). Natija `chop-etish/qr/` ga tushadi.
- `supabase/schema.sql` — jadvallar, RLS, `claim_stamp` (kalit + GPS 150 m + 120 km/soat tezlik tekshiruvi), `sovga_ol`, `kod_ishlat`, `statistika_joylar`. `supabase/seed.sql` — boshlang'ich ma'lumot.
- `docs/ARXITEKTURA.md` — to'liq qo'llanma.

## MAXFIY — hech qachon commit qilmang
- `scripts/kalitlar.local.json`, `supabase/qr_kalitlar.sql`, `chop-etish/`, `.env`. QR maxfiy kalitlari shularda. Ular `.gitignore` da.

## Holat (2026-11-22)
- Sayt ishlaydi va telefonda to'liq sinovdan o'tdi: QR skanerlash, GPS masofa, muhr, 8/8 sahifa, 3 daraja kodlari, pasport.
- Kitobda 8 ta joy: faqat `kenglik-stansiyasi` haqiqiy (GPS taxminiy 39.135, 66.884). `joy-2`…`joy-8` namuna (`tasdiqlangan: false`).
- Supabase hali ulanmagan.

## Keyingi qadamlar
1. Haqiqiy joylar: nomi, 1–2 gap tarixi (3 tilda), rasm, aniq GPS → `joylar.json`, keyin QR'larni qayta chiqarish.
2. Supabase ulash + **Google bilan kirish** (1-sahifa akkauntsiz, sovg'a kodi faqat kirganlarga; kirgandan keyin localStorage sahifalari akkauntga ko'chadi). Profil: "Mening kitobim".
3. Hamkor do'kon/choyxonalar uchun kodni tekshirish sahifasi (`kod_ishlat`).
4. Xaritada bir-birini yopayotgan hudud markerlari (Toshkent, Farg'ona vodiysi) — kichikroq qilish.
5. Keyinroq: Play Market (nom "Safar Kitobi: sayohat pasporti", maxfiylik siyosati sahifasi kerak), `safarkitobi.uz` domeni.

## Nomlash uslubi
Ilova ichidagi bo'limlar kitob tilida: Mening kitobim (profil), Sahifalarim, Boblar (darajalar), Jildlar (tumanlar), Rahnoma (yo'nalishlar).
