<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
</script>

<ModulePage
	name="smrt-places"
	description="Hierarchical geographic database with organic growth via geocoding, Haversine proximity search, and dedicated place-owned asset joins."
	badges={['v0.29.34', 'Geography', 'Hierarchy']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-places</strong> is a comprehensive location management system for the SMRT
			framework. Places form an unlimited-depth hierarchy (Country → Region → City → Building →
			Room), support both real-world locations (with coordinates) and abstract places (virtual
			worlds, game zones, organizational units), and grow organically through
			<code>lookupOrCreate()</code> + geocoding.
		</p>
		<aside>
			<p><strong>Key Features:</strong></p>
			<ul>
				<li>Self-referencing hierarchy with unlimited nesting depth (STI)</li>
				<li>
					Automatic geocoding integration (OpenStreetMap + Google Maps via <code
						>@happyvertical/geo</code
					>)
				</li>
				<li>
					Forward geocoding (address → coordinates) and reverse geocoding (coordinates → address)
				</li>
				<li>Haversine proximity search, sorted nearest-first</li>
				<li>
					POI discovery via <code>discoverNearby()</code> and track-aware
					<code>resolveTrackPlaces()</code> (bucketed + throttled for free geo tiers)
				</li>
				<li>
					Type system via <code>PlaceType</code> (country, city, building, zone, room, region, ...)
				</li>
				<li>
					<strong>PlaceAsset</strong> (new): dedicated owned-asset join in <code>place_assets</code>
					with <code>relationship</code> and <code>sortOrder</code>
				</li>
				<li>JSON metadata storage for custom attributes</li>
				<li>
					Multi-tenant via <code>findWithGlobals(tenantId)</code> — returns tenant + global (<code
						>tenantId=null</code
					>) places
				</li>
			</ul>
		</aside>

		<h3>Tenancy</h3>
		<p>
			Both <code>Place</code> and <code>PlaceType</code> use
			<code>@TenantScoped({'{'} mode: 'optional' {'}'})</code>. A place with
			<code>tenantId = null</code> is a global place visible to every tenant — useful for shared geo
			reference data (countries, well-known landmarks). Tenant-specific places live alongside and
			are retrieved together via <code>findWithGlobals(tenantId)</code>.
		</p>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock
			code={`npm install @happyvertical/smrt-places
# or
pnpm add @happyvertical/smrt-places`}
			language="bash"
		/>
		<p>
			Depends on <code>@happyvertical/smrt-core</code>, <code>@happyvertical/geo</code> for
			geocoding providers (OpenStreetMap, Google Maps), <code>@happyvertical/sql</code> for database
			operations, and optionally <code>@happyvertical/smrt-tenancy</code> for multi-tenant scoping.
		</p>
	</section>

	<section>
		<h2>Quick Start</h2>

		<h3>1. Initialize Collections</h3>
		<CodeBlock
			code={`import { PlaceCollection, PlaceTypeCollection } from '@happyvertical/smrt-places';

const places = await PlaceCollection.create({ db });
const placeTypes = await PlaceTypeCollection.create({ db });

// Seed default place types (country, region, city, etc.)
await placeTypes.initializeDefaults();`}
			language="typescript"
		/>

		<h3>2. Organic Growth via lookupOrCreate</h3>
		<CodeBlock
			code={`// DB first → geocode if not found → create
const office = await places.lookupOrCreate(
  '1234 Market Street, San Francisco, CA',
  {
    geoProvider: 'openstreetmap', // free, no API key
    typeSlug: 'address',
    createIfNotFound: true
  }
);

// Reverse geocoding: coordinates → place
// (query is always a string; pass coordinates via the coords option)
const placeFromCoords = await places.lookupOrCreate(
  '',
  {
    coords: { lat: 37.7749, lng: -122.4194 },
    geoProvider: 'openstreetmap',
    typeSlug: 'address',
    createIfNotFound: true,
  }
);`}
			language="typescript"
		/>

		<h3>3. Proximity Search</h3>
		<CodeBlock
			code={`// Haversine distance, returns Place[] sorted nearest-first
const nearby = await places.searchByProximity(37.7749, -122.4194, 5 /* km */);
nearby.forEach(p => console.log(p.name, p.latitude, p.longitude));`}
			language="typescript"
		/>

		<h3>4. Multi-Tenant Lookup</h3>
		<CodeBlock
			code={`// Returns tenant places PLUS global (tenantId=null) places
const visible = await places.findWithGlobals(currentTenantId);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Place Model</h2>
		<CodeBlock
			code={`class Place extends SmrtHierarchical {   // SmrtHierarchical provides parent/child traversal
  typeId: string                // FK to PlaceType
  parentId: string | null       // Self-referencing hierarchy (from SmrtHierarchical)
  name: string
  description: string

  // Geo fields (all nullable -- abstract places have none)
  latitude: number | null
  longitude: number | null
  streetNumber: string
  streetName: string
  city: string
  region: string
  country: string
  postalCode: string
  countryCode: string
  timezone: string

  // Provenance
  externalId: string           // for syncing with external systems
  source: string               // 'openstreetmap' | 'google' | 'manual'
  metadata: Record<string, any>

  // Hierarchy
  async getParent(): Promise<Place | null>
  async getChildren(): Promise<Place[]>
  async getAncestors(): Promise<Place[]>
  async getDescendants(): Promise<Place[]>
  async getHierarchy(): Promise<PlaceHierarchy>

  // Owned assets via place_assets
  async getAssets(relationship?: string): Promise<Asset[]>
  async addAsset(asset: Asset, relationship?: string, sortOrder?: number): Promise<void>
  async removeAsset(assetId: string, relationship?: string): Promise<void>

  hasCoordinates(): boolean
  getGeoData(): GeoData
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Owned Assets via PlaceAsset (new)</h2>
		<p>
			<code>place_assets</code> is the canonical join for place-owned assets (photos, floor plans,
			documents). Use the matching helpers on <code>Place</code> and <code>PlaceCollection</code>;
			reserve generic <code>AssetAssociation</code> for cross-cutting / provenance links that don't belong
			to a single owner.
		</p>
		<CodeBlock
			code={`// Owner-side helpers (addAsset takes a saved Asset, not just an id)
await place.addAsset(photoAsset, 'gallery', 0); // (asset, relationship?, sortOrder?)
const gallery = await place.getAssets('gallery'); // relationship filter is a string
await place.removeAsset(photoAsset.id, 'gallery');

// Collection-side helpers (operate on one place id at a time)
const sfGallery = await places.getAssets(sfId, 'gallery'); // Promise<Asset[]>
await places.addAsset(sfId, photoAsset, 'gallery', 1);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Key Collection Methods</h2>
		<table>
			<thead>
				<tr><th>Method</th><th>Purpose</th></tr>
			</thead>
			<tbody>
				<tr
					><td><code>lookupOrCreate(query, opts)</code></td><td
						>DB first → geocode if not found → create. Organic growth pattern. Pass coordinates via <code
							>opts.coords</code
						> for reverse geocoding.</td
					></tr
				>
				<tr
					><td><code>searchByProximity(lat, lng, radiusKm?)</code></td><td
						>Haversine distance, returns <code>Place[]</code> sorted by proximity (default radius 10km)</td
					></tr
				>
				<tr
					><td><code>discoverNearby(lat, lng, radiusMeters, opts?)</code></td><td
						>Discover + persist POIs via the geo provider's <code>findPoisNear</code>; cached by
						provider <code>externalId</code></td
					></tr
				>
				<tr
					><td><code>resolveTrackPlaces(points, opts?)</code></td><td
						>Bucketed, throttled POI resolution along a GPS track; returns deduped places plus
						request / cache-hit / bucket counts</td
					></tr
				>
				<tr
					><td><code>findWithGlobals(tenantId)</code></td><td
						>Tenant + global (<code>tenantId=null</code>) places</td
					></tr
				>
				<tr
					><td><code>getRootPlaces()</code>, <code>getByType(slug)</code></td><td
						>Hierarchy + type queries</td
					></tr
				>
				<tr
					><td
						><code>getAssets(placeId, relationship?)</code> /
						<code>addAsset(placeId, asset, ...)</code>
						/ <code>removeAsset(placeId, assetId, ...)</code></td
					><td>Owned-asset helpers backed by <code>place_assets</code></td></tr
				>
			</tbody>
		</table>
	</section>

	<section>
		<h2>POI discovery: discoverNearby &amp; resolveTrackPlaces</h2>
		<p>
			Beyond geocoding a known address, <code>PlaceCollection</code> can discover points of interest
			around a coordinate. <code>discoverNearby(lat, lng, radiusMeters)</code> composes
			<code>@happyvertical/geo</code>'s <code>findPoisNear</code> with the same
			<code>ensureFromLocation</code> path that <code>lookupOrCreate</code> uses, persisting each POI
			as a <code>Place</code>. Caching is effectively automatic: the provider's own place id becomes
			the Place row's <code>externalId</code>, so calling <code>discoverNearby</code> twice over the
			same area on the same provider is a no-op after the first run (for providers that return stable
			ids). It requires a provider that implements <code>findPoisNear</code> (default
			<code>openstreetmap</code>) and throws clearly otherwise.
		</p>
		<CodeBlock
			code={`// Discover and persist POIs within 250m.
const pois = await places.discoverNearby(37.7749, -122.4194, 250, {
  geoProvider: 'openstreetmap', // default; 'google' also supported
  keyword: 'cafe',
  limit: 20,
});`}
			language="typescript"
		/>

		<h3>resolveTrackPlaces — POIs along a GPS track</h3>
		<p>
			<code>resolveTrackPlaces(points, options)</code> resolves POIs along a path (e.g. a video's
			per-frame GPS track) without hammering the provider. Consecutive samples are usually within a
			few meters, so it buckets points by greedy proximity (Haversine) into <code>bucketMeters</code>-wide
			clusters, calls <code>discoverNearby</code> once per distinct bucket, and throttles requests by
			<code>throttleMs</code> to stay inside free-tier (Overpass / Nominatim) rate limits. Returned
			<code>places</code> are deduped across overlapping buckets by Place id.
		</p>
		<CodeBlock
			code={`const result = await places.resolveTrackPlaces(trackPoints, {
  radiusMeters: 50,   // search radius per bucket (default 50)
  bucketMeters: 50,   // points within this distance share one request (default 50)
  throttleMs: 1100,   // delay between provider calls (default 1100ms)
  geoProvider: 'openstreetmap',
});

// TrackPlacesResult:
// {
//   places: Place[],       // deduped across buckets
//   requestCount: number,  // provider calls actually made
//   cacheHitCount: number, // buckets where every POI already existed
//   bucketCount: number,   // distinct geographic buckets walked
// }`}
			language="typescript"
		/>
		<Callout variant="note" title="Defaults tuned for free geo tiers">
			The defaults (50&nbsp;m radius / 50&nbsp;m buckets / 1100&nbsp;ms throttle) keep
			<code>resolveTrackPlaces</code> within community rate limits on OpenStreetMap's Overpass and
			Nominatim out of the box. <code>radiusMeters</code> and <code>bucketMeters</code> must be
			&gt;&nbsp;0 and <code>throttleMs</code> must be a finite non-negative number, or the call throws.
			A higher <code>cacheHitCount</code> relative to <code>requestCount</code> means most of the track
			was already discovered on an earlier run.
		</Callout>
	</section>

	<section>
		<h2>Utility Functions</h2>
		<CodeBlock
			code={`import {
  validateCoordinates,
  calculateDistance,         // Haversine, returns km
  formatCoordinates,
  parseCoordinates,
  areCoordinatesNear,
  generateDisplayName,
  normalizeAddressComponents
} from '@happyvertical/smrt-places';

const distanceKm = calculateDistance(37.7749, -122.4194, 34.0522, -118.2437);
// ~559 km`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Abstract Places</h2>
		<p>
			Places don't require coordinates — perfect for virtual worlds, game zones, or organizational
			structures. All geo fields are nullable.
		</p>
		<CodeBlock
			code={`const world = await places.create({
  name: 'Azeroth',
  typeId: (await placeTypes.getOrCreate('world', 'World')).id,
  description: 'Fantasy game world',
});

const zone = await places.create({
  name: 'Stormwind City',
  typeId: (await placeTypes.getOrCreate('zone', 'Zone')).id,
  parentId: world.id,
  metadata: {
    levelRange: '1-60',
    faction: 'Alliance',
  },
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Gotchas</h2>
		<ul>
			<li>
				<strong>Geo providers</strong>: Google Maps requires <code>GOOGLE_MAPS_API_KEY</code>;
				OpenStreetMap is default and free (rate-limited)
			</li>
			<li>
				<strong>Abstract places allowed</strong>: lat/lng are nullable — check
				<code>hasCoordinates()</code> before using them
			</li>
			<li>
				<strong>Coordinate tolerance varies by latitude</strong>: 0.0001° ≈ 11m at the equator, less
				at the poles
			</li>
			<li>
				<strong>Optional tenancy</strong> with nullable <code>tenantId</code> — use
				<code>findWithGlobals(tenantId)</code> for tenant + global places
			</li>
			<li>
				Use <code>PlaceAsset</code> (<code>place_assets</code>) for owned assets; reserve
				<code>AssetAssociation</code> for generic/provenance links
			</li>
		</ul>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-core">
				<h3>smrt-core</h3>
				<p>Base classes, decorators, and AI integration</p>
			</a>
			<a href="/modules/smrt-tenancy">
				<h3>smrt-tenancy</h3>
				<p>Multi-tenant place isolation</p>
			</a>
			<a href="/modules/smrt-assets">
				<h3>smrt-assets</h3>
				<p>The asset records joined via <code>place_assets</code></p>
			</a>
			<a href="/modules/smrt-events">
				<h3>smrt-events</h3>
				<p>Events reference places via <code>placeId</code></p>
			</a>
		</nav>
	</section>
</ModulePage>
