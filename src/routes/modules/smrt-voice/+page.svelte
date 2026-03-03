<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-voice"
	description="TTS voice profile management with AI voice design, audio cloning from samples, and word-level timing for lip-sync."
	badges={['v0.20.44', 'Voice Design', 'Cloning', 'Lip-Sync Timings']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-voice</strong> manages voice profiles for AI-powered text-to-speech synthesis.
			Profiles can be created via AI voice design (from a natural language prompt) or by cloning from
			audio samples. Generated TTS output includes word-level timing data for lip-sync integration.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Two creation modes: AI design (from prompt) or cloning (from audio samples)</li>
				<li>Voice samples with quality rating and minimum duration validation</li>
				<li>Word-level timing output for lip-sync: <code>{`{word, start, end}`}</code></li>
				<li>Speed (0.5-2.0) and pitch (-20 to 20 semitones) controls</li>
				<li>VoiceOutput extends Content for TTS audio with metadata</li>
				<li>Optional tenancy (null tenantId for global/default voices)</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-voice`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import { VoiceProfile, VoiceSample, VoiceOutput } from '@happyvertical/smrt-voice';

// Mode 1: Voice design -- AI generates from prompt
const designed = new VoiceProfile({
  name: 'News Anchor',
  language: 'en-US',
  gender: 'male',
  designPrompt: 'Warm, authoritative male voice with clear enunciation',
  defaultSpeed: 1.0,   // 0.5 - 2.0
  defaultPitch: 0,     // -20 to 20 semitones
});
await designed.save();

// Mode 2: Voice cloning -- replicate from audio sample(s)
const cloned = new VoiceProfile({
  name: 'Custom Voice',
  language: 'en-US',
  sampleAssetId: 'asset-123',
});
await cloned.save();

// Add training samples (minimum 3 seconds, quality != low)
const sample = new VoiceSample({
  voiceProfileId: cloned.id,
  assetId: 'asset-456',
  duration: 5.2,
  transcription: 'Hello, this is a test recording for voice cloning.',
  quality: 'high',
  sampleRate: 48000,
  format: 'wav',
  isPrimary: true,
});
await sample.save();

// TTS output with word-level timing for lip-sync
const output = new VoiceOutput({
  voiceProfileId: designed.id,
  sourceText: 'Welcome to the evening news.',
  audioAssetId: 'asset-789',
  duration: 2.8,
  wordTimings: [
    { word: 'Welcome', start: 0.0, end: 0.4 },
    { word: 'to', start: 0.4, end: 0.5 },
    { word: 'the', start: 0.5, end: 0.6 },
    { word: 'evening', start: 0.6, end: 1.0 },
    { word: 'news', start: 1.0, end: 1.3 },
  ],
});
// Look up which word is spoken at a timestamp
output.getWordAtTime(0.7); // { word: 'evening', start: 0.6, end: 1.0 }`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>VoiceProfile</h3>
		<CodeBlock
			code={`class VoiceProfile extends SmrtObject {
  name: string
  language: string
  gender: 'male' | 'female' | 'neutral'
  designPrompt?: string       // AI voice design (mutually exclusive)
  sampleAssetId?: string      // Cloned from audio (mutually exclusive)
  defaultSpeed: number        // 0.5 - 2.0
  defaultPitch: number        // -20 to 20 semitones
  voiceData?: Record<string, any>  // Provider-specific (opaque)
  status: 'pending' | 'processing' | 'ready' | 'failed'

  get isCloned(): boolean
  get isDesigned(): boolean
  get isReady(): boolean
}`}
			language="typescript"
		/>

		<h3>VoiceSample</h3>
		<CodeBlock
			code={`class VoiceSample extends SmrtObject {
  voiceProfileId: string
  assetId: string
  duration: number            // Seconds
  transcription?: string
  quality: 'low' | 'medium' | 'high'
  sampleRate?: number
  format?: string
  isPrimary: boolean

  get meetsMinDuration(): boolean      // >= 3 seconds
  get isSuitableForCloning(): boolean  // >= 3 sec AND quality != low
}`}
			language="typescript"
		/>

		<h3>VoiceOutput (extends Content)</h3>
		<CodeBlock
			code={`class VoiceOutput extends Content {
  voiceProfileId: string
  sourceText: string
  audioAssetId: string
  duration: number
  wordTimings: WordTiming[]   // [{ word, start, end }] in seconds
  audioMetadata?: VoiceOutputMetadata

  get wordCount(): number
  get wordsPerSecond(): number
  getWordAtTime(seconds: number): WordTiming | undefined
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use <code>designPrompt</code> XOR <code>sampleAssetId</code> (mutually exclusive modes)</li>
				<li>Check <code>isSuitableForCloning</code> before using samples (3+ sec, not low quality)</li>
				<li>Use <code>getWordAtTime()</code> for precise lip-sync alignment</li>
				<li>Check <code>isReady</code> before using a profile for TTS generation</li>
				<li>Set <code>tenantId: null</code> for global/default voice profiles</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't set both <code>designPrompt</code> and <code>sampleAssetId</code> on the same profile</li>
				<li>Don't expect the framework to generate <code>wordTimings</code> (populated by external TTS provider)</li>
				<li>Don't rely on the 3-second minimum being enforced in the constructor (documented only)</li>
				<li>Don't assume status transitions are enforced (manual status setting is possible)</li>
				<li>Don't depend on a specific <code>voiceData</code> schema (provider-specific, opaque)</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-video">
				<h3>smrt-video</h3>
				<p>Characters reference voice profiles</p>
			</a>
			<a href="/modules/smrt-content">
				<h3>smrt-content</h3>
				<p>Content base class for VoiceOutput</p>
			</a>
			<a href="/modules/smrt-assets">
				<h3>smrt-assets</h3>
				<p>Audio sample and output asset storage</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
