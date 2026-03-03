export interface ComponentMeta {
	name: string;
	slug: string;
	description: string;
}

export interface CategoryMeta {
	slug: string;
	name: string;
	description: string;
	components: ComponentMeta[];
}

export const categories: CategoryMeta[] = [
	{
		slug: 'admin',
		name: 'Admin',
		description: 'Agent administration and settings',
		components: [
			{
				name: 'AgentAdminPanel',
				slug: 'agent-admin-panel',
				description: 'Full admin panel for managing agents'
			},
			{
				name: 'AgentAdminTabs',
				slug: 'agent-admin-tabs',
				description: 'Tabbed interface for agent administration'
			},
			{
				name: 'AgentSettingsShell',
				slug: 'agent-settings-shell',
				description: 'Shell layout for agent settings pages'
			}
		]
	},
	{
		slug: 'calendar',
		name: 'Calendar',
		description: 'Date and calendar display',
		components: [
			{ name: 'Calendar', slug: 'calendar', description: 'Month calendar view' },
			{ name: 'DayView', slug: 'day-view', description: 'Single day schedule view' }
		]
	},
	{
		slug: 'data',
		name: 'Data',
		description: 'Data display and table components',
		components: [
			{
				name: 'DataTable',
				slug: 'data-table',
				description: 'Sortable, filterable data table'
			}
		]
	},
	{
		slug: 'display',
		name: 'Display',
		description: 'Visual display components',
		components: [
			{
				name: 'ConfidenceBadge',
				slug: 'confidence-badge',
				description: 'Badge showing confidence scores'
			},
			{
				name: 'CurrencyDisplay',
				slug: 'currency-display',
				description: 'Formatted currency display'
			},
			{
				name: 'DateDisplay',
				slug: 'date-display',
				description: 'Formatted date display with relative time'
			},
			{ name: 'Icon', slug: 'icon', description: 'SVG icon component' },
			{
				name: 'StatusBadge',
				slug: 'status-badge',
				description: 'Color-coded status indicator badge'
			}
		]
	},
	{
		slug: 'feedback',
		name: 'Feedback',
		description: 'User feedback and modal components',
		components: [
			{
				name: 'ConfirmDialog',
				slug: 'confirm-dialog',
				description: 'Confirmation dialog with accept/cancel'
			},
			{
				name: 'LoadingOverlay',
				slug: 'loading-overlay',
				description: 'Full-screen loading overlay'
			},
			{ name: 'Modal', slug: 'modal', description: 'Accessible modal dialog' },
			{
				name: 'ProgressBar',
				slug: 'progress-bar',
				description: 'Determinate and indeterminate progress bar'
			}
		]
	},
	{
		slug: 'forms',
		name: 'Forms',
		description: 'Form inputs with validation and SMRT integration',
		components: [
			{
				name: 'AddressInput',
				slug: 'address-input',
				description: 'Address input with autocomplete'
			},
			{
				name: 'CheckboxInput',
				slug: 'checkbox-input',
				description: 'Checkbox with label'
			},
			{
				name: 'DateRangeInput',
				slug: 'date-range-input',
				description: 'Date range picker with start/end'
			},
			{
				name: 'DateTimeInput',
				slug: 'datetime-input',
				description: 'Date and time picker'
			},
			{
				name: 'FileUpload',
				slug: 'file-upload',
				description: 'File upload with drag-and-drop'
			},
			{
				name: 'Form',
				slug: 'form',
				description: 'Form wrapper with submission handling'
			},
			{
				name: 'FormGroup',
				slug: 'form-group',
				description: 'Form field grouping with label and error'
			},
			{
				name: 'FormMicButton',
				slug: 'form-mic-button',
				description: 'Microphone button for voice input in forms'
			},
			{
				name: 'Input',
				slug: 'input',
				description: 'Base input component'
			},
			{
				name: 'MeasurementInput',
				slug: 'measurement-input',
				description: 'Numeric input with unit selection'
			},
			{
				name: 'MoneyInput',
				slug: 'money-input',
				description: 'Monetary input with currency formatting'
			},
			{
				name: 'NumberInput',
				slug: 'number-input',
				description: 'Numeric input with increment/decrement'
			},
			{
				name: 'PhoneInput',
				slug: 'phone-input',
				description: 'Phone number input with formatting'
			},
			{
				name: 'SearchInput',
				slug: 'search-input',
				description: 'Search input with debounce and clear'
			},
			{
				name: 'Select',
				slug: 'select',
				description: 'Native select dropdown'
			},
			{
				name: 'SelectInput',
				slug: 'select-input',
				description: 'Enhanced select with search and filtering'
			},
			{
				name: 'Textarea',
				slug: 'textarea',
				description: 'Multi-line text input'
			},
			{
				name: 'TextareaInput',
				slug: 'textarea-input',
				description: 'Enhanced textarea with character count'
			},
			{
				name: 'TextInput',
				slug: 'text-input',
				description: 'Enhanced text input with SMRT integration'
			},
			{
				name: 'Toggle',
				slug: 'toggle',
				description: 'Toggle switch for boolean values'
			}
		]
	},
	{
		slug: 'layout',
		name: 'Layout',
		description: 'Structure and layout components',
		components: [
			{
				name: 'Container',
				slug: 'container',
				description: 'Centered content container with max-width'
			},
			{
				name: 'EmptyState',
				slug: 'empty-state',
				description: 'Placeholder for empty content areas'
			},
			{ name: 'Footer', slug: 'footer', description: 'Page footer with links and copyright' },
			{ name: 'Grid', slug: 'grid', description: 'Responsive grid system' },
			{ name: 'Header', slug: 'header', description: 'Page header with navigation' },
			{
				name: 'Masthead',
				slug: 'masthead',
				description: 'Hero section with title and actions'
			},
			{
				name: 'PageHeader',
				slug: 'page-header',
				description: 'Page title with breadcrumb and actions'
			},
			{
				name: 'SummaryCard',
				slug: 'summary-card',
				description: 'Metric display card with label and value'
			}
		]
	},
	{
		slug: 'memberships',
		name: 'Memberships',
		description: 'Membership display components',
		components: [
			{
				name: 'MembershipCard',
				slug: 'membership-card',
				description: 'Individual membership display card'
			},
			{
				name: 'MembershipList',
				slug: 'membership-list',
				description: 'List of membership entries'
			}
		]
	},
	{
		slug: 'module',
		name: 'Module',
		description: 'Module UI components',
		components: [
			{
				name: 'ModulePanel',
				slug: 'module-panel',
				description: 'Panel for displaying module-registered UI'
			}
		]
	},
	{
		slug: 'nav',
		name: 'Navigation',
		description: 'Navigation and filtering',
		components: [
			{
				name: 'FilterChips',
				slug: 'filter-chips',
				description: 'Chip-based filter selection'
			},
			{ name: 'Tabs', slug: 'tabs', description: 'Tab navigation component' }
		]
	},
	{
		slug: 'permissions',
		name: 'Permissions',
		description: 'Permission and role components',
		components: [
			{
				name: 'PermissionCheck',
				slug: 'permission-check',
				description: 'Conditionally render content based on permissions'
			}
		]
	},
	{
		slug: 'roles',
		name: 'Roles',
		description: 'Role display and selection',
		components: [
			{
				name: 'RoleBadge',
				slug: 'role-badge',
				description: 'Badge displaying a user role'
			},
			{
				name: 'RoleSelector',
				slug: 'role-selector',
				description: 'Dropdown for selecting user roles'
			}
		]
	},
	{
		slug: 'theme',
		name: 'Theme',
		description: 'Theme management components',
		components: [
			{
				name: 'ThemeProvider',
				slug: 'theme-provider',
				description: 'Provides theme context with CSS custom properties'
			}
		]
	},
	{
		slug: 'ui',
		name: 'UI',
		description: 'General-purpose UI components',
		components: [
			{ name: 'Badge', slug: 'badge', description: 'Status and label badges' },
			{ name: 'Button', slug: 'button', description: 'Button with variants and sizes' },
			{ name: 'Card', slug: 'card', description: 'Content card container' },
			{
				name: 'Pagination',
				slug: 'pagination',
				description: 'Page navigation with prev/next and page numbers'
			}
		]
	}
];

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
	return categories.find((c) => c.slug === slug);
}

export function getComponentBySlug(
	categorySlug: string,
	componentSlug: string
): ComponentMeta | undefined {
	const category = getCategoryBySlug(categorySlug);
	return category?.components.find((c) => c.slug === componentSlug);
}
