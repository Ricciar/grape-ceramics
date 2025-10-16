import { Handler } from '@netlify/functions';
import { preloadAllWooData } from '../../src/preload.js';

function decodeHtmlEntities(input: string): string {
  if (!input) return input;

  // 1) fixa dubbel-encodade numeriska entiteter: &amp;#8211; -> &#8211;
  let s = input.replace(/&amp;#(\d+);/g, '&#$1;');

  // 2) avkoda numeriska entiteter: &#8211; -> –
  s = s.replace(/&#(\d+);/g, (_, num) => {
    const code = Number(num);
    try {
      return String.fromCodePoint(code);
    } catch {
      return _;
    }
  });

  // 3) valfritt: fixa vanliga &amp; -> &
  s = s.replace(/&amp;/g, '&');

  return s;
}

export const handler: Handler = async () => {
  console.log('[CRON] Running scheduled preload...');
  await preloadAllWooData();

  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ message: 'Scheduled preload completed' }),
  };
};
