import { SurveyResultModel } from '../../models/survey-result'

export type SaveSurveyResultParams = {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export type SaveSurveyResult = {
  save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel | null>
}
