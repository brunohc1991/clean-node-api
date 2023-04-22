import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../facories/middlewares/auth-middleware-factory'

export const auth = adaptMiddleware(makeAuthMiddleware())
