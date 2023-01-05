import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/useCases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = { id: result.insertedId.toString(), ...accountData }
    return account
    // return await new Promise(resolve => resolve({
    //   id: 'string',
    //   name: 'any_name',
    //   email: 'any_email@mail.com',
    //   password: 'any_password'
    // }))
  }
}
