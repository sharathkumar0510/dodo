'use client';

import { JsonLd } from './json-ld';

interface ServiceStructuredDataProps {
  service: {
    name: string;
    description: string;
    slug: string;
    image: string;
    price?: {
      amount: number;
      currency: string;
    };
    rating?: {
      value: number;
      count: number;
    };
  };
}

export function ServiceStructuredData({ service }: ServiceStructuredDataProps) {
  const serviceData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'Dodo Services',
      url: 'https://dodoservices.com',
    },
    serviceType: service.name,
    areaServed: {
      '@type': 'City',
      name: 'San Francisco',
    },
    url: `https://dodoservices.com/services/${service.slug}`,
    image: service.image,
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price.amount,
        priceCurrency: service.price.currency,
        availability: 'https://schema.org/InStock',
      },
    }),
    ...(service.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: service.rating.value,
        ratingCount: service.rating.count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://dodoservices.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://dodoservices.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.name,
        item: `https://dodoservices.com/services/${service.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={serviceData} />
      <JsonLd data={breadcrumbData} />
    </>
  );
}
