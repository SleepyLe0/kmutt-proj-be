import { MONGO_HOST, MONGO_PORT, MONGO_DATABASE, MONGO_USER, MONGO_PASSWORD } from '@config';

export const dbConnection = {
  url: `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?authSource=admin`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
};
