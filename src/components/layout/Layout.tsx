import React from 'react'
import { ClipLoader } from 'react-spinners'

import DebugInfo from '../DebugInfo.tsx'

interface LayoutProps {
  isLoading: boolean
  title: string
  children: React.ReactNode
  debugData?: any
}

const Layout: React.FC<LayoutProps> = ({ title, isLoading, children, debugData }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen fade-out">
        <ClipLoader size={150} color={'#123abc'} loading={isLoading} />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">{title}</h1>
      {children}
      {debugData && (
        <>
          <hr className="my-6" />
          <DebugInfo className="mt-6 mb-6" debugData={debugData} />
        </>
      )}
    </div>
  )
}

export default Layout
