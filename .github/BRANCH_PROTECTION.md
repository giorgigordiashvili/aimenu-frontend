# Branch Protection Configuration

This document outlines the recommended branch protection settings for the `main`
branch to ensure code quality and proper review process.

## Recommended Settings

### Branch Protection Rules for `main`

Navigate to: **Settings > Branches > Add rule** for the `main` branch

#### Require status checks to pass before merging

- [x] Require branches to be up to date before merging
- [x] **Status checks that are required:**
  - `Code Quality & Type Safety (18.x)`
  - `Code Quality & Type Safety (20.x)`
  - `Build & Test`
  - `Security Audit`

#### Require pull request reviews before merging

- [x] **Required number of reviews before merging:** 1
- [x] Dismiss stale reviews when new commits are pushed
- [x] Require review from code owners (if CODEOWNERS file exists)

#### Require linear history

- [x] Require linear history (prevents merge commits)

#### Include administrators

- [x] Include administrators (admins must follow these rules too)

## GitHub Actions Status Checks

The following GitHub Actions workflows will run automatically and must pass:

### Main CI Pipeline (`ci.yml`)

- **Code Quality & Type Safety:** TypeScript, ESLint, Prettier checks on Node
  18.x and 20.x
- **Build & Test:** Production build verification
- **Security Audit:** Dependency vulnerability scanning

## Failure Scenarios

PRs will be **blocked** if:

- TypeScript compilation fails
- ESLint rules fail
- Code formatting doesn't match Prettier rules
- Production build fails
- Security vulnerabilities found (high severity)
- Required reviewers haven't approved

## Code Owners (Optional)

Create a `.github/CODEOWNERS` file to automatically request reviews:

```
# Global owners
* @your-username

# Frontend specific
/src/ @frontend-lead
/src/components/ @frontend-lead

# Configuration files
*.json @devops-lead
*.yml @devops-lead
.github/ @devops-lead
```

## Override Process

In emergency situations, administrators can:

1. Temporarily disable branch protection
2. Make hotfix commits
3. Re-enable protection immediately after

**Always document emergency overrides and follow up with proper PR process when
possible.**

## Setup Steps

1. Go to repository **Settings**
2. Click **Branches** in the left sidebar
3. Click **Add rule**
4. Set branch name pattern: `main`
5. Configure settings according to the checklist above
6. Click **Create** to save the rule

## Benefits

This configuration ensures:

- All code passes quality checks before merging
- Multiple Node.js versions are tested
- Security vulnerabilities are caught early
- Code review process is mandatory
- Git history remains clean and linear
