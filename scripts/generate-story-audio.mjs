import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

import hareAndTortoiseManifest from '../src/content/manifests/hare-and-tortoise.json' with { type: 'json' };
import lionAndMouseManifest from '../src/content/manifests/lion-and-mouse.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const manifests = [
  {
    slug: hareAndTortoiseManifest.slug,
    voice: 'Soumya',
    segments: hareAndTortoiseManifest.segments,
  },
  {
    slug: lionAndMouseManifest.slug,
    voice: 'Soumya',
    segments: lionAndMouseManifest.segments,
  },
];

function runCommand(command, args) {
  execFileSync(command, args, { stdio: 'inherit' });
}

function segmentFileName(index) {
  return `segment-${String(index + 1).padStart(2, '0')}.m4a`;
}

function generateAudio() {
  const scratchDir = mkdtempSync(path.join(tmpdir(), 'kannada-story-audio-'));

  try {
    manifests.forEach((manifest) => {
      const outputDir = path.join(repoRoot, 'public', 'audio', manifest.slug);
      mkdirSync(outputDir, { recursive: true });

      manifest.segments.forEach((segment, index) => {
        const tempAiffPath = path.join(scratchDir, `${manifest.slug}-${segment.id}.aiff`);
        const outputPath = path.join(outputDir, segmentFileName(index));

        runCommand('say', ['-v', manifest.voice, '-o', tempAiffPath, segment.kannada]);
        runCommand('afconvert', ['-f', 'm4af', '-d', 'aac', tempAiffPath, outputPath]);
      });
    });
  } finally {
    rmSync(scratchDir, { recursive: true, force: true });
  }
}

generateAudio();
