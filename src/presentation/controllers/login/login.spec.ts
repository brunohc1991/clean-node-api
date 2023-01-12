import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { EmailValidator, HttpRequest } from '../signup/signup-protocols'
import { LoginController } from './login'

describe('Login Controller', () => {
  interface sutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
  }

  const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        return true
      }
    }
    return new EmailValidatorStub()
  }

  const makeSut = (): sutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new LoginController(emailValidatorStub)
    return { sut, emailValidatorStub }
  }

  const makeHttpRequest = (): HttpRequest => ({
    body: {
      email: 'any_mail@email.com',
      password: 'any_password'
    }
  })
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_mail@email.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call emailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body?.email)
  })

  test('Should return 500 if emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })
})
