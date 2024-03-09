#!/usr/bin/env zx

/**
 * Release a set of packages
 * @param {string} packages A comma separated list of packages to release
 */
export default async function release(packages) {
    // Exit the pre release
    $`pnpm exec changesets pre exit`

    // Get a list of packages via pnpm

    // Run version for the packages
    $`pnpm exec changesets version -- ${packages}`
}

// Get the packages to release from the command line
const packages = process.argv[2];

// Run the release
release(packages);
