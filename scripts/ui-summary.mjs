/**
 * Turns the JSDoc header of a component's `<script>` into the one-paragraph
 * summary the UI reference shows. Headers are written for maintainers, so the
 * raw text carries feature lists, examples, changelog notes and `{@link}`
 * tags that read as noise on a reference page.
 */

const MAX_LENGTH = 400;
const LIST_LINE = /^\s*(?:[-*\u2022]|\d+[.)])\s/;
const FENCE = /^\s*```/;
const TERMINAL = /[.!?]["'\u201d)\]]*$/;

/** `{@link X}` and `{@link X label}` (also `linkcode`, `linkplain`) as plain text. */
export function renderInlineTags(text) {
	return text.replace(
		/\{@(?:link|linkcode|linkplain)\s+([^}\s|]+)(?:[\s|]+([^}]*))?\}/g,
		(_, target, label) => (label?.trim() ? label.trim() : target)
	);
}

/** Changelog residue some headers carry beside the title. */
const CHANGELOG_TAIL = /\s+refactored for Material \d+\.?$/i;
const CHANGELOG_LINE = /^refactored for Material \d+\.?$/i;

/**
 * A parenthetical that is only tracker references, such as "(#2904)" or
 * "(happyvertical/smrt#5346)". Headers cite the issue that introduced a
 * component for maintainers; a reader of the reference cannot follow them.
 * A parenthetical with any other words in it is prose and stays.
 */
const ISSUE_REF = String.raw`(?:[\w.-]+\/)?[\w.-]*#\d+`;
const ISSUE_PARENTHETICAL = new RegExp(
	String.raw`\s*\(${ISSUE_REF}(?:\s*(?:[,;]|and)\s*${ISSUE_REF})*\)`,
	'g'
);

/** `text` without parentheticals that only cite issues. */
export function stripIssueReferences(text) {
	return text.replace(ISSUE_PARENTHETICAL, '');
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
		if (CHANGELOG_LINE.test(line.trim())) continue;
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

/**
 * The prose of a paragraph, ending where a list or a code fence starts. A
 * title line (no closing punctuation) followed by more lines is closed with a
 * full stop so the sentence after it does not run into it.
 */
function proseOf(lines) {
	const end = lines.findIndex((line) => LIST_LINE.test(line) || FENCE.test(line));
	let kept = end === -1 ? lines : lines.slice(0, end);
	// A line ending in a colon only introduces the list that was cut, so it goes too.
	if (end !== -1 && kept.length && kept.at(-1).trim().endsWith(':')) kept = kept.slice(0, -1);
	const [first = '', ...rest] = kept.map((line) => line.trim());
	let head = first.replace(CHANGELOG_TAIL, '');
	if (rest.length && !/[.!?:;,]$/.test(head) && /^[A-Z]/.test(rest[0])) head += '.';
	// A fence flattened onto a prose line is cut where it opens.
	return [head, ...rest].join(' ').split('```')[0].replace(/\s+/g, ' ').trim();
}

/**
 * "Name - text", "Name: text", "Name. text" and "Name Component text" lose the
 * repeated name, whether the header spells it CardList or "Card List", with or
 * without an acronym prefix. A sentence that merely starts with
 * the name is kept, and so is text that would start with a quote or code.
 * `allowEmpty` returns '' for a title that is only the name.
 */
export function stripLeadingName(text, name, { allowEmpty = false } = {}) {
	if (!name) return text;
	const words = name
		.split(/(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/)
		.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
		.join('\\s*');
	const prefix = new RegExp(`^(?:[A-Z]{2,}\\s*)?${words}(?<tail>.*)$`, 's');
	const found = prefix.exec(text);
	if (!found) return text;
	const tail = found.groups.tail;
	let rest;
	if (/^\s+Component\b/.test(tail)) rest = tail.replace(/^\s+Component\b[\s:.\u2014\u2013-]*/, '');
	else if (/^\s*[:\u2014\u2013-]\s+/.test(tail)) rest = tail.replace(/^\s*[:\u2014\u2013-]\s+/, '');
	else if (/^\.\s+(?=[A-Z])/.test(tail)) rest = tail.replace(/^\.\s+/, '');
	else if (/^[.\s:\u2014\u2013-]*$/.test(tail)) rest = '';
	else return text;
	if (!rest.trim()) return allowEmpty ? '' : text;
	if (!/^[A-Za-z]/.test(rest)) return text;
	return rest.charAt(0).toUpperCase() + rest.slice(1);
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

/** Every summary reads as a sentence. */
export function withTerminalPunctuation(text) {
	const trimmed = text.trim();
	return !trimmed || TERMINAL.test(trimmed) ? trimmed : `${trimmed.replace(/[:;,]$/, '')}.`;
}

/** Inline tags rendered, changelog tail and issue references dropped, then the name and the length. */
export function cleanSummary(text, name) {
	const plain = stripIssueReferences(
		renderInlineTags(text.replace(/\s+/g, ' ').trim().replace(CHANGELOG_TAIL, ''))
	);
	return withTerminalPunctuation(limitToSentences(stripLeadingName(plain, name)));
}

/**
 * The summary for one header block, or '' when it has no prose. Takes the first
 * paragraph with the repeated name removed. When what is left has no closing
 * punctuation it is a title, and the paragraph after it is joined on; a
 * paragraph that is only a list introducer, a list or a code fence is not.
 */
export function summarizeHeader(raw, name) {
	const paragraphs = paragraphsOf(raw);
	if (!paragraphs.length) return '';
	let text = stripLeadingName(renderInlineTags(proseOf(paragraphs[0])), name, {
		allowEmpty: true
	});
	if (!text || !TERMINAL.test(text)) {
		const next = paragraphs[1] ? renderInlineTags(proseOf(paragraphs[1])) : '';
		text = text ? (next ? `${withTerminalPunctuation(text)} ${next}` : text) : next;
	}
	return withTerminalPunctuation(limitToSentences(text));
}
