create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  singleton boolean not null default true unique check (singleton),
  site_name_en text not null, site_name_ur text not null,
  website_url text, contact_email text,
  whatsapp_number text check (whatsapp_number is null or whatsapp_number ~ '^[1-9][0-9]{7,14}$'),
  whatsapp_message text, whatsapp_button_text text,
  chief_editor text, chief_executive text, office_location text,
  newspaper_intro text, cover_image_url text,
  publication_date date, edition_number text, issue_number text,
  page_count integer check (page_count > 0), newspaper_price numeric check (newspaper_price >= 0),
  theme_primary_color text default '#C8102E', theme_secondary_color text default '#111111',
  updated_at timestamptz not null default now()
);
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists trg_touch on public.site_settings;
create trigger trg_touch before update on public.site_settings for each row execute function public.touch_updated_at();

alter table public.site_settings enable row level security;
drop policy if exists "public read" on public.site_settings;
drop policy if exists "auth update" on public.site_settings;
create policy "public read" on public.site_settings for select to anon, authenticated using (true);
create policy "auth update" on public.site_settings for update to authenticated using (true) with check (true);

insert into public.site_settings (site_name_en, site_name_ur, website_url, contact_email, whatsapp_number,
 whatsapp_message, whatsapp_button_text, chief_editor, chief_executive, office_location, newspaper_intro,
 cover_image_url, publication_date, edition_number, issue_number, page_count, newspaper_price)
values ('THE DAILY AHAD LAHORE','روزنامہ عہد','https://www.dailyahad.com.pk','dailyahad@gmail.com',null,
 'ہم آپ کی کیا رہنمائی کر سکتے ہیں؟','واٹس ایپ پر رابطہ کریں','ایس ایم شیرازی','چوہدری عمیر','Lahore, Pakistan',
 'روزنامہ عہد لاہور سے شائع ہونے والا اردو اخبار ہے، جو قارئین تک بروقت اور معتبر خبریں پہنچانے کا عزم رکھتا ہے۔',
 null,'2026-10-20','02','26',4,15)
on conflict (singleton) do nothing;

insert into storage.buckets (id, name, public) values ('newspaper-assets','newspaper-assets',true) on conflict (id) do nothing;
drop policy if exists "assets public read" on storage.objects;
drop policy if exists "assets auth insert" on storage.objects;
create policy "assets public read" on storage.objects for select to anon, authenticated using (bucket_id='newspaper-assets');
create policy "assets auth insert" on storage.objects for insert to authenticated with check (bucket_id='newspaper-assets');
