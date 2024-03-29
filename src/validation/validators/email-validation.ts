import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '../protocols/email-validator'
import { Validation } from '@/presentation/protocols'

export class EmailValidation implements Validation {
  constructor (private readonly emailValidator: EmailValidator, private readonly fieldName: string) {}

  validate (input: any): Error | null {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
    return null
  }
}
