# Product Requirements Document: s-m-r-t.dev

**Version**: 1.0
**Last Updated**: 2026-01-09
**Status**: In Progress

## Executive Summary

s-m-r-t.dev is the official documentation and marketing site for the SMRT framework - a full-stack TypeScript framework that abstracts away implementation details for databases, REST APIs, MCP tools, and CLI commands through simple object definitions.

## Product Vision

Create a comprehensive, developer-friendly documentation site that:

- Showcases SMRT's core value propositions (no vendor lock, adaptability, brevity, scalability)
- Provides complete API documentation with interactive examples
- Enables developers to quickly understand and adopt SMRT
- Serves as a reference for all SMRT components, objects, agents, and collections

## Goals & Success Metrics

### Primary Goals

1. **Complete Documentation Coverage**: 100% of SMRT components, objects, agents, and modules documented with working examples
2. **Fast Time-to-Value**: Developers can find and implement SMRT solutions within 5 minutes
3. **Production-Ready Infrastructure**: Reliable hosting on AWS with <2s page load times globally

### Success Metrics

- [ ] 100% component documentation completion
- [ ] <2s Time to First Byte (TTFB) on CloudFront
- [ ] Zero build/deployment failures on main branch
- [ ] All interactive examples functional
- [ ] Mobile-responsive on all pages

## Technical Architecture

### Stack

- **Framework**: SvelteKit 2.x with adapter-static
- **Language**: TypeScript 5.x
- **Package Manager**: pnpm 9.x
- **Testing**: Vitest
- **Hosting**: AWS S3 + CloudFront
- **Infrastructure**: OpenTofu/Terraform
- **CI/CD**: GitHub Actions

### Build System

- **Development**: Vite dev server with HMR
- **Production**: Static site generation (SSG) with pre-rendering
- **Dependencies**:
  - `@happyvertical/smrt-svelte` (component library)
  - `@happyvertical/smrt-docs` (documentation content)
  - `marked` (Markdown parsing)
  - `gray-matter` (frontmatter extraction)

### Infrastructure

- **Environments**:
  - Staging: `staging.s-m-r-t.dev`
  - Production: `s-m-r-t.dev`
- **Storage**: S3 buckets (havesmrt-staging, havesmrt-production)
- **CDN**: CloudFront with custom SSL certificates
- **DNS**: Route53
- **Deployment**: Automated via GitHub Actions

## Feature Requirements

### 1. Homepage

**Status**: ✅ Complete

**Requirements**:

- [x] Hero section with SMRT value propositions
- [x] Four core tenets (No vendor lock, Adaptability, Brevity, Scalability)
- [x] Simple example showcasing basic SmrtObject usage
- [x] Advanced example with decorators
- [x] Mobile-responsive grid layout

### 2. Component Documentation

**Status**: 🔄 In Progress (Need working examples for all components)

**Requirements**:

- [ ] Complete documentation for all form components
  - [x] SMRTTextInput (Complete)
  - [ ] SMRTSelect
  - [ ] DateTimeInput
  - [ ] MoneyInput
  - [ ] AddressInput
  - [ ] CheckboxInput
- [ ] Complete documentation for user components
  - [ ] UserCard
  - [ ] UserMenu
  - [ ] UserAvatar
  - [ ] UserList
  - [ ] InviteUser
  - [ ] UserForm
- [ ] Complete documentation for feedback components
  - [ ] ProgressBar
  - [ ] ConfirmDialog
- [ ] Dynamic component category pages
- [ ] Breadcrumb navigation
- [ ] Interactive examples with live code
- [ ] Props tables for all components
- [ ] TypeScript interface definitions

**Each Component Page Must Include**:

1. Clear description and use cases
2. Installation/import instructions
3. 3-5 interactive examples showing different use cases
4. Complete props table with types, defaults, and descriptions
5. TypeScript interface definition
6. Accessibility notes (if applicable)
7. SMRT mode behavior (voice input, AI integration)

### 3. SMRT Modules Documentation

**Status**: 📝 Not Started

**Overview**: Document all 28 SMRT modules with comprehensive examples and tutorials. Each module will be analyzed by a dedicated subagent to ensure deep understanding and accurate documentation.

**Approach**: Use Task tool with Explore subagent for each module to:

1. Understand module architecture and purpose
2. Identify key APIs and usage patterns
3. Generate realistic examples
4. Write step-by-step tutorials
5. Document integration patterns

