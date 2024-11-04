import { useEffect, useState } from 'react'

const PREFIX = 'game-one'

const useLocalStorage = (key, initialValue = '') => {
  key = PREFIX + key
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(key)
    if (jsonValue != null) {
      return JSON.parse(jsonValue)
    }
    if (typeof initialValue === 'function') {
      return initialValue()
    }
    return initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorage
