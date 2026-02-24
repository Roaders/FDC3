import { getAgent } from '@morgan-stanley/fdc3-web';
import { closeWindowOnCompletion } from './mock-functions';

getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);
});
