<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-video"
	description="AI video production: Character + Performer + Scene, ComfyUI workflow integration, frame-based durations, and dedicated noun joins for owned assets."
	badges={['v0.29.34', 'Video Pipeline', 'ComfyUI', 'Frame-Based']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-video</strong> models the AI video production pipeline. Characters define virtual personas
			with voice and branding, Performers carry physical likeness via IP-Adapter FaceID, Scenes provide
			virtual backgrounds, and the Composition → Sequence → Shot hierarchy organises generated content.
			ComfyUI workflows are stored as templates with semantic parameter injection.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>
					Character personas (renamed from PersonalityProfile): seed image, voice profile, branding
					kit
				</li>
				<li>
					Performer face consistency via IP-Adapter FaceID (<code>dna.faceEmbedding</code>,
					<code>dna.ipAdapterWeight</code> 0.5–1.0)
				</li>
				<li>Scene backgrounds: image, video, 360 / 180 panorama with viewpoints</li>
				<li>
					Hierarchy: <code>VideoComposition</code> → <code>VideoSequence</code> →
					<code>VideoShot</code> (all extend Content)
				</li>
				<li>
					ComfyUI workflow templates with <code>nodeMapping</code> + safe
					<code>injectParameters()</code>
				</li>
				<li>
					Frame-based durations everywhere (<code>durationInFrames</code>; seconds = frames / fps)
				</li>
				<li>
					Owned asset normalisation: <code>character_assets</code>, <code>performer_assets</code>,
					<code>scene_assets</code>
				</li>
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
  imageAssetId: 'seed-img-001',     // seeds via character_assets noun join
  voiceProfileId: 'voice-123',      // FK to smrt-voice
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
  dna: { gender: 'neutral', ageRange: 'adult', ipAdapterWeight: 0.85 },
});

// Scene = virtual background
const studio = new Scene({
  name: 'News Studio',
  sourceType: 'image',
  projection: 'flat',
});

// Hierarchy: Composition -> Sequence -> Shot (extend Content)
const composition = new VideoComposition({
  title: 'Evening News - March 2, 2026',
  fps: 30,
  width: 1920,
  height: 1080,
});
await composition.save();

const shot = new VideoShot({
  scriptText: 'Welcome to the evening news broadcast.',
  durationInFrames: 900, // 30 sec at 30fps
});
await shot.save();
// estimatedDuration = scriptWordCount / 2.7 words/sec (+/-15%)

// ComfyUI workflow with parameter injection
const workflow = new VideoWorkflow({
  name: 'Wan 2.6 + EchoMimic',
  workflowType: 'broadcast',
  workflowJson: comfyuiApiJson,
  nodeMapping: { seedImage: '1', audioFile: '5', outputVideo: '12' },
  requiredModels: ['wan_2.6_t2v_14b_fp8', 'echomimic_v2'],
});
await workflow.save();

