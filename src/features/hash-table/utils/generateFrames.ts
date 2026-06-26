// ---------------------------------------------------------------------------
// Hash-table frame generation for the interactive visualizer.
// ---------------------------------------------------------------------------

export interface HashEntry {
  key: string;
  value: string;
  status:
    | 'default'
    | 'hashing'
    | 'placed'
    | 'collision'
    | 'found'
    | 'searching'
    | 'deleting';
}

export interface HashBucket {
  index: number;
  entries: HashEntry[];
  status: 'default' | 'active' | 'collision';
}

export interface HashTableFrame {
  buckets: HashBucket[];
  highlightedMarker: string;
  message: string;
  hashComputation?: string;
}

// ── constants ───────────────────────────────────────────────────────────────

export const BUCKET_COUNT = 7;

// ── hash function ───────────────────────────────────────────────────────────

/** Simple hash: sum of char-codes mod `size`. */
export function simpleHash(key: string, size: number): number {
  let sum = 0;
  for (let i = 0; i < key.length; i++) {
    sum += key.charCodeAt(i);
  }
  return sum % size;
}

// ── helpers ─────────────────────────────────────────────────────────────────

/** Deep-clone the bucket array so each frame is an independent snapshot. */
function cloneBuckets(buckets: HashBucket[]): HashBucket[] {
  return buckets.map((b) => ({
    index: b.index,
    status: b.status,
    entries: b.entries.map((e) => ({ ...e })),
  }));
}

/** Reset every bucket & entry to default status. */
function resetBuckets(buckets: HashBucket[]): HashBucket[] {
  return buckets.map((b) => ({
    ...b,
    status: 'default' as const,
    entries: b.entries.map((e) => ({ ...e, status: 'default' as const })),
  }));
}

/** Build a human-readable hash computation string. */
function hashComputationStr(key: string, size: number): string {
  const codes = [...key].map((c) => c.charCodeAt(0));
  const sum = codes.reduce((a, b) => a + b, 0);
  return `hash("${key}") = (${codes.join(' + ')}) % ${size} = ${sum} % ${size} = ${sum % size}`;
}

// ── default hash table ─────────────────────────────────────────────────────

/** Pre-populated table with three entries: name→Alice, age→25, city→NYC. */
export function buildDefaultHashTable(): HashBucket[] {
  const buckets: HashBucket[] = Array.from({ length: BUCKET_COUNT }, (_, i) => ({
    index: i,
    entries: [],
    status: 'default' as const,
  }));

  const defaults: [string, string][] = [
    ['name', 'Alice'],
    ['age', '25'],
    ['city', 'NYC'],
  ];

  for (const [k, v] of defaults) {
    const idx = simpleHash(k, BUCKET_COUNT);
    buckets[idx].entries.push({ key: k, value: v, status: 'default' });
  }

  return buckets;
}

// ── INSERT frames ───────────────────────────────────────────────────────────

export function generateInsertFrames(
  buckets: HashBucket[],
  key: string,
  value: string,
): HashTableFrame[] {
  const frames: HashTableFrame[] = [];
  let current = resetBuckets(cloneBuckets(buckets));

  // @init — show starting state
  frames.push({
    buckets: cloneBuckets(current),
    highlightedMarker: '@init',
    message: `Insert key "${key}" with value "${value}"`,
  });

  // @hash — compute hash
  const hashIdx = simpleHash(key, BUCKET_COUNT);
  const hashStr = hashComputationStr(key, BUCKET_COUNT);

  // Mark key entry as hashing (visual indicator)
  frames.push({
    buckets: cloneBuckets(current),
    highlightedMarker: '@hash',
    message: `Computing hash: ${hashStr}`,
    hashComputation: hashStr,
  });

  // @find-bucket — highlight the target bucket
  current[hashIdx].status = 'active';
  frames.push({
    buckets: cloneBuckets(current),
    highlightedMarker: '@find-bucket',
    message: `Bucket ${hashIdx} selected`,
    hashComputation: hashStr,
  });

  // @check-collision — check if bucket already has entries
  const hasCollision = current[hashIdx].entries.length > 0;
  if (hasCollision) {
    current[hashIdx].status = 'collision';
    current[hashIdx].entries.forEach((e) => {
      e.status = 'collision';
    });
    frames.push({
      buckets: cloneBuckets(current),
      highlightedMarker: '@check-collision',
      message: `Collision detected at bucket ${hashIdx}! Chaining…`,
      hashComputation: hashStr,
    });
  } else {
    frames.push({
      buckets: cloneBuckets(current),
      highlightedMarker: '@check-collision',
      message: `No collision at bucket ${hashIdx}`,
      hashComputation: hashStr,
    });
  }

  // @insert — add the entry
  // Check if key already exists (update)
  const existing = current[hashIdx].entries.findIndex((e) => e.key === key);
  if (existing !== -1) {
    current[hashIdx].entries[existing].value = value;
    current[hashIdx].entries[existing].status = 'placed';
  } else {
    current[hashIdx].entries.push({ key, value, status: 'placed' });
  }
  current[hashIdx].status = 'active';
  frames.push({
    buckets: cloneBuckets(current),
    highlightedMarker: '@insert',
    message: existing !== -1
      ? `Updated key "${key}" in bucket ${hashIdx}`
      : `Inserted ("${key}", "${value}") into bucket ${hashIdx}`,
    hashComputation: hashStr,
  });

  // Final settled state
  current = resetBuckets(current);
  current[hashIdx].entries.forEach((e) => {
    if (e.key === key) e.status = 'placed';
  });
  frames.push({
    buckets: cloneBuckets(current),
    highlightedMarker: '@insert',
    message: 'Insert complete ✓',
  });

  return frames;
}

