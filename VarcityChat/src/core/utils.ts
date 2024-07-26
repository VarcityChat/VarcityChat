export const trimText = (text: string, maxLength: number = 20) => {
  return text.length > maxLength
    ? text.slice(0, maxLength - 3) + "..."
    : text.slice(0, maxLength);
};
