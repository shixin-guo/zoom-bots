import Head from "next/head";
import { useCallback, useEffect, useState } from "react";

import { CodeBlock } from "@/components/CodeBlock";
import { TextBlock } from "@/components/TextBlock";
import { TranslateBody } from "@/types/types";

const copyToClipboard = (text: string):void => {
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

export default function Home(): JSX.Element {
  const [inputLanguage, setInputLanguage] = useState<string>("en-US");
  const [outputLanguage, setOutputLanguage] = useState<string>("zh-CN");
  const [inputCode, setInputCode] = useState<string>("");
  const [outputCode, setOutputCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);

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

        <div className="mt-2 flex items-center space-x-2">
          <button
            className="w-[160px] cursor-pointer rounded-md bg-violet-500 px-4 py-2 font-bold hover:bg-violet-600 active:bg-violet-700"
            disabled={loading}
          >
            {loading ? "Translating..." : "Start Translate"}
          </button>

        </div>
        <div className="mt-2 text-center text-xs">
          {loading
            ? "Translating..."
            : hasTranslated
              ? "Output copied to clipboard!"
              : 'Enter some code and click "Translate"'}
        </div>

        <div className="flex w-full max-w-[1200px] flex-col justify-between sm:flex-row sm:space-x-4">
          <div className="h-100 flex flex-col justify-center space-y-2 sm:w-2/4">
            <div className="text-center text-xl font-bold">Input</div>

            {inputLanguage === "Natural Language" ? (
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
            <div className="text-center text-xl font-bold">Preview</div>

            {outputLanguage === "Natural Language" ? (
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
