import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

describe('Validation Composite', () => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return new MissingParamError('field')
    }
  }

  const makeValidationStub = (): Validation => {
    return new ValidationStub()
  }

  test('Should return an error if any validation fails', () => {
    const sut = new ValidationComposite([
      makeValidationStub()
    ])
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
