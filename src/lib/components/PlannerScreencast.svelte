<script lang="ts">
	import posterSrc from '$lib/assets/planner-poster.jpg';
	import webmSrc from '$lib/assets/planner-home.webm';
	import mp4Src from '$lib/assets/planner-home.mp4';

	/**
	 * Silent, looping recording of build-a-boilerplate. There is no static
	 * `autoplay` attribute on purpose: it would start downloading and playing
	 * before the video is on screen and ignore `prefers-reduced-motion`. Playback
	 * is driven from an IntersectionObserver instead — it plays while at least a
	 * quarter of the frame is visible and pauses offscreen. Under reduced motion
	 * only the poster shows (`preload="none"` means nothing else is fetched)
	 * until the reader presses Play. There is no caption (#337); the video's
	 * aria-label is its accessible name.
	 */
	let video: HTMLVideoElement | undefined = $state();
	let playing = $state(false);
	let pausedByReader = $state(false);
	let reducedMotion = $state(false);
	let visible = false;

	function sync() {
		const element = video;
		if (!element) return;
		if (visible && !pausedByReader && !reducedMotion) {
			element.play().catch(() => {
				// Autoplay can still be refused (e.g. data saver); the poster stays
				// and the Play button remains available.
			});
		} else if (!element.paused) {
			element.pause();
		}
	}

	function toggle() {
		const element = video;
		if (!element) return;
		if (element.paused) {
			pausedByReader = false;
			// A reader asking to play overrides the reduced-motion default.
			reducedMotion = false;
			element.play().catch(() => {});
		} else {
			pausedByReader = true;
			element.pause();
		}
	}

	$effect(() => {
		const element = video;
		if (!element || typeof window === 'undefined') return;

		const motion =
			typeof window.matchMedia === 'function'
				? window.matchMedia('(prefers-reduced-motion: reduce)')
				: undefined;
		const onMotionChange = () => {
			reducedMotion = motion?.matches ?? false;
			sync();
		};
		reducedMotion = motion?.matches ?? false;
		motion?.addEventListener('change', onMotionChange);

		let observer: IntersectionObserver | undefined;
		if (typeof IntersectionObserver === 'function') {
			observer = new IntersectionObserver(
				(entries) => {
					visible = entries.some((entry) => entry.isIntersecting);
					sync();
				},
				{ threshold: 0.25 }
			);
			observer.observe(element);
		}

		return () => {
			observer?.disconnect();
			motion?.removeEventListener('change', onMotionChange);
			if (!element.paused) element.pause();
		};
	});
</script>

<figure class="planner-screencast">
	<div class="frame">
		<video
			bind:this={video}
			onplay={() => (playing = true)}
			onpause={() => (playing = false)}
			muted
			loop
			playsinline
			disablepictureinpicture
			preload="none"
			poster={posterSrc}
			width="1280"
			height="720"
			aria-label="Screen recording of build-a-boilerplate"
		>
			<source src={webmSrc} type="video/webm" />
			<source src={mp4Src} type="video/mp4" />
		</video>
		<button
			type="button"
			class="playback"
			onclick={toggle}
			aria-label={playing ? 'Pause the recording' : 'Play the recording'}
		>
			{playing ? 'Pause' : 'Play'}
		</button>
	</div>
</figure>

<style>
	.planner-screencast {
		margin: 0;
		min-width: 0;
	}

	.frame {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-lg);
		background: var(--site-surface);
		box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
	}

	video {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: cover;
	}

	.playback {
		position: absolute;
		right: 0.6rem;
		bottom: 0.6rem;
		min-width: 4.25rem;
		min-height: 2.25rem;
		padding: 0 0.8rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
		color: var(--site-ink);
		font: 700 0.78rem var(--site-font-mono);
		cursor: pointer;
		opacity: 0.92;
	}

	.playback:hover,
	.playback:focus-visible {
		opacity: 1;
		border-color: var(--site-accent-strong);
	}
</style>