#### 3.1 Core Foundation Modules (4 modules)

**smrt-core**:

- [ ] Overview and architecture
- [ ] Installation and setup
- [ ] SmrtObject base class guide
- [ ] Code generators (REST/MCP/Swagger)
- [ ] Vite plugin configuration
- [ ] Manifest generation
- [ ] Tutorial: Building your first SMRT object
- [ ] Tutorial: Generating REST APIs
- [ ] Tutorial: Setting up MCP tools
- [ ] Advanced: Custom generators

**smrt-types**:

- [ ] Type system overview
- [ ] Core type definitions
- [ ] Using types in your project
- [ ] TypeScript integration
- [ ] Tutorial: Type-safe SMRT development

**smrt-config**:

- [ ] Configuration structure
- [ ] Environment-based config
- [ ] Module configuration
- [ ] Best practices
- [ ] Tutorial: Configuring a multi-environment project

**smrt-scanner**:

- [ ] How the scanner works
- [ ] Performance characteristics
- [ ] Manifest generation process
- [ ] Integration with build tools
- [ ] Tutorial: Custom scanning configurations

#### 3.2 User & Access Management (2 modules)

**smrt-users**:

- [ ] Multi-tenant architecture overview
- [ ] User model and fields
- [ ] Tenant management
- [ ] Roles and permissions (RBAC)
- [ ] Groups and hierarchies
- [ ] Authentication patterns
- [ ] Component Browser: User management components (UserCard, UserAvatar, UserList, UserForm, UserMenu, InviteUser, TenantCard, TenantSwitcher, RoleBadge, RoleSelector, PermissionCheck)
- [ ] Tutorial: Setting up multi-tenant auth
- [ ] Tutorial: Implementing RBAC
- [ ] Tutorial: User registration flow
- [ ] Tutorial: Tenant switching
- [ ] Example: E-commerce user management
- [ ] Example: SaaS application with teams

**smrt-profiles**:

- [ ] Profile model architecture
- [ ] Relationship management
- [ ] Reciprocal associations
- [ ] Metadata handling
- [ ] Tutorial: Building user profiles
- [ ] Tutorial: Managing connections
- [ ] Example: Social network profiles
- [ ] Example: Professional networking

#### 3.3 Domain Models & Data (9 modules)

**smrt-assets**:

- [ ] Asset model and versioning
- [ ] Metadata management
- [ ] AI-powered operations
- [ ] Storage integration
- [ ] Tutorial: File upload and management
- [ ] Tutorial: AI asset tagging
- [ ] Tutorial: Version control
- [ ] Example: Media library
- [ ] Example: Document management system

**smrt-commerce**:

- [ ] Commerce models overview
- [ ] Contracts and agreements
- [ ] Fulfillment workflow
- [ ] Payment processing
- [ ] Tutorial: Building an e-commerce system
- [ ] Tutorial: Order fulfillment
- [ ] Example: Subscription service
- [ ] Example: Marketplace

**smrt-events**:

- [ ] Event hierarchy
- [ ] Participant management
- [ ] Event lifecycle
- [ ] Tutorial: Creating event systems
- [ ] Tutorial: Managing attendees
- [ ] Example: Conference management
- [ ] Example: Webinar platform

**smrt-ledgers**:

- [ ] Double-entry accounting principles
- [ ] Ledger architecture
- [ ] Transaction handling
- [ ] Balance calculations
- [ ] Tutorial: Setting up accounting
- [ ] Tutorial: Recording transactions
- [ ] Tutorial: Financial reporting
- [ ] Example: Invoice tracking
- [ ] Example: Expense management

**smrt-places**:

- [ ] Hierarchical place model
- [ ] Geo integration
- [ ] Location queries
- [ ] Tutorial: Building location features
- [ ] Tutorial: Geo search
- [ ] Example: Store locator
- [ ] Example: Real estate listings

**smrt-products**:

- [ ] Product model architecture
- [ ] Standalone vs federated vs NPM
- [ ] Microservice patterns
- [ ] Tutorial: Product catalog
- [ ] Tutorial: Inventory management
- [ ] Example: Multi-vendor marketplace

**smrt-projects**:

- [ ] Provider-agnostic project models
- [ ] Issues and PRs
- [ ] Repository management
- [ ] Project boards
- [ ] Tutorial: Building project management
- [ ] Tutorial: Issue tracking
- [ ] Example: GitHub-like interface
- [ ] Example: Internal task manager

