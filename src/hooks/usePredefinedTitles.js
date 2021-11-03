/* eslint-disable no-console */
import { useCallback, useEffect, useState } from 'react'
import { getPredefinedTitles } from 'src/services/api.service'
import { storage } from 'src/services/storage'

export const usePredefinedTitles = (problemType) => {
  const [items, setItems] = useState([])

  const fetch = useCallback(async () => {
    try {
      const cacheData = JSON.parse(storage.getItem('predefinedTitles'))
      setItems(
        cacheData.find((x) => x.name === problemType)?.question_titles_list ||
          [],
      )
    } catch (error) {
      console.log('Parse error', error)
    }

    try {
      const response = await getPredefinedTitles()
      const data = response.data?.items || []
      storage.setItem('predefinedTitles', JSON.stringify(data))
      setItems(
        data.find((x) => x.name === problemType)?.question_titles_list || [],
      )
    } catch (error) {
      console.log('Fetch error', error)
    }
  }, [problemType])


  useEffect(() => {
    fetch()
  }, [problemType])

  return items
}
