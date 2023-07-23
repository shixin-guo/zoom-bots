'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import { Cross1Icon } from '@radix-ui/react-icons';

import {
  SupportedFileSuffix,
  code2Props,
  getPropsValue,
  isMarkdownFile,
  json2Props,
  matchRealKeys,
  props2Code,
} from '@/utils/convert';
import copyToClipboard from '@/utils/copyToClipboard';
import { getFileNameAndType } from '@/utils/fileUtils';

import { Checkbox } from '@/components/ui/checkbox';

import Layout from '@/components/ui/Layout';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload } from './_components/Upload';
import { CodeBlock } from './_components/CodeBlock';
import { LanguageShortKey, languages } from './_components/LanguageSelect';

import { DownloadButton } from './_components/DownloadButton';
import { StartButton } from './_components/StartButton';

export default function Home(): JSX.Element {
  const [inputLanguage] = useState<LanguageShortKey>('en-US');
  const [outputLanguage] = useState<LanguageShortKey>('zh-CN');
  const [selectedLangs, setSelectedLangs] = useState<LanguageShortKey[]>([
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

  const tempInputCodePropsString = useRef('');

  const isSelectedAll = useMemo(() => {
    return selectedLangs.length === Object.keys(languages).length;
  }, [selectedLangs]);

  const disableStartButton = useMemo(() => {
    return !inputCode;
  }, [inputCode]);

  const multipleLanguagesWithStatus = useMemo(() => {
    return Object.values(languages)
      .filter((l) => l.shortKey !== inputLanguage)
      .map((language) => {
        const checked =
          isSelectedAll ||
          !![outputLanguage, ...selectedLangs].find(
            (l) => l === language.shortKey,
          );

        const disabled =
          isSelectedAll ||
          language.shortKey === inputLanguage ||
          language.shortKey === outputLanguage;
        return {
          ...language,
          shortKey: language.shortKey as LanguageShortKey,
          checked,
          disabled,
        };
      });
  }, [outputLanguage, inputLanguage, selectedLangs, isSelectedAll]);

  const handleUploadedFile = async (files: File[]) => {
    const input = await files[0].text();
    setInputCode(input);
    uploadRef.current = getFileNameAndType(files[0].name);
    toggleMask(false);
  };
  const handleTranslateCode = async ({
    exceptLang,
    content,
  }: {
    exceptLang: LanguageShortKey;
    content: string;
  }): Promise<void> => {
    const controller = new AbortController();
    const inputCodeProps = code2Props(
      content,
      uploadRef.current.type as SupportedFileSuffix,
    );
    tempInputCodePropsString.current = inputCodeProps;
    const inputCodePropsValue = getPropsValue(inputCodeProps);
    const response = await fetch('/api/tsProperties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        outputLanguage: exceptLang,
        inputCode: inputCodePropsValue,
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
  const handleTranslateMD = async ({
    exceptLang,
    content,
  }: {
    exceptLang: LanguageShortKey;
    content: string;
  }): Promise<void> => {
    const controller = new AbortController();

    const response = await fetch('/api/tsMarkdown', {
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
  const handleTranslate = async (selectedLang: LanguageShortKey) => {
    setOutputCode('');
    if (isMarkdownFile(uploadRef.current.type)) {
      await handleTranslateMD({
        exceptLang: selectedLang,
        content: inputCode,
      });
    } else {
      await handleTranslateCode({
        exceptLang: selectedLang,
        content: inputCode,
      });
    }
  };
  const handleTranslateMultiLanguages = async (
    selectedLangs: LanguageShortKey[],
  ): Promise<void> => {
    if (
      !Object.values(SupportedFileSuffix).includes(
        uploadRef.current.type as SupportedFileSuffix,
      )
    ) {
      alert('Please upload a valid file.');
      return;
    }

    if (!inputCode) {
      // todo
      alert('Please enter some code.');
      return;
    }
    translatedContentRef.current = {};
    setLoading(true);
    setTranslatedLangs([]);

    Promise.all(
      selectedLangs
        .filter((l) => l !== inputLanguage)
        .map(async (selectedLang) => {
          await handleTranslate(selectedLang);
        }),
    )
      .then(() => {
        const fileType = uploadRef.current.type;
        if (
          !(
            fileType === SupportedFileSuffix.MARKDOWN ||
            fileType === SupportedFileSuffix.MARKDOWN_X
          )
        ) {
          Object.keys(translatedContentRef.current).map((shortKey) => {
            let outputCode = translatedContentRef.current[shortKey];
            if (outputCode) {
              const matchRealKeysResult = matchRealKeys(
                tempInputCodePropsString.current,
                outputCode,
              );
              const json2PropsResult = json2Props(matchRealKeysResult);
              outputCode = props2Code(
                json2PropsResult,
                uploadRef.current.type as SupportedFileSuffix,
              );
              translatedContentRef.current[shortKey] = outputCode;
            }
          });
        }
        setOutputCode(translatedContentRef.current[outputLanguage]);
        toggleMask2(false);
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
  return (
    <>
      <div className="flex h-full min-h-screen flex-col items-center border-t border-gray-200 px-4 pb-20 font-sans sm:px-10">
        <div className="mb-4 flex w-full flex-col justify-between sm:flex-row sm:space-x-4">
          <div className="flex h-full flex-col justify-center space-y-2 sm:w-2/4">
            <div className="mt-4 flex h-8 items-center text-base font-bold leading-7">
              Original
            </div>
            <Tabs defaultValue="code">
              <div className="flex items-center justify-between">
                <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
                  <TabsTrigger
                    value="code"
                    className="text-muted-foreground data-[state=active]:text-foreground relative rounded-none   bg-transparent p-2 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
                  >
                    Code
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="code" className="mt-0">
                <div className="relative">
                  {isMaskVisible && (
                    <>
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-200/50">
                        {/* <Button
                          onClick={() => {
                            setInputCode('');
                            toggleMask(false);
                          }}
                        >
                          Create a Empty File
                        </Button> */}
                        <Upload onSuccess={handleUploadedFile} />
                      </div>
                    </>
                  )}
                  <CodeBlock
                    code={inputCode}
                    editable={!loading}
                    onChange={(value) => {
                      setInputCode(value);
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
            <div className="mt-4 flex h-8 items-center justify-between">
              <span className="text-base font-bold leading-7">Translation</span>
              {finished && (
                <div>
                  <StartButton
                    onClick={() => handleTranslateMultiLanguages(selectedLangs)}
                    loading={loading}
                    disabled={disableStartButton}
                  />
                  <DownloadButton
                    fileName={uploadRef.current.name}
                    fileType={uploadRef.current.type}
                    translatedContentRef={translatedContentRef}
                    disabled={loading || outputCode?.length === 0}
                    translatedLangs={translatedLangs}
                  />
                </div>
              )}
            </div>

            {/* <p className="mt-1 text-slate-400">* download as an zip file and files named look like: demo_en-US.properties</p> */}
            {/* <LanguageSelect
              language={outputLanguage}
              disabled={loading}
              onChange={handleOutputLanguageChange}
            /> */}
            {/* todo zh-CN */}
            <Tabs defaultValue="zh-CN">
              <div className="flex items-center justify-between">
                {/* todo memo */}
                {Object.values(multipleLanguagesWithStatus)
                  .filter((i) => i.checked)
                  .map((language) => {
                    return (
                      <TabsList
                        className="w-full justify-start rounded-none bg-transparent p-0"
                        key={language.shortKey}
                      >
                        <TabsTrigger
                          value={language.shortKey}
                          className="text-muted-foreground  data-[state=active]:text-foreground relative w-full justify-start rounded-none   bg-transparent p-2 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
                        >
                          {language.name}
                          <Cross1Icon className="ml-2" />
                        </TabsTrigger>
                      </TabsList>
                    );
                  })}
              </div>

              {Object.values(multipleLanguagesWithStatus)
                .filter((i) => i.checked)
                .map((language) => {
                  return (
                    <TabsContent
                      value={language.shortKey}
                      className="mt-0"
                      key={language.shortKey}
                    >
                      <div className="relative">
                        {isMaskVisible2 && (
                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-200/50">
                            <>
                              <>
                                <div className="mb-5 flex flex-wrap items-center justify-center">
                                  {Object.values(
                                    multipleLanguagesWithStatus,
                                  ).map((language) => {
                                    return (
                                      <div
                                        className="justify-space-evenly mt-2 flex items-center transition-all duration-200"
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
                                                return [
                                                  ...prev,
                                                  language.shortKey,
                                                ];
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
                                  })}
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
                                  disabled={disableStartButton}
                                  onClick={() =>
                                    handleTranslateMultiLanguages(selectedLangs)
                                  }
                                  loading={loading}
                                />
                              }
                            </div>
                          </div>
                        )}
                        <CodeBlock
                          code={
                            translatedContentRef.current?.[language.shortKey]
                          }
                        />
                      </div>
                    </TabsContent>
                  );
                })}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

Home.Layout = Layout;
