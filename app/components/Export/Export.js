import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
import { Linking, Platform, AsyncStorage } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import PlaylistsDB from '../../db/PlaylistsDB';
import SongsDB from '../../db/SongsDB';
import ActionSheet from '../../lib/actionsheets';
import { exportPlaylists } from '../../lib/serverRequest';

class Export extends Component {

  createJsonBlob = (playlists, orphanedSongs) => {
    const blob = { playlists: [] };
    playlists.forEach((playlist) => {
      blob.playlists.push({
        'title': playlist.title,
        'videoIds': playlist.songs.map((song) => song.videoId),
      })
    });

    if (orphanedSongs.length > 0) {
      blob.playlists.push({
        'title': 'Orphanage',
        'videoIds': orphanedSongs.map((song) => song.videoId),
      });
    }

    return blob;
  };

  export = () => {
    const playlists = PlaylistsDB.getAll();
    const playlistTitles = playlists.map((playlist) => playlist.title);

    const orphanedSongs = SongsDB.getAll().filter((song) => {
      return song.playlists.length === 0;
    });
    const orphanedSongsString = orphanedSongs.map((song) => song.title).join('\n');

    let playlistsString = playlistTitles.join('\n');
    ActionSheet.alert(
      'Export',
      `These are your playlists that will be exported:\n${playlistsString}`,
      (proceed) => {
        if (proceed) {
          if (orphanedSongs.length > 0) {
            ActionSheet.alertYN(
              'Orphaned Songs',
              `I found these songs that do not belong to any playlist. I will export these songs to a playlist called "Orphanage". Is that okay?\n${orphanedSongsString}`,
              (proceed) => {
                if (proceed) {
                  const blob = this.createJsonBlob(playlists, orphanedSongs);
                  exportPlaylists(blob)
                    .then((phrase) => {
                      if (phrase) {
                        ActionSheet.alert('Export Successful', `This is your pass phrase to retrieve your playlists in Numulus. Please write this down! (In case you forget, you can always export again)\n\n${phrase}`, () => {});
                      } else {
                        ActionSheet.alert('Uh oh', 'Something went wrong. Please let Eric know!', () => {});
                      }
                    });
                }
              }
            );
          } else {
            const blob = this.createJsonBlob(playlists, []);
            exportPlaylists(blob)
              .then((phrase) => {
                if (phrase) {
                  ActionSheet.alert('Export Successful', `This is your pass phrase to retrieve your playlists in Numulus. Please write this down! (In case you forget, you can always export again)\n\n${phrase}`, () => {});
                } else {
                  ActionSheet.alert('Uh oh', 'Something went wrong. Please let Eric know!', () => {});
                }
              });
          }
        }
      }
    );
  };

 ExportButton = (
    <TouchableOpacity
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 50,
        borderWidth: 2,
        borderRadius: 6,
        borderColor: 'rgb(230, 230, 230)',
        backgroundColor: 'rgb(30, 30, 30)',
      }}
      onPress={this.export}
    >
      <Text style={{
        fontSize: 18,
        color: 'rgb(230, 230, 230)',
      }}>
        Export my songs
      </Text>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{
          flex: 1,
        }}>
          <Text>
            Hi, please press the button below to export all of your songs to the Cumulus server.
          </Text>
        </View>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          { this.ExportButton }
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Export);
