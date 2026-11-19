/**
 * Turns the JSDoc header of a component's `<script>` into the one-paragraph
 * summary the UI reference shows. Headers are written for maintainers, so the
 * raw text carries feature lists, examples, changelog notes and `{@link}`
 * tags that read as noise on a reference page.
 */

const MAX_LENGTH = 400;
const LIST_LINE = /^\s*(?:[-*\u2022]|\d+[.)])\s/;
const FENCE = /^\s*```/;

/** `{@link X}` and `{@link X label}` (also `linkcode`, `linkplain`) as plain text. */
export function renderInlineTags(text) {
	return text.replace(
		/\{@(?:link|linkcode|linkplain)\s+([^}\s|]+)(?:[\s|]+([^}]*))?\}/g,
		(_, target, label) => (label?.trim() ? label.trim() : target)
	);
}

/** The paragraphs of a `/** ... *\/` block, before its first tag line. */
function paragraphsOf(raw) {
	const lines = raw
		.slice(3, -2)
		.split('\n')
		.map((line) => line.replace(/^\s*\*?\s?/, ''));
	const tag = lines.findIndex((line) => /^\s*@/.test(line));
	const paragraphs = [];
	let current = [];
	let fenced = false;
	for (const line of tag === -1 ? lines : lines.slice(0, tag)) {
		if (FENCE.test(line)) fenced = !fenced;
		if (!fenced && !FENCE.test(line) && line.trim() === '') {
			if (current.length) paragraphs.push(current);
			current = [];
		} else {
			current.push(line);
		}
	}
	if (current.length) paragraphs.push(current);
	return paragraphs;
}

/** Changelog residue some headers carry on their title line. */
const CHANGELOG_TAIL = /\s+refactored for Material \d+\.?$/i;

/**
 * The prose lines of a paragraph, ending where a list or a code fence starts.
 * A bare title line (no closing punctuation) is closed with a full stop so the
 * sentence after it does not run into it.
 */
function proseOf(lines) {
	const end = lines.findIndex((line) => LIST_LINE.test(line) || FENCE.test(line));
	let kept = end === -1 ? lines : lines.slice(0, end);
	// "Features:" introduces the list that was cut; drop it with the list.
	if (end !== -1 && kept.length && kept.at(-1).trim().endsWith(':')) {
		kept = kept.length === 1 ? [kept[0].trim().slice(0, -1)] : kept.slice(0, -1);
	}
	const [first = '', ...rest] = kept.map((line) => line.trim());
	let head = first.replace(CHANGELOG_TAIL, '');
	if (rest.length && !/[.!?:;,]$/.test(head) && /^[A-Z]/.test(rest[0])) head += '.';
	// A fence flattened onto a prose line is cut where it opens.
	return [head, ...rest].join(' ').split('```')[0].replace(/\s+/g, ' ').trim();
}

const isTitleLine = (lines) =>
	lines.length === 1 &&
	!/[.!?:]$/.test(lines[0].trim()) &&
	lines[0].trim().split(/\s+/).length <= 6;

/** "Name - text", "Name: text", "Name Component text" lose the repeated name. */
export function stripLeadingName(text, name) {
	if (!name) return text;
	// "LoadingOverlay" also matches the title "Loading Overlay Component". Some
	// headers prefix the old framework name; the class keeps the product-name
	// guard from reading this pattern as copy.
	const words = name
		.replace(/^S[M]RT/, '')
		.split(/(?<=[a-z0-9])(?=[A-Z])/)
		.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
		.join('\\s*');
	const stripped = text
		.replace(
			new RegExp(
				`^(?:S[M]RT)?${words}(?:\\s+Component\\b[\\s:.\\u2014\\u2013-]*|\\s*[:\\u2014\\u2013-]\\s+)`
			),
			''
		)
		.replace(/^[.:\s]+/, '');
	if (stripped === text || !stripped.trim()) return text;
	return stripped.charAt(0).toUpperCase() + stripped.slice(1);
}

/** At most about MAX_LENGTH characters, ending on a sentence end, with no ellipsis. */
export function limitToSentences(text, max = MAX_LENGTH) {
	if (text.length <= max) return text;
	const ends = [...text.matchAll(/[.!?](?=\s|$)/g)].map((match) => match.index + 1);
	const within = ends.filter((end) => end <= max);
	if (within.length) return text.slice(0, within.at(-1));
	// One sentence longer than the limit: keep it whole rather than cut it.
	return ends.length ? text.slice(0, ends[0]) : text;
}

/**
 * The summary for one header block, or '' when it has no prose. Takes the first
 * paragraph; a bare title line is joined with the paragraph after it.
 */
export function summarizeHeader(raw, name) {
	const paragraphs = paragraphsOf(raw);
	if (!paragraphs.length) return '';
	let lines = paragraphs[0];
	if (isTitleLine(lines) && paragraphs[1]) lines = [...lines, ...paragraphs[1]];
	const text = renderInlineTags(proseOf(lines));
	return limitToSentences(stripLeadingName(text, name));
}

/** The same cleaning for a summary that did not come from a header block. */
export function cleanSummary(text, name) {
	return limitToSentences(
		stripLeadingName(
			renderInlineTags(text.replace(/\s+/g, ' ').trim().replace(CHANGELOG_TAIL, '')),
			name
		)
	);
}
