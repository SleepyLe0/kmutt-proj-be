import 'reflect-metadata';
import App from '@/app';
import validateEnv from '@utils/validateEnv';
import path from 'path';

validateEnv();

(() => {
  // Support both dev (ts-node, .ts in src) and prod (compiled .js in dist)
  const controllerGlobs = [
    path.join(__dirname, 'controllers', '**', '*.js'),
    path.join(__dirname, 'controllers', '**', '*.ts'),
  ];

  const app = new App(controllerGlobs); // pass patterns instead of files
  app.listen();
})();
