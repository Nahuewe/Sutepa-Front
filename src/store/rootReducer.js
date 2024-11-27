import layout from './layout'
import auth from './auth'
import user from './user'
import afiliado from './afiliado'
import seccional from './seccional'
import localidad from './localidad'
import agencia from './agencia'
import dataAfiliado from './dataAfiliado'
import dataEstadisticas from './dataEstadisticas'

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
