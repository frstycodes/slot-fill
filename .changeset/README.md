# Changesets

This directory contains "changesets" used for managing versioning and changelogs for this package.

## What are changesets?

Changesets are files that describe changes made to the codebase. Each changeset specifies what version bump is required (patch, minor, or major) and contains a description of the change that will be added to the changelog.

## Adding a changeset

After making changes to the codebase that should result in a version bump, create a changeset by running:

```bash
pnpm changeset
```

This will:
1. Ask you what type of change you've made
2. Ask for a description of the changes
3. Create a markdown file in this directory

## Commit your changeset

You should commit the generated markdown file along with your code changes. When your pull request is merged, our CI/CD system will use these changesets to:

1. Create a "Version Packages" PR that applies the version changes
2. Once that PR is merged, publish the new version to npm

## Further reading

- [Changesets documentation](https://github.com/changesets/changesets)