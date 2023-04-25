import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }, {
            answer: 'other_answer'
          }
        ],
        date: new Date()
      })
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })
  describe('loadAll()', () => {
    test('Should loadAll surveys on success', async () => {
      const sut = makeSut()
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }, {
            answer: 'other_answer'
          }
        ],
        date: new Date()
      }, {
        question: 'other_question',
        answers: [
          {
            image: 'other_image',
            answer: 'other_answer'
          }
        ],
        date: new Date()
      }])
      const surveys = await sut.loadAll()
      expect(surveys?.length).toBe(2)
      if (surveys) {
        expect(surveys[0].id).toBeTruthy()
      }
      if (surveys) {
        expect(surveys[0].question).toEqual('any_question')
      }
      if (surveys) {
        expect(surveys[1]?.question).toEqual('other_question')
      }
    })
    test('Should loadAll empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys?.length).toBe(0)
    })
  })
  describe('loadById()', () => {
    test('Should loadById surveys on success', async () => {
      const sut = makeSut()
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }, {
            answer: 'other_answer'
          }
        ],
        date: new Date()
      })
      const id = res.ops[0]._id
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
      expect(survey?.id).toBeTruthy()
    })
  })
})