**smrt-properties**:

- [ ] Digital property model
- [ ] Zone management
- [ ] Property metadata
- [ ] Tutorial: Property management system
- [ ] Example: Virtual real estate
- [ ] Example: Digital asset registry

**smrt-tags**:

- [ ] Tagging architecture
- [ ] Hierarchical tags
- [ ] Context-aware tagging
- [ ] Multi-language support
- [ ] Tutorial: Implementing tagging
- [ ] Tutorial: Tag hierarchies
- [ ] Example: Content categorization
- [ ] Example: Product taxonomy

#### 3.4 Content & Communication (4 modules)

**smrt-content**:

- [ ] Content processing pipeline
- [ ] Document handling
- [ ] Web content extraction
- [ ] Media processing
- [ ] Tutorial: Content management system
- [ ] Tutorial: Web scraping
- [ ] Example: Blog platform
- [ ] Example: Knowledge base

**smrt-messages**:

- [ ] Email persistence
- [ ] AI integration
- [ ] Message threading
- [ ] Tutorial: Email management
- [ ] Tutorial: AI-powered inbox
- [ ] Example: Customer support system
- [ ] Example: Newsletter platform

**smrt-analytics**:

- [ ] Analytics integration overview
- [ ] Google Analytics setup
- [ ] Plausible integration
- [ ] Event tracking
- [ ] Tutorial: Analytics dashboard
- [ ] Example: Website analytics
- [ ] Example: Application metrics

**smrt-ads**:

- [ ] Ad delivery model
- [ ] Tracking and attribution
- [ ] Campaign management
- [ ] Tutorial: Ad platform setup
- [ ] Example: Display advertising
- [ ] Example: Sponsored content

#### 3.5 Agents & Automation (2 modules)

**smrt-agents**:

- [ ] Agent framework overview
- [ ] Building autonomous agents
- [ ] Agent communication
- [ ] MCP tool integration
- [ ] Tutorial: Creating your first agent
- [ ] Tutorial: Multi-agent systems
- [ ] Example: Customer service bot
- [ ] Example: Data processing agent

**smrt-gnode**:

- [ ] Federation architecture
- [ ] Local knowledge bases
- [ ] Gnode communication
- [ ] Tutorial: Setting up gnodes
- [ ] Tutorial: Federated search
- [ ] Example: Distributed knowledge graph
- [ ] Example: Multi-tenant data federation

#### 3.6 Developer Tools & CLI (3 modules)

**smrt-cli**:

- [ ] CLI overview and commands
- [ ] Project introspection
- [ ] Testing utilities
- [ ] Code generation
- [ ] Tutorial: CLI workflow
- [ ] Tutorial: Custom commands
- [ ] Command reference guide

**smrt-dev-mcp**:

- [ ] Development MCP server
- [ ] Code generation tools
- [ ] Project introspection
- [ ] IDE integration
- [ ] Tutorial: MCP-powered development
- [ ] Example: AI-assisted coding

**smrt-vitest**:

- [ ] Vitest plugin overview
- [ ] Cross-package testing
- [ ] Manifest loading
- [ ] Tutorial: Testing SMRT projects
- [ ] Example: Integration tests

#### 3.7 UI Components & Frontend (2 modules)

**smrt-svelte**:

- [ ] Component library overview
- [ ] Component Browser: All SMRT Svelte components organized by category (Forms, UI, Layout, Display, Feedback, etc.)
- [ ] Auth components
- [ ] User management UI
- [ ] Tenant switching
- [ ] Roles and permissions UI
- [ ] Tutorial: Adding SMRT UI to SvelteKit
- [ ] Example: Admin dashboard
- [ ] Example: User portal
- [ ] (Note: Detailed component docs in Section 2)

**browser-ai**:

- [ ] Framework-agnostic AI
- [ ] Speech-to-text (STT)
- [ ] Text-to-speech (TTS)
- [ ] Browser LLM integration
- [ ] Adapter pattern
- [ ] Component Browser (if applicable): UI components for STT/TTS controls, voice input buttons, transcription displays
- [ ] Tutorial: Voice-enabled forms
- [ ] Tutorial: Client-side AI
- [ ] Example: Voice assistant
- [ ] Example: Real-time transcription

#### 3.8 Project Templates (2 modules)

**template-site-static-json**:

- [ ] Template overview
- [ ] JSON data storage
- [ ] Static site generation
- [ ] Tutorial: Using the template
- [ ] Tutorial: Customization guide

