export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4';

export interface TranslateBody {
  inputLanguage?: string;
  outputLanguage: string;
  inputCode: {
    [key: string]: string;
  };
  model?: OpenAIModel;
}
export interface TranslateMarkdownBody {
  inputLanguage?: string;
  outputLanguage: string;
  inputCode: string;
  model?: OpenAIModel;
  enableOptimize?: boolean;
}

export interface TranslateResponse {
  code: string;
}
