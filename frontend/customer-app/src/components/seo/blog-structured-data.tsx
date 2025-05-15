'use client';

import { JsonLd } from './json-ld';

interface BlogStructuredDataProps {
  post: {
    title: string;
    description: string;
    slug: string;
    image: string;
    datePublished: string;
    dateModified: string;
    author: {
      name: string;
      url?: string;
    };
  };
}

export function BlogStructuredData({ post }: BlogStructuredDataProps) {
  const blogPostData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      '@type': 'Person',
      name: post.author.name,
      ...(post.author.url && { url: post.author.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dodo Services',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dodoservices.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://dodoservices.com/blog/${post.slug}`,
    },
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
        name: 'Blog',
        item: 'https://dodoservices.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://dodoservices.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={blogPostData} />
      <JsonLd data={breadcrumbData} />
    </>
  );
}
