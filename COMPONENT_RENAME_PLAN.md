# s-m-r-t Component Naming Convention & Migration Plan

## Current Issues

1. Inconsistent naming: some components have "SMRT" prefix, others don't
2. Form components have both `SMRTTextInput` and `Input` variants
3. "SMRT" branding in component names is redundant (they're from smrt-svelte)
4. No clear pattern for specialized vs. basic components

## Naming Conventions

### General Principles

1. **Remove "SMRT" prefix** - Component library name implies origin
2. **Add "Input" suffix** for form inputs - Makes it clear they're form fields
3. **Keep specialized names descriptive** - e.g., `ConfirmDialog`, `DateDisplay`
4. **Category folders organize components** - /forms, /display, /feedback, etc.

### Naming Patterns by Category

#### Form Components (suffix: Input)

- Basic inputs end in `Input`: `TextInput`, `NumberInput`, `SelectInput`
- Complex inputs use descriptive names: `DateRangeInput`, `MoneyInput`, `AddressInput`
- Non-inputs keep semantic names: `Form`, `FormGroup`, `Toggle`, `Checkbox`

#### Display Components (suffix: Display or Badge)

- Value formatters end in `Display`: `DateDisplay`, `CurrencyDisplay`
- Status indicators end in `Badge`: `StatusBadge`, `ConfidenceBadge`, `RoleBadge`
- Icons and visual elements: `Icon`, descriptive names

#### Layout Components

- Semantic names: `Container`, `Grid`, `Header`, `Footer`, `PageHeader`
- Cards and panels: `Card`, `SummaryCard`

## Component Renames

### Forms Category

| Current Name      | New Name            | Reason                                 |
| ----------------- | ------------------- | -------------------------------------- |
| `SMRTTextInput`   | `TextInput`         | Remove SMRT, keep Input suffix         |
| `SMRTTextarea`    | `TextareaInput`     | Add Input suffix for consistency       |
| `SMRTNumber`      | `NumberInput`       | Remove SMRT, add Input suffix          |
| `SMRTSelect`      | `SelectInput`       | Remove SMRT, add Input suffix          |
| `SMRTCheckbox`    | `CheckboxInput`     | Remove SMRT, add Input suffix          |
| `SMRTToggle`      | `Toggle`            | Remove SMRT, Toggle is semantic enough |
| `SMRTDateTime`    | `DateTimeInput`     | Remove SMRT, add Input suffix          |
| `SMRTDateRange`   | `DateRangeInput`    | Remove SMRT, add Input suffix          |
| `SMRTMoney`       | `MoneyInput`        | Remove SMRT, add Input suffix          |
| `SMRTPhone`       | `PhoneInput`        | Remove SMRT, add Input suffix          |
| `SMRTAddress`     | `AddressInput`      | Remove SMRT, add Input suffix          |
| `SMRTMeasurement` | `MeasurementInput`  | Remove SMRT, add Input suffix          |
| `SMRTSearchInput` | `SearchInput`       | Remove SMRT, already has Input         |
| `SMRTForm`        | `Form`              | Remove SMRT                            |
| `Input`           | _(keep or remove?)_ | Duplicate - decide if needed           |
| `Select`          | _(keep or remove?)_ | Duplicate - decide if needed           |
| `Textarea`        | _(keep or remove?)_ | Duplicate - decide if needed           |
| `Toggle`          | _(keep as-is)_      | No SMRT prefix                         |

**Decision needed**: Keep duplicate base components (`Input`, `Select`, `Textarea`) or consolidate?

### Display Category

| Current Name      | New Name       | Reason       |
| ----------------- | -------------- | ------------ |
| `SMRTIcon`        | `Icon`         | Remove SMRT  |
| `DateDisplay`     | _(keep as-is)_ | Already good |
| `CurrencyDisplay` | _(keep as-is)_ | Already good |
| `ConfidenceBadge` | _(keep as-is)_ | Already good |
| `StatusBadge`     | _(keep as-is)_ | Already good |

### AI Category

| Current Name       | New Name                 | Reason                                                                                 |
| ------------------ | ------------------------ | -------------------------------------------------------------------------------------- |
| `SmrtProvider`     | `SMRT`                   | Short, distinctive, represents framework. Similar to `<Suspense>`, `<Router>` patterns |
| `AILoadingOverlay` | _(refactor - see below)_ | Extract generic LoadingOverlay, keep AILoadingOverlay as wrapper                       |
| `CapabilityGate`   | _(keep as-is)_           | Clear and descriptive                                                                  |
| `VoiceInput`       | _(keep as-is)_           | Clear and descriptive                                                                  |

#### AILoadingOverlay Refactor

**Create new generic component:**

- `LoadingOverlay` (feedback category) - Generic overlay for any loading state

**Refactor existing:**

- `AILoadingOverlay` becomes a thin wrapper around `LoadingOverlay` that reads from AI context

**Rationale:**

- `LoadingOverlay` can be used for uploads, downloads, processing, etc.
- `AILoadingOverlay` stays as convenience wrapper for AI-specific features
- Clean separation: generic UI vs AI-specific logic

**Generic LoadingOverlay props:**

```typescript
interface LoadingOverlayProps {
	show: boolean;
	message?: string;
	progress?: number; // 0-100
	items?: string[]; // completed items (files, adapters, etc)
	error?: { message: string };
	dismissible?: boolean;
	class?: string;
}
```

**AILoadingOverlay implementation:**

```svelte
<script>
	import { getAppStateContext } from '../../state/context.js';
	import LoadingOverlay from '../feedback/LoadingOverlay.svelte';
	// ... AI-specific logic to map state to props
</script>

<LoadingOverlay
	show={aiState.isAILoading}
	message={getPhaseLabel(aiState.phase)}
	progress={aiState.overallProgress}
	items={aiState.loaded}
	error={aiState.error}
	{dismissible}
/>
```

### Other Categories (No Changes)

- **feedback/**: `ConfirmDialog`, `Modal`, `ProgressBar` - all good
- **layout/**: All good
- **ui/**: `Badge`, `Button`, `Card`, `Pagination` - all good
- **nav/**: `Tabs`, `FilterChips` - all good
- **data/**: `DataTable` - good

## Migration Strategy

**Clean break - no deprecation period, no backwards compatibility.**

### Single Phase: Rename Everything

1. Rename component files in smrt-svelte
2. Update all exports in index.ts
3. Update TypeScript types
4. Update all documentation
5. Update all affected projects:
   - havesmrt.com
   - nunitus
   - praeco
   - domacraft.com
   - smrt packages (events, projects, commerce, template)
6. Bump smrt-svelte to v2.0.0 (breaking change)
7. Create migration issue for each affected project
8. Complete all migrations in one PR per project

## Implementation Checklist

**In smrt-svelte:**

- [ ] Rename component files (SmrtProvider.svelte → SMRT.svelte, etc.)
- [ ] Create new generic `LoadingOverlay` component in feedback/
- [ ] Refactor `AILoadingOverlay` to use generic `LoadingOverlay`
- [ ] Update index.ts exports
- [ ] Update TypeScript types
- [ ] Update all documentation
- [ ] Update playground examples
- [ ] Test all renamed components
- [ ] Update CHANGELOG.md for v2.0.0

**In havesmrt.com:**

- [ ] Update all component imports
- [ ] Update all component pages/docs
- [ ] Update examples
- [ ] Test site

**In other projects:**

- [ ] Create migration issue for nunitus
- [ ] Create migration issue for praeco
- [ ] Create migration issue for domacraft.com
- [ ] Update smrt packages (events, projects, commerce, template)

## Migration Guide Template

For posting as issues in affected projects:

````markdown
# smrt-svelte v2.0 - Component Naming Update

The smrt-svelte component library has been updated to v2.0 with cleaner, more consistent component names.

## What Changed

### Forms (remove SMRT, add Input suffix)

- `SMRTTextInput` → `TextInput`
- `SMRTSelect` → `SelectInput`
- `SMRTNumber` → `NumberInput`
- `SMRTDateTime` → `DateTimeInput`
- `SMRTDateRange` → `DateRangeInput`
- `SMRTMoney` → `MoneyInput`
- `SMRTPhone` → `PhoneInput`
- `SMRTAddress` → `AddressInput`
- `SMRTMeasurement` → `MeasurementInput`
- `SMRTSearchInput` → `SearchInput`
- `SMRTCheckbox` → `CheckboxInput`
- `SMRTTextarea` → `TextareaInput`
- `SMRTForm` → `Form`

### Display

- `SMRTIcon` → `Icon`

### Provider

- `SmrtProvider` → `SMRT`

## Migration Steps

1. **Find all usages**:
   ```bash
   grep -r "SMRT\|Smrt" --include="*.svelte" --include="*.ts" src/
   ```
````

2. **Update imports**:

   ```typescript
   // Before
   import { SMRTTextInput, SMRTSelect, SmrtProvider } from 'smrt-svelte';

   // After
   import { TextInput, SelectInput, SMRT } from 'smrt-svelte';
   ```

3. **Update component usage**:

   ```svelte
   <!-- Before -->
   <SmrtProvider {mode} {user}>
   	<SMRTTextInput bind:value={name} />
   	<SMRTSelect {options} bind:value={selected} />
   </SmrtProvider>

   <!-- After -->
   <SMRT {mode} {user}>
   	<TextInput bind:value={name} />
   	<SelectInput {options} bind:value={selected} />
   </SMRT>
   ```

## Breaking Change

This is a **breaking change**. Old component names no longer work. You must update all imports and usages.

## Questions?

Comment on this issue if you need help with migration.

````

## Special Case: The Framework Provider

### `SmrtProvider` → `SMRT`

The app context provider becomes `SMRT`. Simple, distinctive, memorable.

**Rationale:**
- Short and distinctive: `<SMRT>` immediately identifies the framework
- Follows pattern of short provider names: `<Suspense>`, `<Router>`, etc.
- No confusion about which name to use

**Implementation:**
```typescript
// SMRT.svelte is the actual file
export { default as SMRT } from './SMRT.svelte';
````

**Usage:**

```svelte
<SMRT mode="smrt" user={$user} permissions={$permissions}>
	<App />
</SMRT>
```

## Questions to Resolve

1. **Duplicate base components**: Should we keep both `Input` and `TextInput` or consolidate?
   - Recommendation: Remove bare `Input`, `Select`, `Textarea` - always use descriptive names

2. **Textarea vs TextareaInput**: Should multi-line inputs follow the same pattern?
   - Recommendation: `TextareaInput` for consistency

3. **What about non-form Toggle and Checkbox**? Are they buttons or inputs?
   - Recommendation: `Toggle` stays (it's a switch), `Checkbox` becomes `CheckboxInput`
