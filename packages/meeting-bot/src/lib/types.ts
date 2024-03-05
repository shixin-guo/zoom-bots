export interface MeetingConfig {
  sdkKey: string;
  meetingNumber: string;
  userName: string;
  password?: string;
  leaveUrl: string;
  role: string;
  userEmail: string;
  lang: string | null;
  signature: string;
  china: boolean;
  disablePreview?: boolean;
  webEndpoint?: string;
}

export type Zoom_Meeting_SDK_Language =
  | 'de-DE'
  | 'es-ES'
  | 'en-US'
  | 'fr-FR'
  | 'jp-JP'
  | 'pt-PT'
  | 'ru-RU'
  | 'zh-CN'
  | 'zh-TW'
  | 'ko-KO'
  | 'vi-VN'
  | 'it-IT'
  | 'id-ID'
  | 'nl-NL';
