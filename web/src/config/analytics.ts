// FR-23: Google Analytics 4, Google Search Console and Bing Webmaster Tools.
// Everything is off until the owner's IDs are set as environment variables (Phase 3).

const GA_ID_PATTERN = /^G-[A-Z0-9]{4,20}$/;
const VERIFICATION_PATTERN = /^[A-Za-z0-9_-]{8,100}$/;

const valid = (value: string | undefined, pattern: RegExp) =>
  value && pattern.test(value.trim()) ? value.trim() : undefined;

export const analyticsConfig = {
  gaMeasurementId: valid(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, GA_ID_PATTERN),
  googleSiteVerification: valid(process.env.GOOGLE_SITE_VERIFICATION, VERIFICATION_PATTERN),
  bingSiteVerification: valid(process.env.BING_SITE_VERIFICATION, VERIFICATION_PATTERN),
};
