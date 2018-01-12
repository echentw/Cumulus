//
//  AudioRouteManager.m
//  Cumulus
//
//  Created by Eric Chen on 1/10/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>

#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTLog.h>

#import "AudioRouteManager.h"

@implementation AudioRouteManager

- (instancetype)init
{
  if ((self = [super init])) {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleAudioRouteChange:) name:@"AVAudioSessionRouteChangeNotification" object: nil];
  }
  return self;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"audioDeviceDisconnected"];
}

- (void)handleAudioRouteChange:(NSNotification *)notification
{
  NSDictionary* userInfo = [notification userInfo];
  NSInteger reason = [userInfo[AVAudioSessionRouteChangeReasonKey] integerValue];
  if (reason == AVAudioSessionRouteChangeReasonOldDeviceUnavailable)
  {
    [self sendEventWithName:@"audioDeviceDisconnected" body:nil];
  }
}

RCT_EXPORT_MODULE();

@end
