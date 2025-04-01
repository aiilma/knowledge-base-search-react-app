import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter as Router } from 'react-router'
import { ToastContainer } from 'react-toastify'

import './i18n'
import ArticleSearchView from './views/ArticleSearchView.tsx'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ArticleSearchView />
      </Router>

      <ToastContainer hideProgressBar={true} />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  )
}

export default App
