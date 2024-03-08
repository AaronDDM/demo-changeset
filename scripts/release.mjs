// Step 1: Use changesets to exit the pre release
// Step 2: Use changesets to bump the version for the specified packages
// Step 3: Use changesets to create a release for the specified packages
// Step 4: Use changesets to apply the release to the specified packages
// Step 5: Use changesets to create a changelog for the specified packages
// Step 6: Use changesets to apply the changelog to the specified packages
// Step 7: Use changesets to publish the specified packages

import { exitPre, bump, release, apply, changelog, publish } from '@changesets/action';

export default async function release() {
    await exitPre();
    await bump();
    await release();
    await apply();
    await changelog();
    await publish();
}

