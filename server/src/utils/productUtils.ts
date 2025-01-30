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
  return (
    htmlString
      // Byt ut <p> mot radbrytning
      .replace(/<p>/g, '\n')
      // Ta bort </p>
      .replace(/<\/p>/g, '')
      // Byt ut <br> (inklusive eventuellt snedstreck) mot radbrytning
      .replace(/<br\s*\/?>/g, '\n')
      // Ta bort alla övriga HTML-taggar (ex. <div>, <span>, <img>, etc.)
      .replace(/<\/?[^>]+(>|$)/g, '')
      // Sammanpressa flera ny rad-tecken till två
      .replace(/\n{2,}/g, '\n\n')
      // Trimma bort extra whitespace i början och slutet
      .trim()
  );
}
