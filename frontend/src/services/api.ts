const API_BASE_URL = 'https://shortlnk.live/api';
// const API_BASE_URL = 'http://localhost:3001/api';


export interface UrlEntry {
  id: string;
  longUrl: string;
  shortUrl: string;
  shortCode: string;
  visits: number;
  createdAt: string;
  customCode: string;
}

export interface ShortenResponse {
  shortCode: string;
  shortUrl: string;
}


const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};


const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Authentication required. Please log in.');
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};


export const shortenUrl = async (longUrl: string, customCode?: string): Promise<ShortenResponse> => {
  console.log(' Sending to backend:', { longUrl, customCode });
  try {
    const response = await fetch(`${API_BASE_URL}/encode`, {
      method: 'POST',
      headers: getAuthHeaders(), 
      body: JSON.stringify({ longUrl, customCode }),
    });

    const data = await handleResponse(response);
    console.log(' Received from backend:', data);
    return data;
  } catch (error) {
    console.error(' API Error:', error);
    throw error;
  }
};


export const getUrlStats = async (shortCode: string): Promise<UrlEntry> => {
  const response = await fetch(`${API_BASE_URL}/statistic/${shortCode}`, {
    method: 'GET',
    headers: getAuthHeaders(), 
  });

  return handleResponse(response);
};


export const listUrls = async (): Promise<UrlEntry[]> => {
  const response = await fetch(`${API_BASE_URL}/list`, {
    method: 'GET',
    headers: getAuthHeaders(), 
  });

  return handleResponse(response);
};


export const searchUrls = async (query: string): Promise<UrlEntry[]> => {
  const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: getAuthHeaders(), 
  });

  return handleResponse(response);
};


export const decodeUrl = async (shortCode: string): Promise<{longUrl: string}> => {
  const response = await fetch(`${API_BASE_URL}/decode/${shortCode}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Failed to decode URL');
  }

  return response.json();
};


export const getRedirectUrl = (shortCode: string): string => {
  return `${API_BASE_URL}/${shortCode}`;
};

