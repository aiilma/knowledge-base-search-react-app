import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1 className="underline">123</h1>
    </QueryClientProvider>
  )
}

export default App
