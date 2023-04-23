import 'module-alias/register'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

void MongoHelper.connect(env.mongoUrl).then(async () => {
  const app = (await import ('./config/app')).default
  app.listen(env.port, () => console.log(`server running at http://127.0.0.1:${env.port}`))
}).catch(console.error)
