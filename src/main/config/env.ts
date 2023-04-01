export default {
  mongoUrl: process.env.MONGO_URL as string || 'mongodb://mongo:27017/clean-node-api',
  port: process.env.PORT as string || 5050,
  jwtSecret: process.env.JWT_SECRET as string || 'ç@3sdcÇ4'
}
