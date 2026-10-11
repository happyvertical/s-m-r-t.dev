export const hostedPlannerConfig = {
	inference: {
		mode: 'byo',
		alternatives: ['browser'],
		credentialPersistence: 'memory',
		byo: {
			presets: ['ollama', 'openrouter', 'openai', 'custom']
		}
	}
};
