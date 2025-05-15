# Contributing to Dodo Services

Thank you for considering contributing to Dodo Services! This document outlines the process for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers understand your report, reproduce the behavior, and find related reports.

- Use the bug report template when creating an issue
- Include as many details as possible
- Include steps to reproduce the issue
- Describe the behavior you observed and what you expected to see

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

- Use the feature request template when creating an issue
- Include as many details as possible
- Explain why this enhancement would be useful

### Pull Requests

- Fill in the required template
- Follow the style guidelines
- Include appropriate tests
- Update documentation as needed
- Ensure all tests pass

## Development Workflow

1. Fork the repository
2. Create a new branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Commit your changes using a descriptive commit message
6. Push your branch to your fork
7. Submit a pull request to the `develop` branch

## Style Guidelines

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript/TypeScript Style Guide

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Prefer arrow functions
- Use template literals for string concatenation
- Use destructuring assignment
- Use async/await over promises

### Python Style Guide

- Follow PEP 8
- Use 4 spaces for indentation
- Use docstrings for all public modules, functions, classes, and methods
- Keep lines under 100 characters

## PWA and SEO Considerations

### PWA Development Guidelines

- Ensure all features work offline or provide appropriate offline messages
- Implement background sync for offline actions
- Use service workers appropriately
- Test on multiple devices and browsers

### SEO Development Guidelines

- Include appropriate metadata for all pages
- Use structured data where applicable
- Ensure semantic HTML
- Follow accessibility best practices

## Testing

- Write tests for all new features
- Ensure all tests pass before submitting a pull request
- Include both unit and integration tests where appropriate

## Documentation

- Update the README.md with details of changes to the interface
- Update the documentation when changing functionality
- Comment your code, particularly in hard-to-understand areas

## Questions?

If you have any questions, please feel free to contact the project maintainers.
