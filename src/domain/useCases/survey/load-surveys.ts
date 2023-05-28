import { SurveyModel } from '../../models/survey'

export interface LoadSurveys {
  load: (accountId: String) => Promise<SurveyModel[] | null>
}
