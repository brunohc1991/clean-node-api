import { LoadSurveyResultRepository, SaveSurveyResult, SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly savesurveyResultRepository: SaveSurveyResultRepository, private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel | null> {
    await this.savesurveyResultRepository.save(data)
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId)
    return surveyResult
  }
}
