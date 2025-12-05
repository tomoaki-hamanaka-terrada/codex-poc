# Project Structure

## Organization Philosophy

The project follows a page-based and component-driven organization philosophy, typical for Next.js applications using the App Router. Features are primarily organized within the `app/` directory.

## Directory Patterns

### App Router Pages and Layouts
**Location**: `app/`
**Purpose**: Contains Next.js pages, layouts, and API routes. Each route segment can have its own `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, etc.
**Example**: `app/dashboard/page.tsx` for the dashboard page.

### Static Assets
**Location**: `public/`
**Purpose**: Stores static assets such as images, fonts, and other files that need to be served directly.
**Example**: `public/logo.png`

### Kiro Configuration
**Location**: `.kiro/`
**Purpose**: Contains configuration, steering documents, and specifications for Kiro-style Spec Driven Development.
**Example**: `.kiro/steering/product.md`

## Naming Conventions

- **Files**: Directories are typically `kebab-case`, while React components and page files are `PascalCase`.
- **Components**: React components are named using `PascalCase`.
- **Functions**: JavaScript/TypeScript functions are named using `camelCase`.

## Import Organization

Absolute imports are preferred for modules within the project, using path aliases. Relative imports are used for sibling or child modules within the same directory structure.

```typescript
// Absolute import example
import { SomeComponent } from '@/components/SomeComponent';

// Relative import example
import { LocalUtil } from './utils';
```

**Path Aliases**:
- `@/`: Maps to the project root directory, facilitating absolute imports.

## Code Organization Principles

Components should be modular, reusable, and follow a clear separation of concerns. Data fetching and business logic are typically handled at the page or layout level, with presentation logic encapsulated in child components.

---
_Document patterns, not file trees. New files following patterns shouldn't require updates_
