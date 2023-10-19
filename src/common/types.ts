export interface Artist {
  name: string;
  external_urls: {
    spotify: string;
  };
}

export interface Track {
  energy: number;
  id: string;
  tempo: number;
  duration_ms: number;
  uri: string;
  track: {
    album: {
      name: string;
      external_urls: {
        spotify: string;
      };
    };
    name: string;
    artists: Artist[];
    id: string;
    duration_ms: number;
    external_urls: {
      spotify: string;
    };
  };
}

export interface HelpModalProps {
  heading: string;
  image: string;
  text: string;
  recommendation: string;
}

export interface ToastData {
  show: boolean;
  message: string;
  type: string;
}

export interface PlaylistData {
  length: number;
  count: number;
  steps: number;
}
