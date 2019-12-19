import React from 'react';
import Page from './../layouts/main';
import Badge from './../components/badge';
import Panel from './../components/panel';
import {
  DuplicateTrackList,
  DuplicateTrackListItem,
} from './../components/main';
export default (props: { children: React.ReactNode }) => (
  <Page>
    <h2>Panel</h2>
    <Panel>This is a panel</Panel>
    <h2>Badge</h2>
    <Badge>This is a badge</Badge>
    <h2>DuplicateTrackList</h2>
    <DuplicateTrackList>
      <DuplicateTrackListItem
        reason="same-id"
        trackName="The Spotify Dedup Song"
        trackArtistName="Jose Perez"
      ></DuplicateTrackListItem>
      <DuplicateTrackListItem
        reason="same-name-artist"
        trackName="A beautiful song"
        trackArtistName="Jose Perez"
      ></DuplicateTrackListItem>
      <DuplicateTrackListItem
        reason="same-id"
        trackName="One more song"
        trackArtistName="Jose Perez"
      ></DuplicateTrackListItem>
    </DuplicateTrackList>
  </Page>
);
