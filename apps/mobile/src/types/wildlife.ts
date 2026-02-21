export interface ContentBlock {
  title: string;
  body: string; // Markdown content
  source: 'scubago' | 'manual' | 'external';
}

export interface WildlifeImage {
  storage_path: string;
  url: string;
  credit?: string;
  caption?: string;
  source: 'scubago' | 'manual' | 'external';
}

export interface Wildlife {
  id: string;
  slug: string;
  name: string;
  source: 'scubago' | 'manual' | 'external';
  taxonomy?: string[];
  species_count?: number;
  content: ContentBlock[];
  images: WildlifeImage[];
  keywords?: string[];
  created_at?: string;
  updated_at?: string;
}
