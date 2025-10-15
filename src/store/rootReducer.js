import afiliado from './afiliado'
import agencia from './agencia'
import auth from './auth'
import dataAfiliado from './dataAfiliado'
import dataEstadisticas from './dataEstadisticas'
import layout from './layout'
import localidad from './localidad'
import seccional from './seccional'
import user from './user'

const rootReducer = {
  layout,
  auth,
  user,
  seccional,
  localidad,
  agencia,
  afiliado,
  dataAfiliado,
  dataEstadisticas
}
export default rootReducer