**template-sveltekit**:

- [ ] SvelteKit template overview
- [ ] SMRT integration
- [ ] Best practices
- [ ] Tutorial: Starting a new project
- [ ] Tutorial: Deployment guide

**Module Documentation Standards**:

Each module must include:

1. **Overview**: Purpose, use cases, when to use it
2. **Installation**: Package installation and setup
3. **Quick Start**: 5-minute getting started guide
4. **Core Concepts**: Key architectural concepts
5. **API Reference**: All exports, classes, methods
6. **Component Browser** (if module has components): Interactive browser for module-specific components with live examples, props tables, and code samples
7. **Tutorials** (2-4 per module): Step-by-step guides
8. **Examples** (3-5 per module): Real-world scenarios
9. **Integration**: How it works with other modules
10. **Best Practices**: Dos and don'ts
11. **Troubleshooting**: Common issues and solutions

**Subagent Documentation Process**:

For each module:

1. Launch Explore subagent with thoroughness: "very thorough"
2. Agent explores module source code, README, tests, examples
3. Agent identifies:
   - Key APIs and exports
   - Common usage patterns
   - Integration points
   - Best practices from code
4. Agent generates:
   - Tutorial outlines
   - Example scenarios
   - API documentation structure
5. Human reviews and approves
6. Agent writes final documentation
7. Documentation added to s-m-r-t.dev

### 4. Core Documentation

**Status**: 📝 Not Started

**Requirements**:

- [ ] Objects documentation
  - [ ] SmrtObject base class
  - [ ] Field types and decorators
  - [ ] Relationships (foreignKey, manyToMany)
  - [ ] Computed properties
  - [ ] Actions and methods
  - [ ] AI-powered methods (is, do, describe)
- [ ] Agents documentation
  - [ ] Agent concepts and architecture
  - [ ] Dispatch system
  - [ ] Creating custom agents
  - [ ] MCP tool integration
- [ ] Collections documentation
  - [ ] Collection APIs
  - [ ] Querying and filtering
  - [ ] Pagination
  - [ ] Bulk operations

### 5. Additional Pages

**Status**: 📝 Not Started

**Requirements**:

- [ ] FAQ page
  - [ ] Common setup questions
  - [ ] Troubleshooting
  - [ ] Migration guides
  - [ ] Performance optimization
- [ ] Reference page
  - [ ] API reference
  - [ ] CLI commands reference
  - [ ] Configuration options
  - [ ] Database adapters
- [ ] Getting Started guide
  - [ ] Installation
  - [ ] First project
  - [ ] Basic concepts
  - [ ] Next steps

### 6. Search & Navigation

**Status**: 📝 Not Started

**Requirements**:

- [ ] Global search functionality
- [ ] Keyboard shortcuts (⌘K for search)
- [ ] Category-based navigation
- [ ] Sidebar navigation for docs
- [ ] Table of contents for long pages
- [ ] Previous/next page navigation

### 7. Code Examples

**Status**: 🔄 In Progress

**Current Implementation**:

- [x] CodeBlock component with syntax highlighting
- [x] ComponentExample component with live rendering
- [x] Copy-to-clipboard functionality

**Requirements**:

- [x] Syntax highlighting
- [x] Copy button
- [x] Live preview for components
- [ ] CodeSandbox/StackBlitz integration
- [ ] Language indicators
- [ ] Line highlighting for explanations

### 8. Infrastructure & Deployment

**Status**: 🔄 In Progress

**Current State**:

- [x] OpenTofu configuration complete
- [x] S3 buckets configured
- [x] CloudFront distributions
- [x] Route53 DNS setup
- [x] ACM certificates (us-east-1)
- [x] GitHub Actions workflow
- [ ] Staging environment fully tested
- [ ] Production environment deployed
- [ ] Cache invalidation working
- [ ] Error pages (404, 500)

**Requirements**:

- [ ] Verify staging deployment
- [ ] Production deployment
- [ ] Custom error pages
- [ ] Monitoring/alerting setup
- [ ] Automated cache invalidation
- [ ] Performance optimization
  - [ ] Image optimization
  - [ ] Asset compression
  - [ ] Cache headers validation
- [ ] Security headers (CSP, HSTS, etc.)

### 9. SEO & Metadata

**Status**: 📝 Not Started

**Requirements**:

