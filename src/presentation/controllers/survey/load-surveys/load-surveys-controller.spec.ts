import { mockSurveysModel, throwError } from '@/domain/test'
import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys } from './load-surveys-controller-protocols'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'
import { mockLoadSurvey } from '@/presentation/test/mock-load-surveys'

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  type SutTypes = {
    loadSurveyStub: LoadSurveys
    sut: LoadSurveysController
  }

  const makeSut = (): SutTypes => {
    const loadSurveyStub = mockLoadSurvey()
    const sut = new LoadSurveysController(loadSurveyStub)
    return { sut, loadSurveyStub }
  }

  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveyStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(mockSurveysModel()))
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveyStub } = makeSut()
    jest.spyOn(loadSurveyStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 if LoadSurveys return empty', async () => {
    const { sut, loadSurveyStub } = makeSut()
    jest.spyOn(loadSurveyStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })
})
