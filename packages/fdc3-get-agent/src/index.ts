import { DesktopAgent, GetAgentType, GetAgentParams } from '@kite9/fdc3-standard'
import { ElectronEventLoader } from './strategies/ElectronEventLoader'
import { handleWindowProxy, PostMessageLoader } from './strategies/PostMessageLoader'
import { TimeoutLoader } from './strategies/TimeoutLoader'

const DEFAULT_WAIT_FOR_MS = 20000;

export const FDC3_VERSION = "2.2"

/**
 * This return an FDC3 API.  Should be called by application code.
 * 
 * @param optionsOverride - options to override the default options
 */
export const getAgent: GetAgentType = (optionsOverride?: GetAgentParams) => {

    const DEFAULT_OPTIONS: GetAgentParams = {
        dontSetWindowFdc3: true,
        channelSelector: true,
        intentResolver: true,
        timeout: DEFAULT_WAIT_FOR_MS,
        identityUrl: globalThis.window.location.href
    }

    const options = {
        ...DEFAULT_OPTIONS,
        ...optionsOverride
    }

    const STRATEGIES = [
        new ElectronEventLoader(),
        new PostMessageLoader(),
        new TimeoutLoader()
    ]

    function handleGenericOptions(da: DesktopAgent) {
        if ((!options.dontSetWindowFdc3) && (globalThis.window.fdc3 == null)) {
            globalThis.window.fdc3 = da;
            globalThis.window.dispatchEvent(new Event("fdc3Ready"));
        }

        return da;
    }

    const promises = STRATEGIES.map(s => s.get(options));

    return Promise.race(promises)
        .then(da => {
            // first, cancel the timeout etc.
            STRATEGIES.forEach(s => s.cancel())

            // either the timeout completes first with an error, or one of the other strategies completes with a DesktopAgent.
            if (da) {
                return da as DesktopAgent
            } else {
                throw new Error("No DesktopAgent found")
            }
        })
        .catch(async (error) => {
            if (options.failover) {
                const o = await handleWindowProxy(options, () => { return options.failover!!(options) })
                return o
            } else {
                throw error
            }
        })
        .then(da => handleGenericOptions(da))
}

/**
 * Replaces the original fdc3Ready function from FDC3 2.0 with a new one that uses the new getClientAPI function.
 * 
 * @param waitForMs Amount of time to wait before failing the promise (20 seconds is the default).
 * @returns A DesktopAgent promise.
 */
export function fdc3Ready(waitForMs = DEFAULT_WAIT_FOR_MS): Promise<DesktopAgent> {
    return getAgent({
        timeout: waitForMs,
        dontSetWindowFdc3: false,
        channelSelector: true,
        intentResolver: true
    })
}