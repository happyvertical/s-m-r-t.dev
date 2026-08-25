import { readFileSync } from 'node:fs';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import AgentAwareFormDemo from './AgentAwareFormDemo.svelte';

afterEach(cleanup);

function reviewValue(label: string): string | null | undefined {
	return screen.getByText(label).parentElement?.querySelector('strong')?.textContent;
}

describe('AgentAwareFormDemo', () => {
	it('runs the real staged, confirmed, applied, and undo registry flow', async () => {
		render(AgentAwareFormDemo);

		expect(screen.getByText(/no language model runs in this demo/i)).toBeTruthy();
		expect(reviewValue('Live value')).toBe('Willow Reed');
		expect(reviewValue('Proposed value')).toBe('Not staged');

		const inspectButton = screen.getByRole('button', { name: 'Inspect control' });
		await waitFor(() => expect((inspectButton as HTMLButtonElement).disabled).toBe(false));
		inspectButton.focus();
		await fireEvent.click(inspectButton);
		expect(screen.getByRole('status').textContent).toMatch(/found profile-demo\.displayName/i);
		expect(screen.getByText(/display name, public, required, 3–30 characters/i)).toBeTruthy();

		const validateButton = screen.getByRole('button', { name: /check “willow griffin”/i });
		await waitFor(() => expect(document.activeElement).toBe(validateButton));
		await fireEvent.click(validateButton);
		expect(reviewValue('Proposal check')).toBe('Passes the visible display-name rule');

		const stageButton = screen.getByRole('button', { name: 'Stage proposal' });
		await waitFor(() => expect(document.activeElement).toBe(stageButton));
		await fireEvent.click(stageButton);
		expect(reviewValue('Live value')).toBe('Willow Reed');
		expect(reviewValue('Proposed value')).toBe('Willow Griffin');

		const reviewButton = screen.getByRole('button', { name: 'Mark reviewed' });
		await waitFor(() => expect(document.activeElement).toBe(reviewButton));
		await fireEvent.click(reviewButton);
		expect(reviewValue('Live value')).toBe('Willow Reed');

		const applyButton = screen.getByRole('button', { name: 'Confirm change' });
		await waitFor(() => expect(document.activeElement).toBe(applyButton));
		await fireEvent.click(applyButton);
		await waitFor(() => {
			expect(reviewValue('Live value')).toBe('Willow Griffin');
			expect(reviewValue('Proposed value')).toBe('Not staged');
		});

		const undoButton = screen.getByRole('button', { name: 'Undo applied value' });
		await waitFor(() => expect(document.activeElement).toBe(undoButton));
		await fireEvent.click(undoButton);
		await waitFor(() => {
			expect(reviewValue('Live value')).toBe('Willow Reed');
			expect(document.activeElement).toBe(screen.getByRole('status'));
		});
	});

	it('shows the released secret-control refusal without exposing a protected value', async () => {
		const { container } = render(AgentAwareFormDemo);
		const protectedInput = container.querySelector<HTMLInputElement>(
			'[data-protected-control="true"]'
		);
		const attemptButton = screen.getByRole('button', { name: 'Attempt protected change' });

		expect(protectedInput?.value).toBe('');
		expect(protectedInput?.getAttribute('value')).toBeNull();

		await waitFor(() => expect((attemptButton as HTMLButtonElement).disabled).toBe(false));
		await fireEvent.click(attemptButton);
		expect(screen.getByText('Refused by the released policy')).toBeTruthy();
		expect(screen.getByRole('status').textContent).toMatch(/sensitive_control/i);
		expect(container.querySelector('.refusal-result')?.textContent).toMatch(
			/no protected value was read,\s*staged, or shown/i
		);
		expect(container.querySelector('.refusal-result')?.hasAttribute('aria-live')).toBe(false);
		expect(protectedInput?.value).toBe('');
	});

	it('keeps an accurate storyboard in the server-rendered no-JavaScript fallback', () => {
		const source = readFileSync('src/lib/ui-showcase/AgentAwareFormDemo.svelte', 'utf8');

		expect(source).toContain('<noscript>');
		expect(source).toContain('The scripted flow finds and explains the public control');
		expect(source).toContain('<code>sensitive_control</code>');
	});
});
