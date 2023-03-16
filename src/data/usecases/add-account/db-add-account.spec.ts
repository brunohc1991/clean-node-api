import { DbAddAccount } from './db-add-account'
import { Hasher, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valida_name',
  email: 'valid_email',
  password: 'hashed_password'
})

const makeAccountData = (): AddAccountModel => ({
  name: 'valida_name',
  email: 'valid_email',
  password: 'valid_password'
})

interface SutTypes {
  sut: DbAddAccount
  encryptStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encryptStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encryptStub, addAccountRepositoryStub)
  return {
    sut,
    encryptStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, encryptStub } = makeSut()
    const encryptSpy = jest.spyOn(encryptStub, 'hash')
    await sut.add(makeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, encryptStub } = makeSut()
    jest.spyOn(encryptStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valida_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddACcountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
