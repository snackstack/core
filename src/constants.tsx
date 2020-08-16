import React from 'react';
import { Slide } from '@material-ui/core';
import { getTransitionDirection } from './helpers';
import { SnackProviderOptions } from './types/snackProviderOptions';

export const defaultMaxSnacks = 3;

export const defaultSpacing = 12;

export const defaultAutoHideDuration = 2500;

export const defaultTransitionDelay = 500;

export const defaultAnchorOrigin: Exclude<SnackProviderOptions['anchorOrigin'], undefined> = {
  horizontal: 'left',
  vertical: 'bottom',
};

export const DefaultTransitionComponent: Exclude<
  SnackProviderOptions['TransitionComponent'],
  undefined
> = anchorOrigin => props => <Slide {...props} direction={getTransitionDirection(anchorOrigin)} />;
