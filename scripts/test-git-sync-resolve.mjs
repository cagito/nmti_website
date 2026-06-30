#!/usr/bin/env node
/** Unit tests for git-sync newest-wins resolution (strong mode). */
import { resolveNewestAction } from './lib/git-sync-resolve.mjs';
import { anyPathNeedsBuild, pathNeedsBuild } from './lib/git-sync-utils.mjs';

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
  } else {
    failed++;
    console.error(`FAIL: ${msg}`);
  }
}

const base = {
  localHash: 'a',
  headHash: 'a',
  remoteHash: 'b',
  localExists: true,
  remoteExists: true,
  blockRemoteWins: false,
  conservative: false,
};

assert(
  resolveNewestAction({
    localTs: 10,
    remoteTs: 10,
    localHash: 'abc',
    headHash: 'abc',
    remoteHash: 'abc',
    localExists: true,
    remoteExists: true,
  }) === 'skip-same',
  'identical hash → skip-same'
);

assert(
  resolveNewestAction({ ...base, localTs: 620, remoteTs: 10 }) === 'keep-local',
  'local clearly newer → keep-local'
);

assert(
  resolveNewestAction({ ...base, localTs: 10, remoteTs: 620 }) === 'take-remote',
  'remote clearly newer → take-remote'
);

assert(
  resolveNewestAction({
    ...base,
    localTs: 10,
    remoteTs: 620,
    blockRemoteWins: true,
  }) === 'skip-blocked',
  'push blocked → skip-blocked'
);

assert(
  resolveNewestAction({ ...base, localTs: 5, remoteTs: 5 }) === 'skip-tie',
  'tie → skip-tie'
);

assert(
  resolveNewestAction({
    ...base,
    localTs: 100,
    remoteTs: 200,
    conservative: true,
    ambiguityWindowSec: 120,
  }) === 'skip-ambiguous',
  'strong: near-tie → skip-ambiguous'
);

assert(
  resolveNewestAction({
    ...base,
    localTs: 10,
    remoteTs: 9999,
    hasUncommittedChanges: true,
    conservative: true,
  }) === 'keep-local',
  'strong: uncommitted → keep-local even if remote newer'
);

assert(
  resolveNewestAction({
    ...base,
    localTs: 10,
    remoteTs: 9999,
    hasUncommittedChanges: true,
    forceRemote: true,
    conservative: false,
  }) === 'take-remote',
  'force-remote overrides uncommitted when aggressive timeline'
);

assert(pathNeedsBuild('scripts/image-review-registry.json'), 'registry path');
assert(pathNeedsBuild('assets/images/technology/IMG-001_foo.webp'), 'webp path');
assert(!pathNeedsBuild('index.html'), 'index not build path');
assert(anyPathNeedsBuild(['index.html', 'js/technology/images.js']), 'anyPathNeedsBuild');

console.log(`test-git-sync-resolve: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
