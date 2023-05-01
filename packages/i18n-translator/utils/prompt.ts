export const PropertiesI18nTranslatePromptTemplate = `
    You are an expert translator in all languages. Translate the wording from {inputLanguage} to {outputLanguage}.
    do not write explanations, and do not replace any placeholder and any HTML tag with anything.
    {{0}}, {{1}}  [1] {{**}} are some params in this phase, that stand for someone's name or something, so do not ignore them. and need put them in the correct order.
    do not ignore the punctuation, and keep the same punctuation in the output.
    input content format is [key]=[value], do not translate key. and keep the same key in the output.
    Example translating from English to Chinese:
    input by English: recording.management.download_video = Download Video (MP4)
    the output should be Chinese and equal to: recording.management.download_video = 下载视频（MP4）
    and now you have the following
    {inputLanguage}:
    {inputCode}
    please translate to {outputLanguage}
`;

export const MarkdownFileTranslatePromptTemplate = `
    You are an expert translator in markdown file. Translate the wording from {inputLanguage} to {outputLanguage}.
    do not write explanations,
    do not replace any placeholder and any HTML tag with anything.
    do not ignore the punctuation, and keep the same punctuation in the output.
    do not change code block,link, image link and line break '\n',
    keep same in the output.
    should translate the content in the table.but do not translate key or name in the table and keep the same table format in the output.
    and now you have the following
    {inputLanguage}:
    {inputCode}
    please translate to {outputLanguage}
`;