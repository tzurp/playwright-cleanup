import {playwrightCleanup, CleanupOptions} from "./fixtures/cleanup-fixture";

function extendPlaywrightCleanup(options: CleanupOptions = {}): any {
    return {
      cleanupOptions: options,
      cleanup: playwrightCleanup.cleanup,
    }
}
export default extendPlaywrightCleanup;