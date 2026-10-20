export interface SiteSettings {
  id: string;
  site_name_en: string; site_name_ur: string;
  website_url: string | null; contact_email: string | null;
  whatsapp_number: string | null; whatsapp_message: string | null; whatsapp_button_text: string | null;
  chief_editor: string | null; chief_executive: string | null; office_location: string | null;
  newspaper_intro: string | null; cover_image_url: string | null;
  publication_date: string | null; edition_number: string | null; issue_number: string | null;
  page_count: number | null; newspaper_price: number | null;
  theme_primary_color: string | null; theme_secondary_color: string | null;
  updated_at: string;
}
export type SettingsPatch = Partial<Omit<SiteSettings, 'id' | 'updated_at'>>;
