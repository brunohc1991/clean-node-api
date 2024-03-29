import { AuthenticationModel } from '@/domain/models/authentication'

export type AuthenticationParams = {
  email: string
  password: string
}

export type Authentication = {
  auth: (authenticationParams: AuthenticationParams) => Promise<AuthenticationModel | null>
}
