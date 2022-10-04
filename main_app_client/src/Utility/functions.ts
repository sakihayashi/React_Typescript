export interface DateTimeFormatOptions {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  localeMatcher?: 'best fit' | 'lookup';
  timeZone?: string;
  hour12?: boolean;
  hourCycle?: 'h11' | 'h12' | 'h23' | 'h24';
  formatMatcher?: 'best fit' | 'basic';
  weekday?: 'long' | 'short' | 'narrow';
  era?: 'long' | 'short' | 'narrow';
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  fractionalSecondDigits?: 0 | 1 | 2 | 3;
  timeZoneName?: 'long' | 'short';
}

export const sessionToDateString = (session) => {
  const utcMilliseconds = Math.floor(+session / 1000);
  const date = new Date(utcMilliseconds);
  const options: DateTimeFormatOptions = {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'numeric',
    second: '2-digit',
    timeZoneName: 'short',
    year: 'numeric',
  };
    // return date.toLocaleString(undefined, options);

  return new Intl.DateTimeFormat(undefined, options).format(date);
};

export const decodeBase64 = typeof atob === 'function' ? window.atob.bind(window) : (input) => {
  const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  let output = '';
  // tslint:disable-next-line:one-variable-per-declaration
  let chr1; let chr2; let chr3;
  // tslint:disable-next-line:one-variable-per-declaration
  let enc1; let enc2; let enc3; let enc4;
  let i = 0;
  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4); // eslint-disable-line no-bitwise
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2); // eslint-disable-line no-bitwise
    chr3 = ((enc3 & 3) << 6) | enc4; // eslint-disable-line no-bitwise

    output = output + String.fromCharCode(chr1);

    if (enc3 !== 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output = output + String.fromCharCode(chr3);
    }
  } while (i < input.length);
  return output;
};

export const intArrayFromBase64 = (s) => {
  try {
    const decoded = decodeBase64(s);
    const bytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; ++i) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    throw new Error('Converting base64 string to bytes failed.');
  }
};
