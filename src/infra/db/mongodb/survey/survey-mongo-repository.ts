import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-survey-repository'
import { AddSurveyParams, AddSurveyRepository } from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import { SurveyModel } from '@/domain/models/survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async loadAll (): Promise<SurveyModel[] | null> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys: SurveyModel[] = await surveyCollection.find().toArray()
    return surveys && MongoHelper.mapCollection(surveys)
  }

  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey: SurveyModel = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }
}
