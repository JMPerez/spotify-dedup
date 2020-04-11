import React from 'react';
import { useTranslation, Trans, Translation } from 'react-i18next';
import { PlaylistModel } from '../dedup/types';
import { SpotifyUserType, SpotifyTrackType } from '../dedup/spotify-api';

import Process from '../dedup/process';
import {
  PlaylistDeduplicator,
  SavedTracksDeduplicator,
} from '../dedup/deduplicator';

import Badge from './badge';
import BuyMeACoffee from './bmc';
import Panel from './panel';

//todo: enforce that items are DuplicateTrackListItem
export const DuplicateTrackList = ({ children }) => (
  <ul>
    {children}
    <style jsx>{`
      ul {
        padding: 0;
      }
    `}</style>
  </ul>
);
export const DuplicateTrackListItem = ({
  reason,
  trackName,
  trackArtistName,
}) => {
  const { t, i18n } = useTranslation();
  return (
    <li>
      {reason === 'same-id' && (
        <Badge>{t('result.duplicate.reason-same-id')}</Badge>
      )}
      {reason === 'same-name-artist' && (
        <Badge>{t('result.duplicate.reason-same-data')}</Badge>
      )}
      <Trans i18nKey="result.duplicate.track">
        <span>{{ trackName }}</span> <span className="gray">by</span>{' '}
        <span>{{ trackArtistName }}</span>
      </Trans>
      <style jsx>
        {`
          .gray {
            color: #999;
          }
        `}
      </style>
    </li>
  );
};

const Status = ({ toProcess }) => {
  const { t } = useTranslation();
  return (
    <span>
      <h3>
        {toProcess > 0 || toProcess === null
          ? t('process.status.finding')
          : t('process.status.complete')}
      </h3>
      <style jsx>
        {`
          h3 {
            font-size: 24px;
          }
        `}
      </style>
    </span>
  );
};

type StateType = {
  toProcess?: number;
  playlists: Array<PlaylistModel>;
  savedTracks: {
    status?: string;
    duplicates: Array<{
      index: number;
      reason: string;
      track: SpotifyTrackType;
    }>;
  };
};

