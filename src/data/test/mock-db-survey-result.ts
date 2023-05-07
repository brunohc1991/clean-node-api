import { SaveSurveyResultParams } from '@/domain/useCases/survey-result/save-survey-result'
import { SaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResultModel } from '@/domain/test'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel | null> {
      return await Promise.resolve(mockSurveyResultModel())
    }
  }

  return new SaveSurveyResultRepositoryStub()
}
