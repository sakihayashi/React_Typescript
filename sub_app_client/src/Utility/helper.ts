import * as _ from 'lodash';

// export function operatingSystem(): string | undefined {
//     const nAgt: string = navigator.userAgent;
//     const clientStrings: Array<{s: string, r: RegExp}> = [
//         {s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/},
//         {s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/},
//         {s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/},
//         {s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/},
//         {s: 'Windows Vista', r: /Windows NT 6.0/},
//         {s: 'Windows Server 2003', r: /Windows NT 5.2/},
//         {s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/},
//         {s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/},
//         {s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/},
//         {s: 'Windows 98', r: /(Windows 98|Win98)/},
//         {s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/},
//         {s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
//         {s: 'Windows CE', r: /Windows CE/},
//         {s: 'Windows 3.11', r: /Win16/},
//         {s: 'Android', r: /Android/},
//         {s: 'Open BSD', r: /OpenBSD/},
//         {s: 'Sun OS', r: /SunOS/},
//         {s: 'Linux', r: /(Linux|X11)/},
//         {s: 'iOS', r: /(iPhone|iPad|iPod)/},
//         {s: 'Mac OS X', r: /Mac OS X/},
//         {s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
//         {s: 'QNX', r: /QNX/},
//         {s: 'UNIX', r: /UNIX/},
//         {s: 'BeOS', r: /BeOS/},
//         {s: 'OS/2', r: /OS\/2/},
//         {s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/},
//     ];
//     const cs: {s: string, r: RegExp} | undefined = clientStrings.find(({s, r}) => r.test(nAgt));
//     return (cs) ? cs.s : undefined;
// }

/**
 * Check if string only contains letters, numbers, and underscores as defined by regex "\w".
 * Warning: Upper or lower case is not checked so camelCase would also return true
 *
 * @param s string to check
 * @returns boolean
 */
export function isSnakeCase(s: string) {
    return /^\w+$/g.test(s);
}

/**
 * Search for all instances of substring in source string and replace
 *
 * @param srcString string to transform
 * @param search substring to find
 * @param replacement string to replace substring
 * @returns transformed string
 */
export function replaceAll(srcString: string, search: string, replacement: string): string {
    return srcString.replace(new RegExp(search, 'g'), replacement);
}
