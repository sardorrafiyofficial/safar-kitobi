import { createContext, useContext, useEffect, useState } from 'react'

// Interfeys matnlari 3 tilda. Joylar matni JSON ichida {uz, ru, en} ko'rinishida.
const S = {
  shior:      { uz: "Har bir joy — bir sahifa", ru: "Каждое место — страница", en: "Every place is a page" },
  kirish:     { uz: "QR kodni skanerlang, sahifalar to'plang va sovg'alar oling. Kitob tumanidan boshlab butun O'zbekiston bo'ylab.",
                ru: "Сканируйте QR-код, собирайте страницы и получайте подарки. От Китабского района — по всему Узбекистану.",
                en: "Scan the QR code, collect pages and earn rewards. Starting in Kitob, across all of Uzbekistan." },
  hududlar:   { uz: "Hududlar", ru: "Регионы", en: "Regions" },
  faol:       { uz: "Faol", ru: "Активно", en: "Live" },
  tez_kunda:  { uz: "Tez kunda", ru: "Скоро", en: "Coming soon" },
  joylar:     { uz: "Joylar", ru: "Места", en: "Places" },
  sahifalar:  { uz: "Mening sahifalarim", ru: "Мои страницы", en: "My pages" },
  sahifa:     { uz: "sahifa", ru: "стр.", en: "pages" },
  daraja:     { uz: "Darajalar", ru: "Уровни", en: "Levels" },
  bronza:     { uz: "Bronza", ru: "Бронза", en: "Bronze" },
  kumush:     { uz: "Kumush", ru: "Серебро", en: "Silver" },
  oltin:      { uz: "Oltin", ru: "Золото", en: "Gold" },
  olingan:    { uz: "Sahifa olingan", ru: "Страница получена", en: "Page collected" },
  olish:      { uz: "Sahifani olish", ru: "Получить страницу", en: "Collect the page" },
  tekshir:    { uz: "Joylashuv tekshirilmoqda…", ru: "Проверяем местоположение…", en: "Checking your location…" },
  uzoq:       { uz: "Siz joydan uzoqdasiz", ru: "Вы далеко от места", en: "You are too far from the place" },
  gps_yoq:    { uz: "Joylashuvni aniqlab bo'lmadi. Telefon sozlamalarida joylashuvga ruxsat bering.",
                ru: "Не удалось определить местоположение. Разрешите доступ к геолокации.",
                en: "Couldn't get your location. Allow location access in your phone settings." },
  namuna:     { uz: "Namuna rejimi", ru: "Демо-режим", en: "Demo mode" },
  namuna_ol:  { uz: "Namuna rejimida baribir olish", ru: "Получить в демо-режиме", en: "Collect anyway (demo)" },
  qr_kerak:   { uz: "Sahifani olish uchun joyning o'zidagi QR kodni skanerlang.",
                ru: "Чтобы получить страницу, отсканируйте QR-код на месте.",
                en: "Scan the QR code at the place to collect this page." },
  xaritada:   { uz: "Xaritada", ru: "На карте", en: "On the map" },
  orqaga:     { uz: "Orqaga", ru: "Назад", en: "Back" },
  sovga:      { uz: "Sovg'a", ru: "Подарок", en: "Reward" },
  qoldi:      { uz: "ta joy qoldi", ru: "мест осталось", en: "places to go" },
  sovga_ol:   { uz: "Sovg'a kodini olish", ru: "Получить код подарка", en: "Get reward code" },
  sovga_kod:  { uz: "Hamkor do'konga shu kodni ko'rsating", ru: "Покажите этот код партнёру", en: "Show this code to a partner" },
  gacha:      { uz: "gacha amal qiladi", ru: "действует до", en: "valid until" },
  ochildi:    { uz: "Ochildi!", ru: "Открыто!", en: "Unlocked!" },
  hali_yoq:   { uz: "Hali sahifa yo'q. Birinchi joyga boring va QR kodni skanerlang.",
                ru: "Пока нет страниц. Посетите первое место и отсканируйте QR-код.",
                en: "No pages yet. Visit your first place and scan its QR code." },
}

const Ctx = createContext({ til: 'uz', setTil: () => {}, t: k => k, L: o => o })

export function TilProvider({ children }){
  const [til, setTil] = useState(() => { try { return localStorage.getItem('til') || 'uz' } catch { return 'uz' } })
  useEffect(() => { try { localStorage.setItem('til', til) } catch {} ; document.documentElement.lang = til }, [til])
  const t = k => S[k]?.[til] ?? S[k]?.uz ?? k
  const L = o => (o && typeof o === 'object') ? (o[til] ?? o.uz) : o   // JSON ichidagi {uz,ru,en}
  return <Ctx.Provider value={{ til, setTil, t, L }}>{children}</Ctx.Provider>
}
export const useTil = () => useContext(Ctx)
