import { default as NextImage } from "next/image";
import { useMemo, useState } from "react";

import copyToClipboard from "@/utils/copyToClipboard";
import { CodeBlock } from "@/components/CodeBlock";
import Layout from "@/components/Layout";
import { MarkdownTemplate as testCode } from "@/test/mockData";
enum Languages {
  CN = "汉语",
  EN = "English",
}

interface handleTranslateProps {
  originLang: Languages,
  exceptLang: Languages,
  content: string
}

export default function Markdown(): JSX.Element {
  const [inputCode, setInputCode] = useState<string>("");
  const [outputCode, setOutputCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [inputLang, setInputLang] = useState<Languages>(Languages.EN);
  const outputType = useMemo(() => {
    return inputLang === Languages.CN ? Languages.EN : Languages.CN;
  }, [inputLang]);
  const reverseInputAndOutput = ():void => {
    setInputLang(inputLang === Languages.CN ? Languages.EN : Languages.CN);
  };
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

    const body = {
      inputLanguage: originLang,
      outputLanguage: exceptLang,
      inputCode: content,
    };

    const response = await fetch("/api/tsMarkdown", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });
    // const response = await fetch("/api/optimizeMarkdown", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   signal: controller.signal,
    //   body: JSON.stringify(body),
    // });

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
      setOutputCode((prevCode) => prevCode + chunkValue);
    }
  };
  const convertHandler = async(): Promise<void> => {
    if (!inputCode) {
      alert("Please enter some code.");
      return;
    }
    setLoading(true);
    await handleTranslate({
      originLang: inputLang,
      exceptLang: outputType,
      content: inputCode,
    });

    copyToClipboard(outputCode);
    setLoading(false);
  };

  return (
    <>
      <div className="flex h-full min-h-screen flex-col items-center
      bg-[url('https://tailwindui.com/img/beams-home@95.jpg')]
       px-4 pb-20 sm:px-10 font-sans">
        <div className="mt-4 flex items-center space-x-2">

          <button
            className="w-[160px] cursor-pointer rounded-md
             bg-blue-500 px-4 py-2 font-bold
              hover:bg-blue-600 active:bg-blue-700 text-slate-50"
            onClick={() => convertHandler()}
            disabled={loading}
          >
            {"Start Translate"}
          </button>
        </div>
        <div className="mt-4 -mb-8 flex items-center space-x-2 z-50">
          <button
            className="cursor-pointer rounded-md
              px-4 font-bold
               text-slate-50"
            onClick={reverseInputAndOutput}
          >
            <NextImage
              className="rounded-lg"
              width={30}
              height={30}
              src={"/convert.svg"}
              alt={"Product Image"}
            />
          </button>
        </div>

        <div className="flex w-full mb-4 max-w-[1200px] flex-col justify-between sm:flex-row sm:space-x-4">
          <div className="h-full flex flex-col justify-center space-y-2 sm:w-2/4">
            <div className="text-center text-xl font-bold">{inputLang}</div>
            <CodeBlock
              code={inputCode}
              editable={!loading}
              onChange={(value) => {
                setInputCode(value);
              }}
              onClickTestCode={() => setInputCode(testCode)}
            />
          </div>
          <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
            <div className="text-center text-xl font-bold">{outputType}</div>
            <CodeBlock code={outputCode} />
          </div>
        </div>
      </div>
    </>
  );
}

Markdown.Layout = Layout;
