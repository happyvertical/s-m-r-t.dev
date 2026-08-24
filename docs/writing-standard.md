# Documentation writing standard

s-m-r-t.dev uses ASD-STE100 Simplified Technical English, Issue 9, for public technical copy. ASD released Issue 9 on 2025-01-15.

Use the [official ASD-STE100 Issue 9 standard](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf) as the authority. Do not copy the standard or its controlled dictionary into this repository.

Automated checks support this standard. They do not prove full ASD-STE100 conformity.

## Project rules

- Use American English spelling.
- Use approved dictionary words with their approved meanings.
- Use the project technical terms in this document when the dictionary does not contain the necessary framework term.
- Use active voice. You can use passive voice in descriptive text only when the actor is unknown.
- Replace an ambiguous pronoun with the noun that it identifies.
- Use a maximum of 20 words in each procedural sentence.
- Use a maximum of 25 words in each descriptive sentence.
- Give one instruction in each procedural sentence. You can combine actions only when they occur at the same time.
- Give one topic in each descriptive paragraph.
- Use no more than six sentences in each descriptive paragraph.
- Start each instruction with an imperative verb.
- Use infinitive, imperative, simple present, simple past, or simple future verb forms. Use a past participle only as an adjective.
- Use each word with one clear and literal meaning.

Use the word-count rules in ASD-STE100 Section 8. For example, count a URL, quoted text, or an alphanumeric identifier as one word.

## Project technical terms

Use these technical nouns with the specified meanings:

| Technical noun       | Approved project meaning                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| agent                | Software that can find and operate declared application capabilities under application policy.                      |
| application logic    | Rules that define application behavior, decisions, and data operations. Do not use “business logic” in public copy. |
| component            | A reusable user-interface unit.                                                                                     |
| control              | An interactive user-interface element with declared behavior and policy.                                            |
| framework            | The combined SMRT packages, conventions, and generated surfaces.                                                    |
| guide family         | A group of task-oriented guides for one subject.                                                                    |
| interaction registry | A catalog of controls and the operations that an adapter can request.                                               |
| package              | A published software unit in the `@happyvertical/smrt-*` namespace.                                                 |
| playground           | The standalone application that demonstrates released framework behavior.                                           |
| route                | A public URL path and its application handler or page.                                                              |
| shell                | The persistent user-interface structure around route content.                                                       |
| tenant               | An organization or scope that owns isolated application data.                                                       |
| workbench            | An interactive documentation view for one package or feature.                                                       |

Use these technical verbs only with the specified meanings:

| Technical verb | Approved project meaning                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| authenticate   | Verify the identity of a person, agent, or service.                                                                     |
| authorize      | Decide whether an authenticated actor can do an operation.                                                              |
| configure      | Set declared options for an application or package.                                                                     |
| deploy         | Put a built application into a target environment.                                                                      |
| hydrate        | Add interactive client behavior to server-rendered or static markup.                                                    |
| query          | Request selected data from a data source.                                                                               |
| register       | Add a declared item to a framework registry.                                                                            |
| render         | Produce visible user-interface output.                                                                                  |
| serialize      | Convert data to a declared transport or storage format.                                                                 |
| stage          | Store a proposed value without changing the live value.                                                                 |
| synchronize    | Make declared records agree with their source. Use `sync` only in an API identifier, command, or exact interface label. |
| validate       | Check a value or artifact against declared rules.                                                                       |

Do not create a synonym for an approved project term. Add a term to this document when public copy needs a new framework concept.

## Exclusions

Do not change these items only to satisfy prose rules:

- Code and code comments in examples
- API identifiers and type names
- Package names and import paths
- Routes, URLs, commands, and configuration keys
- Exact error messages and interface labels
- Quotations from external sources
- Product and brand names

Explain an excluded item in clear STE copy when readers can misunderstand it. Do not use an exclusion to hide ordinary public prose.

## Automated validation

Run `pnpm run check:copy`. The check scans public route copy, data-driven content, navigation, search descriptions, metadata, callouts, package summaries, shared components, and static text.

The check fails for prohibited project terminology or a copy source that it cannot parse. It gives advisory warnings for sentence length, paragraph length, and selected ambiguous or disallowed phrases.

The repository test workflow runs this command. The checker tests verify that route, component, data, and static copy files stay in scope.

## Manual review evidence

Every pull request that changes documentation copy must include this evidence:

1. Identify the reviewed files or page groups.
2. Record the `pnpm run check:copy` result.
3. Confirm a manual review of word choice, approved meanings, active voice, pronoun references, sentence purpose, paragraph topics, and exclusions.
4. List accepted warnings and explain why the copy stays clear.
5. Confirm that security, permission, limitation, and release-status statements keep their technical meaning.

Use the pull request template for this record. Do not state that an automated success proves full conformity.
