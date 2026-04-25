export interface JournalEntry {
  id: string;
  timestamp: number;
  title?: string;
  content: string;
  media: MediaItem[];
  mood?: string;
  location?: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  name?: string;
}

export type AuthStatus = 'unauthenticated' | 'authenticated' | 'loading';