- [ ] Page titles for all routes
- [ ] Meta descriptions
- [ ] Open Graph tags
- [ ] Twitter cards
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Structured data (JSON-LD)
- [ ] Canonical URLs

### 10. Analytics & Monitoring

**Status**: 📝 Not Started

**Requirements**:

- [ ] Analytics integration (Plausible/Simple Analytics)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] User feedback mechanism
- [ ] Search analytics
- [ ] Most visited pages tracking

### 11. Accessibility

**Status**: 📝 Not Started

**Requirements**:

- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast validation
- [ ] Focus indicators
- [ ] Skip links
- [ ] ARIA labels where needed

## Technical Specifications

### Build Configuration

**SvelteKit Config** (`svelte.config.js`):

- Adapter: `@sveltejs/adapter-static`
- Prerender: All pages
- Fallback: `404.html` for SPA-like routing
- Trailing slash: Always

**Vite Config** (`vite.config.ts`):

- Test environment: jsdom
- Coverage reporting
- Build optimization
- Asset handling

### Pre-rendering Strategy

**Current Implementation**:

```javascript
// src/routes/+layout.ts
export const prerender = true;
```

**Required Entries** (from recent commit):

- All component routes
- All documentation pages
- Dynamic routes: `/docs/[...slug]`, `/components/[category]`, `/components/[category]/[name]`
- Form components should have SSR disabled to prevent hydration issues

### Deployment Pipeline

**GitHub Actions Workflow**:

```yaml
on:
  push:
    branches: [main] # Auto-deploy staging
  workflow_dispatch: # Manual production deploy

jobs:
  build:
    - Checkout smrt monorepo
    - Build smrt packages (pnpm)
    - Install docs site dependencies (npm)
    - Run tests
    - Build static site
    - Upload artifacts

  deploy-staging:
    - Download artifacts
    - Sync to S3 (with cache headers)
    - Invalidate CloudFront cache

  deploy-production:
    - Same as staging but manual trigger
```

**Required Secrets**:

- `GH_TOKEN`: Access to happyvertical/smrt repo
- `AWS_ROLE_ARN_STAGING`: IAM role for staging
- `AWS_ROLE_ARN_PRODUCTION`: IAM role for production

### Cache Strategy

**HTML Pages**:

- Cache-Control: `public, max-age=3600` (1 hour)
- Reason: Allow updates to propagate quickly

**Static Assets** (`/_app/*`):

- Cache-Control: `public, max-age=31536000, immutable` (1 year)
- Reason: Versioned assets, safe to cache indefinitely

**CloudFront**:

- Default TTL: 1 hour
- Max TTL: 1 year (for versioned assets)
- Origin failover to S3 website endpoint

## Content Requirements

### Component Documentation Template

Each component page should follow this structure:

```markdown
# ComponentName

Brief description (1-2 sentences)

## Installation

Import statement

## Basic Usage

Simple example with explanation

## Examples

3-5 examples covering:

- Basic usage
- Common variants
- Advanced features
- Edge cases

## Props

Complete props table

## TypeScript

Interface definition

## Accessibility (if applicable)

ARIA, keyboard support notes

## SMRT Mode (if applicable)

Voice input, AI integration behavior
```

### Code Example Standards

- Use TypeScript for all examples
- Include imports
- Show realistic use cases
- Keep examples focused (one concept per example)
- Use `$state` runes for Svelte 5 reactivity
- Include comments only when necessary

## Dependencies & External Systems

### SMRT Monorepo

- **Location**: `../smrt`
- **Required Packages**:
  - `@happyvertical/smrt-svelte`: Component library
  - `@happyvertical/smrt-docs`: Documentation content
- **Build Dependency**: Must build smrt packages before the docs site

### AWS Services

- **S3**: Static file storage
- **CloudFront**: CDN
- **Route53**: DNS
- **ACM**: SSL certificates
- **IAM**: Authentication/authorization

### GitHub

- **Repository**: happyvertical/havesmrt.com
- **Monorepo Dependency**: happyvertical/smrt
- **Actions**: CI/CD pipeline

## Known Issues & Current Limitations

### From Recent Commits

1. **Prerender entries**: Dynamic component routes needed explicit prerender entries
2. **SSR for forms**: Form components had SSR disabled to prevent hydration issues
3. **Build system**: Initially had issues with pnpm vs npm in CI
4. **NPM token**: Required for private smrt package access

### Outstanding Issues

