import { describe, expect, it } from 'vitest';
import {
	cleanSummary,
	limitToSentences,
	renderInlineTags,
	stripLeadingName,
	summarizeHeader
} from './ui-summary.mjs';

const block = (...lines) => `/**\n${lines.map((line) => ` * ${line}`.trimEnd()).join('\n')}\n */`;

describe('summarizeHeader', () => {
	it('keeps the first paragraph only', () => {
		const raw = block('Shows the list.', 'Wraps onto a second line.', '', 'A second paragraph.');
		expect(summarizeHeader(raw, 'List')).toBe('Shows the list. Wraps onto a second line.');
	});

	it('stops before a feature list, its introducer and a code fence', () => {
		const list = block('Table of rows.', 'Features:', '- Sortable', '- Selectable');
		expect(summarizeHeader(list, 'Table')).toBe('Table of rows.');
		const fenced = block('Pick a date.', '```svelte', '<Picker />', '```');
		expect(summarizeHeader(fenced, 'Picker')).toBe('Pick a date.');
		const flattened = block('Pick a date. ```svelte', '<Picker />', '```');
		expect(summarizeHeader(flattened, 'Picker')).not.toContain('```');
	});

	it('drops a changelog tail from the title line', () => {
		expect(summarizeHeader(block('Tabs - Tab navigation refactored for Material 3'), 'Tabs')).toBe(
			'Tab navigation.'
		);
		expect(cleanSummary('Tab navigation refactored for Material 3', 'Tabs')).toBe(
			'Tab navigation.'
		);
	});

	it('joins a bare title with the paragraph after it', () => {
		const raw = block('MeetingView Component', '', 'Displays details for a meeting.');
		expect(summarizeHeader(raw, 'MeetingView')).toBe('Displays details for a meeting.');
	});

	it('closes a title line instead of running it into the next sentence', () => {
		const raw = block(
			'Bulk action bar for selected assets',
			'Appears when one or more are selected.'
		);
		expect(summarizeHeader(raw, 'ActionBar')).toBe(
			'Bulk action bar for selected assets. Appears when one or more are selected.'
		);
	});

	it('joins a short title with the paragraph after it', () => {
		const raw = block(
			'Tabs - Tab navigation',
			'',
			'Provides tabbed navigation.',
			'',
			'Usage:',
			'- one'
		);
		expect(summarizeHeader(raw, 'Tabs')).toBe('Tab navigation. Provides tabbed navigation.');
	});

	it('joins a long title, whatever its word count, with the next paragraph', () => {
		const raw = block(
			'InvoiceLineItems - Line items table for invoices/estimates',
			'',
			'Displays line items. Supports both read-only and editable modes.'
		);
		expect(summarizeHeader(raw, 'InvoiceLineItems')).toBe(
			'Line items table for invoices/estimates. Displays line items. Supports both read-only and editable modes.'
		);
	});

	it('joins a title and its changelog line with the paragraph after them', () => {
		const raw = block(
			'ConfirmDialog - Modal confirmation dialog',
			'refactored for Material 3',
			'',
			'Provides a consistent dialog for destructive actions.'
		);
		expect(summarizeHeader(raw, 'ConfirmDialog')).toBe(
			'Modal confirmation dialog. Provides a consistent dialog for destructive actions.'
		);
	});

	it('does not join a title with a list introducer, a list or a changelog note', () => {
		for (const after of [
			['Features:', '- a', '- b'],
			['- a', '- b'],
			['```', 'code', '```']
		]) {
			const raw = block('Gauge - Round meter', '', ...after);
			expect(summarizeHeader(raw, 'Gauge')).toBe('Round meter.');
		}
	});

	it('uses the next paragraph when the title is only the component name', () => {
		const raw = block('MeetingView Component', '', 'Displays a meeting.');
		expect(summarizeHeader(raw, 'MeetingView')).toBe('Displays a meeting.');
		expect(summarizeHeader(block('Chat', '', 'Renders a chat.'), 'Chat')).toBe('Renders a chat.');
	});

	it('ends every summary with terminal punctuation', () => {
		expect(summarizeHeader(block('Gauge - Round meter'), 'Gauge')).toBe('Round meter.');
		expect(summarizeHeader(block('A card (see Card)'), 'Other')).toBe('A card (see Card).');
		expect(cleanSummary('Props for Icon component', 'Icon')).toBe('Props for Icon component.');
		expect(cleanSummary('Says "done."', 'X')).toBe('Says "done."');
	});

	it('keeps a name followed by a quotation, which is not a title', () => {
		const raw = block('WorkingStrip \u2014 "something is working" status.');
		expect(summarizeHeader(raw, 'WorkingStrip')).toBe(
			'WorkingStrip \u2014 "something is working" status.'
		);
	});

	it('returns nothing for a header without prose', () => {
		expect(summarizeHeader(block('@internal'), 'X')).toBe('');
	});
});

describe('renderInlineTags', () => {
	it('renders links as plain text', () => {
		expect(renderInlineTags('Renders {@link ToolsDockInstance} now')).toBe(
			'Renders ToolsDockInstance now'
		);
		expect(renderInlineTags('See {@link defineToolsDock the factory}.')).toBe('See the factory.');
		expect(renderInlineTags('{@linkcode A} and {@linkplain B | label}')).toBe('A and label');
	});

	it('leaves other braces alone', () => {
		expect(renderInlineTags('never `{@html}`')).toBe('never `{@html}`');
	});
});

describe('stripLeadingName', () => {
	it.each([
		['Card - A card for items.', 'Card', 'A card for items.'],
		['Card — a card for items.', 'Card', 'A card for items.'],
		['Card: a card for items.', 'Card', 'A card for items.'],
		['Card Component a card for items.', 'Card', 'A card for items.'],
		['XYZCard - a card for items.', 'Card', 'A card for items.'],
		['Card. Renders items.', 'Card', 'Renders items.'],
		['Card List Component. Shows lists.', 'CardList', 'Shows lists.'],
		['AI Loading Overlay Component. Shows a overlay.', 'AILoadingOverlay', 'Shows a overlay.'],
		['Loading Overlay Component. A overlay.', 'LoadingOverlay', 'A overlay.']
	])('%s', (text, name, expected) => {
		expect(stripLeadingName(text, name)).toBe(expected);
	});

	it('keeps a sentence that merely starts with the name, and never empties one', () => {
		expect(stripLeadingName('Cardinal rules apply.', 'Card')).toBe('Cardinal rules apply.');
		expect(stripLeadingName('Card. renders items.', 'Card')).toBe('Card. renders items.');
		expect(stripLeadingName('Card renders items.', 'Card')).toBe('Card renders items.');
		expect(stripLeadingName('Card -', 'Card')).toBe('Card -');
	});
});

describe('limitToSentences', () => {
	const sentence = 'This sentence is about forty characters.';

	it('cuts at the last sentence end before the limit, with no ellipsis', () => {
		const text = Array(20).fill(sentence).join(' ');
		const out = limitToSentences(text, 100);
		expect(out.length).toBeLessThanOrEqual(100);
		expect(out.endsWith('.')).toBe(true);
		expect(out).not.toContain('…');
	});

	it('keeps one over-long sentence whole instead of cutting it', () => {
		const long = `${'word '.repeat(120)}end.`;
		expect(limitToSentences(long, 100)).toBe(long);
	});

	it('leaves a short summary untouched', () => {
		expect(limitToSentences(sentence)).toBe(sentence);
	});
});
