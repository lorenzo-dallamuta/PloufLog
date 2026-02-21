import getCountryISO2 from "country-iso-3-to-2";

export const getCountryName = (ISO3: string): string => {
  const ISO2 = getCountryISO2(ISO3);
  if (!ISO2) return ISO3
  const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(ISO2);
  return countryName ?? ISO3;
};
