import { HttpRequest, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

describe('AddSurvey Controller', () => {
  interface sutTypes {
    sut: AddSurveyController
    validationStub: Validation
  }

  const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
      validate (input: any): Error | null {
        return null
      }
    }
    return new ValidationStub()
  }

  const makeSut = (): sutTypes => {
    const validationStub = makeValidation()
    const sut = new AddSurveyController(validationStub)

    return { sut, validationStub }
  }

  const makeFakeRequest = (): HttpRequest => ({
    body: {
      question: 'any_question',
      answers: [{
        img: 'any_image',
        answer: 'any_answer'
      }]
    }
  })

  test('Should call validations with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
