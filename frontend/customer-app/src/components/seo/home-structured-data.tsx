'use client';

import { JsonLd } from './json-ld';

export function HomeStructuredData() {
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

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dodo Services',
    url: 'https://dodoservices.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://dodoservices.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Dodo Services',
    image: 'https://dodoservices.com/images/storefront.jpg',
    '@id': 'https://dodoservices.com',
    url: 'https://dodoservices.com',
    telephone: '+1-800-123-4567',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main Street',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      postalCode: '94105',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
        ],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '16:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/dodoservices',
      'https://www.twitter.com/dodoservices',
    ],
  };

  const servicesData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Home Services',
    provider: {
      '@type': 'Organization',
      name: 'Dodo Services',
      url: 'https://dodoservices.com',
    },
    areaServed: {
      '@type': 'City',
      name: 'San Francisco',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Home Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Home Cleaning',
            url: 'https://dodoservices.com/services/cleaning',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Plumbing',
            url: 'https://dodoservices.com/services/plumbing',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Electrical',
            url: 'https://dodoservices.com/services/electrical',
          },
        },
      ],
    },
  };

  return (
    <>
      <JsonLd data={organizationData} />
      <JsonLd data={websiteData} />
      <JsonLd data={localBusinessData} />
      <JsonLd data={servicesData} />
    </>
  );
}
