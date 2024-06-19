export const formatCuil = (value) => {
  const cleanedValue = value.replace(/[^\d]/g, '')
  const cuilFormat = /^(\d{2})(\d{7}|\d{8})(\d{1})$/
  let formattedCuil = ''
  const maxLength = 11

  if (cleanedValue.length > maxLength) {
    return cleanedValue.slice(0, maxLength)
  }

  if (cleanedValue.length > 2 && cleanedValue.length <= 11) {
    formattedCuil = cleanedValue.replace(cuilFormat, '$1-$2-$3')
  } else {
    formattedCuil = cleanedValue
  }

  return formattedCuil
}

export const formatDni = (value) => {
  const cleanedValue = value.replace(/[^\d]/g, '')
  const dniFormat = /^(\d{1,2})(\d{3})(\d{3})$/
  let formattedDni = ''
  const maxLength = 8

  if (cleanedValue.length > maxLength) {
    return cleanedValue.slice(0, maxLength)
  }

  if (cleanedValue.length > 1 && cleanedValue.length <= 9) {
    if (cleanedValue.length <= 5) {
      formattedDni = cleanedValue.replace(dniFormat, '$1.$2.$3')
    } else {
      formattedDni = cleanedValue.replace(dniFormat, '$1.$2.$3')
    }
  } else {
    formattedDni = cleanedValue
  }

  return formattedDni
}

export const formatLegajo = (value) => {
  const cleanedValue = value.replace(/[^\d]/g, '')
  const maxLength = 5
  const legajoLimited = cleanedValue.slice(0, maxLength)

  return legajoLimited
}

export const formatCodigoPostal = (value) => {
  const cleanedValue = value.replace(/[^\d]/g, '')
  const maxLength = 4
  const codigoPostalLimited = cleanedValue.slice(0, maxLength)

  return codigoPostalLimited
}
