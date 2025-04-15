// WordPress-sidor
export interface WPPage {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    //protected?: boolean;
  };
  excerpt?: {
    rendered: string;
    //protected?: boolean;
  };
  featured_media?: number;
  template?: string;
  _links?: WPLinks;
  _embedded?: WPEmbedded;
}

export interface WPLink {
  href: string;
  embeddable?: boolean;
  template?: boolean;
  type?: string;
}

export interface WPLinks {
  'wp:featuredmedia'?: WPLink[];
}

// WordPress-inlägg
export interface WPPost {
  id: number;
  slug: string;
  date: string;
  date_gmt?: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    //protected?: boolean;
  };
  excerpt: {
    rendered: string;
    //protected?: boolean;
  };
  featured_media: number;
  categories?: number[];
  tags?: number[];
  link: string;
  _links: WPLinks;
  _embedded?: WPEmbedded;
}

export interface WooImage {
  id: number;
  src: string;
  alt: string;
  name: string;
}

// WordPress Embedded-innehåll
export interface WPEmbedded {
  'wp:featuredmedia'?: WPMedia[];
  'wp:term'?: WPTerm[][];
  author?: WPAuthor[];
}

// WordPress Term (kategorier, taggar, etc.)
export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  description?: string;
  count?: number;
  link?: string;
}

// WordPress Författare
export interface WPAuthor {
  id: number;
  name: string;
  url?: string;
  description?: string;
  link?: string;
  slug?: string;
  avatar_urls?: Record<string, string>;
}

// WordPress Media
export interface WPMedia {
  id?: number;
  source_url?: string;
  alt_text?: string;
  title?: {
    rendered?: string;
  };
  media_details?: {
    width?: number;
    height?: number;
    file?: string;
    sizes?: {
      full?: WPMediaSize;
      large?: WPMediaSize;
      medium?: WPMediaSize;
      thumbnail?: WPMediaSize;
      [key: string]: WPMediaSize | undefined;
    };
  };
  guid?: {
    rendered?: string;
  };
  caption?: {
    rendered?: string;
  };
  description?: {
    rendered?: string;
  };
}

// Bildstorlekar i WordPress
export interface WPMediaSize {
  file?: string;
  width?: number;
  height?: number;
  mime_type?: string;
  source_url?: string;
}
