// import { GetStaticPropsContext } from "next";
import { useMemo, useRef, useState } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Switch from "@radix-ui/react-switch";
import { CheckIcon } from "@radix-ui/react-icons";

import copyToClipboard from "@/utils/copyToClipboard";
import { CodeBlock } from "@/components/CodeBlock";
import Layout from "@/components/Layout";
import { LanguageSelect, LanguageShortKey, languages } from "@/components/LanguageSelect";
import { Upload } from "@/components/Upload";
import { TranslateBody } from "@/types/types";
import { getFileNameWithoutExtension } from "@/utils/fileUtils";

const testCode = `
recording.management.download_video = Download Video (MP4)
recording.management.download_cc = Download CC Transcript (VTT)
dashboard.user_add_conversations_to_the_playlist = {senderName} added {playListCount} conversation(s) to the playlist <span class="notification-link-name">{playlistName}</span>
dashboard.new_conversations_auto_added_to_the_playlist = {playListCount} new conversation(s) auto-added to the playlist <span class="notification-link-name">{playlistName}</span>
dashboard.notifications_will_appear_here = Notifications will appear here
analytics.over_time_tip = The percentage of conversations where {0} is mentioned over time.
analytics.mention_by_deal = Mentions by Deals Won or Lost
analytics.deal_tip = The percentage of conversations where {0} is mentioned by Deals Won or Lost.
analytics.transcript_title = {0} Mentions in {1}'s Conversations
analytics.chart_title_1 = {0} Mentioned in {1}
analytics.chart_sub_title = The percentage of conversations hosted by {0} where this indicator is mentioned.
`;
const todayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
interface handleTranslateProps {
  originLang: LanguageShortKey,
  exceptLang: LanguageShortKey,
  content: string
}
// interface StaticProps {
//   props: {
//     categories: string
//   }
// }
// export async function getStaticProps({
//   locale,
//   locales,
// }: GetStaticPropsContext):Promise<StaticProps> {
//   const config = { locale, locales };
//   return {
//     props: { categories: "index" },
//   };
// }

