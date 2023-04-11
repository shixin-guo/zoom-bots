import Head from 'next/head';
import { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { CodeBlock } from '@/components/CodeBlock';
import { LanguageSelect, languages } from '@/components/LanguageSelect';
import { ModelSelect } from '@/components/ModelSelect';
import { TextBlock } from '@/components/TextBlock';
import { Upload } from '@/components/Upload';
import { OpenAIModel, TranslateBody } from '@/types/types';

export default function Home() {
  const [inputLanguage, setInputLanguage] = useState<string>('English');
  const [outputLanguage, setOutputLanguage] = useState<string>('Chinese');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);

  const handleTranslate = async () => {
    const maxCodeLength = model === 'gpt-3.5-turbo' ? 6000 : 12000;

    if (inputLanguage === outputLanguage) {
      alert('Please select different languages.');
      return;
    }

    if (!inputCode) {
      alert('Please enter some code.');
      return;
    }

    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }

    setLoading(true);
    setOutputCode('');

    const controller = new AbortController();

    const body: TranslateBody = {
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
    };

    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let code = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      code += chunkValue;

      setOutputCode((prevCode) => prevCode + chunkValue);
    }

    setLoading(false);
    setHasTranslated(true);
    copyToClipboard(code);
  };
  
  const handleDownloadZip = async () => {
    console.log('download zip');
    const zip = new JSZip();
    [outputLanguage,inputLanguage].map((lang) => {
      console.log(lang);
      const shortLanguageCode = languages.find(
        (language) => language.value === lang,
      )?.shortKey
      const fileNamePrefix = 'file_';
      console.log(shortLanguageCode);
      const filename = `${fileNamePrefix}_${shortLanguageCode}.properties`;
    
      zip.file(filename, outputCode);
    })
    zip.generateAsync({ type: 'blob' }).then(function (blob) {
      saveAs(blob, 'files.zip');
    });
  };

  const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  useEffect(() => {
    if (hasTranslated) {
      handleTranslate();
    }
  }, [outputLanguage]);

  return (
    <>
      <Head>
        <title>I18N Translator</title>
        <meta
          name="description"
          content="Use AI to translate I18N from one language to another."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full min-h-screen flex-col items-center bg-[#0E1117] px-4 pb-20 text-neutral-200 sm:px-10">
        <div className="mt-10 flex flex-col items-center justify-center sm:mt-20">
          <div className="text-4xl font-bold">I18N Translator</div>
        </div>

          <Upload className='w-100 pt-10 pb-5' onSuccess={
            async (files) => {
              const input = await files[0].text();
              setInputCode(input)
            }
          }/>
       
        <div className="mt-2 flex items-center space-x-2">
          <ModelSelect model={model} onChange={(value) => setModel(value)} />

          <button
            className="w-[140px] cursor-pointer rounded-md bg-violet-500 px-4 py-2 font-bold hover:bg-violet-600 active:bg-violet-700"
            onClick={handleTranslate}
            disabled={loading}
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>
          <button
            className="w-[140px] cursor-pointer rounded-md bg-emerald-500 px-4 py-2 font-bold hover:bg-emerald-600 active:bg-emerald-700"
            onClick={handleDownloadZip}
            disabled={loading && outputCode.length === 0}
          >
            Download
          </button>
        </div>

        <div className="mt-2 text-center text-xs">
          {loading
            ? 'Translating...'
            : hasTranslated
            ? 'Output copied to clipboard!'
            : 'Enter some code and click "Translate"'}
        </div>

        <div className="mt-6 flex w-full max-w-[1200px] flex-col justify-between sm:flex-row sm:space-x-4">
          <div className="h-100 flex flex-col justify-center space-y-2 sm:w-2/4">
            <div className="text-center text-xl font-bold">Input</div>

            <LanguageSelect
              language={inputLanguage}
              onChange={(value) => {
                setInputLanguage(value);
                setHasTranslated(false);
                setInputCode('');
                setOutputCode('');
              }}
            />

            {inputLanguage === 'Natural Language' ? (
              <TextBlock
                text={inputCode}
                editable={!loading}
                onChange={(value) => {
                  setInputCode(value);
                  setHasTranslated(false);
                }}
              />
            ) : (
              <CodeBlock
                code={inputCode}
                editable={!loading}
                onChange={(value) => {
                  setInputCode(value);
                  setHasTranslated(false);
                }}
              />
            )}
          </div>
          <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
            <div className="text-center text-xl font-bold">Output</div>

            <LanguageSelect
              language={outputLanguage}
              onChange={(lang) => {
                setOutputLanguage(lang);
                setOutputCode('');
              }}
            />

            {outputLanguage === 'Natural Language' ? (
              <TextBlock text={outputCode} />
            ) : (
              <CodeBlock code={outputCode} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