// Deep-clones workflow and overwrites node.inputs
const injected = workflow.injectParameters({
  seedImage: '/path/to/anchor.png',
  audioFile: '/path/to/tts.wav',
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>Character (renamed from PersonalityProfile)</h3>
		<p>
			Old <code>PersonalityProfile</code> export is preserved for backward compatibility. Scene placement
			uses scene-specific position / scale configs.
		</p>
		<CodeBlock
			code={`class Character extends SmrtObject {
  name: string
  imageAssetId?: string       // Seed image FK (via character_assets noun join)
  voiceProfileId?: string     // FK to smrt-voice
  brandingKit?: BrandingConfig // Logo, colors, fonts, lower-thirds
  status: 'pending' | 'ready'
}`}
			language="typescript"
		/>

		<h3>Performer (IP-Adapter face consistency)</h3>
		<CodeBlock
			code={`class Performer extends SmrtObject {
  name: string
  dna: PerformerDNA           // holds faceEmbedding (512-dim FaceID),
                              // ipAdapterWeight (0.5-1.0), ageRange, etc.
  referenceAssetIds: string[] // Linked via performer_assets noun join
  seedImageAssetId?: string   // Generated seed image asset FK
  voiceProfileId?: string     // FK to smrt-voice
  status: 'pending' | 'ready'
}`}
			language="typescript"
		/>

		<h3>Scene</h3>
		<CodeBlock
			code={`class Scene extends SmrtObject {
  name: string
  sourceType: 'image' | 'video' | 'panorama_360' | 'panorama_180'
  projection: string
  viewpoints: Viewpoint[]     // pan / tilt / fov
  lightingProfile?: object
  anchorPoints?: object
}`}
			language="typescript"
		/>

		<h3>VideoShot (extends Content)</h3>
		<CodeBlock
			code={`class VideoShot extends Content {
  scriptText?: string
  scriptWordCount: number
  durationInFrames: number
  videoMetadata?: VideoMetadata  // includes wordTimings for lip-sync
  status: 'draft' | 'queued' | 'processing' | 'ready' | 'failed' | 'published'

  // scriptWordCount / 2.7 (words per second)
  get estimatedDuration(): number
}`}
			language="typescript"
		/>

		<h3>VideoSequence + VideoComposition</h3>
		<CodeBlock
			code={`class VideoSequence extends Content {
  transitionType: 'none' | 'fade' | 'slide' | 'wipe'
  // position ordering within composition
}

class VideoComposition extends Content {
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
  workflowJson: object | null // Full ComfyUI API JSON (object, not string)
  nodeMapping: NodeMapping    // Maps semantic names -> node IDs
  requiredModels?: string[]

  // Deep-clones workflow and overwrites node.inputs (warns in dev if inputs missing)
  injectParameters(params: Record<string, any>): object
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Owned-asset normalisation</h2>
		<p>
			Each video noun has its own join table — <code>character_assets</code>,
			<code>performer_assets</code>, <code>scene_assets</code> — for owner-side asset relationships.
			<code>VideoShot</code>, <code>VideoSequence</code>, and
			<code>VideoComposition</code> inherit the <code>content_assets</code> join from their
			<code>Content</code> base. Generic provenance / "came from" links still use
			<code>AssetAssociation</code> with role <code>derivation_source</code>.
		</p>
		<p>
			Run <code>smrt db:migrate</code> before relying on the new noun joins for writes; reads still tolerate
			the tables being absent during the migration window, and unions legacy STI asset rows for backward
			compatibility.
		</p>
	</section>

	<section>
		<h2>Design Principles</h2>
		<ul>
			<li>
				<strong>Store frames, compute seconds</strong>: every duration is
				<code>durationInFrames</code>; <code>seconds = frames / fps</code>
			</li>
			<li>
				<strong>Content inheritance</strong>: Shot, Sequence, Composition all extend
				<code>Content</code> so they get governance, transparency, and chat for free
			</li>
			<li>
				<strong>Hierarchy</strong>:
				<code>VideoComposition → VideoSequence → VideoShot → VideoShotCharacter</code>
			</li>
			<li>
				<strong>Owned asset normalisation</strong>: noun joins for Character / Performer / Scene;
				content_assets via STI parent
			</li>
		</ul>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Store durations as frames; compute seconds as <code>durationInFrames / fps</code></li>
				<li>Use <code>nodeMapping</code> to map semantic names to ComfyUI node IDs</li>
				<li>
					Use <code>injectParameters()</code> for safe workflow parameter injection (deep-clones)
				</li>
				<li>Estimate speech duration at 2.7 words/second (±15%)</li>
				<li>
					Link <code>Character.voiceProfileId</code> to <a href="/modules/smrt-voice">smrt-voice</a> profiles
				</li>
				<li>
					Use the new noun joins (<code>character_assets</code>, …) rather than ad-hoc STI rows
				</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't store durations as seconds (use <code>durationInFrames</code> everywhere)</li>
				<li>
					Don't assume <code>wordTimings</code> is auto-generated (requires an external TTS provider
					— see <a href="/modules/smrt-voice">smrt-voice</a>)
				</li>
				<li>Don't mutate workflow JSON directly — go through <code>injectParameters()</code></li>
				<li>
					Don't forget <code>trimBeforeFrames</code> / <code>trimAfterFrames</code> in effective frame
					calculations
				</li>
				<li>Don't upload face embeddings through the framework (weight is metadata-only)</li>
				<li>Don't rely on the legacy STI asset rows after running <code>smrt db:migrate</code></li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-voice">
				<h3>smrt-voice</h3>
				<p>TTS voice profiles + word timings for lip-sync</p>
			</a>
			<a href="/modules/smrt-content">
				<h3>smrt-content</h3>
				<p>Content base + content_assets join (inherited by Shot/Sequence/Composition)</p>
			</a>
			<a href="/modules/smrt-assets">
				<h3>smrt-assets</h3>
				<p>AssetRuntime, serveAsset(), ASSET_ROLES vocabulary</p>
			</a>
			<a href="/modules/smrt-images">
				<h3>smrt-images</h3>
				<p>Seed images and thumbnails for Characters / Scenes</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
