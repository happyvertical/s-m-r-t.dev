# smrt-svelte Component Map (After v2.0 Refactor)

Comprehensive list of all components organized by category.

## Quick Stats

- **Total Components:** ~95
- **Renamed:** 16
- **New:** 1 (LoadingOverlay)
- **Refactored:** 1 (AILoadingOverlay)
- **To Remove:** 3 (duplicate Input, Select, Textarea)

## Component Tree

```
smrt-svelte/
├── SMRT (provider)
├── forms/ (16)
│   ├── TextInput, TextareaInput, SearchInput
│   ├── NumberInput, MoneyInput, MeasurementInput
│   ├── SelectInput, CheckboxInput, Toggle
│   ├── DateTimeInput, DateRangeInput
│   ├── PhoneInput, AddressInput
│   └── Form, FormGroup, FormMicButton
├── display/ (8)
│   ├── badges: StatusBadge, ConfidenceBadge, RoleBadge, ScheduleStatusBadge
│   ├── data: DateDisplay, CurrencyDisplay, DurationDisplay
│   └── Icon, UserAvatar
├── feedback/ (5)
│   ├── LoadingOverlay (NEW), Modal, ConfirmDialog
│   └── ProgressBar, DownloadProgress
├── layout/ (8)
│   ├── Container, Grid, Header, Footer, Masthead, PageHeader
│   └── Card, SummaryCard, EmptyState
├── navigation/ (2)
│   └── Tabs, FilterChips
├── ui/ (3)
│   └── Badge, Button, Pagination
├── ai/ (4)
│   ├── AILoadingOverlay (refactored), CapabilityGate
│   └── VoiceInput, STTTest
└── domain-specific/ (48)
    ├── admin/ (3)
    ├── agents/ (5)
    ├── auth/ (1)
    ├── calendar/ (2)
    ├── commerce/ (6)
    ├── content/ (3)
    ├── data/ (1)
    ├── jobs/ (6)
    ├── meetings/ (1)
    ├── memberships/ (2)
    ├── module/ (1)
    ├── permissions/ (1)
    ├── roles/ (1)
    ├── tenants/ (2)
    ├── theme/ (1)
    ├── time/ (7)
    └── users/ (5)
```

## Core

### Provider
- `SMRT` - App context provider (mode, user, permissions)

## Forms

### Text Inputs
- `TextInput` - Single-line text input
- `TextareaInput` - Multi-line text input
- `SearchInput` - Search input with icon

### Number Inputs
- `NumberInput` - Basic number input
- `MoneyInput` - Currency input with formatting
- `MeasurementInput` - Measurement with unit selector

### Selection
- `SelectInput` - Dropdown select
- `CheckboxInput` - Checkbox with label
- `Toggle` - Toggle switch

### Date/Time
- `DateTimeInput` - Date and time picker
- `DateRangeInput` - Start/end date range picker

### Contact
- `PhoneInput` - Phone number with formatting
- `AddressInput` - Full address with autocomplete

### Form Components
- `Form` - Form wrapper with validation
- `FormGroup` - Form field wrapper with label/error
- `FormMicButton` - Voice input trigger for forms

### Legacy (to remove?)
- `Input` - Basic input (duplicate of TextInput?)
- `Select` - Basic select (duplicate of SelectInput?)
- `Textarea` - Basic textarea (duplicate of TextareaInput?)

## Display

### Badges
- `StatusBadge` - Status indicator badge
- `ConfidenceBadge` - Confidence score badge
- `RoleBadge` - User role badge
- `ScheduleStatusBadge` - Agent schedule status

### Data Display
- `DateDisplay` - Formatted date display
- `CurrencyDisplay` - Formatted currency display
- `DurationDisplay` - Time duration display

### Icons & Visuals
- `Icon` - Icon component
- `UserAvatar` - User avatar with fallback

## Feedback

### Overlays & Modals
- `LoadingOverlay` - **NEW** Generic loading overlay (progress, items, error)
- `Modal` - Generic modal dialog
- `ConfirmDialog` - Confirmation dialog

### Progress
- `ProgressBar` - Progress bar component
- `DownloadProgress` - Download progress with bytes/percent

