// types/country-iso-3-to-2.d.ts
declare module 'country-iso-3-to-2' {
  /**
   * Convert a country code from ISO 3166-1 Alpha-3 to ISO 3166-1 Alpha-2
   * @param countryCode - ISO 3166-1 Alpha-3 country code (e.g., 'USA', 'FRA')
   * @returns ISO 3166-1 Alpha-2 country code (e.g., 'US', 'FR') or undefined if not found
   */
  export default function getCountryISO2(countryCode: string): string | undefined;
}