- [ ] Complete component documentation coverage (17 components)
- [ ] Complete module documentation coverage (28 modules)
- [ ] Search functionality not implemented
- [ ] No error tracking
- [ ] No analytics
- [ ] Missing FAQ content
- [ ] Missing reference documentation

### Module Documentation Approach

**Subagent-Driven Documentation**:

To ensure comprehensive and accurate documentation for all 28 SMRT modules, we will use a subagent-driven approach:

1. **Discovery Phase**: For each module, launch an Explore subagent with "very thorough" mode
2. **Analysis**: Subagent analyzes:
   - Source code structure and exports
   - README and existing documentation
   - Test files (revealing usage patterns)
   - Example files and demos
   - Integration with other modules
3. **Outline Generation**: Subagent produces:
   - Tutorial outlines (2-4 per module)
   - Example scenarios (3-5 per module)
   - API reference structure
   - Integration pattern documentation
4. **Human Review**: Review and approve outlines
5. **Content Generation**: Subagent writes full documentation
6. **Integration**: Add documentation to s-m-r-t.dev routes
7. **Validation**: Test all code examples

**Benefits of Subagent Approach**:

- Deep understanding of each module's implementation
- Consistent documentation quality
- Discovery of undocumented features
- Accurate API references
- Realistic, tested examples
- Identification of integration patterns

**Documentation Location**:

- Module docs will live at `/modules/[module-name]`
- Each module gets its own route with subroutes for tutorials, examples, API reference
- Cross-linking between related modules
- Search integration for easy discovery

## Implementation Phases

### Phase 1: Foundation (Current)

**Goal**: Complete core infrastructure and build system

- [x] SvelteKit project setup
- [x] Component library integration
- [x] Basic layout and navigation
- [x] Homepage with examples
- [x] OpenTofu infrastructure
- [x] GitHub Actions CI/CD
- [ ] Verify staging deployment

### Phase 2: Component Documentation

**Goal**: Complete documentation for all components with working examples

Priority Order:

1. Forms components (most used)
2. User components
3. Feedback components
4. Layout components (if any)

For each component:

1. Create documentation page
2. Add 3-5 interactive examples
3. Document all props
4. Add TypeScript definitions
5. Test on mobile

### Phase 3: SMRT Modules Documentation

**Goal**: Comprehensive documentation for all 28 SMRT modules using subagent-driven approach

**Approach**:

- Use Explore subagent for each module (thoroughness: "very thorough")
- Generate 2-4 tutorials per module
- Create 3-5 realistic examples per module
- Document API reference, integration patterns, best practices

**Module Priority**:

1. **Core Foundation** (4 modules): smrt-core, smrt-types, smrt-config, smrt-scanner
2. **High-Usage Feature Modules** (5 modules): smrt-users, smrt-agents, smrt-profiles, smrt-content, smrt-assets
3. **Domain Models** (9 modules): smrt-commerce, smrt-ledgers, smrt-events, smrt-places, smrt-products, smrt-projects, smrt-properties, smrt-tags, smrt-messages
4. **Content & Communication** (3 modules): smrt-analytics, smrt-ads, smrt-gnode
5. **Developer Tools** (3 modules): smrt-cli, smrt-dev-mcp, smrt-vitest
6. **UI & Templates** (4 modules): smrt-svelte, browser-ai, template-site-static-json, template-sveltekit

**Per Module Process**:

1. Launch Explore subagent to analyze module
2. Review subagent findings
3. Approve tutorial/example outlines
4. Subagent generates documentation
5. Human review and refinement
6. Add to s-m-r-t.dev
7. Test all code examples

### Phase 4: Core Documentation

**Goal**: Document SMRT framework concepts

1. Objects documentation (SmrtObject, fields, relationships, AI methods)
2. Agents documentation (concepts, architecture, dispatch, MCP integration)
3. Collections documentation (APIs, querying, pagination)

### Phase 5: Polish & Launch Prep

**Goal**: Production-ready site

1. FAQ page completion
2. Reference documentation
3. Search implementation
4. SEO optimization
5. Analytics integration
6. Performance optimization
7. Accessibility audit
8. Production deployment

### Phase 6: Post-Launch

**Goal**: Continuous improvement

1. Monitor analytics
2. User feedback integration
3. Additional examples based on common questions
4. Video tutorials (optional)
5. Interactive playground (optional)

## Timeline (Effort Estimates)

**Note**: No specific dates, just effort required

