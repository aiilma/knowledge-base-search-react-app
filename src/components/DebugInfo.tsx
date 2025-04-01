import React from 'react'

interface DebugInfoProps {
  debugData: Record<string, unknown>
  className?: string
}

const DebugInfo: React.FC<DebugInfoProps> = ({ debugData, className }) => {
  return (
    <pre className={`bg-gray-100 p-4 rounded-lg shadow-sm ${className}`}>
      {JSON.stringify(debugData, null, 2)}
    </pre>
  )
}

export default DebugInfo
