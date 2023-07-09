import yaml from 'js-yaml';

export enum SupportedFileType {
  JSON = 'json',
  PROPERTIES = 'properties',
  YAML = 'yaml',
  YML = 'yml',
  TS = 'ts',
  JS = 'js',
}
export function json2Props(json: any): string {
  const ObjectJson = json;
  let result = '';
  for (const key in ObjectJson) {
    if (typeof ObjectJson[key] === 'object') {
      const subKeys = json2Props(ObjectJson[key]).split('\n');
      subKeys.forEach((subKey) => {
        if (subKey.trim()) {
          result += key + '.' + subKey + '\n';
        }
      });
    } else {
      result += key + '=' + ObjectJson[key] + '\n';
    }
  }
  return result;
}

export function props2Json(props: string): JSON {
  const result: any = {};
  const lines = props.split('\n').filter((i) => i);
  lines.forEach((line, index) => {
    const parts = line.split('=');
    const keys = parts?.[0]?.split('.').map((key) => key?.trim());
    const value = parts?.[1]?.trim();
    if (!keys || !keys.length || !value) {
      console.log(` Invalid line (${index}):: ${line} + `);
      return;
    }
    let obj = result;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        try {
          obj[key] = value;
        } catch (e) {
          console.log('line', line, 'Error', e);
        }
      } else {
        if (!obj[key]) {
          obj[key] = {};
        }
        obj = obj[key];
      }
    });
  });
  return result;
}
export function yaml2Props(yamlContent: string) {
  const YamlObject = yaml.load(yamlContent);
  return json2Props(YamlObject);
}

export function yaml2Json(yamlContent: string) {
  const YamlObject = yaml.load(yamlContent);
  return JSON.stringify(YamlObject);
}
export function props2YAML(Props: string) {
  const tempJson = props2Json(Props);
  return yaml.dump(tempJson);
}
export const code2Props = (code: string, type: SupportedFileType): string => {
  let Props = '';
  switch (type) {
    case SupportedFileType.YAML:
    case SupportedFileType.YML:
      Props = yaml2Props(code);
      break;
    case SupportedFileType.JSON:
      Props = json2Props(JSON.parse(code));
      break;
    // case 'md' |"mdx":
    // todo

    default:
      Props = code;
  }
  return Props;
};
export const Props2Code = (Props: string, type: SupportedFileType): string => {
  let code = '';
  switch (type) {
    case SupportedFileType.YAML:
    case SupportedFileType.YML:
      code = props2YAML(Props);
      break;
    case SupportedFileType.JSON:
      // todo
      code = JSON.stringify(props2Json(Props), null, 2);
      break;
    // case 'md' |"mdx":
    // todo

    default:
      code = Props;
  }
  return code;
};
export function getPropsValue(text: string): ObjectString2String {
  const lines = text.split('\n');
  const result: any = {};

  for (const [index, line] of lines.entries()) {
    const value = line.split('=')[1];
    if (value) {
      result[index] = value;
    }
  }
  return result;
}

// todo how to optimize TS type export

interface ObjectString2String {
  [key: string]: string;
}
export function matchRealKeys(
  originText: string,
  originTranslationsText: string,
): ObjectString2String {
  const lines = originText.split('\n').filter((i) => i);
  const matchedText: ObjectString2String = {};
  const translations = Object.values(JSON.parse(originTranslationsText));
  for (const line of lines) {
    const equalIndex = line.indexOf('=');
    if (equalIndex !== -1) {
      const key = line.slice(0, equalIndex);
      const translatedValue = translations.shift();
      matchedText[key] = translatedValue as string;
    }
  }

  return matchedText;
}
