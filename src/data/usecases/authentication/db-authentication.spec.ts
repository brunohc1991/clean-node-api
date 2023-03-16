import { DbAuthentication } from './db-authentication'
import { AccountModel, LoadAccountByEmailRepository, AuthenticationModel, HashCompare, TokenGenerator, UpdateAccessTokenRepository } from './db-authentication-protocols'

describe('DbAuthentication useCase', () => {
  const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    email: 'any_email@mail.com',
    name: 'any_name',
    password: 'hashed_password'
  })

  const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel | null> {
        return await new Promise(resolve => resolve(makeFakeAccount()))
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

  const makeFakeAuthenticataio = (): AuthenticationModel => ({
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  const makeHashCompare = (): HashCompare => {
    class HashCompareStub implements HashCompare {
      async compare (value: string, hash: string): Promise<Boolean> {
        return await new Promise(resolve => resolve(true))
      }
    }
    return new HashCompareStub()
  }

  const makeTokenGenerator = (): TokenGenerator => {
    class TokenGeneratorStub implements TokenGenerator {
      async generate (id: string): Promise<string> {
        return await new Promise(resolve => resolve('any_token'))
      }
    }
    return new TokenGeneratorStub()
  }

  const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
      async update (id: String, token: String): Promise<void> {
        return await new Promise(resolve => resolve())
      }
    }
    return new UpdateAccessTokenRepositoryStub()
  }

  interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashCompare
    tokenGeneratorStub: TokenGenerator
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  }

  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const hashComparerStub = makeHashCompare()
    const tokenGeneratorStub = makeTokenGenerator()
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
    const sut = new DbAuthentication(
      loadAccountByEmailRepositoryStub,
      hashComparerStub,
      tokenGeneratorStub,
      updateAccessTokenRepositoryStub
    )
    return { sut, loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateAccessTokenRepositoryStub }
  }

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthenticataio())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('Should throws if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticataio())
    await expect(promise).rejects.toThrow()
  })

  test('Should return if loadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValue(new Promise(resolve => resolve(null)))
    const accessToken = await sut.auth(makeFakeAuthenticataio())
    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthenticataio())
    expect(comparerSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throws if hashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticataio())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if hashCompare return false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValue(new Promise(resolve => resolve(false)))
    const accessToken = await sut.auth(makeFakeAuthenticataio())
    expect(accessToken).toBeNull()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthenticataio())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throws if hashComparer throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticataio())
    await expect(promise).rejects.toThrow()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthenticataio())
    expect(accessToken).toBe('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeAuthenticataio())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throws if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticataio())
    await expect(promise).rejects.toThrow()
  })
})
