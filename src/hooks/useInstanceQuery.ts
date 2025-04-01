import { useQuery } from '@tanstack/react-query'

import { getInstance } from '../api/instance.ts'

export const useInstanceQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['/instance/'],
    queryFn: () => getInstance(),
    enabled
  })
}
