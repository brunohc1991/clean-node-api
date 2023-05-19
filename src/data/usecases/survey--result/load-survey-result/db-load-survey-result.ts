import { LoadSurveyResult, LoadSurveyResultRepository, SurveyResultModel } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {}

  async load (surveyId: String): Promise<SurveyResultModel | null> {
    await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    return null
  }
}
