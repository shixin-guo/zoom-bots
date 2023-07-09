import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import { Cross1Icon } from '@radix-ui/react-icons';

import { Checkbox } from '@/components/ui/checkbox';

import { Switch } from '@/components/ui/switch';

import copyToClipboard from '@/utils/copyToClipboard';
import { todayDate } from '@/utils/date';
import { CodeBlock } from '@/components/CodeBlock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { LanguageShortKey, languages } from '@/components/LanguageSelect';
import { Upload } from '@/components/Upload';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { getFileNameAndType } from '@/utils/fileUtils';
import * as ConvertUtils from '@/utils/convert';
import { Button } from '@/components/ui/button';

const testCode = `
download_video = Download Video (MP4)
download_cc = Download CC Transcript (VTT)
user_add_conversations_to_the_playlist = {senderName} added {playListCount} conversation(s) to the playlist <span class="notification-link-name">{playlistName}</span>
auto_added_to_the_playlist = {playListCount} new conversation(s) auto-added to the playlist <span class="notification-link-name">{playlistName}</span>
notifications_will_appear_here = Notifications will appear here
over_time_tip = The percentage of conversations where {0} is mentioned over time.
mention_by_deal = Mentions by Deals Won or Lost
deal_tip = The percentage of conversations where {0} is mentioned by Deals Won or Lost.
transcript_title = {0} Mentions in {1}'s Conversations
chart_title = {0} Mentioned in {1}
chart_sub_title = The percentage of conversations hosted by {0} where this indicator is mentioned.
`;

const StartButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}> = ({ onClick, disabled, loading }) => {
  return (
    <Button onClick={onClick} disabled={disabled} className="my-2">
      {loading ? 'Translating...' : 'Start'}
    </Button>
  );
};

const DownloadButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  translatedLangs: LanguageShortKey[];
}> = ({ onClick, disabled, translatedLangs }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        {/* todo why react server render wrong when don't have asChild */}
        <TooltipTrigger asChild>
          <button
            className="float-right cursor-pointer rounded-md bg-emerald-500 px-2 py-2 text-slate-50 hover:bg-emerald-600 active:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            onClick={onClick}
            disabled={disabled}
          >
            Export
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <span>
            {translatedLangs.length > 0 &&
              `[ ${translatedLangs.join(', ')} ] translated completed.`}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default function Home(): JSX.Element {
  const [inputLanguage] = useState<LanguageShortKey>('en-US');
  const [outputLanguage] = useState<LanguageShortKey>('zh-CN');
  const [selectedLangs, setSelectedLangs] = useState<LanguageShortKey[]>([
    inputLanguage,
    outputLanguage,
  ]);
  const [translatedLangs, setTranslatedLangs] = useState<LanguageShortKey[]>(
    [],
  );
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [isMaskVisible, setMaskVisible] = useState(true);
  const [isMaskVisible2, setMaskVisible2] = useState(true);

  const toggleMask = useCallback((visible: boolean) => {
    setMaskVisible((prevVisible) => visible ?? !prevVisible);
  }, []);
  const toggleMask2 = useCallback((visible: boolean) => {
    setMaskVisible2((prevVisible) => visible ?? !prevVisible);
  }, []);

  const uploadRef = useRef({
    name: '',
    type: '',
  });

  const translatedContentRef = useRef<{
    [key: string]: string;
  }>({});
  const tempInput = useRef('');
  const isSelectedAll = useMemo(() => {
    return selectedLangs.length === Object.keys(languages).length;
  }, [selectedLangs]);

  const multipleLanguagesWithStatus = useMemo(() => {
    return Object.values(languages).map((language) => {
      return {
        ...language,
        shortKey: language.shortKey as LanguageShortKey,
        checked:
          isSelectedAll ||
          ([inputLanguage, outputLanguage, ...selectedLangs].find(
            (l) => l === language.shortKey,
          )
            ? true
            : false),
        disabled:
          isSelectedAll ||
          language.shortKey === inputLanguage ||
          language.shortKey === outputLanguage,
      };
    });
  }, [outputLanguage, inputLanguage, selectedLangs, isSelectedAll]);

  const handleTranslate = async ({
    exceptLang,
    content,
  }: {
    exceptLang: LanguageShortKey;
    content: {
      [key: string]: string;
    };
  }): Promise<void> => {
    if (!content) {
      alert('Please enter some code.');
      return;
    }

    setOutputCode('');

    const controller = new AbortController();

    const response = await fetch('/api/tsPropertiesProd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        outputLanguage: exceptLang,
        inputCode: content,
      }),
    });

    if (!response.ok) {
      // setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const data = response.body;
    if (!data) {
      // setLoading(false);
      alert('Something went wrong.');
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
      if (!translatedContentRef.current[exceptLang]) {
        translatedContentRef.current[exceptLang] = chunkValue;
      } else {
        translatedContentRef.current[exceptLang] += chunkValue;
      }
    }
    setTranslatedLangs((prevLangs) => [...prevLangs, exceptLang]);
  };
  const handleTranslateMultiLanguages = async (
    selectedLangs: LanguageShortKey[],
  ): Promise<void> => {
    translatedContentRef.current = {};
    setLoading(true);
    setTranslatedLangs([]);

    Promise.all(
      selectedLangs
        .filter((l) => l !== inputLanguage)
        .map(async (selectedLang) => {
          if (
            !Object.values(ConvertUtils.SupportedFileType).includes(
              uploadRef.current.type as ConvertUtils.SupportedFileType,
            )
          ) {
            alert('Please upload a valid file.');
            return;
          }
          const inputCodeProps = ConvertUtils.code2Props(
            inputCode,
            uploadRef.current.type as ConvertUtils.SupportedFileType,
          );
          tempInput.current = inputCodeProps;
          const inputCodePropsValue =
            ConvertUtils.getPropsValue(inputCodeProps);
          await handleTranslate({
            exceptLang: selectedLang,
            content: inputCodePropsValue,
          });
        }),
    )
      .then(() => {
        copyToClipboard(outputCode);
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setFinished(true);
        setLoading(false);
      });
  };

  const handleDownloadZip = async (): Promise<void> => {
    const zip = new JSZip();
    Object.keys(translatedContentRef.current).map((shortKey) => {
      if (translatedContentRef.current[shortKey]) {
        const fileNamePrefix = uploadRef.current.name || 'i18n';
        const filename = `${fileNamePrefix}_${shortKey}.properties`;
        zip.file(filename, translatedContentRef.current[shortKey]);
      }
    });
    zip.generateAsync({ type: 'blob' }).then(function (blob) {
      saveAs(blob, `i18n-${todayDate()}.zip`);
    });
  };
  // const handleInputLanguageChange = useCallback(
  //   (lang: LanguageShortKey) => {
  //     setInputLanguage(lang);
  //     setSelectedLangs((prev) => {
  //       if (isSelectedAll) {
  //         return prev;
  //       }
  //       return prev.filter((key) => {
  //         return key !== inputLanguage;
  //       });
  //     });
  //     setInputCode('');
  //     setOutputCode('');
  //   },
  //   [inputLanguage, isSelectedAll],
  // );

  // const handleOutputLanguageChange = useCallback(
  //   (lang: LanguageShortKey) => {
  //     setOutputLanguage(lang);
  //     setSelectedLangs((prev) => {
  //       if (isSelectedAll) {
  //         return prev;
  //       }
  //       return [
  //         ...prev.filter((key) => {
  //           return key !== outputLanguage;
  //         }),
  //         lang,
  //       ];
  //     });
  //     setOutputCode(translatedContentRef.current[lang]);
  //   },
  //   [outputLanguage, isSelectedAll],
  // );

  const handleUploadedFile = async (files: File[]) => {
    const input = await files[0].text();
    setInputCode(input);
    uploadRef.current = getFileNameAndType(files[0].name);
    toggleMask(false);
  };

  useEffect(() => {
    if (finished) {
      Object.keys(translatedContentRef.current).map((shortKey) => {
        if (translatedContentRef.current[shortKey]) {
          translatedContentRef.current[shortKey] = ConvertUtils.Props2Code(
            ConvertUtils.json2Props(
              ConvertUtils.matchRealKeys(tempInput.current, outputCode),
            ),
            uploadRef.current.type as ConvertUtils.SupportedFileType,
          );
        }
        setOutputCode(translatedContentRef.current[outputLanguage]);
      });
      toggleMask2(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, toggleMask2]);
  return (
    <>
      <div className="flex h-full min-h-screen flex-col items-center border-t border-gray-200 bg-[url('https://tailwindui.com/img/beams-home@95.jpg')] px-4 pb-20 font-sans sm:px-10">
        <div className="mb-4 flex w-full flex-col justify-between sm:flex-row sm:space-x-4">
          <div className="flex h-full flex-col justify-center space-y-2 sm:w-2/4">
            <div className="flex h-16 items-center text-[20px] text-base font-bold leading-7">
              Original
            </div>
            <Tabs defaultValue="code">
              <div className="flex items-center justify-between pb-3">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="code"
                    className="text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
                  >
                    Code
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="code">
                <div className="relative">
                  {isMaskVisible && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-200 bg-opacity-50">
                      <Upload onSuccess={handleUploadedFile} />
                    </div>
                  )}
                  <CodeBlock
                    code={inputCode}
                    editable={!loading}
                    onChange={(value) => {
                      setInputCode(value);
                    }}
                    onClickTestCode={() => {
                      setInputCode(testCode);
                      uploadRef.current = {
                        name: 'I18N',
                        type: ConvertUtils.SupportedFileType.PROPERTIES,
                      };
                    }}
                    onClickCreateEmptyFile={() => {
                      setInputCode('');
                      toggleMask(false);
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
            <div className="flex h-16 items-center justify-between">
              <span className="text-[20px] text-base font-bold leading-7">
                Translation
              </span>
              {finished && (
                <>
                  <StartButton
                    onClick={() => handleTranslateMultiLanguages(selectedLangs)}
                    loading={loading}
                  />
                  <DownloadButton
                    onClick={handleDownloadZip}
                    disabled={loading || outputCode?.length === 0}
                    translatedLangs={translatedLangs}
                  />
                </>
              )}
            </div>

            {/* <p className="mt-1 text-slate-400">* download as an zip file and files named look like: demo_en-US.properties</p> */}
            {/* <LanguageSelect
              language={outputLanguage}
              disabled={loading}
              onChange={handleOutputLanguageChange}
            /> */}

            <Tabs defaultValue="preview">
              <div className="flex items-center justify-between pb-3">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="preview"
                    className="text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
                  >
                    Chinese
                    <Cross1Icon className="ml-2" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    className="text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
                  >
                    French
                    <Cross1Icon className="ml-2" />
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="preview">
                <div className="relative">
                  {isMaskVisible2 && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-200 bg-opacity-50">
                      <>
                        <>
                          <div className="mb-5 flex flex-wrap items-center justify-center">
                            {Object.values(multipleLanguagesWithStatus).map(
                              (language) => {
                                return (
                                  <div
                                    className="justify-space-evenly mt-2 flex h-6 items-center"
                                    key={language.shortKey}
                                  >
                                    <Checkbox
                                      key={language.shortKey}
                                      id="c1"
                                      checked={language.checked}
                                      disabled={language.disabled}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedLangs((prev) => {
                                            return [...prev, language.shortKey];
                                          });
                                        } else {
                                          setSelectedLangs((prev) =>
                                            prev.filter(
                                              (key) =>
                                                key !== language.shortKey,
                                            ),
                                          );
                                        }
                                      }}
                                    />
                                    <label
                                      className="w-48 pl-[8px] text-[16px] leading-none"
                                      htmlFor="c1"
                                    >
                                      {language.name}
                                      <span className="text-sm ">
                                        {' '}
                                        ({language.shortKey})
                                      </span>
                                    </label>
                                  </div>
                                );
                              },
                            )}
                          </div>
                          <div className="flex flex-wrap items-center justify-start">
                            <Switch
                              defaultChecked={isSelectedAll}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedLangs(
                                    Object.keys(
                                      languages,
                                    ) as LanguageShortKey[],
                                  );
                                } else {
                                  setSelectedLangs([
                                    inputLanguage,
                                    outputLanguage,
                                  ]);
                                }
                              }}
                            />

                            <label
                              className="pl-[8px] text-[16px] leading-none "
                              htmlFor="c1"
                            >
                              Select All
                            </label>
                          </div>
                        </>
                      </>
                      <div className="mt-2 flex items-center space-x-2 ">
                        {
                          <StartButton
                            onClick={() =>
                              handleTranslateMultiLanguages(selectedLangs)
                            }
                            loading={loading}
                          />
                        }
                      </div>
                    </div>
                  )}
                  <CodeBlock code={outputCode} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

Home.Layout = Layout;
