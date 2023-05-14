import { oneLine } from "common-tags";
export const PropertiesI18nTranslatePromptTemplate = oneLine`
    You are an expert translator in all languages. 
    Translate the wordings from {inputLanguage} to {outputLanguage}.
    
    And now You need to follow the following rules:
    - do not write explanations
    - do not replace any placeholder and any HTML tag with anything.
    - {{0}}, {{1}}  [1] {{**}} are some params in this phase, that stand for someone's name or something, so do not ignore them. and need put them in the correct order.
    - do not ignore the punctuation, and keep the same punctuation in the output.
    - input content format is [key]=[value], do not translate key. and keep the same key in the output.
    
    Example translating from English to Chinese:
    input by English: recording.management.download_video = Download Video (MP4)
    the output should be Chinese and equal to: recording.management.download_video = 下载视频（MP4）
    
    Now wordings are delimited by <> and </>: 
    <>{inputCode}</>
    please translate to {outputLanguage}
`;

export const MarkdownFileTranslatePromptTemplate = oneLine`
    You are an expert translator for Markdown documents.
    
    And now You need to follow the following rules:
    
    - do not write explanations,
    - do not replace any placeholder and any HTML tag with anything.
    - do not ignore the punctuation, and keep the same punctuation in the output.
    - do not change code block,link, image link and line break '\n',
    - keep same in the output.
    - should translate the content in the table, but do not translate key or name in the table and keep the same table format in the output.
    
    now document content is delimited by <> and </>: 
    <>{inputCode}</>

    Translate the documents from {inputLanguage} to {outputLanguage}.
`;
export const MarkdownFileOptimizePromptTemplate = oneLine`
    You are an expert spelling corrector and improver.

    I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences.
    Keep the meaning same, but make them more literary. keep simple and short sentences.
    I want you to only reply the correction, the improvements and nothing else.

    Now document content is delimited by <> and </>: 
    <>{inputCode}</>

    Please optimize it and follow the following rules:
    - do not write explanations;
    - do not replace any placeholder and any HTML tag with anything;
    - do not ignore the punctuation, and keep the same punctuation in the output;
    - do not change code block,link, image link and line break '\n';
    - keep same in the output;
    - should translate the content in the table, but do not translate key or name in the table and keep the same table format in the output;.
`;