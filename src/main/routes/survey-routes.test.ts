import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection

describe('Survey Routes', () => {
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
  describe('POST /survey', () => {
    test('Should return 204 on survey', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'question',
          answers: [{
            answer: 'answer1',
            image: 'http://image-name.com'
          },
          {
            answer: 'answer2'
          }]
        })
        .expect(204)
    })
  })
})
