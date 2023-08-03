export function splitJSON(
  json: { [key: string]: string },
  maxCharacters: number,
): { [key: string]: string }[] {
  const result: { [key: string]: string }[] = [];
  let currentObject: { [key: string]: string } = {};
  let currentCharacters = 0;

  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      const value = json[key];
      const keyValueLength = key.length + value.length;

      if (currentCharacters + keyValueLength > maxCharacters) {
        result.push(currentObject);
        currentObject = {};
        currentCharacters = 0;
      }

      currentObject[key] = value;
      currentCharacters += keyValueLength;
    }
  }

  if (Object.keys(currentObject).length > 0) {
    result.push(currentObject);
  }

  return result;
}
