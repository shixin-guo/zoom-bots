import yaml from 'js-yaml';

enum FileType {
  JSON = 'json',
  PROPERTIES = 'properties',
  YAML = 'yaml',
}
export function jsonToProperties(json: any): string {
  let result = '';
  for (const key in json) {
    if (typeof json[key] === 'object') {
      const subKeys = jsonToProperties(json[key]).split('\n');
      subKeys.forEach((subKey) => {
        if (subKey.trim()) {
          result += key + '.' + subKey + '\n';
        }
      });
    } else {
      result += key + '=' + json[key] + '\n';
    }
  }
  return result;
}

export function propertiesToJson(properties: string): any {
  const result: any = {};
  const lines = properties.split('\n');
  lines.forEach((line) => {
    const parts = line.split('=');
    const keys = parts?.[0]?.split('.').map((key) => key?.trim());
    const value = parts?.[1]?.trim();
    if (!keys || !keys.length || !value) {
      console.log('Invalid line: ' + line);
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
export function yamlToJson(yamlContent: string) {
  return yaml.load(yamlContent);
}

export function jsonToYAML(json: string) {
  return yaml.dump(JSON.parse(json));
}
