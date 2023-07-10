import { FastifyInstance } from 'fastify'
import { create } from '@/http/controllers/gyms/create'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { nearby } from '@/http/controllers/gyms/nearby'
import { search } from '@/http/controllers/gyms/search'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/nearby', nearby)
  app.get('/gyms/search', search)

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
}
