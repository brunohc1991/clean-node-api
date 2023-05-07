import { Authentication, AuthenticationParams } from '@/domain/useCases/account/authentication'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string | null> {
      return await Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}
