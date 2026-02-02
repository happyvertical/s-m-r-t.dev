<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-places"
	description="Hierarchical place management with geo-coordinates, address validation, and territory mapping."
	badges={['v0.19.0', 'Geography', 'Hierarchy']}
>
	<!-- What is smrt-places? -->
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-places</strong> is a comprehensive location management system for the SMRT framework.
			It provides hierarchical organization of geographic locations with automatic geocoding integration,
			proximity-based searches, and support for both real-world places (with coordinates) and abstract
			places (virtual worlds, game zones, organizational units).
		</p>
		<p>
			The module enables organic database growth through <code>lookupOrCreate()</code>, which
			automatically queries geocoding services (OpenStreetMap or Google Maps) for missing locations.
			Places can be organized in unlimited nesting depth (Country → Region → City → Building →
			Room), and each place can store custom metadata for domain-specific attributes.
		</p>
		<aside>
			<p><strong>Key Features:</strong></p>
			<ul>
				<li>Self-referencing hierarchy with unlimited nesting depth</li>
				<li>Automatic geocoding integration (OpenStreetMap + Google Maps)</li>
				<li>
					Forward geocoding (address → coordinates) and reverse geocoding (coordinates → address)
				</li>
				<li>Proximity-based search (find places within radius)</li>
				<li>Type system for categorization (country, city, building, zone, etc.)</li>
				<li>Support for both physical and abstract places</li>
				<li>JSON metadata storage for custom attributes</li>
				<li>Distance calculations (Haversine formula)</li>
			</ul>
		</aside>
	</section>

	<!-- Installation -->
	<section>
		<h2>Installation</h2>
		<CodeBlock
			code={`npm install @happyvertical/smrt-places
# or
pnpm add @happyvertical/smrt-places`}
			language="bash"
		/>
		<p>
			The module depends on <code>@happyvertical/smrt-core</code> for base classes and
			<code>@happyvertical/geo</code> for geocoding integration. It works seamlessly with
			<code>smrt-tenancy</code> for multi-tenant isolation.
		</p>
	</section>

	<!-- Quick Start -->
	<section>
		<h2>Quick Start (5 Minutes)</h2>
		<p>
			Here's a minimal example showing how to create a place hierarchy, use geocoding, and search by
			proximity:
		</p>

		<h3>1. Initialize Collections</h3>
		<CodeBlock
			code={`import { PlaceCollection, PlaceTypeCollection } from '@happyvertical/smrt-places';

const places = new PlaceCollection({ db: {...} });
const placeTypes = new PlaceTypeCollection({ db: {...} });

// Seed default place types (country, region, city, etc.)
await placeTypes.initializeDefaults();`}
			language="typescript"
		/>

		<h3>2. Create Place Hierarchy Manually</h3>
		<CodeBlock
			code={`// Create country
const usa = await places.create({
  name: 'United States',
  typeId: (await placeTypes.getBySlug('country'))?.id,
  countryCode: 'US'
});

// Create state/region
const california = await places.create({
  name: 'California',
  typeId: (await placeTypes.getBySlug('region'))?.id,
  parentId: usa.id,
  region: 'CA'
});

// Create city
const sanFrancisco = await places.create({
  name: 'San Francisco',
  typeId: (await placeTypes.getBySlug('city'))?.id,
  parentId: california.id,
  city: 'San Francisco',
  region: 'CA',
  country: 'United States'
});`}
			language="typescript"
		/>

		<h3>3. Use Organic Database Growth (lookupOrCreate)</h3>
		<CodeBlock
			code={`// Forward geocoding: address → place with coordinates
const office = await places.lookupOrCreate(
  '1234 Market Street, San Francisco, CA',
  {
    geoProvider: 'openstreetmap', // Free, no API key needed
    typeSlug: 'address',
    createIfNotFound: true
  }
);

console.log('Address found:', office.name);
console.log('Coordinates:', office.latitude, office.longitude);
console.log('Full address:', office.streetNumber, office.streetName, office.city);

// Reverse geocoding: coordinates → place with address
const placeFromCoords = await places.lookupOrCreate(
  { lat: 37.7749, lng: -122.4194 },
  {
    geoProvider: 'openstreetmap',
    typeSlug: 'address',
    createIfNotFound: true
  }
);
console.log('Place from coords:', placeFromCoords.name);`}
			language="typescript"
		/>

		<h3>4. Search by Proximity</h3>
		<CodeBlock
			code={`// Find all places within 5km of coordinates
const nearbyPlaces = await places.searchByProximity(
  37.7749,
  -122.4194,
  5 // radius in km
);

console.log('Found', nearbyPlaces.length, 'places nearby');
nearbyPlaces.forEach(place => {
  console.log('-', place.name, '| Distance:', place.distance, 'km');
});`}
			language="typescript"
		/>
	</section>

	<!-- Core Concepts -->
	<section>
		<h2>Core Concepts</h2>

		<h3>Place Model Structure</h3>
		<p>
			The <code>Place</code> model supports both physical locations (with coordinates) and abstract places
			(virtual worlds, game zones). All geographic fields are optional:
		</p>
		<CodeBlock
			code={`class Place extends SmrtObject {
  // Core fields
  id: string
  typeId: string                // Reference to PlaceType
  parentId: string | null       // Self-referencing hierarchy
  name: string
  description: string

  // Geographic fields (all optional)
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

  // Metadata and tracking
  externalId: string            // For syncing with external systems
  source: string                // 'openstreetmap', 'google', 'manual'
  metadata: Record<string, any> // JSON storage for custom attributes

  // Methods
  getGeoData(): GeoData
  hasCoordinates(): boolean
  getMetadata(): Record<string, any>
  setMetadata(data: Record): void
  updateMetadata(updates: Record): void
}`}
			language="typescript"
		/>

		<h3>Hierarchical Organization</h3>
		<p>
			Places form a self-referencing hierarchy through the <code>parentId</code> field. This enables unlimited
			nesting depth for organizing locations:
		</p>
		<figure>
			<figcaption>Example Hierarchies:</figcaption>
			<ul>
				<li>
					🌍 United States → California → San Francisco → Market Street → Building 1234 → Floor 5 →
					Room 501
				</li>
				<li>
					🎮 Game World → Eastern Kingdom → Forest of Doom → Ancient Temple → Treasure Chamber
				</li>
				<li>🏢 Acme Corp → West Coast Office → Floor 3 → Engineering → Desk 42</li>
			</ul>
		</figure>
		<CodeBlock
			code={`// Get immediate parent
const parent = await place.getParent();

// Get all children
const children = await place.getChildren();

// Get all ancestors (root to parent)
const ancestors = await place.getAncestors();

// Get all descendants (children, grandchildren, etc.)
const descendants = await place.getDescendants();

// Get complete hierarchy
const hierarchy = await place.getHierarchy();
// Returns: { ancestors: Place[], current: Place, descendants: Place[] }`}
			language="typescript"
		/>

		<h3>PlaceType System</h3>
		<p>
			Places are categorized using the <code>PlaceType</code> model with slug-based identification. Default
			types include:
		</p>
		<ul class="type-grid">
			<li>country</li>
			<li>region</li>
			<li>city</li>
			<li>address</li>
			<li>building</li>
			<li>room</li>
			<li>zone</li>
			<li>point_of_interest</li>
		</ul>
		<CodeBlock
			code={`// Get or create type (idempotent)
const buildingType = await placeTypes.getOrCreate('building', 'Building');

// Look up by slug
const cityType = await placeTypes.getBySlug('city');

// Create custom type
const restaurantType = await placeTypes.getOrCreate('restaurant', 'Restaurant');`}
			language="typescript"
		/>

		<h3>Geocoding Integration</h3>
		<p>
			The module integrates with <code>@happyvertical/geo</code> for automatic geocoding using OpenStreetMap
			(free, no API key) or Google Maps (requires API key):
		</p>
		<CodeBlock
			code={`// Forward geocoding: address → coordinates + place data
const place = await places.lookupOrCreate(
  '1600 Amphitheatre Parkway, Mountain View, CA',
  {
    geoProvider: 'google',  // or 'openstreetmap'
    typeSlug: 'address',
    createIfNotFound: true
  }
);
// Automatically populated: lat, lng, streetNumber, streetName, city, region, etc.

// Reverse geocoding: coordinates → address + place data
const place2 = await places.lookupOrCreate(
  { lat: 37.4220, lng: -122.0841 },
  {
    geoProvider: 'openstreetmap',
    typeSlug: 'address',
    createIfNotFound: true
  }
);
// Automatically populated from geocoding service`}
			language="typescript"
		/>

		<h3>Abstract Places (No Coordinates)</h3>
		<p>
			Places don't require coordinates - perfect for virtual worlds, game zones, or organizational
			structures:
		</p>
		<CodeBlock
			code={`// Create game world hierarchy
const world = await places.create({
  name: 'Azeroth',
  typeId: (await placeTypes.getOrCreate('world', 'World')).id,
  description: 'Fantasy game world'
});

const zone = await places.create({
  name: 'Stormwind City',
  typeId: (await placeTypes.getOrCreate('zone', 'Zone')).id,
  parentId: world.id,
  metadata: {
    levelRange: '1-60',
    faction: 'Alliance',
    hasFlyingMount: false
  }
});

const poi = await places.create({
  name: 'Stormwind Keep',
  typeId: (await placeTypes.getOrCreate('point_of_interest', 'POI')).id,
  parentId: zone.id,
  metadata: {
    questGiver: 'King Varian Wrynn',
    services: ['Bank', 'Auction House', 'Vendors']
  }
});`}
			language="typescript"
		/>
	</section>

	<!-- API Reference -->
	<section>
		<h2>API Reference</h2>

		<h3>Place Model Methods</h3>
		<CodeBlock
			code={`// Geographic data
place.getGeoData(): GeoData              // Get all geographic fields
place.hasCoordinates(): boolean          // Check if lat/lng are set

// Metadata management
place.getMetadata(): Record<string, any> // Parse and return JSON metadata
place.setMetadata(data): void            // Replace entire metadata
place.updateMetadata(updates): void      // Merge updates into metadata

// Relationships
await place.getType(): PlaceType | null
await place.getParent(): Place | null
await place.getChildren(): Place[]
await place.getAncestors(): Place[]      // Root-to-parent chain
await place.getDescendants(): Place[]    // All children recursively
await place.getHierarchy(): PlaceHierarchy`}
			language="typescript"
		/>

		<h3>PlaceCollection Methods</h3>
		<CodeBlock
			code={`// Organic database growth
await places.lookupOrCreate(query, options?): Promise<Place | null>
// query: address string OR { lat, lng }
// options: { geoProvider?, typeSlug?, parentId?, createIfNotFound? }

// Hierarchy traversal
await places.getChildren(parentId): Promise<Place[]>
await places.getRootPlaces(): Promise<Place[]>
await places.getHierarchy(placeId): Promise<PlaceHierarchy>

// Type-based queries
await places.getByType(typeSlug): Promise<Place[]>

// Proximity search
await places.searchByProximity(lat, lng, radiusKm): Promise<Place[]>
// Returns places sorted by distance with distance property added`}
			language="typescript"
		/>

		<h3>PlaceTypeCollection Methods</h3>
		<CodeBlock
			code={`// Idempotent type access
await placeTypes.getOrCreate(slug, name?): Promise<PlaceType>

// Lookup
await placeTypes.getBySlug(slug): Promise<PlaceType | null>

// Initialize defaults
await placeTypes.initializeDefaults(): Promise<PlaceType[]>
// Seeds: country, region, city, address, building, room, zone, point_of_interest`}
			language="typescript"
		/>

		<h3>Utility Functions</h3>
		<CodeBlock
			code={`import {
  validateCoordinates,
  calculateDistance,
  formatCoordinates,
  parseCoordinates,
  areCoordinatesNear,
  generateDisplayName,
  normalizeAddressComponents
} from '@happyvertical/smrt-places';

// Validation
const result = validateCoordinates(37.7749, -122.4194);
// Returns: { valid: true } or { valid: false, error: string }

// Distance calculation (Haversine formula)
const distanceKm = calculateDistance(
  37.7749, -122.4194,  // San Francisco
  34.0522, -118.2437   // Los Angeles
);
console.log(distanceKm); // ~559 km

// Formatting
const formatted = formatCoordinates(37.7749, -122.4194, 4);
// "37.7749, -122.4194"

// Parsing
const coords = parseCoordinates("37.7749, -122.4194");
// { lat: 37.7749, lng: -122.4194 }

// Proximity check
const isNear = areCoordinatesNear(
  37.7749, -122.4194,
  37.7750, -122.4195,
  0.1 // threshold in km
);
// true

// Display name generation
const display = generateDisplayName({
  streetNumber: '1234',
  streetName: 'Market Street',
  city: 'San Francisco',
  region: 'CA'
});
// "1234 Market Street, San Francisco, CA"`}
			language="typescript"
		/>
	</section>

	<!-- Tutorials -->
	<section>
		<h2>Tutorials</h2>

		<article>
			<h3>Tutorial 1: Basic Place Creation and Hierarchy (10-15 min)</h3>
			<p>Build a location hierarchy from scratch:</p>
			<ul>
				<li>Initialize PlaceTypeCollection and seed default types</li>
				<li>Create country, region, city hierarchy manually</li>
				<li>Retrieve complete hierarchy using getHierarchy()</li>
				<li>List all places at each level</li>
				<li>Navigate parent-child relationships</li>
			</ul>
		</article>

		<article>
			<h3>Tutorial 2: Organic Database Growth with lookupOrCreate (15-20 min)</h3>
			<p>Automatically populate places using geocoding:</p>
			<ul>
				<li>Forward geocoding (address string → place with coordinates)</li>
				<li>Reverse geocoding (coordinates → place with address)</li>
				<li>Compare OpenStreetMap vs Google Maps providers</li>
				<li>Control creation with createIfNotFound flag</li>
				<li>Store and retrieve metadata from geocoding results</li>
			</ul>
		</article>

		<article>
			<h3>Tutorial 3: Proximity Search and Location Queries (15-20 min)</h3>
			<p>Find nearby places and calculate distances:</p>
			<ul>
				<li>Populate database with places at real coordinates</li>
				<li>Search places within 10km radius</li>
				<li>Calculate distances between specific places</li>
				<li>Filter results by place type</li>
				<li>Sort by relevance/distance</li>
			</ul>
		</article>

		<article>
			<h3>Tutorial 4: Abstract Places and Virtual Worlds (15-20 min)</h3>
			<p>Build location systems without real-world coordinates:</p>
			<ul>
				<li>Create custom place types for game zones (zone, area, sector)</li>
				<li>Build hierarchy without geocoding</li>
				<li>Store game-specific metadata</li>
				<li>Query abstract place hierarchies</li>
				<li>Mix physical and abstract places in same system</li>
			</ul>
		</article>
	</section>

	<!-- Examples -->
	<section>
		<h2>Real-World Examples</h2>

		<h3>Example 1: Restaurant Locator Application</h3>
		<p>Build a restaurant finder with automatic geocoding:</p>
		<CodeBlock
			code={`// Create restaurant type
const restaurantType = await placeTypes.getOrCreate('restaurant', 'Restaurant');

// Add restaurants using addresses (organic growth)
const restaurant1 = await places.lookupOrCreate(
  '123 Main Street, San Francisco, CA',
  {
    geoProvider: 'openstreetmap',
    typeSlug: 'restaurant',
    createIfNotFound: true
  }
);

// Store restaurant-specific metadata
restaurant1.updateMetadata({
  cuisineType: 'Italian',
  priceRange: '$$',
  rating: 4.5,
  hours: {
    monday: '11:00-22:00',
    tuesday: '11:00-22:00',
    // ...
  },
  reservations: true,
  delivery: false
});
await restaurant1.save();

// Find restaurants near user
const userLat = 37.7749;
const userLng = -122.4194;
const nearbyRestaurants = await places.searchByProximity(userLat, userLng, 5);

// Filter by type and metadata
const italianRestaurants = nearbyRestaurants.filter(place => {
  const metadata = place.getMetadata();
  return metadata.cuisineType === 'Italian';
});

console.log('Found', italianRestaurants.length, 'Italian restaurants within 5km');`}
			language="typescript"
		/>

		<h3>Example 2: Event Management System</h3>
		<p>Manage venues with hierarchical room organization:</p>
		<CodeBlock
			code={`// Create venue hierarchy
const city = await places.create({
  name: 'Chicago',
  typeId: (await placeTypes.getBySlug('city'))?.id,
  latitude: 41.8781,
  longitude: -87.6298
});

const building = await places.create({
  name: 'Convention Center',
  typeId: (await placeTypes.getBySlug('building'))?.id,
  parentId: city.id,
  streetName: 'Michigan Avenue',
  streetNumber: '2301',
  latitude: 41.8781,
  longitude: -87.6298
});

// Create floors
const floor1 = await places.create({
  name: 'Floor 1',
  typeId: (await placeTypes.getOrCreate('floor', 'Floor')).id,
  parentId: building.id
});

const floor2 = await places.create({
  name: 'Floor 2',
  typeId: (await placeTypes.getOrCreate('floor', 'Floor')).id,
  parentId: building.id
});

// Create rooms with capacity metadata
const rooms = [
  { name: 'Grand Ballroom', floor: floor1, capacity: 500 },
  { name: 'Conference Room A', floor: floor1, capacity: 50 },
  { name: 'Conference Room B', floor: floor2, capacity: 30 }
];

for (const roomData of rooms) {
  const room = await places.create({
    name: roomData.name,
    typeId: (await placeTypes.getBySlug('room'))?.id,
    parentId: roomData.floor.id,
    metadata: {
      capacity: roomData.capacity,
      equipment: ['Projector', 'Sound system', 'WiFi'],
      accessible: true
    }
  });
}

// Query all rooms in building
const allRooms = await building.getDescendants();
const roomsOnly = allRooms.filter(async place => {
  const type = await place.getType();
  return type?.slug === 'room';
});

// Find available spaces near user location
const nearbyVenues = await places.searchByProximity(41.8781, -87.6298, 10);
console.log('Found', nearbyVenues.length, 'venues within 10km');`}
			language="typescript"
		/>

		<h3>Example 3: Game World Builder</h3>
		<p>Create abstract place hierarchies for virtual worlds:</p>
		<CodeBlock
			code={`// Create game world (no coordinates needed)
const world = await places.create({
  name: 'Eldoria',
  typeId: (await placeTypes.getOrCreate('world', 'World')).id,
  description: 'Fantasy MMORPG world',
  metadata: {
    maxPlayers: 10000,
    serverRegion: 'US-West',
    version: '2.1.0'
  }
});

// Create regions
const easternKingdom = await places.create({
  name: 'Eastern Kingdom',
  typeId: (await placeTypes.getOrCreate('region', 'Region')).id,
  parentId: world.id,
  metadata: {
    faction: 'Alliance',
    recommendedLevel: '1-40',
    climate: 'Temperate'
  }
});

// Create zones
const elwynnForest = await places.create({
  name: 'Elwynn Forest',
  typeId: (await placeTypes.getOrCreate('zone', 'Zone')).id,
  parentId: easternKingdom.id,
  metadata: {
    levelRange: '1-10',
    enemyTypes: ['Wolf', 'Bear', 'Defias Bandit'],
    resources: ['Wood', 'Copper Ore'],
    questHubs: ['Goldshire', 'Northshire Abbey']
  }
});

// Create points of interest
const goldshire = await places.create({
  name: 'Goldshire',
  typeId: (await placeTypes.getOrCreate('point_of_interest', 'POI')).id,
  parentId: elwynnForest.id,
  metadata: {
    type: 'town',
    npcs: ['Innkeeper', 'Blacksmith', 'Quest Giver'],
    services: ['Rest area', 'Vendors', 'Flight path'],
    safeZone: true
  }
});

// Query game hierarchy
const worldHierarchy = await world.getHierarchy();
console.log('World structure:');
console.log('- World:', worldHierarchy.current.name);
console.log('- Regions:', worldHierarchy.descendants.filter(p => p.typeId === easternKingdom.typeId).length);
console.log('- Total locations:', worldHierarchy.descendants.length);`}
			language="typescript"
		/>

		<h3>Example 4: Real Estate Platform</h3>
		<p>Organize properties with geocoding and search:</p>
		<CodeBlock
			code={`// Property hierarchy: Country → City → Building → Unit
const propertyType = await placeTypes.getOrCreate('property', 'Property');

// Create building with geocoding
const building = await places.lookupOrCreate(
  '555 California Street, San Francisco, CA',
  {
    geoProvider: 'google',
    typeSlug: 'building',
    createIfNotFound: true
  }
);

building.updateMetadata({
  buildingName: 'Sunset Tower',
  yearBuilt: 2010,
  floors: 20,
  parking: true,
  amenities: ['Pool', 'Gym', 'Concierge']
});
await building.save();

// Create units within building
for (let floor = 1; floor <= 20; floor++) {
  for (const unit of ['A', 'B', 'C', 'D']) {
    const unitNumber = floor * 100 + unit.charCodeAt(0) - 64;

    const propertyUnit = await places.create({
      name: 'Unit ' + unitNumber,
      typeId: propertyType.id,
      parentId: building.id,
      latitude: building.latitude,
      longitude: building.longitude,
      metadata: {
        floor: floor,
        bedrooms: floor < 10 ? 1 : 2,
        bathrooms: floor < 10 ? 1 : 2,
        sqft: floor < 10 ? 800 : 1200,
        price: (floor < 10 ? 2500 : 3500) + (floor * 50),
        available: Math.random() > 0.7,
        viewType: floor > 15 ? 'City view' : 'Street view'
      }
    });
  }
}

// Search for properties near location
const searchLat = 37.7749;
const searchLng = -122.4194;
const nearbyProperties = await places.searchByProximity(searchLat, searchLng, 2);

// Filter by availability and price
const availableUnits = nearbyProperties.filter(place => {
  const metadata = place.getMetadata();
  return metadata.available && metadata.price <= 3000;
});

console.log('Found', availableUnits.length, 'available units under $3000 within 2km');`}
			language="typescript"
		/>

		<h3>Example 5: Supply Chain Management</h3>
		<p>Track warehouse locations and zones:</p>
		<CodeBlock
			code={`// Warehouse hierarchy: Country → Distribution Center → Warehouse → Zone → Shelf
const dcType = await placeTypes.getOrCreate('distribution_center', 'Distribution Center');
const warehouseType = await placeTypes.getOrCreate('warehouse', 'Warehouse');
const zoneType = await placeTypes.getOrCreate('zone', 'Zone');
const shelfType = await placeTypes.getOrCreate('shelf', 'Shelf');

// Create distribution center
const dc = await places.create({
  name: 'West Coast DC',
  typeId: dcType.id,
  latitude: 37.5483,
  longitude: -121.9886,
  city: 'Tracy',
  region: 'CA',
  metadata: {
    operatingHours: '24/7',
    maxCapacity: 1000000, // sqft
    manager: 'John Doe'
  }
});

// Create warehouse within DC
const warehouse = await places.create({
  name: 'Warehouse A',
  typeId: warehouseType.id,
  parentId: dc.id,
  latitude: dc.latitude,
  longitude: dc.longitude,
  metadata: {
    temperature: 'ambient',
    securityLevel: 'high'
  }
});

// Create zones within warehouse
for (const zoneName of ['Receiving', 'Picking', 'Packing', 'Shipping']) {
  const zone = await places.create({
    name: zoneName + ' Zone',
    typeId: zoneType.id,
    parentId: warehouse.id,
    metadata: {
      capacity: 10000,
      currentOccupancy: Math.floor(Math.random() * 10000)
    }
  });

  // Create shelves within zone
  for (let aisle = 1; aisle <= 10; aisle++) {
    for (let position = 1; position <= 20; position++) {
      const shelf = await places.create({
        name: 'Shelf ' + zoneName[0] + '-' + aisle + '-' + position,
        typeId: shelfType.id,
        parentId: zone.id,
        metadata: {
          aisle: aisle,
          position: position,
          height: Math.floor(Math.random() * 3) + 1, // 1-3 levels
          occupied: Math.random() > 0.3
        }
      });
    }
  }
}

// Query all shelves in warehouse
const allDescendants = await warehouse.getDescendants();
const shelves = allDescendants.filter(async place => {
  const type = await place.getType();
  return type?.slug === 'shelf';
});

console.log('Total shelves in warehouse:', shelves.length);

// Calculate distances for route optimization
const warehouseA = await places.findOne({ name: 'Warehouse A' });
const warehouseB = await places.findOne({ name: 'Warehouse B' });
const distance = calculateDistance(
  warehouseA.latitude, warehouseA.longitude,
  warehouseB.latitude, warehouseB.longitude
);
console.log('Distance between warehouses:', distance, 'km');`}
			language="typescript"
		/>
	</section>

	<!-- Integration Patterns -->
	<section>
		<h2>Integration Patterns</h2>

		<article>
			<h3>With smrt-core</h3>
			<p>
				Place and PlaceType extend <code>SmrtObject</code> with full SMRT framework integration:
			</p>
			<ul>
				<li><code>@smrt</code> decorator auto-generates REST APIs, CLI commands, and MCP tools</li>
				<li>Automatic database schema generation from TypeScript types</li>
				<li>Built-in validation, lifecycle hooks (beforeSave, afterSave)</li>
				<li>AI-powered methods: <code>do()</code> and <code>is()</code></li>
			</ul>
		</article>

		<article>
			<h3>With @happyvertical/geo</h3>
			<p>Seamless geocoding integration for organic database growth:</p>
			<ul>
				<li>PlaceCollection internally uses geo adapter for lookupOrCreate()</li>
				<li>OpenStreetMap provider (free, no API key)</li>
				<li>Google Maps provider (requires GOOGLE_MAPS_API_KEY env var)</li>
				<li>Automatic address component extraction and population</li>
			</ul>
		</article>

		<article>
			<h3>With smrt-tenancy</h3>
			<p>Multi-tenant place isolation:</p>
			<ul>
				<li>Each tenant has separate place hierarchies</li>
				<li>Query scoping via tenant context in collection options</li>
				<li>Shared schema, separate data per tenant</li>
				<li>Permission checks control which users access which places</li>
			</ul>
		</article>

		<article>
			<h3>With smrt-users</h3>
			<p>User location tracking and proximity features:</p>
			<ul>
				<li>User profiles store <code>placeId</code> foreign key</li>
				<li>Track user location history (visits to places)</li>
				<li>Proximity-based user discovery (find users nearby)</li>
				<li>Location-based permissions/roles</li>
			</ul>
		</article>

		<article>
			<h3>With smrt-content</h3>
			<p>Location-specific content:</p>
			<ul>
				<li>Content references places via <code>placeId</code> foreign key</li>
				<li>Blog posts/articles about specific locations</li>
				<li>Location guides and documentation</li>
				<li>Metadata synchronization between content and places</li>
			</ul>
		</article>
	</section>

	<!-- Best Practices -->
	<section>
		<h2>Best Practices</h2>

		<article class="tip">
			<h3>Creating Hierarchies</h3>
			<ul>
				<li>Start with root places (countries) and build downward</li>
				<li>Use consistent naming conventions across hierarchy levels</li>
				<li>Assign type slugs early for better querying and filtering</li>
				<li>Store external IDs for syncing with other systems</li>
			</ul>
		</article>

		<article class="tip">
			<h3>Geocoding</h3>
			<ul>
				<li>Use OpenStreetMap by default (free, no API key needed)</li>
				<li>Switch to Google Maps for better accuracy on edge cases</li>
				<li>Set <code>createIfNotFound: false</code> for lookup-only queries</li>
				<li>Validate coordinates with <code>validateCoordinates()</code> before storing</li>
				<li>Check <code>source</code> field to track which provider created the place</li>
			</ul>
		</article>

		<article class="tip">
			<h3>Metadata Usage</h3>
			<ul>
				<li>Store domain-specific attributes in JSON metadata field</li>
				<li>Use consistent schema across place types for easier querying</li>
				<li>Don't store sensitive data in metadata (no encryption)</li>
				<li>Validate metadata structure before <code>updateMetadata()</code></li>
				<li>Consider extracting frequently-queried metadata to dedicated columns</li>
			</ul>
		</article>

		<article class="tip">
			<h3>Performance</h3>
			<ul>
				<li>Index frequently-queried fields (parentId, typeId, city, region)</li>
				<li>Use proximity search carefully on large datasets (pre-filter by type)</li>
				<li>Cache hierarchy results when possible (e.g., getHierarchy())</li>
				<li>Batch load relationships to avoid N+1 queries</li>
				<li>Consider pagination for large result sets</li>
			</ul>
		</article>

		<article class="tip">
			<h3>Abstract Places</h3>
			<ul>
				<li>Skip all geographic fields for virtual/abstract places</li>
				<li>Use descriptive type slugs ('zone', 'area', 'sector')</li>
				<li>Store domain-specific data in metadata field</li>
				<li>Hierarchies can be arbitrarily deep (no practical limit)</li>
				<li>Mix physical and abstract places in same system</li>
			</ul>
		</article>

		<article class="warning">
			<h3>Common Mistakes to Avoid</h3>
			<ul>
				<li>Don't create circular references (Child → Parent → Grandparent → Child)</li>
				<li>Don't store massive objects in metadata (keep under 10KB)</li>
				<li>Don't use geocoding for every query (cache lookups)</li>
				<li>Don't forget to set <code>typeId</code> (required field)</li>
				<li>Don't mix coordinate systems (always use decimal degrees)</li>
			</ul>
		</article>
	</section>

	<!-- Troubleshooting -->
	<section>
		<h2>Common Issues and Troubleshooting</h2>

		<article class="issue">
			<h3>Error: "Place not found" on lookupOrCreate()</h3>
			<p><strong>Cause:</strong> Geocoding service can't find the address</p>
			<p>
				<strong>Solution:</strong> Check internet access, verify address format, try different provider,
				or use reverse geocoding with coordinates instead.
			</p>
			<CodeBlock
				code={`// Try different format
const place1 = await places.lookupOrCreate('San Francisco, CA, USA', {...});

// Or use coordinates
const place2 = await places.lookupOrCreate(
  { lat: 37.7749, lng: -122.4194 },
  {...}
);`}
				language="typescript"
			/>
		</article>

		<article class="issue">
			<h3>Error: "Invalid coordinates"</h3>
			<p><strong>Cause:</strong> Latitude or longitude out of valid range</p>
			<p>
				<strong>Solution:</strong> Validate with <code>validateCoordinates()</code>. Latitude: -90
				to 90, Longitude: -180 to 180. Watch for swapped values.
			</p>
			<CodeBlock
				code={`const result = validateCoordinates(lat, lng);
if (!result.valid) {
  console.error('Invalid coordinates:', result.error);
  return;
}`}
				language="typescript"
			/>
		</article>

		<article class="issue">
			<h3>Issue: Slow hierarchy traversal</h3>
			<p><strong>Cause:</strong> Multiple database queries for ancestors/descendants</p>
			<p>
				<strong>Solution:</strong> Use <code>getHierarchy()</code> once instead of separate calls. Create
				database indexes on parentId. Cache results for frequently-accessed hierarchies.
			</p>
			<CodeBlock
				code={`// Efficient: single call
const hierarchy = await place.getHierarchy();
const ancestors = hierarchy.ancestors;
const descendants = hierarchy.descendants;

// Less efficient: multiple calls
const ancestors = await place.getAncestors();
const descendants = await place.getDescendants();`}
				language="typescript"
			/>
		</article>

		<article class="issue">
			<h3>Issue: Geocoding provider inconsistencies</h3>
			<p><strong>Cause:</strong> Different providers return different address formats</p>
			<p>
				<strong>Solution:</strong> Store <code>source</code> field to track provider. Use
				<code>normalizeAddressComponents()</code> to standardize formats. Consider fallback provider.
			</p>
			<CodeBlock
				code={`const place = await places.lookupOrCreate(address, {
  geoProvider: 'google',
  createIfNotFound: true
});

console.log('Created by:', place.source); // 'google'

// Try fallback if needed
if (!place) {
  place = await places.lookupOrCreate(address, {
    geoProvider: 'openstreetmap',
    createIfNotFound: true
  });
}`}
				language="typescript"
			/>
		</article>

		<article class="issue">
			<h3>Issue: Abstract place queries returning empty</h3>
			<p><strong>Cause:</strong> Incorrect parentId or typeId</p>
			<p>
				<strong>Solution:</strong> Verify parentId is set correctly (null or empty = root level).
				Check typeId matches expected type. Use <code>getHierarchy()</code> to inspect structure.
			</p>
			<CodeBlock
				code={`// Check place structure
const hierarchy = await place.getHierarchy();
console.log('Parent:', hierarchy.current.parentId);
console.log('Type:', await hierarchy.current.getType());
console.log('Children:', hierarchy.descendants.length);`}
				language="typescript"
			/>
		</article>

		<article class="issue">
			<h3>Issue: Circular reference errors</h3>
			<p><strong>Cause:</strong> Attempting to create Parent → Child → Parent loop</p>
			<p>
				<strong>Solution:</strong> Database foreign key constraints prevent this. Always verify parent
				exists before setting parentId. Use transactions when restructuring hierarchies.
			</p>
			<CodeBlock
				code={`// Safe: check parent exists
const parent = await places.findById(parentId);
if (!parent) {
  throw new Error('Parent not found');
}

const child = await places.create({
  name: 'Child',
  parentId: parent.id,
  typeId: typeId
});`}
				language="typescript"
			/>
		</article>
	</section>

	<!-- Related Modules -->
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
			<a href="/modules/smrt-users">
				<h3>smrt-users</h3>
				<p>User location tracking and proximity</p>
			</a>
			<a href="/modules/smrt-content">
				<h3>smrt-content</h3>
				<p>Location-specific content management</p>
			</a>
		</nav>
	</section>
</ModulePage>
