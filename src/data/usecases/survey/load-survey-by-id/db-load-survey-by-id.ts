import { LoadSurveyById, LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRespository: LoadSurveyByIdRepository) {}

  async loadById (id: string): Promise<SurveyModel | null> {
    const survey = await this.loadSurveyByIdRespository.loadById(id)
    return survey
  }
}
