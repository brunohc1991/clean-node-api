import { AccountModel } from '../models/account'
import { AddAccountParams } from '../useCases/account/add-account'
import { AuthenticationParams } from '../useCases/account/authentication'

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAuthenticataio = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})
