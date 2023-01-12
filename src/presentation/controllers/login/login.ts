import { Authentication } from '../../../domain/useCases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFieds = ['email', 'password']

      for (const field of requiredFieds) {
        if (!httpRequest.body[field]) {
          return await new Promise(resolve => resolve(badRequest(new MissingParamError(field))))
        }
      }
      const { email, password } = httpRequest.body
      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return await new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
      }

      const token = await this.authentication.auth(email, password)

      return ok(token)
    } catch (error) {
      return serverError(error)
    }
  }
}
