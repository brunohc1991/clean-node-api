import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../useCases/survey-result/save-survey-result'

export const mockSaveSurveyResultData = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'ant_survey_id',
  answer: 'any_answaer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    count: 0,
    percent: 0
  },
  {
    answer: 'other_answer',
    image: 'any_image',
    count: 0,
    percent: 0
  }],
  date: new Date()
})
