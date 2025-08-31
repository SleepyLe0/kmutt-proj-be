import 'reflect-metadata';
import express from 'express';
import {
  CREDENTIALS,
  LOG_FORMAT,
  NODE_ENV,
  ORIGIN,
  PORT,
  ROUTE_PREFIX,
} from '@config';
import { connect, set } from 'mongoose';
import { logger, stream } from '@utils/logger';
import errorMiddleware from '@middlewares/error.middleware';
import { dbConnection } from '@databases';
import morgan from 'morgan';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { useExpressServer } from 'routing-controllers';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public routingControllersOption: {
    cors: Object;
    routePrefix: string;
    controllers: Function[];
    defaultErrorHandler: false;
  };

  constructor(controllers: Function[]) {
    try {
      this.app = express();
      this.env = NODE_ENV || 'development';
      this.port = PORT || 3000;
      this.connectToDatabase();
      this.initializeMiddlewares();

      this.routingControllersOption = {
        cors: {
          origin: ORIGIN,
          credentials: CREDENTIALS,
          allowedHeaders: [
            'X-Requested-With',
            'Content-Type',
            'Authorization',
            'g-recaptcha-token',
          ],
          methods: 'GET, OPTIONS, PUT, POST, DELETE',
          exposedHeaders: ['set-cookie'],
          preflightContinue: false,
        },
        routePrefix: ROUTE_PREFIX || '',
        controllers: controllers,
        defaultErrorHandler: false,
      };

      this.initializeRoutes();
      this.initializeErrorHandling();
    } catch (error) {
      logger.error(error);
    }
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} ========`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', false);
    }

    connect(dbConnection.url)
      .then(async () => {
        logger.info(`Connected to MongoDB!`);
      })
      .catch(err => {
        logger.error(err);
      });
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(hpp());
    this.app.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );
    this.app.use(compression());
    // this.app.use(express.json());
    // this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes() {
    useExpressServer(this.app, this.routingControllersOption);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
