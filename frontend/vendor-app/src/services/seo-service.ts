'use client';

import { API_URL } from '@/config';

// Types
interface SEOMetadata {
  id: number;
  page_type: string;
  page_identifier?: string;
  title: string;
  description: string;
  keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  structured_data?: any;
  created_at: string;
  updated_at: string;
}

// Service
export const SEOService = {
  // Get SEO metadata for a specific page
  async getMetadata(pageType: string, pageIdentifier?: string): Promise<SEOMetadata> {
    let url = `${API_URL}/api/seo-metadata/?page_type=${pageType}`;
    
    if (pageIdentifier) {
      url += `&page_identifier=${pageIdentifier}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch SEO metadata');
    }
    
    const data = await response.json();
    
    // Return the first result or a default
    return data.results && data.results.length > 0 
      ? data.results[0] 
      : {
          page_type: pageType,
          page_identifier: pageIdentifier,
          title: 'Dodo Services - Vendor Portal',
          description: 'Manage your services and bookings as a vendor on Dodo Services',
        };
  },
  
  // Get robots.txt content
  async getRobotsTxt(): Promise<string> {
    const response = await fetch(`${API_URL}/vendor/robots.txt`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch robots.txt');
    }
    
    return response.text();
  },
};
