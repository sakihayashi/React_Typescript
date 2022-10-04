export function sessionToDateString(session) {
  const utcMilliseconds = Math.floor(+session / 1000);
  const date = new Date(utcMilliseconds);
  const options = {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'numeric',
    second: '2-digit',
    timeZoneName: 'short',
    year: 'numeric',
  };
  return date.toLocaleString(undefined, options);
}

export const decodeBase64 = typeof atob === 'function' ? window.atob.bind(window) : (input) => {
  const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  let output = '';
  // eslint-disable-next-line one-var
  let chr1, chr2, chr3;
  // eslint-disable-next-line one-var
  let enc1, enc2, enc3, enc4;
  let i = 0;
  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    // eslint-disable-next-line no-bitwise
    chr1 = (enc1 << 2) | (enc2 >> 4);
    // eslint-disable-next-line no-bitwise
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    // eslint-disable-next-line no-bitwise
    chr3 = ((enc3 & 3) << 6) | enc4;

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

export function intArrayFromBase64(s) {
  try {
    const decoded = decodeBase64(s);
    const bytes = new Uint8Array(decoded.length);
    for (let i = 0 ; i < decoded.length ; ++i) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return bytes;
    } catch (e) {
        console.log('error', e);
        throw new Error('Converting base64 string to bytes failed.');
    }
}
