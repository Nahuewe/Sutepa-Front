export const tipoContrato = {
  1: 'PLANTA PERMANENTE',
  2: 'CONTRATADO'
}

export const tipoRoles = {
  1: 'ADMINISTRADOR',
  2: 'SECCIONAL',
  3: 'AFILIACIÓN',
  4: 'SUBSIDIOS',
  5: 'SOLO LECTURA'
}

export const tipoDependencias = {
  12: 'MAR DEL PLATA',
  17: 'NEUQUEN',
  20: 'SANTIAGO DEL ESTERO',
  25: 'CATAMARCA',
  26: 'LA RIOJA',
  27: 'SAN LUIS',
  28: 'RIO NEGRO',
  29: 'SANTA CRUZ',
  34: 'TIERRA DEL FUEGO'
}

export const formatDate = (dateString) => {
  if (!dateString) {
    return ''
  }

  const date = new Date(dateString)
  if (isNaN(date)) {
    return ''
  }

  const userTimezoneOffset = date.getTimezoneOffset() * 60000
  const adjustedDate = new Date(date.getTime() + userTimezoneOffset)

  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return adjustedDate.toLocaleDateString(undefined, options)
}

export const getTipoContrato = (id) => {
  return tipoContrato[id] || ''
}

export const getTipoRoles = (id) => {
  return tipoRoles[id] || ''
}

export const getTipoDependencias = (id) => {
  return tipoDependencias[id] || ''
}
