export const generateotp = (length = 6) =>
    Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
  