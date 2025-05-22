// frontend/src/services/api.ts
const API_BASE_URL = 'https://shortlnk.live';

// frontend/src/services/api.ts
export interface UrlEntry {
  id: string;
  longUrl: string;
  shortUrl: string;
  shortCode: string;
  visits: number;
  createdAt: string;
  customCode: string
}

export interface ShortenResponse {
  shortCode: string;
  shortUrl: string;
}

// frontend/src/services/api.ts

export const shortenUrl = async (longUrl: string, customCode: string): Promise<ShortenResponse> => {
  console.log('📤 Sending to backend:', { longUrl, customCode });
  try {
    const response = await fetch(`${API_BASE_URL}/encode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ longUrl,customCode }),
    });

    const data = await response.json();
    console.log('📥 Received from backend:', data);
    
    if (!response.ok) throw new Error(data.error || 'Failed to shorten URL');
    return data;
  } catch (error) {
    console.error('🚨 API Error:', error);
    throw error;
  }
};

export const getUrlStats = async (shortCode: string): Promise<UrlEntry> => {
  const response = await fetch(`${API_BASE_URL}/statistic/${shortCode}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch URL stats');
  }

  return response.json();
};

export const listUrls = async (): Promise<UrlEntry[]> => {
  const response = await fetch(`${API_BASE_URL}/list`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch URL list');
  }

  return response.json();
};

export const searchUrls = async (query: string): Promise<UrlEntry[]> => {
  const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    throw new Error('Failed to search URLs');
  }

  return response.json();
};

// Utility function for the redirect endpoint (not an API call)
export const getRedirectUrl = (shortCode: string): string => {
  return `${API_BASE_URL.replace('/api', '')}/${shortCode}`;
};