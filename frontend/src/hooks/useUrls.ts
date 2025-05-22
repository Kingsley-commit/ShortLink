import { useState, useEffect, useCallback } from 'react';
import { listUrls, searchUrls, type UrlEntry } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useUrls = () => {
  const [urls, setUrls] = useState<UrlEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth(); 

  const fetchUrls = useCallback(async () => {
    
    if (!user) {
      setUrls([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let data: UrlEntry[];
      if (searchQuery && searchQuery.length >= 3) {
        data = await searchUrls(searchQuery);
      } else {
        data = await listUrls();
      }
      
      setUrls(data);
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch URLs');
      
      
      if (err instanceof Error && err.message.includes('Authentication')) {
        setUrls([]);
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery, user]);

  const search = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // this is for fetching URLs when user changes or search query changes
  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  // Clear data when user logs out
  useEffect(() => {
    if (!user) {
      setUrls([]);
      setError(null);
      setSearchQuery('');
    }
  }, [user]);

  return {
    urls,
    loading,
    error,
    fetchUrls,
    search,
  };
};