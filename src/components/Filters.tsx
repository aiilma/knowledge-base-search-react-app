import React from 'react'

import SelectInput from '../components/ui/SelectInput.tsx'

interface FilterOption {
  value: any
  label: string
}

interface BaseFilterConfig {
  value: any
  name: string
  onChange: (value: any) => void
  isLoading: boolean
  isDisabled: boolean
}

interface InputSelectFilterConfig extends BaseFilterConfig {
  type: 'inputselect' | 'multi-inputselect'
  options: FilterOption[]
  placeholder: string
}

interface CustomFilterConfig extends BaseFilterConfig {
  type: 'custom'
  renderCustomFilter: () => React.ReactNode
}

export type FilterConfig = InputSelectFilterConfig | CustomFilterConfig

interface FiltersProps {
  filters: FilterConfig[]
  className?: string
}

const Filters: React.FC<FiltersProps> = ({ filters, className }) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 ${className}`}>
      {filters.map((filter, index) => (
        <div key={index} className="min-w-[200px]">
          {filter.type === 'inputselect' || filter.type === 'multi-inputselect' ? (
            <SelectInput
              options={filter.options}
              onChange={filter.onChange}
              value={filter.value}
              placeholder={filter.placeholder}
              isDisabled={filter.isDisabled}
              isMulti={filter.type === 'multi-inputselect'}
            />
          ) : filter.type === 'custom' ? (
            filter.renderCustomFilter()
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default Filters
