/**
 * Official Government Portal Mapping
 * Provides fallback URLs when direct scheme application links are unavailable or broken.
 */

// Central government scheme portals by category
export const centralPortals: Record<string, { name: string; url: string }> = {
  "Medical & Health": { name: "National Health Mission", url: "https://nhm.gov.in" },
  "Insurance": { name: "Jan Suraksha Portal", url: "https://jansuraksha.gov.in" },
  "Welfare Board": { name: "MyScheme Portal", url: "https://www.myscheme.gov.in" },
  "Disability": { name: "Department of Empowerment of PwD", url: "https://disabilityaffairs.gov.in" },
  "Senior Citizen": { name: "NSAP Portal", url: "https://nsap.nic.in" },
  "Women Welfare": { name: "Ministry of Women & Child Development", url: "https://wcd.nic.in" },
  "Agriculture": { name: "PM-KISAN Portal", url: "https://pmkisan.gov.in" },
  "Housing": { name: "PM Awas Yojana", url: "https://pmaymis.gov.in" },
  "Employment": { name: "National Career Service", url: "https://www.ncs.gov.in" },
  "Social Justice": { name: "Ministry of Social Justice", url: "https://socialjustice.gov.in" },
  // Scholarship categories
  "Merit": { name: "National Scholarship Portal", url: "https://scholarships.gov.in" },
  "Financial": { name: "National Scholarship Portal", url: "https://scholarships.gov.in" },
  "Minority": { name: "National Scholarship Portal", url: "https://scholarships.gov.in" },
  "SC/ST": { name: "National Scholarship Portal", url: "https://scholarships.gov.in" },
  "BC/OBC": { name: "National Scholarship Portal", url: "https://scholarships.gov.in" },
  "Women": { name: "National Scholarship Portal", url: "https://scholarships.gov.in" },
  "General": { name: "National Scholarship Portal", url: "https://scholarships.gov.in" },
  "Disability_scholarship": { name: "National Scholarship Portal", url: "https://scholarships.gov.in" },
};

// State government portals
export const statePortals: Record<string, { name: string; url: string }> = {
  "Tamil Nadu": { name: "Tamil Nadu e-Sevai Portal", url: "https://www.tnesevai.tn.gov.in" },
  "Karnataka": { name: "Karnataka Seva Sindhu", url: "https://sevasindhu.karnataka.gov.in" },
  "Kerala": { name: "Kerala e-District Portal", url: "https://edistrict.kerala.gov.in" },
  "Maharashtra": { name: "Maharashtra Aaple Sarkar", url: "https://aaplesarkar.mahaonline.gov.in" },
  "Andhra Pradesh": { name: "AP Meeseva Portal", url: "https://ap.meeseva.gov.in" },
  "Telangana": { name: "Telangana MeeSeva", url: "https://ts.meeseva.telangana.gov.in" },
  "Rajasthan": { name: "Rajasthan SSO Portal", url: "https://sso.rajasthan.gov.in" },
  "West Bengal": { name: "West Bengal e-District", url: "https://edistrict.wb.gov.in" },
  "Gujarat": { name: "Digital Gujarat Portal", url: "https://www.digitalgujarat.gov.in" },
  "Odisha": { name: "Odisha e-District Portal", url: "https://edistrict.odisha.gov.in" },
  "Punjab": { name: "Punjab Sewa Portal", url: "https://connect.punjab.gov.in" },
  "Uttar Pradesh": { name: "UP e-Sathi Portal", url: "https://esathi.up.gov.in" },
  "Madhya Pradesh": { name: "MP e-District Portal", url: "https://mpedistrict.gov.in" },
  "Delhi": { name: "Delhi e-District Portal", url: "https://edistrict.delhigovt.nic.in" },
  "Bihar": { name: "Bihar Service Plus", url: "https://serviceonline.bihar.gov.in" },
  "Jharkhand": { name: "Jharkhand Jharseva Portal", url: "https://jharsewa.jharkhand.gov.in" },
  "Assam": { name: "Assam e-District Portal", url: "https://edistrict.assam.gov.in" },
  "Chhattisgarh": { name: "CG e-District Portal", url: "https://edistrict.cgstate.gov.in" },
  "Haryana": { name: "Haryana Antyodaya Saral", url: "https://saralharyana.gov.in" },
  "Uttarakhand": { name: "Uttarakhand e-District", url: "https://edistrict.uk.gov.in" },
  "Himachal Pradesh": { name: "HP e-District Portal", url: "https://edistrict.hp.gov.in" },
  "Goa": { name: "Goa Online Portal", url: "https://goaonline.gov.in" },
  "All India": { name: "MyScheme Portal", url: "https://www.myscheme.gov.in" },
};

// Universal fallback
export const universalFallback = {
  name: "MyScheme - Government of India",
  url: "https://www.myscheme.gov.in",
};

/**
 * Get the best fallback portal for a scheme/scholarship.
 */
export function getFallbackPortal(
  state: string,
  category: string,
  governmentType: string
): { name: string; url: string } {
  // For central schemes, try category-specific portal first
  if (governmentType === "Central") {
    return centralPortals[category] || universalFallback;
  }

  // For state schemes, try state portal first
  return statePortals[state] || universalFallback;
}

/**
 * Ensure URL is HTTPS
 */
export function ensureHttps(url: string): string {
  if (!url) return url;
  return url.replace(/^http:\/\//i, "https://");
}
