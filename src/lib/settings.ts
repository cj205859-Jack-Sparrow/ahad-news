import { supabase } from './supabase';
import type { SiteSettings, SettingsPatch } from '../types/settings';

export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
  if (error) throw error;
  return data as SiteSettings;
}
export async function updateSettings(id: string, patch: SettingsPatch): Promise<SiteSettings> {
  const { data, error } = await supabase.from('site_settings').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data as SiteSettings;
}
export async function uploadCover(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const path = `cover-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('newspaper-assets').upload(path, file, { contentType: file.type });
  if (error) throw error;
  return supabase.storage.from('newspaper-assets').getPublicUrl(path).data.publicUrl;
}

export const normalizeWhatsAppNumber = (n?: string | null) => {
  if (!n) return null;
  const cleaned = n.replace(/\s+/g, '').replace(/[+()\-]/g, '');
  if (!/^\d+$/.test(cleaned) || cleaned.length < 8 || cleaned.length > 15) return null;
  return cleaned;
};

export const isValidWhatsApp = (n?: string | null) => !!normalizeWhatsAppNumber(n);
export const buildWhatsAppUrl = (n?: string | null, msg?: string | null) => {
  const normalized = normalizeWhatsAppNumber(n);
  return normalized ? `https://wa.me/${normalized}?text=${encodeURIComponent(msg ?? '')}` : null;
};
