import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { intersection } from 'lodash';
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const b64EncodeUnicode = (str: string) => {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(
    encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode(Number('0x' + p1));
      },
    ),
  );
};
// const b64EncodeUnicode = (str: string) => {
//   // Going backwards: from bytestream, to percent-encoding, to original string.
//   return btoa(
//     encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
//       String.fromCharCode(Number('0x' + p1)),
//     ),
//   );
// };

export const b64DecodeUnicode = (str: string) => {
  return decodeURIComponent(
    atob(str)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );
};

export const isMobileDevice = () => {
  return (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  );
};
export const copyToClipboard = (text: string): void => {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
//   createZoomNode: function (id: string, url: string) {
//     const zoomIframe = document.createElement('iframe');
//     zoomIframe.id = id;
//     zoomIframe.sandbox =
//       'allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox';
//     zoomIframe.allow = 'microphone; camera; fullscreen;';
//     zoomIframe.src = url;
//     zoomIframe.style = '';
//     if (typeof document.body.append === 'function') {
//       document.body.append(zoomIframe);
//     } else {
//       document.body.appendChild(zoomIframe);
//     }
//   },
export const getCurrentDomain = () => {
  return (
    window.location.protocol +
    '//' +
    window.location.hostname +
    ':' +
    window.location.port
  );
};

export const serialize = (obj: Record<string, any>) => {
  const keyOrderArr = [
    'name',
    'mn',
    'email',
    'pwd',
    'role',
    'lang',
    'signature',
    'china',
  ];

  const tmpInterArr = intersection(keyOrderArr, Object.keys(obj));
  const sortedObj: any[] = [];
  keyOrderArr.forEach((key) => {
    if (tmpInterArr.includes(key)) {
      sortedObj.push([key, obj[key]]);
    }
  });
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      if (!tmpInterArr.includes(key)) {
        sortedObj.push([key, obj[key]]);
      }
    });
  const tmpSortResult = ((sortedObj) => {
    const str = [];
    for (const p in sortedObj) {
      if (typeof sortedObj[p][1] !== 'undefined') {
        str.push(
          encodeURIComponent(sortedObj[p][0]) +
            '=' +
            encodeURIComponent(sortedObj[p][1]),
        );
      }
    }
    return str.join('&');
  })(sortedObj);
  return tmpSortResult;
};

const detectOS = () => {
  const sUserAgent = navigator.userAgent;
  const isWin =
    navigator.platform === 'Win32' || navigator.platform === 'Windows';
  const isMac =
    navigator.platform === 'Mac68K' ||
    navigator.platform === 'MacPPC' ||
    navigator.platform === 'Macintosh' ||
    navigator.platform === 'MacIntel';
  if (isMac) return 'Mac';
  const isUnix = navigator.platform === 'X11' && !isWin && !isMac;
  if (isUnix) return 'Unix';
  const isLinux = String(navigator.platform).indexOf('Linux') > -1;
  if (isLinux) return 'Linux';
  if (isWin) {
    const isWin2K =
      sUserAgent.indexOf('Windows NT 5.0') > -1 ||
      sUserAgent.indexOf('Windows 2000') > -1;
    if (isWin2K) return 'Win2000';
    const isWinXP =
      sUserAgent.indexOf('Windows NT 5.1') > -1 ||
      sUserAgent.indexOf('Windows XP') > -1;
    if (isWinXP) return 'WinXP';
    const isWin2003 =
      sUserAgent.indexOf('Windows NT 5.2') > -1 ||
      sUserAgent.indexOf('Windows 2003') > -1;
    if (isWin2003) return 'Win2003';
    const isWinVista =
      sUserAgent.indexOf('Windows NT 6.0') > -1 ||
      sUserAgent.indexOf('Windows Vista') > -1;
    if (isWinVista) return 'WinVista';
    const isWin7 =
      sUserAgent.indexOf('Windows NT 6.1') > -1 ||
      sUserAgent.indexOf('Windows 7') > -1;
    if (isWin7) return 'Win7';
    const isWin10 =
      sUserAgent.indexOf('Windows NT 10') > -1 ||
      sUserAgent.indexOf('Windows 10') > -1;
    if (isWin10) return 'Win10';
  }
  return 'other';
};

const detectIE = () => {
  const ua = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  const msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return 'IE' + parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  const trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf('rv:');
    return 'IE' + parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  const edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return 'Edge' + parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  return false;
};

const getBrowserInfo = () => {
  const agent = navigator.userAgent.toLowerCase();
  const regStr_ff = /firefox\/[\d.]+/gi;
  const regStr_chrome = /chrome\/[\d.]+/gi;
  const regStrChrome2 = /ipad; cpu os (\d+_\d+)/gi;
  const regStr_saf = /version\/[\d.]+/gi;
  const regStr_saf2 = /safari\/[\d.]+/gi;
  const regStr_edg = /edg\/[\d.]+/gi;

  // firefox
  if (agent.indexOf('firefox') > 0) {
    return agent.match(regStr_ff);
  }

  // Safari
  if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
    let tmpInfo = 'safari/unknow' || agent.match(regStr_saf);
    const tmpInfo2 = agent.match(regStr_saf2);
    if (tmpInfo) {
      tmpInfo = tmpInfo.toString().replace('version', 'safari');
    }
    if (tmpInfo2) {
      tmpInfo = tmpInfo2.toString().replace('version', 'safari');
    }
    return tmpInfo;
  }

  // IE / Eege
  const tmpIsIE = detectIE();
  if (tmpIsIE) {
    return tmpIsIE;
  }
  // Chrome
  if (agent.indexOf('chrome') > 0) {
    return agent.match(regStr_chrome);
  }

  return 'other';
};

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const extractHostname = (url: string) => {
  let hostname;
  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }
  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];
  return hostname;
};

const getDomainName = (hostName: string) => {
  return hostName.substring(
    hostName.lastIndexOf('.', hostName.lastIndexOf('.') - 1) + 1,
  );
};

const setCookie = (cname: string, cvalue: string) => {
  const exdays = 1;
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
};

const getCookie = (cname: string) => {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

const deleteAllCookies = () => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

const isSupportWebCodecs = () => {
  return typeof (window as any).MediaStreamTrackProcessor === 'function';
};

export {
  detectOS,
  detectIE,
  getBrowserInfo,
  getRandomInt,
  extractHostname,
  getDomainName,
  setCookie,
  getCookie,
  deleteAllCookies,
  isSupportWebCodecs,
};
