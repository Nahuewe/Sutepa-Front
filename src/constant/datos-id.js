export const tipoDocumento = {
  DNI: 'DNI',
  PASAPORTE: 'PASAPORTE'
}

export const tipoEstadoCivl = {
  1: 'CASADO',
  2: 'CONCUBINO',
  3: 'DIVORCIADO',
  4: 'SOLTERO',
  5: 'VIUDO'
}

export const tipoDocumentoNombres = {
  1: 'ACTA DEFUNCION',
  2: 'CERTIFICADO DE MATRIMONIO',
  3: 'CERTIFICADO DE NACIMIENTO',
  4: 'CONSTANCIA DE ALUMNO REGULAR',
  5: 'FORMULARIO DE ALTA',
  6: 'FOTOCOPIA DEL DNI',
  7: 'TELEGRAMA DE BAJA'
}

export const tipoNacionalidad = {
  1: 'ARGENTINO',
  2: 'CHILENO',
  3: 'BOLIVIANO',
  4: 'PERUANO',
  5: 'PARAGUAYO',
  6: 'URUGUAYO',
  7: 'BRASILEÑO'
}

export const sexoNombres = {
  1: 'HOMBRE',
  2: 'MUJER',
  3: 'NO INFORMA'
}

export const parentescoNombres = {
  1: 'ABUELO',
  2: 'AHIJADO',
  3: 'CONCUBINO',
  4: 'CONYUGE',
  5: 'HERMANO',
  6: 'HIJO',
  7: 'MADRE',
  8: 'NIETO',
  9: 'PADRE',
  10: 'SOBRINO'
}

export const subsidioNombres = {
  1: 'APOYO ESCOLAR',
  2: 'APOYO SECUNDARIO',
  3: 'APOYO TRABAJADOR/UNIVERSITARIO',
  4: 'CASAMIENTO',
  5: 'FALLECIMIENTO DE FAMILIAR DIRECTO',
  6: 'FALLECIMIENTO DEL TITULAR',
  7: 'NACIMIENTO'
}

export const provinciasNombres = {
  1: 'Ciudad Autónoma de Buenos Aires',
  2: 'Neuquén',
  3: 'San Luis',
  4: 'Santa Fe',
  5: 'La Rioja',
  6: 'Catamarca',
  7: 'Tucumán',
  8: 'Chaco',
  9: 'Formosa',
  10: 'Santa Cruz',
  11: 'Chubut',
  12: 'Mendoza',
  13: 'Entre Ríos',
  14: 'San Juan',
  15: 'Jujuy',
  16: 'Santiago del Estero',
  17: 'Río Negro',
  18: 'Corrientes',
  19: 'Misiones',
  20: 'Salta',
  21: 'Córdoba',
  22: 'Buenos Aires',
  23: 'La Pampa',
  24: 'Tierra del Fuego, Antártida e Islas del Atlántico Sur'
}

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

export const getParentescoNameById = (id) => {
  return parentescoNombres[id] || ''
}

export const getTipoSubsidioNombre = (id) => {
  return subsidioNombres[id] || ''
}

export const getTipoSexo = (id) => {
  return sexoNombres[id] || ''
}

export const getTipoEstadoCivil = (id) => {
  return tipoEstadoCivl[id] || ''
}

export const getTipoNacionalidad = (id) => {
  return tipoNacionalidad[id] || ''
}

export const getTipoProvincia = (id) => {
  return provinciasNombres[id] || ''
}
