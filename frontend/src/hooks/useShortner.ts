import { useState } from 'react'
import { shortenUrl } from '../services/api'
import { useUrls } from './useUrls'

export function useShortener (fetchUrls: () => void) {
  
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')



  const handleShorten = async (url: string, customCode: string) => {
    try {
      const data = await shortenUrl(url, customCode)
      console.log(data)
      setSuccessMessage(`URL shortened successfully: ${data.shortUrl}`)
      fetchUrls()
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      console.error('Failed to shorten URL:', error)
      setErrorMessage(`${error}`)
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }


  return {
    handleShorten,
    successMessage,
    errorMessage,
  }
}