export default function Home(): JSX.Element {
  const [inputLanguage, setInputLanguage] = useState<LanguageShortKey>("en-US");
  const [outputLanguage, setOutputLanguage] = useState<LanguageShortKey>("zh-CN");
  const [enableMultiLang, setEnableMultiLang] = useState<boolean>(false);
  const [selectedLangs, setSelectedLangs] = useState<LanguageShortKey[]>([inputLanguage, outputLanguage]);
  const [translatedLangs, setTranslatedLangs] = useState<LanguageShortKey[]>([]);
  const [inputCode, setInputCode] = useState<string>("");
  const [outputCode, setOutputCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);

  const uploadRef = useRef("");

  const translatedContent = useRef<{
    [key: string]: string
  }>({});

  const isSelectedAll = useMemo(() => {
    return selectedLangs.length === Object.keys(languages).length;
  }, [selectedLangs]);

  const multipleLanguagesWithStatus = useMemo(() => {
    return Object.values(languages).map((language) => {
      return {
        ...language,
        shortKey: language.shortKey as LanguageShortKey,
        checked: isSelectedAll || (
          [inputLanguage, outputLanguage, ... selectedLangs].find(l => l === language.shortKey) ? true : false
        ),
        disabled: isSelectedAll || language.shortKey === inputLanguage || language.shortKey === outputLanguage,
      };
    });
  }, [outputLanguage, inputLanguage, selectedLangs, isSelectedAll]);

  const handleTranslate = async ({ originLang, exceptLang, content }: handleTranslateProps): Promise<void> => {
    if (originLang === exceptLang) {
      alert("Please select different languages.");
      return;
    }
    if (!content) {
      alert("Please enter some code.");
      return;
    }

    setOutputCode("");

    const controller = new AbortController();

    const body: TranslateBody = {
      inputLanguage: originLang,
      outputLanguage: exceptLang,
      inputCode: content,
    };

    const response = await fetch("/api/tsProperties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // setLoading(false);
      alert("Something went wrong.");
      return;
    }

    const data = response.body;

    if (!data) {
      // setLoading(false);
      alert("Something went wrong.");
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      if (exceptLang === outputLanguage) {
        setOutputCode((prevCode) => prevCode + chunkValue);
      }
      if (!translatedContent.current[exceptLang]) {
        translatedContent.current[exceptLang] = chunkValue;
      } else {
        translatedContent.current[exceptLang] += chunkValue;
      }
    }
    setTranslatedLangs((prevLangs) => [...prevLangs, exceptLang]);
  };

  const handleTranslateMultiLanguages = async(langs: LanguageShortKey[]): Promise<void> => {
    translatedContent.current = {};
    setLoading(true);
    setTranslatedLangs([]);
    Promise.all(langs.filter(l => l !== inputLanguage).map(async (lang) => {
      await handleTranslate({
        originLang: inputLanguage,
        exceptLang: lang,
        content: inputCode,
      });
    })).then(() => {
      copyToClipboard(outputCode);

    }).catch((err) => {
      alert(err);
    }).finally(() => {
      setHasTranslated(true);
      setLoading(false);
    });
  };

  const handleDownloadZip = async ():Promise<void> => {
    const zip = new JSZip();
    Object.keys(translatedContent.current).map((shortKey) => {
      if (translatedContent.current[shortKey]) {
        const fileNamePrefix = uploadRef.current || "i18n";
        const filename = `${fileNamePrefix}_${shortKey}.properties`;
        zip.file(filename, translatedContent.current[shortKey]);
      }
    });
    zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, `i18n-${todayDate()}.zip`);
    });
  };

  return (
    <>
      <div className="flex h-full min-h-screen flex-col items-center
      bg-[url('https://tailwindui.com/img/beams-home@95.jpg')]
       px-4 pb-20 sm:px-10 font-sans">
        <div className="mt-10 flex flex-col items-center justify-center sm:mt-20">
          <div className="text-4xl font-bold">I18N Translator</div>
          <div className="text-sm mt-1 text-slate-400">model: gpt-3.5-turbo</div>
        </div>

        <Upload className='w-100 pt-6 pb-5 rounded-lg' onSuccess={
          async (files) => {
            const input = await files[0].text();
            setInputCode(input);
            uploadRef.current = getFileNameWithoutExtension(files[0].name);
          }
        }/>

        <div className="mt-2 flex items-center space-x-2">
          <button
            className="w-[160px] cursor-pointer rounded-md
             bg-blue-500 px-4 py-2 font-bold
              hover:bg-blue-600 active:bg-blue-700 text-slate-50"
            onClick={() => handleTranslateMultiLanguages(selectedLangs)}
            disabled={loading}
          >
            {loading ? "Translating..." : "Start Translate"}
          </button>
        </div>
        <div className="mt-2 text-center text-xs">
          {loading
            ? `Please wait... translating : ${selectedLangs.filter(l => {
              return !translatedLangs.includes(l) && l !== inputLanguage;
            }).join(", ")}`
            : hasTranslated
              ? `[  ${translatedLangs.join(", ")}  ] translated completed. and [ ${outputLanguage} ] copied to clipboard!`
              : 'Enter some code and click "Start Translate"'}
        </div>
        <>
          <div className="flex items-center mt-2 mb-2" style={{ display: "flex", alignItems: "center" }}>
            <label className="text-[15px] leading-none" htmlFor="airplane-mode">
            Translate to multiple languages:
            </label>
            <Switch.Root
              className="ml-2 w-[42px] h-[25px] bg-slate-200 rounded-full
              relative shadow-[0_2px_10px]
              data-[state=checked]:bg-blue-500 outline-none cursor-default"
              checked={enableMultiLang}
              onCheckedChange={(checked: boolean) => {
                setEnableMultiLang(checked);
              }}
            >
              <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full
               transition-transform
              duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
          </div>
          {enableMultiLang && <>
            <div className="w-[660px] flex flex-wrap justify-start items-center mb-5">
              {Object.values(multipleLanguagesWithStatus).map((language) => {
                return <div className="flex items-center justify-space-evenly mt-2 h-6" key={language.shortKey}>
                  <Checkbox.Root
                    key={language.shortKey}
                    className="shadow-blackA7 hover:bg-violet3 flex h-[25px]
                    border-[1px] border-slate-400
                    w-[25px] appearance-none items-center justify-center
                    rounded-[6px] bg-white outline-none
                    data-[disabled]:cursor-not-allowed data-[disabled]:bg-[#9CA3AF]"
                    id="c1"
                    checked={language.checked}
                    disabled={language.disabled}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedLangs((prev) => {
                          return [...prev, language.shortKey];
                        });
                      } else {
                        setSelectedLangs((prev) => prev.filter((key) => key !== language.shortKey));
                      }
                    }}
                  >
                    <Checkbox.Indicator className="text-[black]">
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label className="pl-[8px] text-[16px] leading-none w-48" htmlFor="c1">
                    {language.name}
                    <span className="text-sm ">  ({language.shortKey})</span>
                  </label>
                </div>;
              })}
            </div>
            <div className="flex flex-wrap justify-start items-center">
              <Checkbox.Root
                className="shadow-blackA7 hover:bg-violet3 flex h-[25px] w-[25px]
                appearance-none items-center justify-center
                rounded-[6px] bg-white outline-none border-[1px] border-slate-400"
                defaultChecked={isSelectedAll}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedLangs(Object.keys(languages) as LanguageShortKey[]);
                  } else {
                    setSelectedLangs([inputLanguage, outputLanguage]);
                  }
                }}
              >
                <Checkbox.Indicator className="text-[black]">
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label className="pl-[8px] text-[16px] leading-none " htmlFor="c1">
                Select All
              </label>
            </div>
            <div className="text-sm mt-1 text-slate-400">
               * pls should click "Start Translate" button again 👆 after change selected languages.
            </div>
          </>}
        </>

        <div className="flex w-full mb-4 max-w-[1200px] flex-col justify-between sm:flex-row sm:space-x-4">
          <div className="h-full flex flex-col justify-center space-y-2 sm:w-2/4">
            <div className="text-center text-xl font-bold">Input</div>

            <LanguageSelect
              language={inputLanguage}
              disabled={loading}
              onChange={(lang) => {
                setInputLanguage(lang);
                setHasTranslated(false);
                setSelectedLangs((prev) => {
                  if (isSelectedAll) {
                    return prev;
                  }
                  return prev.filter((key) => {
                    return key !== inputLanguage;
                  });
                });
                setInputCode("");
                setOutputCode("");
              }}
            />

            <CodeBlock
              code={inputCode}
              editable={!loading}
              onChange={(value) => {
                setInputCode(value);
                setHasTranslated(false);
              }}
              onClickTestCode={() => setInputCode(testCode)}
            />
          </div>
          <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
            <div className="text-center text-xl font-bold">Preview</div>

            <LanguageSelect
              language={outputLanguage}
              disabled={loading}
              onChange={(lang) => {
                setOutputLanguage(lang);
                setSelectedLangs((prev) => {
                  if (isSelectedAll) {
                    return prev;
                  }
                  return [...prev.filter((key) => {
                    return key !== outputLanguage;
                  }), lang];
                });
                setOutputCode(translatedContent.current[lang]);
              }}
            />
            <CodeBlock code={outputCode} />
          </div>
        </div>

        <button
          className="mt-4 w-[480px] cursor-pointer rounded-md
          bg-emerald-500 px-4 py-2 font-bold
          hover:bg-emerald-600 active:bg-emerald-700
          text-slate-50
          disabled:cursor-not-allowed disabled:bg-[#9CA3AF]"
          onClick={handleDownloadZip}
          disabled={loading || outputCode?.length === 0}
        >
         ⬇️  Download Translated Files
        </button>
        <ul>
          <li></li>
        </ul>
        <p className="mt-1 text-slate-400">* download as an zip file and files named look like: demo_en-US.properties</p>
      </div>
    </>
  );
}

Home.Layout = Layout;
