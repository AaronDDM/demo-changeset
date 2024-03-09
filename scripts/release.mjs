#!/usr/bin/env zx

import { $ } from 'zx';
import path from 'node:path';

/**
 * Release a set of packages
 * @param {string} releasePackages A comma separated list of packages to release
 */
export default async function release(releasePackages) {
    // Exit the pre release
    await $`pnpm exec changeset pre exit`

    // Get a list of packages via pnpm nx projects
    const _packageNames = await $`pnpm nx show projects --json`.quiet()
    const packageNames = JSON.parse(_packageNames.stdout.split('\n').slice(4).join('\n'))

    // Get the package root for each package via pnpm nx show project [packageName]
    const pkgs = {}
    for (const packageName of packageNames) {
        // Remove the first 3 lines of the output
        const _nxPackageInfo = await $`pnpm nx show project ${packageName} --json`.quiet()
        const nxPackageInfo = JSON.parse(_nxPackageInfo.stdout.split('\n').slice(4).join('\n'))

        const packageSourceRoot = nxPackageInfo.sourceRoot

        // Get the package.json for the package
        const pkgPath = path.resolve(path.join(packageSourceRoot, 'package.json'))
        const _pkg = await $`cat ${pkgPath}`.quiet()
        const pkg = JSON.parse(_pkg.stdout)

        // Add the package to the packages object
        pkgs[packageName] = pkg
    }

    // Filter the package list to the packages that have publishConfig.access set to public
    const publicPackages = Object.entries(pkgs).filter(([_, pkg]) => pkg.publishConfig?.access === 'public')

    // Get the package names for the public packages
    const publicPackageNames = publicPackages.map(([name, _]) => name)

    // Ignore the packages that are not in the list of packages to release
    const packagesToIgnore = publicPackageNames.filter(name => !releasePackages.includes(name))

    console.debug('Ignoring packages:', packagesToIgnore)

    // Run version for the packages with the ignore flag
    await $`pnpm exec changeset version --ignore ${packagesToIgnore.join(' ')}`

    // Re-enter the pre release
    await $`pnpm exec changeset pre enter canary`
}

// Get the packages to release from the command line
const packages = process.argv[2];

// If no packages are provided, throw an error
if (!packages) {
    console.error('No packages provided to release');
    process.exit(1);
}

// Run the release
release(packages);
