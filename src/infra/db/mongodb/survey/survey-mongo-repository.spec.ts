import { MongoHelper } from '../helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { AccountModel } from '@/domain/models/account'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
  })
  return MongoHelper.map(res.ops[0])
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
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
        didAnswer: false,
        date: new Date()
      })
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })
  describe('loadAll()', () => {
    test('Should loadAll surveys on success', async () => {
      const account = await makeAccount()
      const result = await surveyCollection.insertMany([{
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
      const survey = result.ops[0]
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey._id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)
      expect(surveys?.length).toBe(2)
      if (surveys) {
        expect(surveys[0].id).toBeTruthy()
        expect(surveys[0].question).toEqual('any_question')
        expect(surveys[0].didAnswer).toBe(true)
        expect(surveys[1].question).toEqual('other_question')
        expect(surveys[1].didAnswer).toBe(false)
      }
    })
    test('Should loadAll empty list', async () => {
      const account = await makeAccount()
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)
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
