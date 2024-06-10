export const tipoContrato = {
  1: 'PLANTA PERMANENTE',
  2: 'CONTRATADO'
}

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

export const getTipoContrato = (id) => {
  return tipoContrato[id] || ''
}
