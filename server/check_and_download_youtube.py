#!/usr/bin/python

import subprocess
import argparse
import os.path

def check_and_download(videoId):
  if os.path.isfile('downloads/' + videoId + '.mp3'):
    print('video already exists')
  else:
    subprocess.call([
      'youtube-dl',
      '--extract-audio',
      '--audio-format', 'mp3',
      '--output', 'downloads/' + videoId + '.%(ext)s',
      'https://www.youtube.com/watch?v=' + videoId,
    ])

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--videoId', help='the youtube video id')
  args = parser.parse_args()
  check_and_download(args.videoId)