- **Phase 1**: ~80% complete, ~2-3 days remaining
- **Phase 2**: ~4-6 days (17 components × 3-5 hours each)
- **Phase 3**: ~14-21 days (28 modules × 4-6 hours each with subagent approach)
  - Core Foundation: ~2-3 days (4 modules, most critical)
  - High-Usage Features: ~2-4 days (5 modules, complex)
  - Domain Models: ~5-7 days (9 modules, varied complexity)
  - Content & Communication: ~1-2 days (3 modules)
  - Developer Tools: ~2-3 days (3 modules, technical)
  - UI & Templates: ~2-3 days (4 modules)
- **Phase 4**: ~2-3 days (core concepts documentation)
- **Phase 5**: ~2-3 days (polish and optimization)
- **Phase 6**: Ongoing

**Total estimated effort**: ~24-36 days of focused work (increased from 11-16 days due to comprehensive module documentation)

## Success Criteria

### Launch Checklist

**Content**:

- [ ] All components documented with working examples (17 components)
- [ ] All SMRT modules documented with tutorials and examples (28 modules)
  - [ ] Core Foundation modules (4/4)
  - [ ] User & Access Management modules (2/2)
  - [ ] Domain Models & Data modules (9/9)
  - [ ] Content & Communication modules (4/4)
  - [ ] Agents & Automation modules (2/2)
  - [ ] Developer Tools & CLI modules (3/3)
  - [ ] UI Components & Frontend modules (2/2)
  - [ ] Project Templates (2/2)
- [ ] Objects, Agents, Collections docs complete
- [ ] FAQ populated with at least 10 questions
- [ ] Reference documentation complete
- [ ] Getting Started guide complete

**Technical**:

- [ ] All pages pre-render successfully
- [ ] Build passes without errors/warnings
- [ ] Tests passing
- [ ] Production deployment successful
- [ ] CloudFront cache working correctly
- [ ] <2s page load times
- [ ] Mobile responsive on all pages

**SEO**:

- [ ] All pages have titles and meta descriptions
- [ ] Sitemap.xml generated
- [ ] robots.txt configured
- [ ] Open Graph tags on all pages

**Quality**:

- [ ] No console errors
- [ ] All links working
- [ ] All code examples tested
- [ ] Accessibility audit passed
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

## Maintenance Plan

### Content Updates

- Component docs: Update when SMRT components change
- Module docs: Update with each module release
- API docs: Update with each SMRT release
- Examples: Add based on community feedback
- Tutorial updates: Refresh when best practices evolve

### Infrastructure

- Monitor CloudFront costs
- Review cache hit ratios monthly
- Update dependencies quarterly
- Security patches as needed

### Deployment

- Staging: Auto-deploy on every main branch push
- Production: Manual deploy via GitHub Actions workflow_dispatch
- Rollback: Revert S3 sync and invalidate CloudFront cache

## Appendix

### File Structure

```
havesmrt.com/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte (homepage)
│   │   ├── components/
│   │   │   ├── [category]/
│   │   │   │   ├── +page.svelte (category index)
│   │   │   │   └── [name]/+page.svelte (component page)
│   │   │   ├── forms/
│   │   │   ├── users/
│   │   │   └── feedback/
│   │   ├── docs/
│   │   │   ├── agents/
│   │   │   ├── objects/
│   │   │   ├── collections/
│   │   │   └── [...slug]/
│   │   ├── faq/
│   │   ├── modules/
│   │   │   ├── +page.svelte (modules index)
│   │   │   ├── [module-name]/
│   │   │   │   ├── +page.svelte (module overview)
│   │   │   │   ├── tutorials/
│   │   │   │   │   └── [tutorial-slug]/+page.svelte
│   │   │   │   ├── examples/
│   │   │   │   │   └── [example-slug]/+page.svelte
│   │   │   │   └── api/+page.svelte (API reference)
│   │   │   ├── smrt-core/
│   │   │   ├── smrt-users/
│   │   │   ├── smrt-agents/
│   │   │   ├── smrt-commerce/
│   │   │   ├── smrt-ledgers/
│   │   │   ├── ... (28 modules total)
│   │   └── reference/
│   ├── lib/
│   │   └── components/
│   │       ├── Header.svelte
│   │       ├── Footer.svelte
│   │       ├── CodeBlock.svelte
│   │       ├── ComponentExample.svelte
│   │       ├── PropsTable.svelte
│   │       └── Grid.svelte
│   └── app.html
├── static/
│   └── (static assets)
├── infra/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── staging.tfvars
│   └── production.tfvars
├── .github/
│   └── workflows/
│       └── build-deploy.yaml
├── package.json
├── svelte.config.js
├── vite.config.ts
└── tsconfig.json
```

