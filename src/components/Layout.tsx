import { Mail, Globe, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SiteSettings } from '../types/settings';
import { buildWhatsAppUrl } from '../lib/settings';

export function Header({ s }: { s: SiteSettings }) {
  return (
    <header className="hdr">
      <div className="wrap row">
        <div>
          <div className="ur h-ur" dir="rtl" lang="ur">{s.site_name_ur}</div>
          <div className="en">{s.site_name_en}</div>
        </div>
        <div className="header-actions">
          <div className="meta">
            <span><Globe size={14} /> {s.website_url}</span>
            <a href={`mailto:${s.contact_email}`}><Mail size={14} /> {s.contact_email}</a>
          </div>
          <Link className="admin-login" to="/admin/login">
            <ShieldCheck size={16} /> Admin Login
          </Link>
        </div>
      </div>
    </header>
  );
}
export function Footer({ s }: { s: SiteSettings }) {
  const wa = buildWhatsAppUrl(s.whatsapp_number, s.whatsapp_message);
  return (
    <footer className="ftr"><div className="wrap">
      <div className="ur" dir="rtl" lang="ur">{s.site_name_ur}</div><div className="en">{s.site_name_en}</div>
      <p><Globe size={14} /> {s.website_url} · <Mail size={14} /> {s.contact_email} · <MapPin size={14} /> {s.office_location}</p>
      {wa && <p><a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a></p>}
      <small>© {new Date().getFullYear()} {s.site_name_en}. All rights reserved.</small>
    </div></footer>
  );
}
export const LoadingState = ({ text = 'Loading…' }: { text?: string }) => <div className="center" role="status">{text}</div>;
