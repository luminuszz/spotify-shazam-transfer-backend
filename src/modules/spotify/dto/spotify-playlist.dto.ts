interface ExternalUrls {
  spotify: string;
}

interface Followers {
  href: string;
  total: number;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Owner {
  external_urls: ExternalUrls2;
  followers: Followers2;
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name: string;
}

interface ExternalUrls2 {
  spotify: string;
}

interface Followers2 {
  href: string;
  total: number;
}

interface Tracks {
  href: string;
  items: Item[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Item {}

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
}
