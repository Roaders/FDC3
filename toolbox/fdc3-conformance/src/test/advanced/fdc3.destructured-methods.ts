import { AppIdentifier, DesktopAgent, getAgent, IntentResolution, PrivateChannel } from '@finos/fdc3';
import { expect } from 'chai';
import { handleFail } from '../../utils';
import { closeMockAppWindow } from '../fdc3-conformance-utils';
import { APIDocumentation } from '../support/apiDocuments';
import { ContextType, Intent, IntentApp } from '../support/intent-support';

const documentation = '\r\nDocumentation: ' + APIDocumentation.desktopAgent + '\r\nCause';

type DesktopAgentFunctionNames = keyof {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof DesktopAgent as DesktopAgent[K] extends (...args: any[]) => any ? K : never]: true;
};

const desktopAgentFunctionNames: Record<DesktopAgentFunctionNames, true> = {
  findIntent: true,
  findIntentsByContext: true,
  open: true,
  findInstances: true,
  getAppMetadata: true,
  raiseIntent: true,
  raiseIntentForContext: true,
  createPrivateChannel: true,
  close: true,
  broadcast: true,
  addIntentListener: true,
  addIntentListenerWithContext: true,
  addContextListener: true,
  addEventListener: true,
  getUserChannels: true,
  joinUserChannel: true,
  getOrCreateChannel: true,
  getCurrentChannel: true,
  leaveCurrentChannel: true,
  getInfo: true,
};

function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default async () =>
  describe('fdc3.destructuredMethods', () => {
    let fdc3: DesktopAgent;
    let openedWindows = 0;

    beforeEach(async () => {
      fdc3 = await getAgent();
      openedWindows = 0;
    });

    afterEach(async function afterEach() {
      if (openedWindows > 0) {
        await closeMockAppWindow(this.currentTest?.title ?? 'Unknown test', openedWindows);
      }
    });

    (Object.keys(desktopAgentFunctionNames) as Array<DesktopAgentFunctionNames>).forEach(functionName => {
      it(`(Destructured${capitalize(functionName)}) ${functionName} should remain callable when destructured`, async () => {
        try {
          // const {[functionName]: destructuredFunction} = fdc3;

          //await destructuredFunction();

          switch (functionName) {
            case 'findIntent': {
              const { findIntent } = fdc3;
              const appIntent = await findIntent(Intent.aTestingIntent, { type: ContextType.testContextX });

              expect(appIntent.intent.name, documentation).to.equal(Intent.aTestingIntent);
              expect(appIntent.apps, documentation).to.have.length(1);
              break;
            }

            case 'findIntentsByContext': {
              const { findIntentsByContext } = fdc3;
              const appIntents = await findIntentsByContext({ type: ContextType.testContextX });

              expect(appIntents, documentation).to.be.an('array');
              expect(appIntents.length, documentation).to.be.greaterThan(0);
              break;
            }

            case 'open': {
              const { open } = fdc3;
              const appIdentifier = await open({ appId: IntentApp.IntentAppA });
              openedWindows = 1;

              validateAppIdentifier(appIdentifier);
              break;
            }

            case 'findInstances': {
              const { findInstances, open } = fdc3;
              const appIdentifier1 = await open({ appId: IntentApp.IntentAppA });
              const appIdentifier2 = await open({ appId: IntentApp.IntentAppA });
              openedWindows = 2;

              const instances = await findInstances({ appId: IntentApp.IntentAppA });

              expect(
                instances.some(instance => sameAppIdentifier(instance, appIdentifier1)),
                documentation
              ).to.equal(true);
              expect(
                instances.some(instance => sameAppIdentifier(instance, appIdentifier2)),
                documentation
              ).to.equal(true);
              break;
            }

            case 'getAppMetadata': {
              const { getAppMetadata } = fdc3;
              const metadata = await getAppMetadata();

              expect(metadata, documentation).to.have.property('appId');
              break;
            }

            case 'raiseIntent': {
              const { raiseIntent } = fdc3;
              const intentResolution = await raiseIntent(Intent.aTestingIntent, { type: ContextType.testContextX });
              openedWindows = 1;

              validateIntentResolution(intentResolution);
              break;
            }

            case 'raiseIntentForContext': {
              const { raiseIntentForContext } = fdc3;
              const intentResolution = await raiseIntentForContext({ type: ContextType.testContextZ });
              openedWindows = 1;

              validateIntentResolution(intentResolution);
              break;
            }

            case 'createPrivateChannel': {
              const { createPrivateChannel } = fdc3;
              const privateChannel = await createPrivateChannel();

              validatePrivateChannel(privateChannel);
              privateChannel.disconnect();
              break;
            }
          }
        } catch (ex) {
          handleFail(documentation + '\r\n' + apiDocumentationFor(functionName), ex);
        }
      });
    });
  });

function apiDocumentationFor(functionName: DesktopAgentFunctionNames): string {
  switch (functionName) {
    case 'findIntent':
      return APIDocumentation.findIntent;
    case 'findIntentsByContext':
      return APIDocumentation.findIntentsByContext;
    case 'open':
      return APIDocumentation.open;
    case 'findInstances':
      return APIDocumentation.findInstances;
    case 'getAppMetadata':
      return APIDocumentation.appMetadata;
    case 'raiseIntent':
      return APIDocumentation.raiseIntent;
    case 'raiseIntentForContext':
      return APIDocumentation.raiseIntentForContext;
  }
}

function sameAppIdentifier(a: AppIdentifier, b: AppIdentifier): boolean {
  return a.appId === b.appId && a.instanceId === b.instanceId;
}

function validateAppIdentifier(appIdentifier: AppIdentifier) {
  expect(appIdentifier, documentation).to.have.property('appId');
  expect(appIdentifier, documentation).to.have.property('instanceId');
}

function validateIntentResolution(intentResolution: IntentResolution) {
  expect(intentResolution, documentation).to.have.property('source');
  expect(intentResolution.source, documentation).to.have.property('appId');
}

function validatePrivateChannel(privateChannel: PrivateChannel) {
  expect(privateChannel, documentation).to.have.property('id');
  expect(privateChannel, documentation).to.have.property('disconnect').that.is.a('function');
}
