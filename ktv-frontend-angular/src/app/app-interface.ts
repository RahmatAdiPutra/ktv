import { HttpResponsePayloads } from './app-interface';

export interface User {
  name: string;
  avatar: string;
}

export interface Meta {
  id: number;
  name: string;
  token: string;
  activation_key: string;
}

export interface Session {
  guest_name: string;
  opened_at: string;
  hour_duration: number;
  session_type: string;
  timer_countdown: boolean;
}

export interface Player {
  playing: string;
  is_karaoke: boolean;
  volume_audio: number;
  volume_mic: number;
  pitch: number;
}

export interface PlayerState {
  action: string;
  state: Player;
}

export interface Song {
  id: number;
  title: string;
  title_non_latin: string;
  artist_label: string;
  cover_art: string;
  file_path: string;
  type: string;
  equalizer: string;
  volume: number;
  audio_channel: string;
}

export interface Playlist {
  id: number;
  now_playing: boolean;
  song: Song;
}
export interface PlaylistFormatted {
  nowPlayingIndex: number;
  hasPrev: boolean;
  hasNext: boolean;
  playlist: Playlist[];
}

export interface Room {
  meta: Meta;
  session: Session;
  player: Player;
  playlist: Playlist[];
}

export interface HttpResponsePayloads {
  bindAs: string;
  user: User;
  room: Room;
}

export interface HttpResponse {
  error: boolean;
  payloads: HttpResponsePayloads;
  code?: string;
  message?: string;
  file?: string;
  line?: string;
  ip?: string;
}