// ── SEARCH frames ───────────────────────────────────────────────────────────

export function generateSearchFrames(
  buckets: HashBucket[],
  key: string,
): HashTableFrame[] {
  const frames: HashTableFrame[] = [];
  let current = resetBuckets(cloneBuckets(buckets));

  // @init
  frames.push({
    buckets: cloneBuckets(current),
    highlightedMarker: '@init',
    message: `Search for key "${key}"`,
  });

  // @hash
  const hashIdx = simpleHash(key, BUCKET_COUNT);
  const hashStr = hashComputationStr(key, BUCKET_COUNT);
  frames.push({
    buckets: cloneBuckets(current),
    highlightedMarker: '@hash',
    message: `Computing hash: ${hashStr}`,
    hashComputation: hashStr,
  });

  // @find-bucket
  current[hashIdx].status = 'active';
  frames.push({
    buckets: cloneBuckets(current),
    highlightedMarker: '@find-bucket',
    message: `Look in bucket ${hashIdx}`,
    hashComputation: hashStr,
  });

  // @search-bucket — iterate entries
  const entries = current[hashIdx].entries;
  let foundIdx = -1;
  for (let i = 0; i < entries.length; i++) {
    entries[i].status = 'searching';
    frames.push({
      buckets: cloneBuckets(current),
      highlightedMarker: '@search-bucket',
      message: `Checking entry "${entries[i].key}" == "${key}"? ${entries[i].key === key ? 'Yes!' : 'No'}`,
      hashComputation: hashStr,
    });

    if (entries[i].key === key) {
      foundIdx = i;
      break;
    }
    entries[i].status = 'default';
  }

  if (foundIdx !== -1) {
    // @found
    entries[foundIdx].status = 'found';
    frames.push({
      buckets: cloneBuckets(current),
      highlightedMarker: '@found',
      message: `Found! "${key}" → "${entries[foundIdx].value}" ✓`,
      hashComputation: hashStr,
    });
  } else {
    // @not-found
    current[hashIdx].status = 'default';
    frames.push({
      buckets: cloneBuckets(current),
      highlightedMarker: '@not-found',
      message: `Key "${key}" not found ✗`,
      hashComputation: hashStr,
    });
  }

  return frames;
}

// ── DELETE frames ───────────────────────────────────────────────────────────

export function generateDeleteFrames(
  buckets: HashBucket[],
  key: string,
): HashTableFrame[] {
  const frames: HashTableFrame[] = [];
  let current = resetBuckets(cloneBuckets(buckets));

  // @init
  frames.push({
    buckets: cloneBuckets(current),
    highlightedMarker: '@init',
    message: `Delete key "${key}"`,
  });

  // @hash
  const hashIdx = simpleHash(key, BUCKET_COUNT);
  const hashStr = hashComputationStr(key, BUCKET_COUNT);
  frames.push({
    buckets: cloneBuckets(current),
    highlightedMarker: '@hash',
    message: `Computing hash: ${hashStr}`,
    hashComputation: hashStr,
  });

  // @find-bucket
  current[hashIdx].status = 'active';
  frames.push({
    buckets: cloneBuckets(current),
    highlightedMarker: '@find-bucket',
    message: `Look in bucket ${hashIdx}`,
    hashComputation: hashStr,
  });

  // @search-bucket — iterate entries
  const entries = current[hashIdx].entries;
  let foundIdx = -1;
  for (let i = 0; i < entries.length; i++) {
    entries[i].status = 'searching';
    frames.push({
      buckets: cloneBuckets(current),
      highlightedMarker: '@search-bucket',
      message: `Checking entry "${entries[i].key}" == "${key}"? ${entries[i].key === key ? 'Yes!' : 'No'}`,
      hashComputation: hashStr,
    });

    if (entries[i].key === key) {
      foundIdx = i;
      break;
    }
    entries[i].status = 'default';
  }

  if (foundIdx !== -1) {
    // @delete
    entries[foundIdx].status = 'deleting';
    frames.push({
      buckets: cloneBuckets(current),
      highlightedMarker: '@delete',
      message: `Deleting "${key}" from bucket ${hashIdx}…`,
      hashComputation: hashStr,
    });

    current[hashIdx].entries.splice(foundIdx, 1);
    current = resetBuckets(current);
    frames.push({
      buckets: cloneBuckets(current),
      highlightedMarker: '@delete',
      message: `Deleted "${key}" ✓`,
    });
  } else {
    // Key not found
    current[hashIdx].status = 'default';
    frames.push({
      buckets: cloneBuckets(current),
      highlightedMarker: '@search-bucket',
      message: `Key "${key}" not found — nothing to delete ✗`,
      hashComputation: hashStr,
    });
  }

  return frames;
}
