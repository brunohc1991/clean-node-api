import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

describe('DbLoadAccountByToken UseCase', () => {
  const makeDecrypter = (): Decrypter => {
    class DecrypterStub implements Decrypter {
      async decrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve('any_value'))
      }
    }
    return new DecrypterStub()
  }

  interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
  }

  const makeSut = (): SutTypes => {
    const decrypterStub = makeDecrypter()
    const sut = new DbLoadAccountByToken(decrypterStub)
    return { sut, decrypterStub }
  }
  test('Should call decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptStub = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')
    expect(decryptStub).toHaveBeenCalledWith('any_token')
  })
})
