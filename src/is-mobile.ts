import * as MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export const isMobile = !!md.mobile();
