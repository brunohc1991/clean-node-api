import { AddSurvey, AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurevyRepository: AddSurveyRepository) {

  }

  async add (data: AddSurveyModel): Promise<void> {
    await this.addSurevyRepository.add(data)
  }
}
