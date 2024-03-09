# Release

This document outlines the process for releasing new versions of the packages in this repository.

# Generating a changeset

For any pull request you make **that includes feature work or bug fixes** that need a changelog entry, run the following command to generate a changeset entry:

```sh
pnpm changeset
```

Follow the instructions to create a changeset. This will create a file in the `.changeset` directory that will be used to generate the changelog.
Make sure to include the changeset file in your pull request.

# Releasing a canary version

By default, all changesets merged into the main branch will be included in a PR that will be used to release a canary version.

These PRs will be titled "Version Packages (canary)" and will be created by the `github-actions` bot.

When ready to release a canary version, merge the PR created by the `github-actions` bot. **This will automatically trigger the release of a canary version.**

# Releasing a stable version

To release a stable version of a package, follow these steps:
1. Create a new branch (e.g. stable-[package-name]-[date]) from the latest **main** branch.
2. Then run the following command:
    ```sh
    node scripts/release.mjs [package-name-1] [package-name-2] ...
    ```

    You can include the names of multiple packages to release them all at once.

3. After running the command, the script queue up the packages to be released from canary to their stable versions.

4. You now simply have to include all of the file changes in a single commit and push the branch to the repository and create a pull request.

5. Once the PR is up, merge it into the main branch.

   This will trigger the release of the stable versions of the packages.
