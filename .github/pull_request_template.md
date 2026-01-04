# Pull Request

## Description

<!-- Provide a brief description of the changes in this PR -->

## Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to
      not work as expected)
- [ ] Documentation update
- [ ] Style/UI changes
- [ ] Code refactoring
- [ ] Performance improvements

## Code Quality Checklist

<!-- Verify all quality checks pass -->

- [ ] All ESLint rules pass (`npm run lint`)
- [ ] TypeScript compilation succeeds (`npm run type-check`)
- [ ] Code is properly formatted (`npm run format:check`)
- [ ] All validation checks pass (`npm run validate`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No `console.log` statements (use `console.warn` or `console.error` if
      needed)
- [ ] No `any` types used
- [ ] All props are properly typed

## Testing

<!-- Describe how you tested your changes -->

- [ ] Tested in development environment
- [ ] Tested build process
- [ ] Verified on multiple screen sizes (if UI changes)
- [ ] Tested with different locales (ka, en, ru)

## Screenshots

<!-- If applicable, add screenshots to help explain your changes -->

### Before:

<!-- Screenshot of the old state -->

### After:

<!-- Screenshot of the new state -->

## Internationalization

<!-- If your changes affect UI text -->

- [ ] Added translations to all language files
- [ ] Tested with different locales

## Additional Notes

<!-- Any additional information, context, or notes for reviewers -->

## Related Issues

<!-- Link to any related issues -->

Fixes #(issue_number)

---

## For Reviewers

### Review Checklist

- [ ] Code follows established patterns and conventions
- [ ] TypeScript types are appropriate and complete
- [ ] No security vulnerabilities introduced
- [ ] Performance considerations addressed
- [ ] Accessibility standards maintained
- [ ] Documentation updated if needed

### Deployment

- [ ] Ready to merge to main
- [ ] All GitHub Actions checks pass
