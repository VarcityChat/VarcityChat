import Logger from 'bunyan';
import mongoose from 'mongoose';
import { config } from './config';

const log: Logger = config.createLogger('setupDatabase');

export default () => {
  const connect = () => {
    mongoose
      .connect(`${process.env.DB_URL}`)
      .then(() => {
        log.info('Successfully connected to database.');
      })
      .catch((error) => {
        log.error('Error connecting to database.', error);
        return process.exit(1);
      });
  };

  connect();
  mongoose.connection.on('disconnect', connect);
};
