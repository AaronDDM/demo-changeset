import 'zx/globals'
import path from 'node:path';
import { execSync } from 'node:child_process';

// Get the packages to release from the command line
const _releasePackages = process.argv[2];

// If no packages are provided, throw an error
if (!_releasePackages) {
    console.error('No packages provided to release');
    process.exit(1);
}

const releasePackages = _releasePackages.split(',')

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
const packagesToIgnore = publicPackageNames.filter(name => !releasePackages.includes(name)).map(name => `--ignore ${name}`)
console.debug('Ignoring packages:', packagesToIgnore)

// Run version for the packages with the ignore flag
// TODO: I'm not sure why this doesn't work, but it seems to ignore the ignore flag when using zx...
// await $`pnpm exec changeset version ${packagesToIgnore}`
execSync(`pnpm exec changeset version ${packagesToIgnore.join(' ')}`, { stdio: 'inherit' });

// Re-enter the pre release
await $`pnpm exec changeset pre enter canary`
