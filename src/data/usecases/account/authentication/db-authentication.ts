import { Authentication, LoadAccountByEmailRepository, AuthenticationParams, HashCompare, Encrypter, UpdateAccessTokenRepository, AuthenticationModel } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationParams): Promise<AuthenticationModel | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (account != null) {
      const isValidPasswd = await this.hashCompare.compare(authentication.password, account.password)
      if (isValidPasswd) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return {
          accessToken,
          name: account.name
        }
      }
    }
    return null
  }
}
