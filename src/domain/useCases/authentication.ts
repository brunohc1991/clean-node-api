export type AuthenticationModel = {
  email: string
  password: string
}

export type Authentication = {
  auth: (authenticationModel: AuthenticationModel) => Promise<String | null>
}
