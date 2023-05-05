export type AuthenticationParams = {
  email: string
  password: string
}

export type Authentication = {
  auth: (authenticationParams: AuthenticationParams) => Promise<String | null>
}
