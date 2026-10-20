import { useEffect, useState } from 'react';
import { getSettings } from '../lib/settings';
import type { SiteSettings } from '../types/settings';
import { Header, Footer, LoadingState } from '../components/Layout';
import WhatsAppButton from '../components/WhatsAppButton';

export default function Home() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    document.title = 'The Daily Ahad Lahore | روزنامہ عہد';
    getSettings().then(setS).catch(() => setErr(true));
  }, []);
  if (err) return <LoadingState text="Unable to load website settings. Please try again later." />;
  if (!s) return <LoadingState />;
  return (
    <div style={{ ['--red' as string]: s.theme_primary_color || '#C8102E', ['--ink' as string]: s.theme_secondary_color || '#111' }}>
      <Header s={s} />
      <main>
        <section className="wrap hero">
          <h1 className="ur big" dir="rtl" lang="ur">{s.site_name_ur}</h1>
          <p className="en">{s.site_name_en}</p>
          <p className="ur intro" dir="rtl" lang="ur">{s.newspaper_intro}</p>
          <WhatsAppButton s={s} />
          {s.cover_image_url ? (
            <img className="cover" src={s.cover_image_url} alt={`${s.site_name_en} front page`} loading="lazy" />
          ) : (
            <div className="cover-placeholder" aria-label="Cover image placeholder">
              <strong>{s.site_name_en}</strong>
            </div>
          )}
        </section>
      </main>
      <Footer s={s} />
    </div>
  );
}
