import { LoadSurveysRepository } from './db-load-surveys-protocols'
import { DbLoadSurveys } from './db-load-surveys'
import MockDate from 'mockdate'
import { mockSurveysModel, throwError } from '@/domain/test'
import { mockLoadSurveyRepository } from '@/data/test'

type sutTypes = {
  loadSurveysRepositoryStub: LoadSurveysRepository
  sut: DbLoadSurveys
}

const makeSut = (): sutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveyRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return {
    loadSurveysRepositoryStub,
    sut
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load('any_account_id')
    expect(loadAllSpy).toHaveBeenCalledWith('any_account_id')
  })

  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load('any_account_id')
    expect(surveys).toEqual(mockSurveysModel())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load('any_account_id')
    await expect(promise).rejects.toThrow()
  })
})
