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

#import "AudioRouteManager.h"

@implementation AudioRouteManager

- (instancetype)init
{
  if ((self = [super init])) {
    [[UIDevice currentDevice] setProximityMonitoringEnabled:YES];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sensorStateChange:) name:@"UIDeviceProximityStateDidChangeNotification" object:nil];
  }
  return self;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"proximityStateDidChange"];
}

- (void)sensorStateChange:(NSNotificationCenter *)notification
{
  BOOL proximityState = [[UIDevice currentDevice] proximityState];
  [self sendEventWithName:@"proximityStateDidChange" body:@{@"proximity": @(proximityState)}];
}

RCT_EXPORT_MODULE();

@end


//RCT_EXPORT_MODULE();
//
//- (NSArray<NSString *> *)supportedEvents {
//  return @[@"sayHello"];
//}
//
//- (void)tellJS {
//  [self sendEventWithName:@"sayHello" body:@"Hello"];
//}
//
//@end

