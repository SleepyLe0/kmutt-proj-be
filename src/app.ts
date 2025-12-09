import 'reflect-metadata';
import express from 'express';
import {
  CREDENTIALS,
  LOG_FORMAT,
  NODE_ENV,
  ORIGIN,
  PORT,
  ROUTE_PREFIX,
  SITE,
} from '@config';
import { connect, set } from 'mongoose';
import * as swaggerUiExpress from 'swagger-ui-express';
import { logger, stream } from '@utils/logger';
import errorMiddleware from '@middlewares/error.middleware';
import { dbConnection } from '@databases';
import morgan from 'morgan';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { getMetadataArgsStorage, useExpressServer } from 'routing-controllers';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import agenda from './jobs/agenda/agenda';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public routingControllersOption: {
    cors: Object;
    routePrefix: string;
    controllers: string[];
    defaultErrorHandler: false;
  };

  constructor(controllers: string[]) {
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
      if (SITE === 'dev') this.initializeSwagger();
      this.initializeErrorHandling();
    } catch (error) {
      logger.error(error);
    }
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} ========`);
      if (SITE === 'dev') {
        logger.info(`Open API docs http://localhost:${this.port}/docs/`);
        logger.info(`Open API docs for admin http://localhost:${this.port}/docs-admin/`);
      }
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
        await agenda.start();
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
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes() {
    useExpressServer(this.app, this.routingControllersOption);
  }

  private initializeSwagger() {    
    // Parse class-validator classes into JSON Schema:
    const schemas : any = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    });

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, this.routingControllersOption, {
      components: {
        schemas,
        securitySchemes: {
          basicAuth: {
            scheme: 'bearer',
            type: 'http',
          },
        },
      },
      info: {
        description: 'Generated with `routing-controllers-openapi`',
        title: 'Admission Form API',
        version: '1.0.0',
      },
    });

    const filterPaths = (spec: any, predicate: (p: string) => boolean) => ({
      ...spec,
      paths: Object.fromEntries(
        Object.entries(spec.paths || {}).filter(([path]) => predicate(path)) 
      ),
    });

    const adminSpec = filterPaths(spec, (p) => p.startsWith('/api/admin'));
    const userSpec = filterPaths(spec, (p) => !p.startsWith('/api/admin'));

    this.app.use('/docs', swaggerUiExpress.serveFiles(userSpec, {}), swaggerUiExpress.setup(userSpec))
    this.app.use('/docs-admin', swaggerUiExpress.serveFiles(adminSpec, {}), swaggerUiExpress.setup(adminSpec))
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
