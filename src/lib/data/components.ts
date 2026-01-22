export interface ComponentMeta {
	name: string;
	slug: string;
	description: string;
	status?: 'stable' | 'beta' | 'experimental';
}

export interface CategoryMeta {
	name: string;
	slug: string;
	description: string;
	components: ComponentMeta[];
}

export const categories: CategoryMeta[] = [
	{
		name: 'UI',
		slug: 'ui',
		description: 'Core UI primitives for building interfaces',
		components: [
			{ name: 'Button', slug: 'button', description: 'Interactive button with multiple variants and sizes' },
			{ name: 'Badge', slug: 'badge', description: 'Small status indicator with color variants' },
			{ name: 'Card', slug: 'card', description: 'Container for grouping related content' },
			{ name: 'Pagination', slug: 'pagination', description: 'Page navigation controls' }
		]
	},
	{
		name: 'Layout',
		slug: 'layout',
		description: 'Page structure and layout components',
		components: [
			{ name: 'Container', slug: 'container', description: 'Centered max-width container' },
			{ name: 'Grid', slug: 'grid', description: '12-column responsive grid system' },
			{ name: 'Header', slug: 'header', description: 'Site header with navigation' },
			{ name: 'Footer', slug: 'footer', description: 'Site footer with links' },
			{ name: 'Masthead', slug: 'masthead', description: 'Hero section for page headers' },
			{ name: 'EmptyState', slug: 'empty-state', description: 'Placeholder for empty content areas' },
			{ name: 'PageHeader', slug: 'page-header', description: 'Page title and breadcrumbs' },
			{ name: 'SummaryCard', slug: 'summary-card', description: 'Compact info card for dashboards' }
		]
	},
	{
		name: 'Content',
		slug: 'content',
		description: 'Components for displaying content',
		components: [
			{ name: 'ArticleCard', slug: 'article-card', description: 'Card for article previews' },
			{ name: 'ArticleList', slug: 'article-list', description: 'List of article cards' },
			{ name: 'Markdown', slug: 'markdown', description: 'Render markdown content' }
		]
	},
	{
		name: 'Forms',
		slug: 'forms',
		description: 'Smart form components with validation',
		components: [
			{ name: 'TextInput', slug: 'text-input', description: 'Enhanced text input with SMRT integration' },
			{ name: 'SelectInput', slug: 'smrt-select', description: 'Enhanced select with search' },
			{ name: 'CheckboxInput', slug: 'checkbox', description: 'Checkbox with label' },
			{ name: 'DateTimeInput', slug: 'datetime', description: 'Date and time picker' },
			{ name: 'AddressInput', slug: 'address', description: 'Address input with autocomplete' },
			{ name: 'MoneyInput', slug: 'money', description: 'Currency input with formatting' }
		]
	},
	{
		name: 'Display',
		slug: 'display',
		description: 'Data visualization and display components',
		components: [
			{ name: 'StatusBadge', slug: 'status-badge', description: 'Status indicator with semantic colors' },
			{ name: 'ConfidenceBadge', slug: 'confidence-badge', description: 'Show confidence scores' },
			{ name: 'CurrencyDisplay', slug: 'currency-display', description: 'Formatted currency values' },
			{ name: 'DateDisplay', slug: 'date-display', description: 'Formatted dates with relative time' },
			{ name: 'Icon', slug: 'icon', description: 'Icon component with multiple sets' }
		]
	},
	{
		name: 'Feedback',
		slug: 'feedback',
		description: 'User feedback and progress components',
		components: [
			{ name: 'ProgressBar', slug: 'progress-bar', description: 'Progress indicator with percentage' },
			{ name: 'ConfirmDialog', slug: 'confirm-dialog', description: 'Confirmation modal dialog' },
			{ name: 'Modal', slug: 'modal', description: 'Accessible dialog component with multiple sizes' }
		]
	},
	{
		name: 'Users',
		slug: 'users',
		description: 'User management components',
		components: [
			{ name: 'UserAvatar', slug: 'user-avatar', description: 'User avatar with fallback' },
			{ name: 'UserCard', slug: 'user-card', description: 'User profile card' },
			{ name: 'UserForm', slug: 'user-form', description: 'User creation/edit form' },
			{ name: 'UserList', slug: 'user-list', description: 'List of users with actions' },
			{ name: 'UserMenu', slug: 'user-menu', description: 'User dropdown menu' },
			{ name: 'InviteUserModal', slug: 'invite-user', description: 'Modal for inviting users' }
		]
	},
	{
		name: 'Calendar',
		slug: 'calendar',
		description: 'Date and calendar components',
		components: [
			{ name: 'Calendar', slug: 'calendar', description: 'Month view calendar' },
			{ name: 'DayView', slug: 'day-view', description: 'Single day schedule view' }
		]
	}
];

export function getCategory(slug: string): CategoryMeta | undefined {
	return categories.find((c) => c.slug === slug);
}

export function getComponent(categorySlug: string, componentSlug: string): ComponentMeta | undefined {
	const category = getCategory(categorySlug);
	return category?.components.find((c) => c.slug === componentSlug);
}

export function getAllComponents(): Array<ComponentMeta & { category: string }> {
	return categories.flatMap((cat) =>
		cat.components.map((comp) => ({ ...comp, category: cat.slug }))
	);
}
