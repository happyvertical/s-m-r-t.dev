<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-profiles - Profile Management System | SMRT Documentation</title>
	<meta
		name="description"
		content="Comprehensive profile management with flexible metadata, relationships, and multi-provider authentication (OIDC, Nostr, API keys)."
	/>
</svelte:head>

<Grid>
	<nav class="breadcrumb" slot="header">
		<a href="/">Home</a>
		<span>/</span>
		<a href="/modules">Modules</a>
		<span>/</span>
		<span>smrt-profiles</span>
	</nav>

	<h1>smrt-profiles</h1>
	<p class="lead">
		Comprehensive profile management system with flexible metadata, complex relationships, and
		multi-provider authentication support (OIDC, Nostr, API keys).
	</p>

	<section id="overview">
		<h2>Overview</h2>
		<p>
			The <code>@happyvertical/smrt-profiles</code> package enables managing profiles of any type
			(people, organizations, robots) with flexible metadata, complex relationships, and integrated
			authentication support.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li>
				<strong>Flexible Profile Types</strong>: Define custom types (Person, Organization, Team,
				Robot)
			</li>
			<li>
				<strong>Controlled Metadata</strong>: EAV pattern with controlled vocabulary and validation
			</li>
			<li>
				<strong>Complex Relationships</strong>: Reciprocal, directional, with temporal terms and
				context
			</li>
			<li>
				<strong>Multi-Provider Auth</strong>: OIDC (Google, GitHub, Keycloak), Nostr, API keys
			</li>
			<li><strong>Email-Based Linking</strong>: Same verified email = same profile</li>
			<li><strong>Temporal Tracking</strong>: Employment history, membership periods</li>
			<li><strong>Audit Logging</strong>: Complete action trail for compliance</li>
			<li><strong>Multi-Tenancy</strong>: Database-level isolation</li>
		</ul>

		<h3>Architecture</h3>
		<div class="diagram">
			<pre>
