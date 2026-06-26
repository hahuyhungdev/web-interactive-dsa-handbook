// ---------------------------------------------------------------------------
// Pseudocode strings for the hash-table operations, with @markers for the
// CodeViewer highlight sync.
// ---------------------------------------------------------------------------

export const HASH_INSERT_CODE: string[] = [
  'function insert(table, key, value) {',
  '  // Compute the hash index // @init',
  '  let hash = 0; // @hash',
  '  for (let c of key) hash += charCode(c);',
  '  let index = hash % TABLE_SIZE; // @find-bucket',
  '',
  '  let bucket = table[index]; // @check-collision',
  '  // Check for existing key (update)',
  '  for (let entry of bucket) {',
  '    if (entry.key === key) {',
  '      entry.value = value; // update',
  '      return;',
  '    }',
  '  }',
  '  bucket.push({ key, value }); // @insert',
  '}',
];

export const HASH_SEARCH_CODE: string[] = [
  'function search(table, key) {',
  '  // Compute the hash index // @init',
  '  let hash = 0; // @hash',
  '  for (let c of key) hash += charCode(c);',
  '  let index = hash % TABLE_SIZE; // @find-bucket',
  '',
  '  let bucket = table[index]; // @search-bucket',
  '  for (let entry of bucket) {',
  '    if (entry.key === key) {',
  '      return entry.value; // @found',
  '    }',
  '  }',
  '  return undefined; // @not-found',
  '}',
];

export const HASH_DELETE_CODE: string[] = [
  'function delete(table, key) {',
  '  // Compute the hash index // @init',
  '  let hash = 0; // @hash',
  '  for (let c of key) hash += charCode(c);',
  '  let index = hash % TABLE_SIZE; // @find-bucket',
  '',
  '  let bucket = table[index]; // @search-bucket',
  '  for (let i = 0; i < bucket.length; i++) {',
  '    if (bucket[i].key === key) {',
  '      bucket.splice(i, 1); // @delete',
  '      return true;',
  '    }',
  '  }',
  '  return false; // key not found',
  '}',
];
