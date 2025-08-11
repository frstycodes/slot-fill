# Contributing to @frsty/slot-fill

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [pnpm](https://pnpm.io/) (v7 or higher)

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/frstycodes/slot-fill.git
   cd slot-fill
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development process:
   ```bash
   pnpm dev
   ```

## Development Workflow

### Branching Strategy

- `main`: Production-ready code
- For new features or fixes, create a branch from `main`:
  ```bash
  git checkout -b feature/your-feature-name
  # or
  git checkout -b fix/issue-description
  ```

### Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This enables automatic versioning and changelog generation.

Examples of commit messages:
- `feat: add new SlotConsumer component`
- `fix: resolve issue with nested slot components`
- `docs: update API documentation`
- `test: add unit tests for SlotManager`
- `chore: update dependencies`

### Pull Requests

1. Make sure your code passes all tests and linting:
   ```bash
   pnpm lint
   pnpm test
   ```

2. Push your branch and create a pull request against `main`

3. In your PR description, clearly explain the changes and reference any related issues

## Versioning and Publishing

We use [@favware/cliff-jumper](https://github.com/favware/cliff-jumper) to manage versions and changelogs.

### Creating a Version Bump

When you're ready to propose a version change (e.g., after adding a new feature or fixing a bug):

```bash
pnpm cliff-jumper
```

This will:
1. Prompt you to select the type of change (patch, minor, major)
2. Update the version in package.json
3. Generate or update the CHANGELOG.md file based on your commit history

### Releasing a New Version

The release process is mostly automated through GitHub Actions:

1. When you've made changes and are ready to release:
   ```bash
   pnpm bump
   ```
   This will run the cliff-jumper command, version the package, and push changes with tags.

2. GitHub Actions will:
   - Detect the new version
   - Run tests and build the package
   - Create a GitHub release
   - Publish to npm

### Manual Release (if needed)

If you need to perform a release manually:

1. Make sure you're on the `main` branch with the latest changes
2. Run the version command to update versions and generate the changelog:
   ```bash
   pnpm version
   ```
3. Commit and push the changes:
   ```bash
   git add .
   git commit -m "chore: release"
   git push --follow-tags
   ```
4. Publish to npm:
   ```bash
   pnpm release
   ```

## Testing

Run tests with:
```bash
pnpm test
```

When adding new features, please also add corresponding tests.

## License

By contributing to this project, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).
