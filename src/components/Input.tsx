import React from 'react'

type Props = {
  className?: string
  type?: string
  placeholder?: string
  name?: string
  id?: string
  label?: string
  value?: string | number | boolean
  required?: boolean
  onChange?: Function
  onFocus?: Function
  onBlur?: Function
  children?: any
  validation?: string
  formState?: { [key: string]: any }
}

/**
 * Input is a default text-type input component
 *
 * @prop id - String - The id and for attributes for the input and label respectively
 * @prop label - String - The label text
 * @prop name - String - The name attribute for the input
 * @prop value - String - The value attribute for the input
 * @prop onChange - Function - The onChange attribute for the input
 * @prop onFocus - Function - The onFocus attribute for the input
 * @prop onBlur - Function - The onBlur attribute for the input
 * @prop placeholder - String - The placeholder attribute for the input
 * @prop children - Any - Anything additional to add under the input
 * @prop className - String - Wrapper class
 * @prop type - String - The type attribute for the input
 * @prop formState - Object - The object passed from the useForm hook. This will handle most of the other props if they are not set.
 */
const Input = (props: Props) => {
  // Instantiate props with defaults
  let {
    className = '',
    type = 'text',
    placeholder = '',
    name = '',
    id = name,
    label = '',
    value = '',
    required = false,
    onChange = () => null,
    onFocus = () => null,
    onBlur = () => null,
    children = null,
    validation = '',
    formState,
  } = props

  // Set formstate vars, but don't overwrite if passed explicitely
  if (formState) {
    if (!value) value = formState.values[name]
    if (!validation) validation = formState.errors[name]
    if (!onChange()) onChange = formState.handleChange
    if (!onBlur()) onBlur = formState.validateField
  }

  // Render label if present
  const renderLabel = () => {
    if (label) {
      return (
        <label className="input__label" htmlFor={id}>
          {label}
          {required && ' *'}
        </label>
      )
    }
  }

  // Render the input
  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <>
          {renderLabel()}
          <textarea
            placeholder={placeholder}
            name={name}
            id={id}
            className={`input__textarea ${
              validation && 'input__textarea--invalid'
            }`}
            value={value?.toString() || ''}
            required={!!required}
            onChange={(event) => onChange(event)}
            onBlur={(event) => onBlur(event)}
            onFocus={(event) => onFocus(event)}
          />
        </>
      )
    } else if (type === 'checkbox') {
      return (
        <>
          <input
            type={type}
            placeholder={placeholder}
            name={name}
            id={id}
            className="input__checkbox"
            checked={!!value}
            required={!!required}
            onChange={(event) => onChange(event)}
            onBlur={(event) => onBlur(event)}
            onFocus={(event) => onFocus(event)}
          />
          {renderLabel()}
        </>
      )
    }

    return (
      <>
        {renderLabel()}
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          id={id}
          className={`input__input ${
            validation && 'input__input--invalid'
          }`}
          value={value?.toString() || ''}
          required={!!required}
          onChange={(event) => onChange(event)}
          onBlur={(event) => onBlur(event)}
          onFocus={(event) => onFocus(event)}
        />
      </>
    )
  }

  return (
    <div className={`input ${className}`}>
      {renderInput()}
      <p className="input__validation">{validation}</p>
      {children}
    </div>
  )
}

export default Input
