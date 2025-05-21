import { useState, useEffect } from 'react'
import { listUrls, searchUrls,  } from '../services/api'
import type  { UrlEntry } from '../services/api'

export const useUrls = () => {
  const [urls, setUrls] = useState<UrlEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUrls = async () => {
    try {
      setLoading(true)
      const data = await listUrls()
      
      console.log(data)
      setUrls(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch URLs')
    } finally {
      setLoading(false)
    }
  }

  const search = async (query: string) => {
    if (query.length < 3) {
      fetchUrls()
      return
    }
    
    try {
      setLoading(true)
      const data = await searchUrls(query)
      setUrls(data)
      setError(null)
    } catch (err) {
      setError('Failed to search URLs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUrls()
  }, [])

  return { urls, loading, error, fetchUrls, search }
}