## Layout

### Structure
- `Container` - Content container
- `Grid` - Grid layout
- `Header` - Page header
- `Footer` - Page footer
- `Masthead` - Site masthead
- `PageHeader` - Page title header

### Cards
- `Card` - Generic card
- `SummaryCard` - Summary stat card
- `EmptyState` - Empty state placeholder

## Navigation

- `Tabs` - Tab navigation
- `FilterChips` - Filter chip toggles

## UI

- `Badge` - Generic badge
- `Button` - Generic button
- `Pagination` - Pagination controls

## AI

### Provider & Gates
- `AILoadingOverlay` - AI-specific loading (wraps LoadingOverlay)
- `CapabilityGate` - Conditional render based on AI capabilities

### Voice
- `VoiceInput` - Voice input component
- `STTTest` - Speech-to-text test component

## Admin

- `AgentAdminPanel` - Agent administration panel
- `AgentAdminTabs` - Agent admin tab navigation
- `AgentSettingsShell` - Agent settings shell

## Agents

- `AgentDashboard` - Agent overview dashboard
- `AgentRunHistory` - Agent execution history
- `AgentScheduleForm` - Schedule editor form
- `AgentScheduleList` - Schedule list view

## Auth

- `UserMenu` - User menu dropdown

## Calendar

- `Calendar` - Full calendar view
- `DayView` - Single day calendar view

## Commerce

### Invoices
- `InvoiceActions` - Invoice action buttons
- `InvoiceCard` - Invoice summary card
- `InvoiceHeader` - Invoice header info
- `InvoiceLineItems` - Invoice line items table
- `InvoiceTotals` - Invoice totals display
- `UnbilledItems` - Unbilled items list

## Content

- `ArticleCard` - Article preview card
- `ArticleList` - Article list view
- `Markdown` - Markdown renderer

## Data

- `DataTable` - Generic data table

## Jobs

- `JobActions` - Job action buttons
- `JobDashboard` - Jobs overview dashboard
- `JobDetail` - Job detail view
- `JobList` - Jobs list view
- `JobStats` - Job statistics display
- `JobStatusBadge` - Job status badge

## Meetings

- `MeetingView` - Meeting detail view

## Memberships

- `MembershipCard` - Membership card
- `MembershipList` - Membership list

## Module

- `ModulePanel` - Module configuration panel

## Permissions

- `PermissionCheck` - Conditional render based on permissions

## Roles

- `RoleSelector` - Role picker dropdown

## Tenants

- `TenantCard` - Tenant info card
- `TenantSwitcher` - Tenant switcher dropdown

## Theme

- `ThemeProvider` - Theme provider (colors, mode)

## Time Tracking

- `ApprovalActions` - Time entry approval actions
- `BulkActions` - Bulk time entry actions
- `RejectDialog` - Time entry rejection dialog
- `TimeEntryCard` - Time entry card
- `TimeEntryList` - Time entries list
- `TimeSummary` - Time summary stats

## Users

- `InviteUserModal` - User invitation modal
- `UserCard` - User profile card
- `UserForm` - User edit form
- `UserList` - Users list view

---

## Summary

**Total Components:** ~95

### By Category
- **Core:** 1 (SMRT)
- **Forms:** 16 (15 after removing duplicates)
- **Display:** 8
- **Feedback:** 5 (includes new LoadingOverlay)
- **Layout:** 8
- **Navigation:** 2
- **UI:** 3
- **AI:** 4
- **Domain-specific:** ~48 (admin, agents, auth, calendar, commerce, content, data, jobs, meetings, memberships, module, permissions, roles, tenants, theme, time, users)

### Changes in v2.0
- **Renamed:** 16 components (13 forms + Icon + SMRT + Toggle → Toggle)
- **New:** 1 (LoadingOverlay)
- **Refactored:** 1 (AILoadingOverlay)
- **To Remove:** 3 (duplicate Input, Select, Textarea)

### Open Questions
1. Remove duplicate base components (Input, Select, Textarea)?
2. Any other components that should be consolidated?
3. Are all domain-specific components being used?
