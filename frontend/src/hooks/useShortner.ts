import { useState } from 'react';
import { shortenUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useShortener = (onSuccess?: () => void) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth();

  const handleShorten = async (url: string, customCode?: string): Promise<void> => {
   
    if (!user) {
      setErrorMessage('Please log in to shorten URLs');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    try {
     
      setSuccessMessage('');
      setErrorMessage('');
      
      const data = await shortenUrl(url, customCode);
      setSuccessMessage(`URL shortened successfully: ${data.shortUrl}`);
      
     
      if (onSuccess) {
        onSuccess();
      }
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Failed to shorten URL:', error);
      
      let errorMsg = 'Failed to shorten URL';
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  return {
    handleShorten,
    successMessage,
    errorMessage,
  };
};