import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldValidation } from './compare-field-validation'

const makeSut = (): CompareFieldValidation => {
  return new CompareFieldValidation('field', 'field_to_compare')
}

describe('CompareField Validation', () => {
  test('Should return a InvalidParamError if compare fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'text', field_to_compare: 'other_text' })
    expect(error).toEqual(new InvalidParamError('field_to_compare'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'text', field_to_compare: 'text' })
    expect(error).toBeFalsy()
  })
})
