import App from '@/app';
import validateEnv from '@utils/validateEnv';
import getFile from 'node-recursive-directory';

validateEnv();

(async () => {
  const files = await getFile(__dirname + '/controllers/', true);
  const app = new App(files.map((file: any) => file.fullpath));
  app.listen();
})();
