'use client';

import { JsonLd } from './json-ld';

export function VendorStructuredData() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dodo Services',
    url: 'https://dodoservices.com',
    logo: 'https://dodoservices.com/images/logo.png',
    sameAs: [
      'https://www.facebook.com/dodoservices',
      'https://www.twitter.com/dodoservices',
      'https://www.instagram.com/dodoservices',
      'https://www.linkedin.com/company/dodoservices',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+1-800-123-4567',
        contactType: 'customer service',
        areaServed: 'US',
        availableLanguage: ['English'],
      },
    ],
  };

  const softwareApplicationData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Dodo Services Vendor Portal',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <JsonLd data={organizationData} />
      <JsonLd data={softwareApplicationData} />
    </>
  );
}
