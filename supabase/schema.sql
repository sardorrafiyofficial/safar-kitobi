-- =====================================================================
--  Safar Kitobi — Supabase (Postgres) sxemasi
--  Ierarxiya: hudud → tuman → joy → sahifa (muhr) → sovg'a kodi
--  Supabase → SQL Editor ga to'liq qo'yib, "Run" bosiladi.
-- =====================================================================

-- 1. Hududlar (14 ta: 12 viloyat + Qoraqalpog'iston + Toshkent shahri)
create table if not exists hududlar (
  id        text primary key,                 -- 'qashqadaryo'
  nom       jsonb not null,                   -- {"uz":"..","ru":"..","en":".."}
  lat       double precision, lng double precision,
  holat     text not null default 'tez_kunda' check (holat in ('faol','tez_kunda'))
);

-- 2. Tumanlar
create table if not exists tumanlar (
  id        text primary key,                 -- 'qashqadaryo/kitob'
  hudud_id  text not null references hududlar(id),
  nom       jsonb not null,
  tavsif    jsonb,
  lat       double precision, lng double precision, zoom int default 12,
  darajalar jsonb not null default '[]',      -- [{"id":"bronza","joylar":3,"sovga":{..}}, ...]
  holat     text not null default 'faol'
);

-- 3. Joylar (ziyoratgoh, tarixiy joy, tabiat, ilm)
create table if not exists joylar (
  id        text primary key,                 -- 'qashqadaryo/kitob/kenglik-stansiyasi'
  tuman_id  text not null references tumanlar(id),
  tur       text not null,
  nom       jsonb not null,
  matn      jsonb,
  lat       double precision not null,
  lng       double precision not null,
  radius_m  int not null default 150,         -- GPS ruxsat etilgan masofa
  qr_kalit  text,                             -- MAXFIY: faqat server ko'radi
  tasdiqlangan boolean not null default false,
  faol      boolean not null default true
);

-- 4. Olingan sahifalar (muhrlar)
create table if not exists sahifalar (
  id        bigserial primary key,
  qurilma   text not null,                    -- keyinchalik auth.users bilan almashtiriladi
  joy_id    text not null references joylar(id),
  vaqt      timestamptz not null default now(),
  lat       double precision, lng double precision,
  unique (qurilma, joy_id)                    -- bitta joydan bitta sahifa
);

-- 5. Bir martalik sovg'a kodlari
create table if not exists sovga_kodlari (
  kod        text primary key,                -- 'KB-48213'
  qurilma    text not null,
  tuman_id   text not null references tumanlar(id),
  daraja     text not null,                   -- bronza | kumush | oltin
  yaratildi  timestamptz not null default now(),
  amal_qiladi timestamptz not null default now() + interval '7 days',
  ishlatildi timestamptz,
  hamkor     text,
  unique (qurilma, tuman_id, daraja)
);

-- Ochiq ko'rinish: qr_kalit'siz
create or replace view joylar_ochiq as
  select id, tuman_id, tur, nom, matn, lat, lng, radius_m, tasdiqlangan from joylar where faol;

-- ---------------------------------------------------------------------
-- Xavfsizlik (RLS): turist jadvallarga to'g'ridan-to'g'ri yozolmaydi
-- ---------------------------------------------------------------------
alter table hududlar enable row level security;
alter table tumanlar enable row level security;
alter table joylar enable row level security;
alter table sahifalar enable row level security;
alter table sovga_kodlari enable row level security;

create policy "hududlar ochiq" on hududlar for select using (true);
create policy "tumanlar ochiq" on tumanlar for select using (true);
-- joylar jadvalining o'zi yopiq (qr_kalit bor); ochiq ma'lumot joylar_ochiq orqali
grant select on joylar_ochiq to anon, authenticated;

-- Masofa (metr) — haversine
create or replace function masofa_m(a_lat float8, a_lng float8, b_lat float8, b_lng float8)
returns float8 language sql immutable as $$
  select 2 * 6371000 * asin(sqrt(
    power(sin(radians(b_lat - a_lat) / 2), 2) +
    cos(radians(a_lat)) * cos(radians(b_lat)) * power(sin(radians(b_lng - a_lng) / 2), 2)))
$$;

-- ---------------------------------------------------------------------
-- Sahifa olish: QR kaliti + GPS + tezlik tekshiruvi
-- ---------------------------------------------------------------------
create or replace function claim_stamp(p_place text, p_key text, p_lat float8, p_lng float8, p_device text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare j joylar; oxirgi sahifalar; m float8; soat float8;
begin
  select * into j from joylar where id = p_place and faol;
  if not found then return jsonb_build_object('ok', false, 'sabab', 'joy_yoq'); end if;
  if j.qr_kalit is null or p_key is distinct from j.qr_kalit then
    return jsonb_build_object('ok', false, 'sabab', 'kalit'); end if;
  if p_lat is null or p_lng is null then
    return jsonb_build_object('ok', false, 'sabab', 'gps_yoq'); end if;
  m := masofa_m(p_lat, p_lng, j.lat, j.lng);
  if m > j.radius_m then
    return jsonb_build_object('ok', false, 'sabab', 'uzoq', 'masofa', round(m)); end if;

  -- Imkonsiz tezlik: oldingi sahifadan 120 km/soat'dan tez ko'chib bo'lmaydi
  select * into oxirgi from sahifalar where qurilma = p_device order by vaqt desc limit 1;
  if found and oxirgi.lat is not null then
    soat := greatest(extract(epoch from now() - oxirgi.vaqt) / 3600, 0.0001);
    if masofa_m(oxirgi.lat, oxirgi.lng, p_lat, p_lng) / 1000 / soat > 120 then
      return jsonb_build_object('ok', false, 'sabab', 'tez'); end if;
  end if;

  insert into sahifalar(qurilma, joy_id, lat, lng) values (p_device, p_place, p_lat, p_lng)
  on conflict (qurilma, joy_id) do nothing;
  return jsonb_build_object('ok', true);
end $$;
grant execute on function claim_stamp to anon, authenticated;

-- ---------------------------------------------------------------------
-- Sovg'a kodi berish: darajaga yetgan turistga bir martalik kod
-- ---------------------------------------------------------------------
create or replace function sovga_ol(p_tuman text, p_daraja text, p_device text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare d jsonb; kerak int; bor int; jami int; k text;
begin
  select x into d from tumanlar t, jsonb_array_elements(t.darajalar) x where t.id = p_tuman and x->>'id' = p_daraja;
  if d is null then return jsonb_build_object('ok', false, 'sabab', 'daraja_yoq'); end if;
  select count(*) into jami from joylar where tuman_id = p_tuman and faol;
  kerak := case when d->>'joylar' = 'hammasi' then jami else (d->>'joylar')::int end;
  select count(*) into bor from sahifalar s join joylar j on j.id = s.joy_id where s.qurilma = p_device and j.tuman_id = p_tuman;
  if bor < kerak then return jsonb_build_object('ok', false, 'sabab', 'yetarli_emas', 'bor', bor, 'kerak', kerak); end if;
  select kod into k from sovga_kodlari where qurilma = p_device and tuman_id = p_tuman and daraja = p_daraja;
  if k is null then
    k := 'SK-' || lpad((floor(random() * 1000000))::text, 6, '0');
    insert into sovga_kodlari(kod, qurilma, tuman_id, daraja) values (k, p_device, p_tuman, p_daraja);
  end if;
  return jsonb_build_object('ok', true, 'kod', k);
end $$;
grant execute on function sovga_ol to anon, authenticated;

-- Hamkor kodni tekshiradi va "ishlatildi" deb belgilaydi
create or replace function kod_ishlat(p_kod text, p_hamkor text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r sovga_kodlari;
begin
  select * into r from sovga_kodlari where kod = upper(p_kod);
  if not found then return jsonb_build_object('ok', false, 'sabab', 'topilmadi'); end if;
  if r.ishlatildi is not null then return jsonb_build_object('ok', false, 'sabab', 'ishlatilgan'); end if;
  if r.amal_qiladi < now() then return jsonb_build_object('ok', false, 'sabab', 'muddati_otgan'); end if;
  update sovga_kodlari set ishlatildi = now(), hamkor = p_hamkor where kod = r.kod;
  return jsonb_build_object('ok', true, 'daraja', r.daraja);
end $$;
-- kod_ishlat faqat tizimga kirgan hamkorlar uchun (2-bosqich)
grant execute on function kod_ishlat to authenticated;

-- Statistika (hokimiyat hisobotlari uchun)
create or replace view statistika_joylar as
  select j.tuman_id, j.id as joy_id, j.nom->>'uz' as joy, count(s.id) as sahifalar,
         count(distinct s.qurilma) as turistlar, max(s.vaqt) as oxirgi
  from joylar j left join sahifalar s on s.joy_id = j.id group by j.tuman_id, j.id, j.nom;
