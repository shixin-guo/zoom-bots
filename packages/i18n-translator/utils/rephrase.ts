export function jsonToProperties(json: any): string {
  let result = "";
  for (const key in json) {
    if (typeof json[key] === "object") {
      const subKeys = jsonToProperties(json[key]).split("\n");
      subKeys.forEach(subKey => {
        if (subKey.trim()) {
          result += key + "." + subKey + "\n";
        }
      });
    } else {
      result += key + "=" + json[key] + "\n";
    }
  }
  return result;
}

export function propertiesToJson(properties: string): any {
  const result: any = {};
  const lines = properties.split("\n");
  lines.forEach(line => {
    const parts = line.split("=");
    const keys = parts[0].split(".");
    const value = parts[1];
    let obj = result;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        obj[key] = value;
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
