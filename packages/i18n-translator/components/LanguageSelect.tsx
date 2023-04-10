import type { FC } from 'react';

interface Props {
  language: string;
  onChange: (language: string) => void;
}

export const LanguageSelect: FC<Props> = ({ language, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select
      className="w-full rounded-md bg-[#1F2937] px-4 py-2 text-neutral-200"
      value={language}
      onChange={handleChange}
    >
      {languages
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
    </select>
  );
};


// "de-DE",
// "en-US",
// "es-ES",
// "fr-FR",
// "id-ID",
// "it-IT",
// "jp-JP",
// "ko-KO",
// "nl-NL",
// "pl-PL",
// "pt-PT",
// "ru-RU",
// "tr-TR",
// "vi-VN",
// "zh-CN",
// "zh-TW",


const languages = [
  { value: "English", label: "English(en-US)" },
  { value: "German", label: "German(de-DE)" },
  { value: "Chinese Simple", label: "Chinese Simple(zh-CN)" },
];
