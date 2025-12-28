/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Payoneer Supported Countries
 * List of countries supported by Payoneer for various operations
 */

export interface CountryInfo {
  code: string;
  name: string;
  region: string;
  currency: string;
  supported: {
    receiving: boolean;
    withdrawal: boolean;
    card: boolean;
    localBank: boolean;
  };
}

export const COUNTRIES: Record<string, CountryInfo> = {
  US: {
    code: 'US',
    name: 'United States',
    region: 'North America',
    currency: 'USD',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    region: 'Europe',
    currency: 'GBP',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    region: 'Europe',
    currency: 'EUR',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  FR: {
    code: 'FR',
    name: 'France',
    region: 'Europe',
    currency: 'EUR',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  ES: {
    code: 'ES',
    name: 'Spain',
    region: 'Europe',
    currency: 'EUR',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  IT: {
    code: 'IT',
    name: 'Italy',
    region: 'Europe',
    currency: 'EUR',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  NL: {
    code: 'NL',
    name: 'Netherlands',
    region: 'Europe',
    currency: 'EUR',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  BE: {
    code: 'BE',
    name: 'Belgium',
    region: 'Europe',
    currency: 'EUR',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  AT: {
    code: 'AT',
    name: 'Austria',
    region: 'Europe',
    currency: 'EUR',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  CH: {
    code: 'CH',
    name: 'Switzerland',
    region: 'Europe',
    currency: 'CHF',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  SE: {
    code: 'SE',
    name: 'Sweden',
    region: 'Europe',
    currency: 'SEK',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  NO: {
    code: 'NO',
    name: 'Norway',
    region: 'Europe',
    currency: 'NOK',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  DK: {
    code: 'DK',
    name: 'Denmark',
    region: 'Europe',
    currency: 'DKK',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  FI: {
    code: 'FI',
    name: 'Finland',
    region: 'Europe',
    currency: 'EUR',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  IE: {
    code: 'IE',
    name: 'Ireland',
    region: 'Europe',
    currency: 'EUR',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  PT: {
    code: 'PT',
    name: 'Portugal',
    region: 'Europe',
    currency: 'EUR',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  PL: {
    code: 'PL',
    name: 'Poland',
    region: 'Europe',
    currency: 'PLN',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  CZ: {
    code: 'CZ',
    name: 'Czech Republic',
    region: 'Europe',
    currency: 'CZK',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  HU: {
    code: 'HU',
    name: 'Hungary',
    region: 'Europe',
    currency: 'HUF',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  RO: {
    code: 'RO',
    name: 'Romania',
    region: 'Europe',
    currency: 'RON',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  BG: {
    code: 'BG',
    name: 'Bulgaria',
    region: 'Europe',
    currency: 'BGN',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  GR: {
    code: 'GR',
    name: 'Greece',
    region: 'Europe',
    currency: 'EUR',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    region: 'North America',
    currency: 'CAD',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  MX: {
    code: 'MX',
    name: 'Mexico',
    region: 'North America',
    currency: 'MXN',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  BR: {
    code: 'BR',
    name: 'Brazil',
    region: 'South America',
    currency: 'BRL',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  AR: {
    code: 'AR',
    name: 'Argentina',
    region: 'South America',
    currency: 'ARS',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  CL: {
    code: 'CL',
    name: 'Chile',
    region: 'South America',
    currency: 'CLP',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  CO: {
    code: 'CO',
    name: 'Colombia',
    region: 'South America',
    currency: 'COP',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  PE: {
    code: 'PE',
    name: 'Peru',
    region: 'South America',
    currency: 'PEN',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    region: 'Oceania',
    currency: 'AUD',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  NZ: {
    code: 'NZ',
    name: 'New Zealand',
    region: 'Oceania',
    currency: 'NZD',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    region: 'Asia',
    currency: 'JPY',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  CN: {
    code: 'CN',
    name: 'China',
    region: 'Asia',
    currency: 'CNY',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  HK: {
    code: 'HK',
    name: 'Hong Kong',
    region: 'Asia',
    currency: 'HKD',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    region: 'Asia',
    currency: 'SGD',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  KR: {
    code: 'KR',
    name: 'South Korea',
    region: 'Asia',
    currency: 'KRW',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  TW: {
    code: 'TW',
    name: 'Taiwan',
    region: 'Asia',
    currency: 'TWD',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  IN: {
    code: 'IN',
    name: 'India',
    region: 'Asia',
    currency: 'INR',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  PH: {
    code: 'PH',
    name: 'Philippines',
    region: 'Asia',
    currency: 'PHP',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  TH: {
    code: 'TH',
    name: 'Thailand',
    region: 'Asia',
    currency: 'THB',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  VN: {
    code: 'VN',
    name: 'Vietnam',
    region: 'Asia',
    currency: 'VND',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  MY: {
    code: 'MY',
    name: 'Malaysia',
    region: 'Asia',
    currency: 'MYR',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  ID: {
    code: 'ID',
    name: 'Indonesia',
    region: 'Asia',
    currency: 'IDR',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  PK: {
    code: 'PK',
    name: 'Pakistan',
    region: 'Asia',
    currency: 'PKR',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  BD: {
    code: 'BD',
    name: 'Bangladesh',
    region: 'Asia',
    currency: 'BDT',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  AE: {
    code: 'AE',
    name: 'United Arab Emirates',
    region: 'Middle East',
    currency: 'AED',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  IL: {
    code: 'IL',
    name: 'Israel',
    region: 'Middle East',
    currency: 'ILS',
    supported: { receiving: true, withdrawal: true, card: true, localBank: true },
  },
  TR: {
    code: 'TR',
    name: 'Turkey',
    region: 'Middle East',
    currency: 'TRY',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  SA: {
    code: 'SA',
    name: 'Saudi Arabia',
    region: 'Middle East',
    currency: 'SAR',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  EG: {
    code: 'EG',
    name: 'Egypt',
    region: 'Africa',
    currency: 'EGP',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  ZA: {
    code: 'ZA',
    name: 'South Africa',
    region: 'Africa',
    currency: 'ZAR',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  NG: {
    code: 'NG',
    name: 'Nigeria',
    region: 'Africa',
    currency: 'NGN',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  KE: {
    code: 'KE',
    name: 'Kenya',
    region: 'Africa',
    currency: 'KES',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  GH: {
    code: 'GH',
    name: 'Ghana',
    region: 'Africa',
    currency: 'GHS',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  UA: {
    code: 'UA',
    name: 'Ukraine',
    region: 'Europe',
    currency: 'UAH',
    supported: { receiving: true, withdrawal: true, card: false, localBank: true },
  },
  RU: {
    code: 'RU',
    name: 'Russia',
    region: 'Europe',
    currency: 'RUB',
    supported: { receiving: false, withdrawal: false, card: false, localBank: false },
  },
};

/**
 * Country options for n8n dropdown
 */
export const COUNTRY_OPTIONS = Object.entries(COUNTRIES)
  .filter(([_, info]) => info.supported.receiving)
  .map(([code, info]) => ({
    name: `${info.name} (${code})`,
    value: code,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

/**
 * Get country info by code
 */
export function getCountryInfo(code: string): CountryInfo | undefined {
  return COUNTRIES[code.toUpperCase()];
}

/**
 * Validate country code
 */
export function isValidCountry(code: string): boolean {
  return code.toUpperCase() in COUNTRIES;
}

/**
 * Get countries by region
 */
export function getCountriesByRegion(region: string): CountryInfo[] {
  return Object.values(COUNTRIES).filter(
    (country) => country.region.toLowerCase() === region.toLowerCase(),
  );
}

/**
 * Get countries with specific support
 */
export function getCountriesWithSupport(
  supportType: keyof CountryInfo['supported'],
): CountryInfo[] {
  return Object.values(COUNTRIES).filter((country) => country.supported[supportType]);
}

/**
 * Regions
 */
export const REGIONS = [
  'North America',
  'South America',
  'Europe',
  'Asia',
  'Middle East',
  'Africa',
  'Oceania',
] as const;

export type Region = (typeof REGIONS)[number];
