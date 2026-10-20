import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getSettings, updateSettings, uploadCover, isValidWhatsApp, normalizeWhatsAppNumber, buildWhatsAppUrl } from '../../lib/settings';
import type { SiteSettings, SettingsPatch } from '../../types/settings';
import { LoadingState } from '../../components/Layout';

type F = Record<string, string>;
const fields: [string, string, string?][] = [
  ['Branding', ''], ['site_name_en', 'English name'], ['site_name_ur', 'Urdu name'], ['website_url', 'Website URL'],
  ['newspaper_intro', 'Urdu introduction', 'area'], ['theme_primary_color', 'Primary color', 'color'], ['theme_secondary_color', 'Secondary color', 'color'],
  ['WhatsApp', ''], ['whatsapp_number', 'WhatsApp number (e.g. +92 300 1234567 or 923001234567)'], ['whatsapp_message', 'Prefilled message', 'area'], ['whatsapp_button_text', 'Button text'],
  ['Contact', ''], ['contact_email', 'Email', 'email'], ['office_location', 'Office location'], ['chief_editor', 'Chief Editor'], ['chief_executive', 'Chief Executive'],
];

export default function AdminSettings() {
  const nav = useNavigate();
  const [s, setS] = useState<SiteSettings | null>(null);
  const [f, setF] = useState<F>({});
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [msg, setMsg] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);

  const load = (d: SiteSettings) => {
    setS(d);
    setF(Object.fromEntries(fields.filter(x => x[1]).map(([k]) => [k, String((d as unknown as Record<string, unknown>)[k] ?? '')])));
  };
  useEffect(() => { getSettings().then(load).catch(() => setErr('Could not load settings.')); }, []);

  function pick(file?: File) {
    setErr('');
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return setErr('Cover must be PNG, JPG or WebP.');
    if (file.size > 5 * 1024 * 1024) return setErr('Cover must be under 5 MB.');
    setFile(file); setPreview(URL.createObjectURL(file));
  }
  async function save() {
    if (!s) return;
    setErr(''); setMsg('');
    const normalizedNumber = normalizeWhatsAppNumber(f.whatsapp_number);
    if (f.whatsapp_number && !normalizedNumber) return setErr('WhatsApp number must contain 8–15 digits in international format, for example 923001234567.');
    if (f.contact_email && !/^\S+@\S+\.\S+$/.test(f.contact_email)) return setErr('Enter a valid email.');
    if (!f.site_name_en || !f.site_name_ur) return setErr('Newspaper names are required.');
    setBusy(true);
    try {
      let cover = s.cover_image_url;
      if (file) cover = await uploadCover(file);
      const patch = { ...f, whatsapp_number: normalizedNumber || null, cover_image_url: cover } as SettingsPatch;
      load(await updateSettings(s.id, patch));
      setFile(null); setPreview(''); setMsg('Saved successfully.');
    } catch (e) { setErr('Save failed: ' + (e as Error).message); }
    setBusy(false);
  }
  async function logout() { await supabase.auth.signOut(); nav('/admin/login'); }

  if (!s) return <LoadingState text={err || 'Loading…'} />;
  const url = buildWhatsAppUrl(f.whatsapp_number, f.whatsapp_message);
  return (
    <div className="wrap admin">
      <div className="row">
        <h1>Admin – {s.site_name_en}</h1>
        <div className="row-inline">
          <Link to="/" target="_blank">View site</Link>
          <button className="btn alt" onClick={logout}>Logout</button>
        </div>
      </div>
      <p className="meta">WhatsApp: {s.whatsapp_number || 'not set'} · Email: {s.contact_email} · Last updated: {new Date(s.updated_at).toLocaleString()}</p>
      <div className="card form">
        {fields.map(([k, label, type]) => !label ? <h2 key={k}>{k}</h2> : (
          <label key={k}>{label}
            {type === 'area'
              ? <textarea dir="auto" rows={3} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} />
              : <input dir="auto" type={type || 'text'} step={type === 'number' ? 'any' : undefined} min={type === 'number' ? 0 : undefined} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} />}
          </label>
        ))}
        <div className="wa-preview">
          <span>WhatsApp status:</span>
          <strong>{url ? 'Ready to open' : 'Enter a valid number'}</strong>
        </div>
        <button className="btn alt" type="button" disabled={!url} onClick={() => url && window.open(url, '_blank', 'noopener')}>Test WhatsApp</button>
        <h2>Cover image</h2>
        <img className="cover small" src={preview || s.cover_image_url || ''} alt="Cover preview" />
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => pick(e.target.files?.[0])} />
        {err && <p className="error" role="alert">{err}</p>}
        {msg && <p className="ok" role="status">{msg}</p>}
        <button className="btn" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
      </div>
    </div>
  );
}
