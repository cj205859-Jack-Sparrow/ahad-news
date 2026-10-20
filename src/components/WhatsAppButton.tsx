import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../lib/settings';
import type { SiteSettings } from '../types/settings';

export default function WhatsAppButton({ s }: { s: SiteSettings }) {
  const url = buildWhatsAppUrl(s.whatsapp_number, s.whatsapp_message);
  const label = s.whatsapp_button_text || 'واٹس ایپ پر رابطہ کریں';
  if (!url) return <button className="wa" disabled dir="rtl" title="WhatsApp number not set"><MessageCircle />{label}</button>;
  return (
    <a className="wa" href={url} target="_blank" rel="noopener noreferrer" dir="rtl" aria-label={label}>
      <MessageCircle aria-hidden />{label}
    </a>
  );
}
