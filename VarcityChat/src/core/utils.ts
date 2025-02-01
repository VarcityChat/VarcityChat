export const trimText = (text: string, maxLength: number = 20) => {
  return text.length > maxLength
    ? text.slice(0, maxLength - 3) + "..."
    : text.slice(0, maxLength);
};

export const capitalize = (text: string): string => {
  if (text.length === 0) return "";
  if (text.length === 1) return text[0].toUpperCase();
  return text[0].toUpperCase() + text.substring(1);
};
