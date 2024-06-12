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

export const formatDate = (dateString) => {
  if (!dateString) {
    return ''
  }
  const date = new Date(dateString)
  if (isNaN(date)) {
    return ''
  }
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString(undefined, options)
}

export const getTipoContrato = (id) => {
  return tipoContrato[id] || ''
}

export const getTipoRoles = (id) => {
  return tipoRoles[id] || ''
}
