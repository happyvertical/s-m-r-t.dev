/**
 * Shell commands the site prints in more than one place, written once so the
 * landing page and Getting Started cannot disagree.
 */

import { SMRT_VERSION } from '$lib/version';

/** The smrt CLI at the release this site documents, run without installing. */
export const SMRT_CLI = `npx -y @happyvertical/smrt-cli@${SMRT_VERSION}`;

/** Serves the planner on localhost and applies the cookbook sent from it. */
export const KITCHEN_COMMAND = `${SMRT_CLI} kitchen my-app`;
