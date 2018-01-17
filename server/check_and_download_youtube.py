#!/usr/bin/python

import subprocess
import argparse
import os.path

PENDING_DIR = 'pending_downloads'
DOWNLOADS_DIR = 'downloads'

def song_is_downloaded(videoId):
  path = os.path.join(DOWNLOADS_DIR, 'song_{}.mp3'.format(videoId))
  return os.path.isfile(path)

def check_and_download(videoId):
  if song_is_downloaded(videoId):
    print('video already exists')
    return

  subprocess.call([
    'youtube-dl',
    '-f', 'webm',
    '--extract-audio',
    '--audio-format', 'mp3',
    '--output', os.path.join(PENDING_DIR, 'song_{}.%(ext)s'.format(videoId)),
    'https://www.youtube.com/watch?v={}'.format(videoId),
  ])

  pending_path = os.path.join(PENDING_DIR, 'song_{}.mp3'.format(videoId))
  download_path = os.path.join(DOWNLOADS_DIR, 'song_{}.mp3'.format(videoId))
  os.rename(pending_path, download_path)


if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--videoId', type=str, help='the youtube video id')
  args = parser.parse_args()

  prefixLen = len('song_')
  check_and_download(args.videoId[prefixLen:])
