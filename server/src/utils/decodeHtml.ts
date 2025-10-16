// server/src/utils/decodeHtml.ts
export function decodeHtmlEntities(input: string): string {
  if (!input) return input;

  // Fixa dubbel-encodade numeriska entiteter: &amp;#8211; -> &#8211;
  let s = input.replace(/&amp;#(\d+);/g, '&#$1;');

  // Avkoda numeriska entiteter: &#8211; -> –
  s = s.replace(/&#(\d+);/g, (_, num) => {
    const code = Number(num);
    try {
      return String.fromCodePoint(code);
    } catch {
      return _;
    }
  });

  // Avkoda &amp; -> &
  s = s.replace(/&amp;/g, '&');

  return s;
}
