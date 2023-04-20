export function getFileNameWithoutExtension(filename: string): string {
  let dotIndex = filename.lastIndexOf(".");
  if (dotIndex == -1) {
    dotIndex = filename.length;
  }
  const pathSeparatorIndex = Math.max(filename.lastIndexOf("/"), filename.lastIndexOf("\\"));
  const startIndex = pathSeparatorIndex > -1 ? pathSeparatorIndex + 1 : 0;
  return filename.slice(startIndex, dotIndex);
}
