import { Authentication, HttpRequest } from './login-protocols'
import { MissingParamError, ServerError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { LoginController } from './login'
import { Validation } from '../signup/signup-protocols'

describe('Login Controller', () => {
  interface sutTypes {
    sut: LoginController
    authenticationStub: Authentication
    validationStub: Validation
  }

  const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
      async auth (email: string, password: string): Promise<string | null> {
        return await new Promise(resolve => resolve('any_token'))
      }
    }
    return new AuthenticationStub()
  }

  const makeFakeRequest = (): HttpRequest => ({
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_pass',
      passwordConfirmation: 'any_pass'
    }
  })

  const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
      validate (input: any): Error | null {
        return null
      }
    }
    return new ValidationStub()
  }

  const makeSut = (): sutTypes => {
    const authenticationStub = makeAuthentication()
    const validationStub = makeValidation()
    const sut = new LoginController(authenticationStub, validationStub)
    return { sut, authenticationStub, validationStub }
  }

  const makeHttpRequest = (): HttpRequest => ({
    body: {
      email: 'any_mail@email.com',
      password: 'any_password'
    }
  })

  test('Should call authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should returns 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
