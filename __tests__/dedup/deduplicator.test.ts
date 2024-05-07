import { expect, test } from 'vitest';

import { calculateTracksToAddBack } from '@/dedup/deduplicator';
import { SpotifyTrackType } from '@/dedup/spotifyApi';
import { Duplicate } from '@/dedup/types';

test('calculateTracksToAddBack > should calculate the correct tracks to add back, simplest case', () => {
  const duplicates: Duplicate[] = [
    // 0 => track 1
    { index: 1, reason: 'same-id', canonicalPosition: 0, track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' } },
  ];

  const expected: { track: SpotifyTrackType, position: number }[] = [
    { track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' }, position: 0 },
  ];

  // Call the function with the mock data
  const result = calculateTracksToAddBack(duplicates);

  // Check that the result matches the expected output
  expect(result).toEqual(expected);
});

test('calculateTracksToAddBack > should calculate the correct tracks to add back, simplest case x2', () => {
  const duplicates: Duplicate[] = [
    // 0 => track 1
    { index: 1, reason: 'same-id', canonicalPosition: 0, track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' } },
    { index: 2, reason: 'same-id', canonicalPosition: 0, track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' } },
  ];

  const expected: { track: SpotifyTrackType, position: number }[] = [
    { track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' }, position: 0 },
  ];

  // Call the function with the mock data
  const result = calculateTracksToAddBack(duplicates);

  // Check that the result matches the expected output
  expect(result).toEqual(expected);
});


test('calculateTracksToAddBack > should calculate the correct tracks to add back with only same ids', () => {
  const duplicates: Duplicate[] = [
    // 0 => track 1
    { index: 1, reason: 'same-id', canonicalPosition: 0, track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' } },
    // 2 => track 2
    { index: 3, reason: 'same-id', canonicalPosition: 2, track: { id: '2', name: 'Track 2', artists: [{ id: 'Artist2', name: 'Artist 2' }], duration_ms: 300000, uri: 'spotify:track:2' } },
    // 4 => track 3
    { index: 5, reason: 'same-id', canonicalPosition: 4, track: { id: '3', name: 'Track 3', artists: [{ id: 'Artist3', name: 'Artist 3' }], duration_ms: 300000, uri: 'spotify:track:3' } },
    { index: 6, reason: 'same-id', canonicalPosition: 0, track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' } },
    { index: 7, reason: 'same-id', canonicalPosition: 2, track: { id: '2', name: 'Track 2', artists: [{ id: 'Artist2', name: 'Artist 2' }], duration_ms: 300000, uri: 'spotify:track:2' } },
    { index: 8, reason: 'same-id', canonicalPosition: 0, track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' } },
  ];

  const expected: { track: SpotifyTrackType, position: number }[] = [
    { track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' }, position: 0 },
    { track: { id: '2', name: 'Track 2', artists: [{ id: 'Artist2', name: 'Artist 2' }], duration_ms: 300000, uri: 'spotify:track:2' }, position: 1 },
    { track: { id: '3', name: 'Track 3', artists: [{ id: 'Artist3', name: 'Artist 3' }], duration_ms: 300000, uri: 'spotify:track:3' }, position: 2 },
  ];

  // Call the function with the mock data
  const result = calculateTracksToAddBack(duplicates);

  // Check that the result matches the expected output
  expect(result).toEqual(expected);
});

test('calculateTracksToAddBack > should calculate the correct tracks to add back with mixed', () => {
  const duplicates: Duplicate[] = [
    // 0 => track 1
    { index: 1, reason: 'same-id', canonicalPosition: 0, track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' } },
    // 2 => track 2
    { index: 3, reason: 'same-id', canonicalPosition: 2, track: { id: '2', name: 'Track 2', artists: [{ id: 'Artist2', name: 'Artist 2' }], duration_ms: 300000, uri: 'spotify:track:2' } },
    // 4 => track 3
    // 5 => track 4
    { index: 6, reason: 'same-name-artist', canonicalPosition: undefined, track: { id: '4', name: 'Track 4', artists: [{ id: 'Artist4', name: 'Artist 4' }], duration_ms: 300000, uri: 'spotify:track:4' } },
    { index: 7, reason: 'same-id', canonicalPosition: 4, track: { id: '3', name: 'Track 3', artists: [{ id: 'Artist3', name: 'Artist 3' }], duration_ms: 300000, uri: 'spotify:track:3' } },
    { index: 8, reason: 'same-id', canonicalPosition: 0, track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' } },
    { index: 9, reason: 'same-id', canonicalPosition: 2, track: { id: '2', name: 'Track 2', artists: [{ id: 'Artist2', name: 'Artist 2' }], duration_ms: 300000, uri: 'spotify:track:2' } },
    { index: 10, reason: 'same-id', canonicalPosition: 0, track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' } },
  ];

  const expected: { track: SpotifyTrackType, position: number }[] = [
    { track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' }, position: 0 },
    { track: { id: '2', name: 'Track 2', artists: [{ id: 'Artist2', name: 'Artist 2' }], duration_ms: 300000, uri: 'spotify:track:2' }, position: 1 },
    { track: { id: '3', name: 'Track 3', artists: [{ id: 'Artist3', name: 'Artist 3' }], duration_ms: 300000, uri: 'spotify:track:3' }, position: 2 },
  ];

  // Call the function with the mock data
  const result = calculateTracksToAddBack(duplicates);

  // Check that the result matches the expected output
  expect(result).toEqual(expected);
});

test('calculateTracksToAddBack > should calculate the correct tracks to add back with mixed', () => {
  const duplicates: Duplicate[] = [
    // 0 => track 1
    { index: 1, reason: 'same-name-artist', canonicalPosition: undefined, track: { id: '1b', name: 'Track 1b', artists: [{ id: 'Artist4', name: 'Artist 4' }], duration_ms: 300000, uri: 'spotify:track:1b' } },
    { index: 2, reason: 'same-id', canonicalPosition: 0, track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' } },
  ];

  const expected: { track: SpotifyTrackType, position: number }[] = [
    { track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' }, position: 0 },
  ];

  // Call the function with the mock data
  const result = calculateTracksToAddBack(duplicates);

  // Check that the result matches the expected output
  expect(result).toEqual(expected);
});

test('calculateTracksToAddBack > should calculate the correct tracks to add back with mixed', () => {
  const duplicates: Duplicate[] = [
    // 0 => track 1
    { index: 1, reason: 'same-id', canonicalPosition: 0, track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' } },
    // 2 => track 2
    { index: 3, reason: 'same-id', canonicalPosition: 2, track: { id: '2', name: 'Track 2', artists: [{ id: 'Artist2', name: 'Artist 2' }], duration_ms: 300000, uri: 'spotify:track:2' } },
    // 4 => track 3
    // 5 => track 4
    { index: 6, reason: 'same-name-artist', canonicalPosition: undefined, track: { id: '4b', name: 'Track 4b', artists: [{ id: 'Artist4', name: 'Artist 4' }], duration_ms: 300000, uri: 'spotify:track:4b' } },
    { index: 7, reason: 'same-id', canonicalPosition: 4, track: { id: '3', name: 'Track 3', artists: [{ id: 'Artist3', name: 'Artist 3' }], duration_ms: 300000, uri: 'spotify:track:3' } },
    { index: 8, reason: 'same-id', canonicalPosition: 0, track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' } },
    { index: 9, reason: 'same-id', canonicalPosition: 2, track: { id: '2', name: 'Track 2', artists: [{ id: 'Artist2', name: 'Artist 2' }], duration_ms: 300000, uri: 'spotify:track:2' } },
    { index: 10, reason: 'same-id', canonicalPosition: 0, track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' } },
    // 11 => track 5
    { index: 12, reason: 'same-id', canonicalPosition: 11, track: { id: '5', name: 'Track 5', artists: [{ id: 'Artist5', name: 'Artist 5' }], duration_ms: 300000, uri: 'spotify:track:5' } },
  ];

  // after the deletion, there is only [ '4' ]

  const expected: { track: SpotifyTrackType, position: number }[] = [
    { track: { id: '1', name: 'Track 1', artists: [{ id: 'Artist1', name: 'Artist 1' }], duration_ms: 300000, uri: 'spotify:track:1' }, position: 0 },
    // after this, ['1', '4']
    { track: { id: '2', name: 'Track 2', artists: [{ id: 'Artist2', name: 'Artist 2' }], duration_ms: 300000, uri: 'spotify:track:2' }, position: 1 },
    // after this, ['1', '2', '4']
    { track: { id: '3', name: 'Track 3', artists: [{ id: 'Artist3', name: 'Artist 3' }], duration_ms: 300000, uri: 'spotify:track:3' }, position: 2 },
    // after this, ['1', '2', '3', '4']
    { track: { id: '5', name: 'Track 5', artists: [{ id: 'Artist5', name: 'Artist 5' }], duration_ms: 300000, uri: 'spotify:track:5' }, position: 4 },
    // after this, ['1', '2', '3', '4', '5']
  ];

  // Call the function with the mock data
  const result = calculateTracksToAddBack(duplicates);

  // Check that the result matches the expected output
  expect(result).toEqual(expected);
});