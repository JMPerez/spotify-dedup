import { Translation, useTranslation } from 'react-i18next';
import {
  PlaylistDeduplicator,
  SavedTracksDeduplicator
} from '../dedup/deduplicator';
import { Duplicate, PlaylistModel, DuplicateMatchingConfig } from '../dedup/types';

import { Progress } from "@/components/ui/progress";
import { logEvent } from '@/utils/analytics';
import React from 'react';
import Process from '../dedup/process';
import { SpotifyCurrentUser } from '../dedup/spotifyApi';
import Badge from './badge';
import BuyMeACoffee from './bmc';
import DuplicateTrackList from './duplicateTrackList';
import DuplicateTrackListItem from './duplicateTrackListItem';
import Panel from './panel';

const Status = ({ toProcess }) => {
  const { t } = useTranslation();
  const isProcessingComplete = toProcess === 0;
  return (
    <span>
      <h3 className="text-2xl font-bold tracking-tight">
        {t(`process.status.${isProcessingComplete ? 'complete' : 'finding'}`)}
      </h3>
    </span>
  );
};

type StateType = {
  toProcess?: number;
  playlists: Array<PlaylistModel>;
  savedTracks: {
    status?: string;
    duplicates: Array<Duplicate>;
  };
  progress: number;
};

export default class Main extends React.Component<{
  api: any;
  user: SpotifyCurrentUser;
  accessToken: string;
  matchingSettings: DuplicateMatchingConfig;
}> {
  state: StateType = {
    toProcess: undefined,
    playlists: [],
    savedTracks: {
      status: undefined,
      duplicates: [],
    },
    progress: 0
  };

  componentDidMount() {
    const process = new Process();
    process.on('updateState', (state) => {
      this.setState(state);
    });
    process.process(this.props.api, this.props.user, this.props.matchingSettings);
  }

  removeDuplicates = (playlist: PlaylistModel) => {
    (async () => {
      const index = this.state.playlists.findIndex(
        (p) => p.playlist.id === playlist.playlist.id
      );
      const playlistModel = this.state.playlists[index];
      if (playlistModel.playlist.id === 'starred') {
        logEvent('error_remove_duplicates_starred');
        global['alert'] &&
          global['alert'](
            'It is not possible to delete duplicates from your Starred playlist using this tool since this is not supported in the Spotify Web API. You will need to remove these manually.'
          );
      }
      try {
        await PlaylistDeduplicator.removeDuplicates(
          this.props.api,
          playlistModel
        );
        const playlistsCopy = [...this.state.playlists];
        playlistsCopy[index].duplicates = [];
        playlistsCopy[index].status = 'process.items.removed';
        this.setState({ ...this.state, playlists: [...playlistsCopy] });
        logEvent('playlist_removed_duplicates');
      } catch (e) {
        global['Raven'] &&
          global['Raven'].captureMessage(
            `Exception trying to remove duplicates from playlist`,
            {
              extra: {
                duplicates: playlistModel.duplicates,
              },
            }
          );
      }
    })();
  };

  removeDuplicatesInSavedTracks() {
    (async () => {
      await SavedTracksDeduplicator.removeDuplicates(
        this.props.api,
        this.state.savedTracks
      );
      this.setState({
        ...this.state,
        savedTracks: {
          duplicates: [],
          status: 'process.items.removed',
        },
      });
      logEvent('saved_tracks_removed_duplicates');
    })();
  }

  render() {
    const totalDuplicates =
      this.state.playlists.length === 0
        ? 0
        : this.state.playlists.reduce(
          (prev, current) => prev + current.duplicates.length,
          0
        ) + this.state.savedTracks?.duplicates?.length;

    return (
      <div className="mx-4 md:mx-0">
        <Status toProcess={this.state.toProcess} />
        <Panel>
          {this.state.toProcess === undefined && (
            <Translation>{(t) => t('process.reading-library')}</Translation>
          )}
          {this.state.toProcess !== undefined && this.state.toProcess > 0 && (
            <Translation>
              {(t) => t('process.processing', { count: this.state.toProcess })}
            </Translation>
          )}
          {this.state.toProcess === 0 && totalDuplicates > 0 && (
            <span>
              <Translation>
                {(t) => t('process.status.complete.body')}
              </Translation>{' '}
              <Translation>
                {(t) => (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t('process.status.complete.dups.body', {
                        strongOpen: '<strong>',
                        strongClose: '</strong>',
                      }),
                    }}
                  />
                )}
              </Translation>
              <BuyMeACoffee />
            </span>
          )}
          {this.state.toProcess === 0 && totalDuplicates === 0 && (
            <span>
              <Translation>
                {(t) => t('process.status.complete.body')}
              </Translation>
              <br />
              <Translation>
                {(t) => t('process.status.complete.nodups.body')}
              </Translation>
              <BuyMeACoffee />
            </span>
          )}
          {(this.state.toProcess !== undefined && (this.state.toProcess > 0 || this.state.progress < 100)) && (
            <Progress value={this.state.progress} />
          )}
        </Panel>

        {this.state.toProcess === 0 && (
          <ul className="p-0">
            {this.state.savedTracks.duplicates.length > 0 && (
              <li className="mb-8">
                <div className="float-left mr-5">
                  <img
                    width="100"
                    height="100"
                    className="w-[100px]"
                    src={'./placeholder.png'}
                  />
                </div>
                <div className="overflow-hidden relative">
                  <span className="block font-bold max-w-[50%]">
                    <Translation>{(t) => t('process.saved.title')}</Translation>
                  </span>
                  {this.state.savedTracks.status && (
                    <Badge>
                      <Translation>
                        {(t) => t(this.state.savedTracks.status as string)}
                      </Translation>
                    </Badge>
                  )}
                  {this.state.savedTracks.duplicates.length != 0 && (
                    <span>
                      <span>
                        <Translation>
                          {(t) =>
                            t('process.saved.duplicates', {
                              count: this.state.savedTracks.duplicates.length,
                            })
                          }
                        </Translation>
                      </span>
                      <button
                        className="bg-[#428bca] border-[#357ebd] text-white text-sm font-normal leading-[1.428571429] py-[6px] px-3 rounded cursor-pointer text-center align-middle whitespace-nowrap max-w-[50%] absolute right-0 top-0 hover:bg-[#5094ce] md:relative md:max-w-full"
                        onClick={() => this.removeDuplicatesInSavedTracks()}
                      >
                        <Translation>
                          {(t) => t('process.saved.remove-button')}
                        </Translation>
                      </button>
                      <DuplicateTrackList>
                        {this.state.savedTracks.duplicates.map(
                          (duplicate, index) => (
                            <DuplicateTrackListItem
                              key={index}
                              reason={duplicate.reason}
                              trackName={duplicate.track.name}
                              trackArtistName={duplicate.track.artists[0].name}
                            />
                          )
                        )}
                      </DuplicateTrackList>
                    </span>
                  )}
                </div>
              </li>
            )}
            {this.state.playlists
              .filter((p) => p.duplicates.length || p.status != '')
              .map((playlist: PlaylistModel, index) => (
                <li className="mb-8" key={index}>
                  <div className="float-left mr-5">
                    <img
                      width="100"
                      height="100"
                      className="w-[100px]"
                      src={playlist.playlist.images?.[0]?.url}
                    />
                  </div>
                  <div className="overflow-hidden relative">
                    <span className="block font-bold max-w-[50%]">
                      {playlist.playlist.name}
                    </span>
                    {playlist.status && (
                      <Badge>
                        <Translation>{(t) => t(playlist.status)}</Translation>
                      </Badge>
                    )}
                    {playlist.duplicates.length != 0 && (
                      <span>
                        <span>
                          <Translation>
                            {(t) =>
                              t('process.playlist.duplicates', {
                                count: playlist.duplicates.length,
                              })
                            }
                          </Translation>
                        </span>
                        <button
                          className="bg-[#428bca] border-[#357ebd] text-white text-sm font-normal leading-[1.428571429] py-[6px] px-3 rounded cursor-pointer text-center align-middle whitespace-nowrap max-w-[50%] absolute right-0 top-0 hover:bg-[#5094ce] md:relative md:max-w-full"
                          onClick={() => this.removeDuplicates(playlist)}
                        >
                          <Translation>
                            {(t) => t('process.playlist.remove-button')}
                          </Translation>
                        </button>
                        <DuplicateTrackList>
                          {playlist.duplicates.map((duplicate, index) => (
                            <DuplicateTrackListItem
                              key={index}
                              reason={duplicate.reason}
                              trackName={duplicate.track.name}
                              trackArtistName={duplicate.track.artists[0].name}
                            />
                          ))}
                        </DuplicateTrackList>
                      </span>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    );
  }
}
