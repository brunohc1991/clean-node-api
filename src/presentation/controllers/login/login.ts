import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFieds = ['email', 'password']

    for (const field of requiredFieds) {
      if (!httpRequest.body[field]) {
        return await new Promise(resolve => resolve(badRequest(new MissingParamError(field))))
      }
    }

    const { email } = httpRequest.body

    const isEmailValid = this.emailValidator.isValid(email)
    if (!isEmailValid) {
      return await new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
    }

    return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
  }
}
