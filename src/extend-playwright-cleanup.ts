import {playwrightCleanup, CleanupOptions} from "./fixtures/cleanup-fixture";

function extendPlaywrightCleanup(options: CleanupOptions = {}): any {
    return {
      cleanupOptions: options,
      cleanup: options.dependOnRequest
        ? playwrightCleanup.cleanupWithRequest
        : playwrightCleanup.cleanup,
    }
}
export default extendPlaywrightCleanup;