export default class Main extends React.Component<{
  api: any;
  user: SpotifyUserType;
}> {
  state: StateType = {
    toProcess: null,
    playlists: [],
    savedTracks: {
      status: null,
      duplicates: [],
    },
  };
  componentDidMount() {
    const process = new Process();
    process.on('updateState', state => {
      this.setState(state);
    });
    process.process(this.props.api, this.props.user);
  }

  removeDuplicates = (playlist: PlaylistModel) => {
    (async () => {
      const index = this.state.playlists.findIndex(
        p => p.playlist.id === playlist.playlist.id
      );
      const playlistModel = this.state.playlists[index];
      if (playlistModel.playlist.id === 'starred') {
        global['alert'] &&
          global['alert'](
            'It is not possible to delete duplicates from your Starred playlist using this tool since this is not supported in the Spotify Web API. You will need to remove these manually.'
          );
      }
      if (playlistModel.playlist.collaborative) {
        global['alert'] &&
          global['alert'](
            'It is not possible to delete duplicates from a collaborative playlist using this tool since this is not supported in the Spotify Web API. You will need to remove these manually.'
          );
      } else {
        try {
          await PlaylistDeduplicator.removeDuplicates(
            this.props.api,
            playlistModel
          );
          const playlistsCopy = [...this.state.playlists];
          playlistsCopy[index].duplicates = [];
          playlistsCopy[index].status = 'process.items.removed';
          this.setState({ ...this.state, playlists: [...playlistsCopy] });
          if (global['ga']) {
            global['ga'](
              'send',
              'event',
              'spotify-dedup',
              'playlist-removed-duplicates'
            );
          }
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
      if (global['ga']) {
        global['ga'](
          'send',
          'event',
          'spotify-dedup',
          'saved-tracks-removed-duplicates'
        );
      }
    })();
  }

  render() {
    const totalDuplicates =
      this.state.playlists.length === 0
        ? 0
        : this.state.playlists.reduce(
            (prev, current) => prev + current.duplicates.length,
            0
          ) + this.state.savedTracks.duplicates.length;
    return (
      <div>
        <Status toProcess={this.state.toProcess} />
        <Panel>
          {this.state.toProcess === null && (
            <Translation>{t => t('process.reading-library')}</Translation>
          )}
          {this.state.toProcess > 0 && (
            <Translation>
              {t => t('process.processing', { count: this.state.toProcess })}
            </Translation>
          )}
          {this.state.toProcess === 0 && totalDuplicates > 0 && (
            <span>
              <Translation>
                {t => t('process.status.complete.body')}
              </Translation>{' '}
              <Translation>
                {t => (
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
                {t => t('process.status.complete.body')}
              </Translation>
              <br />
              <Translation>
                {t => t('process.status.complete.nodups.body')}
              </Translation>
              <BuyMeACoffee />
            </span>
          )}
        </Panel>

        <ul className="playlists-list">
          {(this.state.savedTracks.duplicates.length ||
            this.state.savedTracks.status) && (
            <li className="playlists-list-item media">
              <div className="img">
                <img
                  width="100"
                  height="100"
                  className="playlists-list-item__img"
                  src={'./placeholder.png'}
                />
              </div>
              <div className="bd">
                <span className="playlists-list-item__name">
                  <Translation>{t => t('process.saved.title')}</Translation>
                </span>
                {this.state.savedTracks.status && (
                  <Badge><Translation>
                    {t => t(this.state.savedTracks.status)}
                  </Translation></Badge>
                )}
                {this.state.savedTracks.duplicates.length != 0 && (
                  <span>
                    <span>
                      <Translation>
                        {t =>
                          t('process.saved.duplicates', {
                            count: this.state.savedTracks.duplicates.length,
                          })
                        }
                      </Translation>
                    </span>
                    <button
                      className="btn btn-primary btn-sm playlist-list-item__btn"
                      onClick={() => this.removeDuplicatesInSavedTracks()}
                    >
                      <Translation>
                        {t => t('process.saved.remove-button')}
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
            .filter(p => p.duplicates.length || p.status != '')
            .map((playlist: PlaylistModel, index) => (
              <li className="playlists-list-item media" key={index}>
                <div className="img">
                  <img
                    width="100"
                    height="100"
                    className="playlists-list-item__img"
                    src={
                      playlist.playlist.images &&
                      playlist.playlist.images[0] &&
                      playlist.playlist.images[0].url
                    }
                  />
                </div>
                <div className="bd">
                  <span className="playlists-list-item__name">
                    {playlist.playlist.name}
                  </span>
                  {playlist.status && <Badge>
                    <Translation>
                      {t => t(playlist.status)}
                    </Translation></Badge>}
                  {playlist.duplicates.length != 0 && (
                    <span>
                      <span>
                        <Translation>
                          {t =>
                            t('process.playlist.duplicates', {
                              count: playlist.duplicates.length,
                            })
                          }
                        </Translation>
                      </span>
                      <button
                        className="btn btn-primary btn-sm playlist-list-item__btn"
                        onClick={() => this.removeDuplicates(playlist)}
                      >
                        <Translation>
                          {t => t('process.playlist.remove-button')}
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
        <style jsx>
          {`
            .bd {
              position: relative;
            }

            .media,
            .bd {
              overflow: hidden;
              _overflow: visible;
              zoom: 1;
            }

            .media .img {
              float: left;
              margin-right: 20px;
            }

            img {
              vertical-align: middle;
            }

            .playlists-list-item {
              margin-bottom: 2rem;
            }

            .playlists-list-item__img {
              width: 100px;
            }

            .btn {
              display: inline-block;
              padding: 6px 12px;
              margin-bottom: 0;
              font-size: 14px;
              font-weight: 400;
              line-height: 1.428571429;
              text-align: center;
              white-space: nowrap;
              vertical-align: middle;
              background-image: none;
              border: 1px solid transparent;
              border-radius: 4px;
              cursor: pointer;
            }

            .btn-primary {
              color: #fff;
              background-color: #428bca;
              border-color: #357ebd;
            }

            .btn-primary:hover {
              background-color: #5094ce;
            }

            .playlist-list-item__btn {
              max-width: 50%;
              position: absolute;
              right: 0;
              top: 0;
            }

            @media (max-width: 700px) {
              .playlist-list-item__btn {
                position: relative;
                max-width: 100%;
              }
            }

            .playlists-list-item__name {
              display: block;
              font-weight: bold;
              max-width: 50%;
            }

            ul {
              padding: 0;
            }
          `}
        </style>
      </div>
    );
  }
}
