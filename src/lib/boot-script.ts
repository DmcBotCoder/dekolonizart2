import { LOCALE_STORAGE_KEY } from '@/i18n/config';
import { A11Y_STORAGE_KEY } from './a11y-settings';
import { REDUCE_MOTION_KEY } from './motion';

/**
 * Runs in <head> before first paint, so the page never flashes in the wrong state:
 *  - `reduce-motion` (in-site switch, else the OS setting) or `motion-ok`
 *  - accessibility settings as classes (text size, contrast, font, spacing, underline)
 *  - first visit to "/": go to the saved or browser language
 * `motion-ok` lets CSS hold back elements that animate in; if the reveal
 * script has not started after 4 s, everything is shown anyway.
 */
export const bootScript = `(function(){
var d=document.documentElement,c=d.classList,s;
try{s=window.localStorage}catch(e){}
function get(k){try{return s&&s.getItem(k)}catch(e){return null}}
var rm=get('${REDUCE_MOTION_KEY}');
var reduce=rm==='1'||(rm!=='0'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
c.add(reduce?'reduce-motion':'motion-ok');
try{var a=JSON.parse(get('${A11Y_STORAGE_KEY}')||'{}');
if(a.textSize===125)c.add('a11y-text-125');if(a.textSize===150)c.add('a11y-text-150');
if(a.contrast)c.add('a11y-contrast');if(a.readableFont)c.add('a11y-readable-font');
if(a.spacing)c.add('a11y-spacing');if(a.underline)c.add('a11y-underline');}catch(e){}
if(location.pathname==='/'){var l=get('${LOCALE_STORAGE_KEY}');
if(!l){var n=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||''];
for(var i=0;i<n.length;i++){var x=String(n[i]).slice(0,2).toLowerCase();if(x==='en'||x==='de'||x==='fr'){l=x;break}}}
if(l==='de'||l==='fr'){location.replace('/'+l+location.hash);return}}
if(!reduce)setTimeout(function(){if(!window.__dkReveal)c.add('reveal-all')},4000);
})();`;
