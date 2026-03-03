<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-video"
	description="AI video production pipeline with characters, performers, scenes, shots, sequences, compositions, and ComfyUI workflow integration."
	badges={['v0.20.44', 'Video Pipeline', 'ComfyUI', 'Frame-Based']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-video</strong> models the full video production pipeline for AI-powered video
			generation. Characters define virtual personas with voice and branding, Performers provide
			physical likeness via IP-Adapter FaceID, and the Composition-Sequence-Shot hierarchy organizes
			generated content. ComfyUI workflows enable dynamic parameter injection for rendering.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Character personas: seed image, voice profile, branding kit</li>
				<li>Performer face consistency via IP-Adapter FaceID embeddings</li>
				<li>Scene backgrounds: image, video, 360/180 panorama with viewpoints</li>
				<li>Hierarchy: Composition, Sequence, Shot (all extend Content)</li>
				<li>ComfyUI workflow templates with dynamic parameter injection</li>
				<li>Frame-based durations: store frames, compute seconds</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-video`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import {
  Character, Performer, Scene,
  VideoShot, VideoSequence, VideoComposition,
  VideoShotCharacter, VideoWorkflow,
} from '@happyvertical/smrt-video';

// Character = virtual persona (outfit, voice, branding)
const anchor = new Character({
  name: 'Bentley News Anchor',
  imageAssetId: 'seed-img-001',
  voiceProfileId: 'voice-123',
  brandingKit: {
    logoAssetId: 'logo-asset',
    primaryColor: '#1a73e8',
    lowerThirdTemplate: 'news-standard',
    tickerEnabled: true,
  },
});
await anchor.save();

// Performer = physical likeness for IP-Adapter face consistency
const performer = new Performer({
  name: 'Alex',
  ipAdapterWeight: 0.85,
});

// Scene = virtual background
const studio = new Scene({
  name: 'News Studio',
  sourceType: 'image',
  projection: 'flat',
});

// Hierarchy: Composition -> Sequence -> Shot
const composition = new VideoComposition({
  title: 'Evening News - March 2, 2026',
  fps: 30,
  width: 1920,
  height: 1080,
});
await composition.save();

const shot = new VideoShot({
  scriptText: 'Welcome to the evening news broadcast.',
  targetDuration: 30,
});
await shot.save();
// Estimated speech: scriptWordCount / 2.7 words per second

// ComfyUI workflow with parameter injection
const workflow = new VideoWorkflow({
  name: 'Wan 2.6 + EchoMimic',
  workflowType: 'broadcast',
  workflowJson: comfyuiApiJson,
  nodeMapping: { seedImage: '1', audioFile: '5', outputVideo: '12' },
  requiredModels: ['wan_2.6_t2v_14b_fp8', 'echomimic_v2'],
});
await workflow.save();

// Inject runtime parameters into a deep-cloned workflow
const injected = workflow.injectParameters({
  seedImage: '/path/to/anchor.png',
  audioFile: '/path/to/tts.wav',
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>Character</h3>
		<CodeBlock
			code={`class Character extends SmrtObject {
  name: string
  imageAssetId?: string       // Seed image FK
  voiceProfileId?: string     // FK to smrt-voice
  brandingKit?: BrandingConfig // Logo, colors, fonts, lower-thirds
  status: 'pending' | 'ready'
}`}
			language="typescript"
		/>

		<h3>VideoShot (extends Content)</h3>
		<CodeBlock
			code={`class VideoShot extends Content {
  scriptText?: string
  scriptWordCount: number
  durationInFrames: number
  videoMetadata?: VideoMetadata  // Includes wordTimings for lip-sync
  status: 'draft' | 'queued' | 'processing' | 'ready' | 'failed' | 'published'

  get estimatedDuration(): number  // scriptWordCount / 2.7 (words/sec)
}`}
			language="typescript"
		/>

		<h3>VideoComposition (extends Content)</h3>
		<CodeBlock
			code={`class VideoComposition extends Content {
  fps: number
  width: number
  height: number
  durationInFrames: number
  renderStatus: 'draft' | 'rendering' | 'ready' | 'failed'
  renderProgress: number
}`}
			language="typescript"
		/>

		<h3>VideoWorkflow (ComfyUI)</h3>
		<CodeBlock
			code={`class VideoWorkflow extends SmrtObject {
  name: string
  workflowType: 'prebake' | 'broadcast' | 'lipsync' | 'postprod' | 'custom'
  workflowJson: string        // Full ComfyUI API JSON
  nodeMapping: NodeMapping     // Maps semantic names -> node IDs
  requiredModels?: string[]

  // Deep-clones workflow and overwrites node.inputs
  injectParameters(params: Record<string, any>): object
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Store durations as frames, compute seconds with <code>frames / fps</code></li>
				<li>Use <code>nodeMapping</code> to map semantic names to ComfyUI node IDs</li>
				<li>Use <code>injectParameters()</code> for safe workflow parameter injection (deep-clones)</li>
				<li>Estimate speech duration at 2.7 words/second (with 15% tolerance)</li>
				<li>Link Characters to VoiceProfiles from smrt-voice for TTS integration</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't store durations as seconds (use <code>durationInFrames</code> everywhere)</li>
				<li>Don't assume <code>wordTimings</code> is auto-generated (requires external TTS provider)</li>
				<li>Don't mutate workflow JSON directly (use <code>injectParameters()</code> for safe cloning)</li>
				<li>Don't forget <code>trimBeforeFrames</code>/<code>trimAfterFrames</code> in effective frame calculations</li>
				<li>Don't upload face embeddings through the framework (weight is metadata-only)</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-voice">
				<h3>smrt-voice</h3>
				<p>TTS voice profiles and word timings</p>
			</a>
			<a href="/modules/smrt-content">
				<h3>smrt-content</h3>
				<p>Content base class for Shot/Sequence/Composition</p>
			</a>
			<a href="/modules/smrt-assets">
				<h3>smrt-assets</h3>
				<p>Asset management for media files</p>
			</a>
			<a href="/modules/smrt-images">
				<h3>smrt-images</h3>
				<p>Seed images and thumbnails</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