### Module Component Browsers

Each module that includes UI components should have its own component browser at `/modules/[module-name]/components/`:

**Structure for modules with components:**

```
/modules/[module-name]/
├── +page.svelte (module overview)
├── components/
│   ├── +page.svelte (component browser index)
│   ├── [component-name]/
│   │   └── +page.svelte (individual component documentation)
├── tutorials/
├── examples/
└── api/
```

**Modules with Component Browsers:**

- **smrt-users**: UserCard, UserAvatar, UserList, UserForm, UserMenu, InviteUser, TenantCard, TenantSwitcher, RoleBadge, RoleSelector, PermissionCheck, MembershipCard, MembershipList
- **smrt-svelte**: All SMRT Svelte form components, UI components, layout components, display components, feedback components
- **browser-ai**: STT/TTS control components, voice input buttons, transcription displays (if applicable)
- **Other modules**: Add component browsers as module-specific UI components are developed

**Component Browser Requirements:**
Each component page must follow the same standards as Section 2 (Component Documentation):

1. Clear description and use cases
2. Installation/import instructions
3. 3-5 interactive examples
4. Complete props table
5. TypeScript interface definition
6. Accessibility notes
7. SMRT mode behavior (if applicable)

### Key Technologies

**Frontend**:

- Svelte 5 (with runes: $state, $derived, $effect)
- SvelteKit 2
- TypeScript 5
- Vite 7

**Documentation**:

- Marked (Markdown parsing)
- gray-matter (YAML frontmatter)
- Syntax highlighting (via CodeBlock component)

**Infrastructure**:

- OpenTofu 1.6+
- AWS CLI
- GitHub Actions

**Build Tools**:

- pnpm (for smrt monorepo)
- npm (for the docs site)
- Vitest (testing)
- Prettier (formatting)
- ESLint (linting)

### Related Resources

- SMRT Monorepo: `../smrt`
- SMRT Svelte Components: `../smrt/packages/smrt-svelte`
- SMRT Docs: `../smrt/docs`
- Infrastructure README: `/infra/README.md`
- GitHub Actions Workflow: `.github/workflows/build-deploy.yaml`

### Complete Module List (28 Total)

**Core Foundation (4)**:

1. smrt-core - Core AI agent framework
2. smrt-types - Shared type definitions
3. smrt-config - Configuration management
4. smrt-scanner - TypeScript scanner for manifest generation

**User & Access Management (2)**: 5. smrt-users - Multi-tenant user management with RBAC 6. smrt-profiles - Profile management with relationships

**Domain Models & Data (9)**: 7. smrt-assets - Asset management with versioning and AI 8. smrt-commerce - Commerce models (contracts, fulfillments, payments) 9. smrt-events - Hierarchical event management 10. smrt-ledgers - Double-entry accounting 11. smrt-places - Hierarchical place management with geo 12. smrt-products - Product catalog and inventory 13. smrt-projects - Provider-agnostic project management 14. smrt-properties - Digital property and zone management 15. smrt-tags - Reusable tagging system

**Content & Communication (4)**: 16. smrt-content - Content processing (documents, web, media) 17. smrt-messages - Email persistence with AI integration 18. smrt-analytics - Analytics integration (GA, Plausible) 19. smrt-ads - Advertising delivery and tracking

**Agents & Automation (2)**: 20. smrt-agents - Agent framework for autonomous actors 21. smrt-gnode - Federation library for local knowledge bases

**Developer Tools & CLI (3)**: 22. smrt-cli - Developer CLI for SMRT framework 23. smrt-dev-mcp - Development MCP server 24. smrt-vitest - Vitest plugin for cross-package testing

**UI Components & Frontend (2)**: 25. smrt-svelte - Svelte 5 components for SMRT 26. browser-ai - Framework-agnostic browser AI (STT, TTS, LLM)

**Project Templates (2)**: 27. template-site-static-json - Static site template with JSON storage 28. template-sveltekit - SvelteKit project template with SMRT

---

**Document Owner**: Will (HappyVertical)
**Last Review**: 2026-01-09
**Next Review**: After Phase 3 completion (module documentation)
