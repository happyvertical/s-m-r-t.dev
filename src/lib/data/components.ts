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
		slug: 'layout',
		name: 'Layout',
		description: 'Structure and layout components',
		components: [
			{ name: 'Grid', slug: 'grid', description: 'Responsive grid system' },
			{ name: 'SummaryCard', slug: 'summary-card', description: 'Metric display card' }
		]
	},
	{
		slug: 'display',
		name: 'Display',
		description: 'Visual display components',
		components: [
			{ name: 'Icon', slug: 'icon', description: 'SVG icon component' },
			{ name: 'Badge', slug: 'badge', description: 'Status and label badges' },
			{ name: 'ThemeSwitcher', slug: 'theme-switcher', description: 'Theme selection control' },
			{ name: 'ColorSchemeToggle', slug: 'color-scheme-toggle', description: 'Light/dark mode toggle' }
		]
	},
	{
		slug: 'forms',
		name: 'Forms',
		description: 'Smart form components with validation',
		components: [
			{ name: 'TextInput', slug: 'text-input', description: 'Enhanced text input with SMRT integration' },
			{ name: 'SelectInput', slug: 'smrt-select', description: 'Enhanced select with search' },
			{ name: 'CheckboxInput', slug: 'checkbox', description: 'Checkbox with label' },
			{ name: 'DateTimeInput', slug: 'datetime', description: 'Date and time picker' },
			{ name: 'AddressInput', slug: 'address', description: 'Address input with autocomplete' },
			{ name: 'MoneyInput', slug: 'money', description: 'Monetary input in cents' }
		]
	}
];

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
	return categories.find((c) => c.slug === slug);
}

export function getComponentBySlug(categorySlug: string, componentSlug: string): ComponentMeta | undefined {
	const category = getCategoryBySlug(categorySlug);
	return category?.components.find((c) => c.slug === componentSlug);
}
