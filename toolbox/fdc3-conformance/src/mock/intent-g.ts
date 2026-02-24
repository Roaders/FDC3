import { closeWindowOnCompletion } from './mock-functions';
import { getAgent } from '@morgan-stanley/fdc3-web';
import { Intent } from '../test/support/intent-support';

getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);
  fdc3.addIntentListener(Intent.sharedTestingIntent2, async context => {
    return context;
  });
});
