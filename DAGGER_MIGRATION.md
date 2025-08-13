# Dagger Migration

This project has been migrated from Earthly/Jenkins to GitHub Actions with Dagger.

## What Changed

### Before (Earthly/Jenkins)

- `Earthfile` defined build steps
- `Jenkinsfile` defined CI pipeline
- CI ran on Jenkins with Kubernetes agents

### After (GitHub Actions + Dagger)

- `dagger.json` defines the Dagger module configuration
- `.dagger/src/index.ts` defines the Dagger pipeline functions
- `.github/workflows/ci.yml` defines the GitHub Actions workflow
- CI runs on GitHub Actions with Dagger

## Available Dagger Functions

You can run these functions locally or in CI:

```bash
# List all available functions
dagger functions

# Run linting
dagger call lint --source=.

# Build the project
dagger call build --source=.

# Run unit tests
dagger call test --source=.

# Test a specific example
dagger call test-example --source=. --example=custom
dagger call test-example --source=. --example=preset

# Run the complete CI pipeline
dagger call ci --source=.
```

## Local Development

1. Install [Dagger CLI](https://docs.dagger.io/cli/install)
2. Run any of the functions above

## CI/CD

The GitHub Actions workflow (`.github/workflows/ci.yml`) automatically:

- Installs Node.js and dependencies
- Installs Dagger CLI
- Runs the complete CI pipeline using `dagger call ci --source=.`

## Migration Notes

- The old `Earthfile` and `Jenkinsfile` have been moved to `old_ci/` directory
- The Dagger module provides the same functionality as the original Earthfile:
  - `deps` → now handled within each function
  - `lint` → `dagger call lint`
  - `build` → `dagger call build`
  - `test` → `dagger call test-example`
  - `ci` → `dagger call ci`

## Benefits

- **Portability**: Dagger functions can run anywhere (local, CI, other platforms)
- **Consistency**: Same execution environment locally and in CI
- **Simplicity**: Single tool for all build operations
- **Speed**: Improved caching and parallelization with Dagger
- **Maintenance**: No need to maintain separate CI infrastructure

## Troubleshooting

If you encounter issues:

1. Make sure you have the latest Dagger CLI installed
2. Check that your Docker daemon is running
3. Verify that the dagger.json configuration is valid
4. Check the Dagger module code in `.dagger/src/index.ts`

For more information, see the [Dagger documentation](https://docs.dagger.io/).
