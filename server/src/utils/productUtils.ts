/**
 * stripHtml
 * ---------
 * Tar in en HTML-sträng och tar bort/ersätter vissa HTML-taggar:
 * 1. <p> ersätts med en ny rad.
 * 2. </p> tas helt bort (dvs. ingen extra rad).
 * 3. <br> (inkl. valfria snedstreck) ersätts med en ny rad.
 * 4. Alla övriga HTML-taggar (ex. <div>, <span>, etc.) tas bort helt.
 * 5. Flera ny rad-tecken i följd sammanpressas till max två.
 * 6. Trim - tar bort extra whitespace i början och slutet.
 */
export function stripHtml(htmlString: string): string {
  if (!htmlString) return '';

  return (
    htmlString
      // Ta bort HTML-taggar först
      .replace(/<p[^>]*>/g, '') // Ta bort <p> taggar med attribut
      .replace(/<\/p>/g, '\n') // Ersätt </p> med newline
      .replace(/<br\s*\/?>/g, '\n') // Ersätt <br> med newline
      .replace(/<\/?[^>]+(>|$)/g, '') // Ta bort alla andra HTML-taggar
      // Hantera radbrytningar
      .replace(/\r\n/g, '\n') // Normalisera Windows radbrytningar
      .replace(/\n\n+/g, '\n') // Ersätt multipla newlines med en
      // Slutlig formatering
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join('\n')
      .trim()
  );
}
