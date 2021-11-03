import { useLocation } from 'react-router-dom'

export function useResource() {
  const location = useLocation()

  let resourceType = ''
  let resourceName = ''
  let resourceCode = 0

  if (location.pathname.match(/\/tests/)) {
    resourceType = 'tests'
    resourceName = 'Test'
    resourceCode = 2
  } else if (location.pathname.match(/\/practices/)) {
    resourceType = 'practices'
    resourceName = 'Practice'
    resourceCode = 1
  } else if (location.pathname.match(/\/video/)) {
    resourceType = 'video'
    resourceName = 'Video'
    resourceCode = 3
  }
  return { resourceName, resourceType, resourceCode }
}
