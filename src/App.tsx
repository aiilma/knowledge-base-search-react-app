import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ArticleSearchView from './views/ArticleSearchView.tsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ArticleSearchView />

      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  )
}

export default App
