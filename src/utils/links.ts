export function getUkAffiliateLink(link: string | null | undefined): string {
  if (!link) return "#";
  // Force any amazon domain (e.g., .com, .in, etc.) to .co.uk
  return link.replace(/amazon\.[a-z]{2,3}/, "amazon.co.uk");
}
