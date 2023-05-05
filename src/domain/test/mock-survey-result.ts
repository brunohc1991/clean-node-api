import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../useCases/survey-result/save-survey-result'

export const mockSaveSurveyResultData = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'ant_survey_id',
  answer: 'any_answaer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => Object.assign({}, mockSaveSurveyResultData(), {
  id: 'any_id'
})
