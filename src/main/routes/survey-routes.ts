import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../facories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '../facories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeLoadSurveysController } from '../facories/controllers/survey/load-surveys/load-surveys-controller-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  const auth = adaptMiddleware(makeAuthMiddleware())
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
