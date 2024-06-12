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
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

export const getTipoContrato = (id) => {
  return tipoContrato[id] || ''
}

export const getTipoRoles = (id) => {
  return tipoRoles[id] || ''
}
