import { getInstance } from '../api/instance.ts'
import { useQuery } from '@tanstack/react-query'

export const useInstanceQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['/instance/'],
    queryFn: () => getInstance(),
    enabled
  })
}
