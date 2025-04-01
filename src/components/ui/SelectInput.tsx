import React from 'react'
import Select, { Props as SelectProps, ActionMeta, SingleValue, MultiValue } from 'react-select'

import { Locale } from '../../types/instance'

interface OptionType {
  value: Locale | number
  label: string
}

interface SelectInputProps extends Omit<SelectProps<OptionType>, 'onChange' | 'value'> {
  options: OptionType[]
  value: SingleValue<OptionType> | MultiValue<OptionType>
  onChange: (
    newValue: SingleValue<OptionType> | MultiValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => void
  placeholder: string
  isMulti?: boolean
  isDisabled?: boolean
}

const SelectInput: React.FC<SelectInputProps> = ({
  options,
  value,
  onChange,
  placeholder,
  isMulti = false,
  isDisabled = false,
  ...props
}) => {
  return (
    <Select
      options={options}
      onChange={onChange}
      value={value}
      className="w-full"
      placeholder={placeholder}
      isMulti={isMulti}
      isDisabled={isDisabled}
      {...props}
    />
  )
}

export default SelectInput
