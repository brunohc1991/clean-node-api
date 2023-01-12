import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols'
import { LoginController } from './login'

describe('Login Controller', () => {
  const makeSut = (): LoginController => {
    return new LoginController()
  }

  const makeHttpRequest = (): HttpRequest => ({
    body: {
      password: 'any_password'
    }
  })
  test('Should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
