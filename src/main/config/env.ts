export default {
  mongoUrl: process.env.MONGO_URL as string || 'mongodb://127.0.0.1:27017/clean-node-api',
  port: process.env.PORT as string || 5050,
  jwtSecret: process.env.jwtSecret as string || 'ç@3sdcÇ4'
}
