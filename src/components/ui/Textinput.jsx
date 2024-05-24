import React, { useState } from 'react'
import Icon from '@/components/ui/Icon'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'

const Textinput = ({
  type,
  label,
  placeholder = 'Add placeholder', // Se establece el placeholder predeterminado
  classLabel = 'form-label',
  className = '',
  classGroup = '',
  register,
  name,
  readonly,
  value,
  error,
  icon,
  disabled,
  id,
  horizontal,
  validate,
  isMask,
  msgTooltip,
  description,
  hasicon,
  onChange,
  options,
  onFocus,
  defaultValue,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const isPasswordInput = type === 'password'

  return (
    <div
      className={`fromGroup  ${error ? 'has-error' : ''}  ${horizontal ? 'flex' : ''
        }  ${validate ? 'is-valid' : ''} `}
    >
      {label && (
        <label
          htmlFor={id}
          className={`block capitalize ${classLabel}  ${horizontal ? 'flex-0 mr-6 md:w-[100px] w-[60px] break-words' : ''
            }`}
        >
          {label}
        </label>
      )}
      <div className={`relative ${horizontal ? 'flex-1' : ''}`}>
        {name && !isMask && (
          <input
            type={isPasswordInput && !showPassword ? 'password' : 'text'} //  "text" a type
            {...register(name)}
            {...rest}
            className={`${error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} ${error ? 'has-error' : ''} form-control py-2 ${className} dark:text-white dark:placeholder-white placeholder-black-900`}
            placeholder={placeholder} // Aquí se establece el placeholder
            readOnly={readonly}
            defaultValue={defaultValue}
            disabled={disabled}
            id={id}
            onChange={onChange}
            style={{ textTransform: 'uppercase' }} // Fuerza mayúsculas
          />
        )}
        {!name && !isMask && (
          <input
            type={isPasswordInput && !showPassword ? 'password' : 'text'}
            className={`${error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} ${error ? 'has-error' : ''} form-control py-2 ${className} dark:text-white dark:placeholder-white placeholder-black-900`}
            placeholder={placeholder} // Aquí se establece el placeholder
            readOnly={readonly}
            disabled={disabled}
            defaultValue={defaultValue}
            onChange={onChange}
            id={id}
            style={{ textTransform: 'uppercase' }} // Fuerza mayúsculas
          />
        )}
        {name && isMask && (
          <Cleave
            {...register(name)}
            {...rest}
            placeholder={placeholder} // Aquí se establece el placeholder
            options={options}
            className={`${error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} ${error ? 'has-error' : ''} form-control py-2 ${className} dark:text-white dark:placeholder-white placeholder-black-900`}
            onFocus={onFocus}
            id={id}
            readOnly={readonly}
            disabled={disabled}
            onChange={onChange}
            style={{ textTransform: 'uppercase' }} // Fuerza mayúsculas
          />
        )}
        {!name && isMask && (
          <Cleave
            placeholder={placeholder} // Aquí se establece el placeholder
            options={options}
            className={`${error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} ${error ? 'has-error' : ''} form-control py-2 ${className} dark:text-white dark:placeholder-white placeholder-black-900`}
            onFocus={onFocus}
            id={id}
            readOnly={readonly}
            disabled={disabled}
            onChange={onChange}
            style={{ textTransform: 'uppercase' }} // Fuerza mayúsculas
          />
        )}
        {/* icon */}
        <div className='flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2  space-x-1 rtl:space-x-reverse'>
          {hasicon && (
            <span
              className='cursor-pointer text-secondary-500'
              onClick={handleTogglePassword}
            >
              {isPasswordInput && showPassword
                ? (
                  <Icon icon='heroicons-outline:eye-slash' />
                  )
                : (
                  <Icon icon='heroicons-outline:eye' />
                  )}
            </span>
          )}

          {error && (
            <span className='text-danger-500'>
              <Icon icon='heroicons-outline:information-circle' />
            </span>
          )}
          {validate && (
            <span className='text-success-500'>
              <Icon icon='bi:check-lg' />
            </span>
          )}
        </div>
      </div>
      {/* error and success message */}
      {error && (
        <div
          className={` mt-2 ${msgTooltip
              ? ' inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded'
              : ' text-danger-500 block text-sm'
            }`}
        >
          {error.message}
        </div>
      )}
      {/* validated and success message */}
      {validate && (
        <div
          className={` mt-2 ${msgTooltip
              ? ' inline-block bg-success-500 text-white text-[10px] px-2 py-1 rounded'
              : ' text-success-500 block text-sm'
            }`}
        >
          {validate}
        </div>
      )}
      {description && <span className='input-description'>{description}</span>}

    </div>
  )
}

export default Textinput