┌─────────────────────────────────────────────────────────────┐
│                   SMRT Profiles System                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Core Models                              │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ • Profile (Person, Org, Robot, etc.)                 │  │
│  │ • ProfileType (type definitions with slugs)          │  │
│  │ • ProfileMetadata + ProfileMetafield (controlled)    │  │
│  │ • ProfileRelationship + ProfileRelationshipType      │  │
│  │ • ProfileRelationshipTerm (temporal tracking)        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Authentication Models                        │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ • OidcIdentity (Google, GitHub, Keycloak)           │  │
│  │ • NostrIdentity (encrypted keypairs)                 │  │
│  │ • ApiKey (hashed, scoped, expirable)                 │  │
│  │ • MagicLinkToken (passwordless)                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Security & Compliance                      │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ • AuditLog (all actions tracked)                    │  │
│  │ • Email verification (OIDC)                          │  │
│  │ • Master secret encryption (Nostr)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
			</pre>
		</div>

		<h3>Use Cases</h3>
		<ul>
			<li>Multi-tenant SaaS platforms with user profiles</li>
			<li>Social networks and collaboration tools</li>
			<li>Employee directories and organizational charts</li>
			<li>Web3 identity systems with Nostr</li>
			<li>Healthcare provider networks</li>
			<li>Educational institutions (students, teachers, courses)</li>
		</ul>
	</section>

	<section id="installation">
		<h2>Installation</h2>

		<h3>Using pnpm (recommended)</h3>
		<CodeBlock code={`pnpm add @happyvertical/smrt-profiles`} language="bash" />

		<h3>Using npm</h3>
		<CodeBlock code={`npm install @happyvertical/smrt-profiles`} language="bash" />

		<h3>Using bun</h3>
		<CodeBlock code={`bun add @happyvertical/smrt-profiles`} language="bash" />

		<h3>Database Setup</h3>
		<p>Requires database configuration (SQLite, PostgreSQL, etc.):</p>
		<CodeBlock
			code={`import { smrt @happyvertical '@happyvertical/smrt-core';

await smrt.initialize({
  db: { type: \'sqlite\', url: \'profiles.db\' }
});`}
			language="typescript"
		/>
	</section>

	<section id="quick-start">
		<h2>Quick Start (5 Minutes)</h2>

		<h3>1. Create Profile Type</h3>
		<CodeBlock
			code={`import {
  ProfileCollection,
  ProfileTypeCollection
} from '@happyvertical/smrt-profiles';

// Create profile type
const typeCollection = await ProfileTypeCollection.create({ db: {...} });
const humanType = await typeCollection.create({ name: \'Human\' });
await humanType.save();
console.log(humanType.slug); // 'human'`}
			language="typescript"
		/>

		<h3>2. Create Profile</h3>
		<CodeBlock
			code={`// Create profile
const profileCollection = await ProfileCollection.create({ db: {...} });
const person = await profileCollection.create({
  typeId: humanType.id,
  name: 'Alice Johnson',
  email: 'alice@example.com',
  description: 'Software engineer'
});
await person.save();`}
			language="typescript"
		/>

		<h3>3. Add Metadata</h3>
		<CodeBlock
			code={`import { ProfileMetafieldCollection @happyvertical '@happyvertical/smrt-profiles';

// Define metafield with validation
const fieldCollection = await ProfileMetafieldCollection.create({ db: {...} });
const location = await fieldCollection.create({
  name: 'Location',
  validation: { type: \'string\', maxLength: 100 }
});
await location.save();

// Add metadata to profile
await person.addMetadata('location', 'San Francisco, CA');
const metadata = await person.getMetadata();
// { location: \'San Francisco, CA\' }`}
			language="typescript"
		/>

		<h3>4. Create Relationships</h3>
		<CodeBlock
			code={`import {
  ProfileRelationshipTypeCollection
} from '@happyvertical/smrt-profiles';

// Create relationship type (reciprocal)
const relTypeCollection = await ProfileRelationshipTypeCollection.create({ db: {...} });
const friendType = await relTypeCollection.create({
  name: 'Friend',
  reciprocal: true // Auto-creates inverse
});
await friendType.save();

// Create relationship (automatically creates reciprocal)
const bob = await profileCollection.get({ email: \'bob@example.com\' });
await person.addRelationship(bob, 'friend');

// Query relationships
const friends = await person.getRelatedProfiles('friend');
console.log(friends.length); // 1 (Bob)`}
			language="typescript"
		/>
	</section>

	<section id="core-concepts">
		<h2>Core Concepts</h2>

		<h3>1. Profile Type System</h3>
		<p>
			<strong>ProfileType</strong> is a lookup table that classifies profiles (Person,
			Organization, Robot, Team, etc.).
		</p>

		<CodeBlock
			code={`// Create multiple types
const personType = await typeCollection.create({ name: \'Person\' });
const orgType = await typeCollection.create({ name: \'Organization\' });
const teamType = await typeCollection.create({ name: \'Team\' });

// Use type when creating profiles
const employee = await profileCollection.create({
  typeId: personType.id,
  name: 'Jane Doe'
});

// Get type slug
const slug = await employee.getTypeSlug(); // 'person'

// Set type by slug
await employee.setTypeBySlug('organization');`}
			language="typescript"
		/>

		<h3>2. Metadata System (Controlled EAV)</h3>
		<p>Flexible key-value storage with controlled vocabulary and validation.</p>

		<h4>Architecture</h4>
		<ul>
			<li><strong>ProfileMetafield</strong>: Defines allowed keys (controlled vocabulary)</li>
			<li><strong>ProfileMetadata</strong>: Stores actual values</li>
			<li><strong>Validation</strong>: Each metafield can define validation rules</li>
		</ul>

		<CodeBlock
			code={`// Define metafield with validation
const phone = await fieldCollection.create({
  name: 'Phone Number',
  validation: {
    type: 'string',
    pattern: '^\\+?[0-9]{10,15}$',
    message: 'Must be valid phone number'
  }
});
await phone.save();

// Add metadata (validated before save)
await person.addMetadata('phone-number', '+14155551234');

// Get all metadata
const metadata = await person.getMetadata();
// { 'phone-number': \'+14155551234\', location: \'SF\' }

// Update multiple
await person.updateMetadata({
  location: 'New York',
  'job-title': 'Senior Engineer'
});

// Remove metadata
await person.removeMetadata('location');`}
			language="typescript"
		/>

		<h4>Validation Types</h4>
		<table>
			<thead>
				<tr>
					<th>Type</th>
					<th>Properties</th>
					<th>Example</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>string</code></td>
					<td>pattern, minLength, maxLength</td>
					<td>Email, phone, URL</td>
				</tr>
				<tr>
					<td><code>number</code></td>
					<td>min, max</td>
					<td>Age, salary, score</td>
				</tr>
				<tr>
					<td><code>boolean</code></td>
					<td>-</td>
					<td>Active, verified</td>
				</tr>
				<tr>
					<td><code>date</code></td>
					<td>-</td>
					<td>Start date, birthdate</td>
				</tr>
				<tr>
					<td><code>json</code></td>
					<td>-</td>
					<td>Complex objects</td>
				</tr>
			</tbody>
		</table>

		<h3>3. Relationship System</h3>
		<p>
			<strong>ProfileRelationship</strong> connects two profiles with a relationship type.
			Relationships can be directional or reciprocal.
		</p>

		<h4>Reciprocal Relationships</h4>
		<CodeBlock
			code={`// Create reciprocal type
const spouseType = await relTypeCollection.create({
  name: 'Spouse',
  reciprocal: true
});
await spouseType.save();

// Add relationship (auto-creates inverse)
await alice.addRelationship(bob, 'spouse');

// Both profiles now have the relationship
const aliceSpouses = await alice.getRelatedProfiles('spouse'); // [Bob]
const bobSpouses = await bob.getRelatedProfiles('spouse'); // [Alice]`}
			language="typescript"
		/>

		<h4>Directional Relationships</h4>
		<CodeBlock
			code={`// Create directional type
const managerType = await relTypeCollection.create({
  name: 'Manager',
  reciprocal: false
});
await managerType.save();

// Add one-way relationship
await employee.addRelationship(manager, 'manager');

// Only employee has manager
const managers = await employee.getRelatedProfiles('manager'); // [Manager]
const reports = await manager.getRelatedProfiles('manager'); // []`}
			language="typescript"
		/>

		<h4>Context Profiles</h4>
		<p>Optional tertiary profile for modeling complex relationships.</p>

		<CodeBlock
			code={`// Colleagues through a company
const company = await profileCollection.create({
  typeId: orgType.id,
  name: 'Acme Corp'
});
await company.save();

await alice.addRelationship(bob, 'colleague', company);

// Query with context
const colleagues = await alice.getRelatedProfiles('colleague');
// Can filter by context in advanced queries`}
			language="typescript"
		/>

		<h3>4. Temporal Relationships (Terms)</h3>
		<p>
			<strong>ProfileRelationshipTerm</strong> tracks time-based periods for relationships
			(employment history, memberships, etc.).
		</p>

		<CodeBlock
			code={`// Add relationship with term
const employeeRel = await employee.addRelationship(company, 'works-at');
await employeeRel.addTerm(new Date('2023-01-15'), null); // Currently employed

// End current employment
await employeeRel.endCurrentTerm(new Date('2024-06-30'));

// Add new employment period
await employeeRel.addTerm(new Date('2024-07-01'), null);

// Query history
const terms = await employeeRel.getTerms();
// [
//   { startDate: 2023-01-15, endDate: 2024-06-30 },
//   { startDate: 2024-07-01, endDate: null }
// ]

// Get current active term
const activeTerm = await employeeRel.getActiveTerm();`}
			language="typescript"
		/>
	</section>

	<section id="authentication">
		<h2>Authentication</h2>

		<h3>OIDC Integration</h3>
		<p>
			Support for any OpenID Connect provider (Google, GitHub, Keycloak, custom) with email-based
			account linking.
		</p>

		<CodeBlock
			code={`import {
  createProfileFromOidc,
  resolveIdentity
} from '@happyvertical/smrt-profiles';

// On OIDC login callback
const oidcClaims = {
  sub: 'google-user-123',
  iss: 'https://accounts.google.com',
  email: 'user@example.com',
  email_verified: true,
  name: 'John Doe'
};

// Create or link profile
const { profile, oidcIdentity, created } = await createProfileFromOidc(
  oidcClaims,
  'google',
  { db: {...} }
);

if (created) {
  console.log('New profile created');
} else {
  console.log('Linked to existing profile via email');
}`}
			language="typescript"
		/>

		<h4>Email-Based Account Linking</h4>
		<ul>
			<li>Same verified email = same profile across providers</li>
			<li>Security: only links when <code>email_verified: true</code></li>
			<li>Multiple OIDC identities per profile supported</li>
		</ul>

		<h3>Authentication Resolution</h3>
		<CodeBlock
			code={`// In authentication middleware
const { profile, source } = await resolveIdentity({
  oidcSession: event.locals.session,
  apiKey: event.request.headers.get('X-API-Key'),
  db: event.locals.db
});

if (!profile) {
  return error(401, 'Unauthorized');
}

// Store in context
event.locals.profile = profile;
event.locals.authSource = source; // 'oidc', 'api-key', etc.`}
			language="typescript"
		/>

		<h4>Resolution Priority</h4>
		<ol>
			<li>API key header (highest priority for programmatic access)</li>
			<li>OIDC session (web users)</li>
			<li>Nostr authentication (NIP-42 signed events)</li>
			<li>Actor header (CI pass-through)</li>
			<li>None (anonymous)</li>
		</ol>

		<h3>API Keys</h3>
		<p>Secure API keys for programmatic access with scopes and expiration.</p>

		<CodeBlock
			code={`// Generate API key for profile
const apiKey = await profile.generateApiKey({
  name: 'CI/CD Bot',
  scopes: ['read:profiles', 'write:profiles'],
  expiresAt: new Date('2025-12-31')
});

console.log(apiKey.key); // 'smrt_1234567890abcdef...'
console.log(apiKey.keyPrefix); // 'smrt_123' (for identification)

// Verify API key
const verified = await ApiKey.verify(apiKey.key);
if (verified?.isValid()) {
  const profile = await verified.getProfile();
  if (verified.hasScope('read:profiles')) {
    // Allow access
  }
}

// Revoke key
await apiKey.revoke();

// List active keys
const activeKeys = await profile.getActiveApiKeys();`}
			language="typescript"
		/>

		<h4>API Key Security</h4>
		<ul>
			<li>SHA-256 hashed storage (never plaintext)</li>
			<li>Prefix stored for identification</li>
			<li>Scopes/permissions system</li>
			<li>Expiration and revocation support</li>
			<li>Usage tracking (lastUsedAt)</li>
		</ul>

		<h3>Nostr Identity</h3>
		<p>Decentralized identity with custodial keypair management.</p>

		<CodeBlock
			code={`import {
  generateNostrKeypair,
  createMagicLinkToken
} from '@happyvertical/smrt-profiles';

// Generate keypair (encrypted with master secret)
const keypair = await generateNostrKeypair('user@example.com');

// Create magic link token
const token = await createMagicLinkToken(profile, keypair);

// Send email with magic link
await sendEmail({
  to: profile.email,
  subject: 'Sign in to your account',
  body: \`Click here: https://app.example.com/auth/magic?\${'${token}\`
});

// Verify magic link
const verified = await verifyMagicLinkToken(token);
if (verified) {
  // Sign in user
}`}
			language="typescript"
		/>
	</section>

	<section id="tutorials">
		<h2>Tutorials</h2>

		<h3>Tutorial 1: Building an Employee Directory</h3>
		<p>
			Create an employee directory with organizational structure, metadata, and relationship
			tracking.
		</p>

		<h4>Step 1: Create Profile Types</h4>
		<CodeBlock
			code={`const personType = await typeCollection.create({ name: \'Person\' });
const orgType = await typeCollection.create({ name: \'Organization\' });
const deptType = await typeCollection.create({ name: \'Department\' });
await Promise.all([personType.save(), orgType.save(), deptType.save()]);`}
			language="typescript"
		/>

		<h4>Step 2: Create Organization and Departments</h4>
		<CodeBlock
			code={`const company = await profileCollection.create({
  typeId: orgType.id,
  name: 'Acme Corporation',
  description: 'Technology company'
});
await company.save();

const engineering = await profileCollection.create({
  typeId: deptType.id,
  name: 'Engineering'
});
await engineering.save();

await engineering.addRelationship(company, 'part-of');`}
			language="typescript"
		/>

		<h4>Step 3: Create Employees with Metadata</h4>
		<CodeBlock
			code={`// Define metadata fields
const jobTitleField = await fieldCollection.create({
  name: 'Job Title',
  validation: { type: \'string\', maxLength: 100 }
});
const startDateField = await fieldCollection.create({
  name: 'Start Date',
  validation: { type: \'date\' }
});
await Promise.all([jobTitleField.save(), startDateField.save()]);

// Create employee
const employee = await profileCollection.create({
  typeId: personType.id,
  name: 'Alice Johnson',
  email: 'alice@acme.com'
});
await employee.save();

// Add metadata
await employee.addMetadata('job-title', 'Senior Software Engineer');
await employee.addMetadata('start-date', new Date('2023-01-15'));`}
			language="typescript"
		/>

		<h4>Step 4: Create Relationships with Terms</h4>
		<CodeBlock
			code={`// Employee works at company
const employmentRel = await employee.addRelationship(company, 'works-at');
await employmentRel.addTerm(new Date('2023-01-15'), null); // Current

// Employee in department
await employee.addRelationship(engineering, 'member-of');

// Colleague relationship with context
const bob = await profileCollection.create({
  typeId: personType.id,
  name: 'Bob Smith',
  email: 'bob@acme.com'
});
await bob.save();

await employee.addRelationship(bob, 'colleague', company);`}
			language="typescript"
		/>

		<h4>Step 5: Query and Analytics</h4>
		<CodeBlock
			code={`// Get all employees
const employees = await profileCollection.list({
  where: { typeId: personType.id }
});

// Get employee's colleagues
const colleagues = await employee.getRelatedProfiles('colleague');

// Get employment history
const workRel = await employee.getRelationships({ slug: \'works-at\' });
const terms = await workRel[0].getTerms();`}
			language="typescript"
		/>

		<h3>Tutorial 2: OIDC-Based Multi-Tenant SaaS</h3>
		<p>Implement OIDC authentication with email-based account linking across tenants.</p>

		<h4>Step 1: Configure OIDC Providers</h4>
		<CodeBlock
			code={`// Configure in your auth provider (e.g., Auth.js, Keycloak)
const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }),
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  })
];`}
			language="typescript"
		/>

		<h4>Step 2: Handle OIDC Callback</h4>
		<CodeBlock
			code={`// In your OIDC callback handler
export async function handleOidcCallback(oidcClaims, provider) {
  const { profile, oidcIdentity, created } = await createProfileFromOidc(
    oidcClaims,
    provider,
    { db: getTenantDb() }
  );

  // Store tenant ID in metadata
  if (created) {
    await profile.addMetadata('tenant-id', getCurrentTenantId());
  }

  // Create session
  const session = await createSession({
    profileId: profile.id,
    provider: oidcIdentity.provider
  });

  return session;
}`}
			language="typescript"
		/>

		<h4>Step 3: Authentication Middleware</h4>
		<CodeBlock
			code={`// In hooks.server.ts or middleware
export async function handle({ event, resolve }) {
  const { profile, source } = await resolveIdentity({
    oidcSession: await getSession(event.cookies),
    apiKey: event.request.headers.get('X-API-Key'),
    db: event.locals.db
  });

  if (profile) {
    event.locals.profile = profile;
    event.locals.authSource = source;

    // Get tenant from metadata
    const metadata = await profile.getMetadata();
    event.locals.tenantId = metadata['tenant-id'];
  }

  return resolve(event);
}`}
			language="typescript"
		/>

		<h3>Tutorial 3: Social Network with Reciprocal Relationships</h3>
		<p>Build a social network with friends, followers, and custom relationship types.</p>

		<CodeBlock
			code={`// Create relationship types
const friendType = await relTypeCollection.create({
  name: 'Friend',
  reciprocal: true
});
const followerType = await relTypeCollection.create({
  name: 'Follower',
  reciprocal: false
});
await Promise.all([friendType.save(), followerType.save()]);

// Add friends (auto-reciprocal)
await alice.addRelationship(bob, 'friend');

// Both have the relationship
const aliceFriends = await alice.getRelatedProfiles('friend'); // [Bob]
const bobFriends = await bob.getRelatedProfiles('friend'); // [Alice]

// Add follower (one-way)
await alice.addRelationship(charlie, 'follower');

// Query friend network at depth 2
const friendsOfFriends = await alice.getRelationshipNetwork({
  slug: 'friend',
  depth: 2
});

// Analytics
const followerCount = (await alice.getRelatedProfiles('follower')).length;
const mutualFriends = await findMutualFriends(alice, bob);`}
			language="typescript"
		/>
	</section>

	<section id="examples">
		<h2>Examples</h2>

		<h3>Example 1: Healthcare Provider Network</h3>
		<CodeBlock
			code={`// Profile types
const physicianType = await typeCollection.create({ name: \'Physician\' });
const patientType = await typeCollection.create({ name: \'Patient\' });
const clinicType = await typeCollection.create({ name: \'Clinic\' });

// Create profiles
const drSmith = await profileCollection.create({
  typeId: physicianType.id,
  name: 'Dr. Sarah Smith',
  email: 'sarah.smith@clinic.com'
});

const clinic = await profileCollection.create({
  typeId: clinicType.id,
  name: 'Downtown Medical Clinic'
});

// Metadata
await drSmith.addMetadata('specialty', 'Cardiology');
await drSmith.addMetadata('license-number', 'CA12345');

// Relationships
await drSmith.addRelationship(clinic, 'works-at');

// Referrals with context
const drJones = await profileCollection.create({
  typeId: physicianType.id,
  name: 'Dr. Michael Jones'
});

await drSmith.addRelationship(drJones, 'refers-to', clinic);

// Audit logging
await drSmith.recordAction({
  action: 'patient_viewed',
  resourceType: 'Patient',
  resourceId: 'patient-123',
  source: 'web',
  metadata: { reason: \'Follow-up appointment\' }
});`}
			language="typescript"
		/>

		<h3>Example 2: Educational Institution</h3>
		<CodeBlock
			code={`// Profile types
const studentType = await typeCollection.create({ name: \'Student\' });
const teacherType = await typeCollection.create({ name: \'Teacher\' });
const courseType = await typeCollection.create({ name: \'Course\' });

// Create profiles
const student = await profileCollection.create({
  typeId: studentType.id,
  name: 'Emma Wilson',
  email: 'emma.wilson@university.edu'
});

const course = await profileCollection.create({
  typeId: courseType.id,
  name: 'Computer Science 101'
});

// Enrollment with term
const enrollmentRel = await student.addRelationship(course, 'enrolled-in');
await enrollmentRel.addTerm(
  new Date('2024-09-01'),
  new Date('2024-12-15')
);

// Metadata
await student.addMetadata('grade-level', 'Freshman');
await student.addMetadata('gpa', 3.8);

// Query courses
const courses = await student.getRelatedProfiles('enrolled-in');

// Get enrollment history
const enrollments = await student.getRelationships({ slug: \'enrolled-in\' });
const history = await Promise.all(
  enrollments.map(async (rel) => ({
    course: await rel.getToProfile(),
    terms: await rel.getTerms()
  }))
);`}
			language="typescript"
		/>
	</section>

	<section id="integration">
		<h2>Integration with Other Modules</h2>

		<h3>smrt-users</h3>
		<p>
			The profiles package provides identity and profile management that complements smrt-users:
		</p>
		<ul>
			<li><strong>smrt-users</strong>: Authentication, sessions, permissions</li>
			<li><strong>smrt-profiles</strong>: Profile data, relationships, metadata</li>
		</ul>

		<CodeBlock
			code={`// User logs in via OIDC (handled by smrt-users)
// Profile is created or retrieved via smrt-profiles
const { profile } = await resolveIdentity(authContext);

// Store profile reference in user session
event.locals.profile = profile;

// Use profile for authorization
const tenantId = (await profile.getMetadata())['tenant-id'];
const membership = await getUserTenantMembership(profile.id, tenantId);`}
			language="typescript"
		/>

		<h3>smrt-core</h3>
		<ul>
			<li>All models extend <strong>SmrtObject</strong> for database persistence</li>
			<li>Automatic API generation (REST, CLI, MCP)</li>
			<li>AI-powered methods (<code>generateBio()</code>, <code>matches()</code>)</li>
		</ul>

		<h3>Multi-Tenancy Pattern</h3>
		<CodeBlock
			code={`// Tenant A database
const profilesA = await ProfileCollection.create({
  db: { type: \'postgres\', url: DATABASE_URL_TENANT_A }
});

// Tenant B database
const profilesB = await ProfileCollection.create({
  db: { type: \'postgres\', url: DATABASE_URL_TENANT_B }
});

// Complete isolation at database level`}
			language="typescript"
		/>
	</section>

	<section id="best-practices">
		<h2>Best Practices</h2>

		<h3>1. Profile Design</h3>
		<ul>
			<li>Use descriptive names for profile types (Person vs User, Team vs Group)</li>
			<li>Normalize emails to lowercase for reliable lookups</li>
			<li>Always provide profile descriptions for context</li>
			<li>Don't mix profile types unnecessarily</li>
		</ul>

		<h3>2. Metadata Management</h3>
		<ul>
			<li>Define metafields (vocabulary) upfront before adding metadata</li>
			<li>Use appropriate validation types and constraints</li>
			<li>Namespace keys with dot notation (contact.phone, social.github)</li>
			<li>Use batch operations for efficiency</li>
		</ul>

		<CodeBlock
			code={`// Good - namespaced
await profile.updateMetadata({
  'contact.phone': '+14155551234',
  'contact.email': 'user@example.com',
  'social.github': 'username',
  'social.linkedin': 'username'
});

// Bad - no namespace
await profile.updateMetadata({
  phone: '+14155551234',
  email: 'user@example.com',
  github: 'username'
});`}
			language="typescript"
		/>

		<h3>3. Relationships</h3>
		<ul>
			<li>Choose relationship types that accurately represent connections</li>
			<li>Use <code>reciprocal: true</code> for symmetric relationships (friend, spouse)</li>
			<li>Add context profiles when relationships depend on intermediary</li>
			<li>Always add terms for temporal relationships (employment, membership)</li>
		</ul>

		<h3>4. Authentication</h3>
		<ul>
			<li>Only link OIDC accounts with <code>email_verified: true</code></li>
			<li>Implement regular API key rotation and revocation</li>
			<li>Use specific scopes rather than <code>*</code> permission</li>
			<li>Combine OIDC with additional verification for sensitive operations</li>
		</ul>

		<h3>5. Security</h3>
		<ul>
			<li>Record all sensitive actions in audit logs</li>
			<li>Never store plaintext API keys (handled automatically)</li>
			<li>Secure SERVER_MASTER_SECRET for Nostr decryption</li>
			<li>Implement rate limiting at middleware level</li>
		</ul>

		<h3>6. Performance</h3>
		<ul>
			<li>Use batch operations for bulk imports/updates</li>
			<li>Use pagination (<code>limit</code> and <code>offset</code>) for large result sets</li>
			<li>Limit relationship network traversal depth (default 2-3)</li>
			<li>Consider caching frequently accessed metadata</li>
		</ul>
	</section>

	<section id="troubleshooting">
		<h2>Troubleshooting</h2>

		<h3>Profile type not found</h3>
		<p><strong>Solution:</strong> Create profile types before creating profiles</p>
		<CodeBlock
			code={`// Wrong order
const profile = await profileCollection.create({
  typeId: 'person', // Error: type doesn't exist
  name: 'John'
});

// Correct order
const personType = await typeCollection.create({ name: \'Person\' });
await personType.save();

const profile = await profileCollection.create({
  typeId: personType.id, // Works
  name: 'John'
});`}
			language="typescript"
		/>

		<h3>OIDC identity not linking to profile</h3>
		<p><strong>Solution:</strong> Ensure <code>email_verified</code> is true</p>
		<CodeBlock
			code={`// Won't link (security)
const claims = {
  email: 'user@example.com',
  email_verified: false // ❌
};

// Will link
const claims = {
  email: 'user@example.com',
  email_verified: true // ✅
};`}
			language="typescript"
		/>

		<h3>Reciprocal relationship not creating inverse</h3>
		<p><strong>Solution:</strong> Set <code>reciprocal: true</code> on relationship type</p>
		<CodeBlock
			code={`// Wrong - no reciprocal
const friendType = await relTypeCollection.create({
  name: 'Friend',
  reciprocal: false // ❌
});

// Correct
const friendType = await relTypeCollection.create({
  name: 'Friend',
  reciprocal: true // ✅
});`}
			language="typescript"
		/>

		<h3>Metadata validation failing</h3>
		<p><strong>Solution:</strong> Check validation rules and value format</p>
		<CodeBlock
			code={`// Define validation
const phoneField = await fieldCollection.create({
  name: 'Phone',
  validation: {
    type: 'string',
    pattern: '^\\+?[0-9]{10,15}$'
  }
});

// Will fail
await profile.addMetadata('phone', '123'); // Too short

// Will succeed
await profile.addMetadata('phone', '+14155551234');`}
			language="typescript"
		/>

		<h3>Multi-tenant data leaking</h3>
		<p><strong>Solution:</strong> Pass correct database URL for each tenant</p>
		<CodeBlock
			code={`// Wrong - shared database
const collection = await ProfileCollection.create({ db: sharedDb });

// Correct - tenant-specific
const tenantACollection = await ProfileCollection.create({
  db: { type: \'postgres\', url: TENANT_A_URL }
});
const tenantBCollection = await ProfileCollection.create({
  db: { type: \'postgres\', url: TENANT_B_URL }
});`}
			language="typescript"
		/>
	</section>

	<section id="api-reference">
		<h2>API Reference</h2>

		<h3>Profile Model</h3>
		<table>
			<thead>
				<tr>
					<th>Method</th>
					<th>Returns</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>addMetadata(slug, value)</code></td>
					<td><code>Promise&lt;void&gt;</code></td>
					<td>Add single metadata value</td>
				</tr>
				<tr>
					<td><code>getMetadata()</code></td>
					<td><code>Promise&lt;object&gt;</code></td>
					<td>Get all metadata as key-value object</td>
				</tr>
				<tr>
					<td><code>updateMetadata(obj)</code></td>
					<td><code>Promise&lt;void&gt;</code></td>
					<td>Update multiple metadata values</td>
				</tr>
				<tr>
					<td><code>removeMetadata(slug)</code></td>
					<td><code>Promise&lt;void&gt;</code></td>
					<td>Remove metadata by slug</td>
				</tr>
				<tr>
					<td><code>addRelationship(to, slug, context?)</code></td>
					<td><code>Promise&lt;ProfileRelationship&gt;</code></td>
					<td>Create relationship</td>
				</tr>
				<tr>
					<td><code>getRelationships(options?)</code></td>
					<td><code>Promise&lt;ProfileRelationship[]&gt;</code></td>
					<td>Get relationships with filtering</td>
				</tr>
				<tr>
					<td><code>getRelatedProfiles(slug?)</code></td>
					<td><code>Promise&lt;Profile[]&gt;</code></td>
					<td>Get related profiles</td>
				</tr>
				<tr>
					<td><code>generateApiKey(options)</code></td>
					<td><code>Promise&lt;ApiKey&gt;</code></td>
					<td>Generate new API key</td>
				</tr>
				<tr>
					<td><code>getActiveApiKeys()</code></td>
					<td><code>Promise&lt;ApiKey[]&gt;</code></td>
					<td>List non-expired, non-revoked keys</td>
				</tr>
				<tr>
					<td><code>getOidcIdentities()</code></td>
					<td><code>Promise&lt;OidcIdentity[]&gt;</code></td>
					<td>List linked OIDC identities</td>
				</tr>
				<tr>
					<td><code>recordAction(options)</code></td>
					<td><code>Promise&lt;AuditLog&gt;</code></td>
					<td>Log action for audit trail</td>
				</tr>
				<tr>
					<td><code>generateBio()</code></td>
					<td><code>Promise&lt;string&gt;</code></td>
					<td>Generate professional bio using AI</td>
				</tr>
			</tbody>
		</table>

		<h3>ProfileRelationship Model</h3>
		<table>
			<thead>
				<tr>
					<th>Method</th>
					<th>Returns</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>addTerm(start, end?)</code></td>
					<td><code>Promise&lt;ProfileRelationshipTerm&gt;</code></td>
					<td>Add time-based period</td>
				</tr>
				<tr>
					<td><code>endCurrentTerm(endDate)</code></td>
					<td><code>Promise&lt;void&gt;</code></td>
					<td>Close active term</td>
				</tr>
				<tr>
					<td><code>getActiveTerm()</code></td>
					<td><code>Promise&lt;ProfileRelationshipTerm | null&gt;</code></td>
					<td>Get current active term</td>
				</tr>
				<tr>
					<td><code>getTerms()</code></td>
					<td><code>Promise&lt;ProfileRelationshipTerm[]&gt;</code></td>
					<td>Get all historical terms</td>
				</tr>
				<tr>
					<td><code>getTypeSlug()</code></td>
					<td><code>Promise&lt;string&gt;</code></td>
					<td>Get relationship type slug</td>
				</tr>
			</tbody>
		</table>

		<h3>Utility Functions</h3>
		<table>
			<thead>
				<tr>
					<th>Function</th>
					<th>Returns</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>createProfileFromOidc(claims, provider, options)</code></td>
					<td><code>Promise&lt;{ profile, oidcIdentity, created }&gt;</code></td>
					<td>Create or link profile from OIDC</td>
				</tr>
				<tr>
					<td><code>resolveIdentity(context)</code></td>
					<td><code>Promise&lt;{ profile, source } | null&gt;</code></td>
					<td>Resolve authentication</td>
				</tr>
				<tr>
					<td><code>ApiKey.verify(key)</code></td>
					<td><code>Promise&lt;ApiKey | null&gt;</code></td>
					<td>Verify and validate API key</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section id="related">
		<h2>Related Modules</h2>
		<ul>
			<li><a href="/modules/smrt-core">smrt-core</a> - SmrtObject, database persistence</li>
			<li><a href="/modules/smrt-users">smrt-users</a> - Multi-tenant RBAC</li>
			<li><a href="/modules/smrt-config">smrt-config</a> - Configuration management</li>
		</ul>
	</section>
</Grid>

<style>
	.lead {
		font-size: 1.25rem;
		margin-bottom: 2rem;
	}

	.breadcrumb {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
		font-size: 0.875rem;
		color: var(--smrt-color-on-surface-variant, #666);
	}

	.breadcrumb a {
		color: #0066cc;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	section {
		margin-bottom: 3rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	th,
	td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 1px solid #e5e5e5;
	}

	th {
		font-weight: 600;
		background-color: #f5f5f5;
	}

	code {
		background-color: #f5f5f5;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-size: 0.9em;
	}

	.diagram {
		background-color: #f5f5f5;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 1rem 0;
	}

	.diagram pre {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
	}

	h2 {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid #e5e5e5;
	}

	h3 {
		margin-top: 1.5rem;
	}

	h4 {
		margin-top: 1rem;
		font-size: 1rem;
	}
</style>
