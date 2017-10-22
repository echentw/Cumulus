#!/usr/bin/python

import subprocess
import argparse
import os.path

def check_and_download(videoId):
  outputPath = 'downloads/' + videoId + '.mp3'

  if os.path.isfile(outputPath):
    print('video already exists')
  else:
    subprocess.call([
      'youtube-dl',
      '-x', # specify audio only
      '--audio-format', 'mp3',
      '--output', outputPath,
      'https://www.youtube.com/watch?v=' + videoId,
    ])

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--videoId', help='the youtube video id')
  args = parser.parse_args()
  check_and_download(args.videoId)
