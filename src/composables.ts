/* ******************************************
 * MODULE IMPORTS
 ****************************************** */
import { inject } from 'vue'

/* ******************************************
 * LOCAL IMPORTS
 ****************************************** */
import type { Breakpoint, MotionPreference, Orientation, Theme } from 'types'
import { validatePreset, sanitiseBreakpoints } from './validation'
import { removeListeners, createMediaQueries, subscribeToMediaQuery } from './helpers'

/* ******************************************
 * STATE IMPORTS
 ****************************************** */
import {
  setAvailableBreakpoints,
  updateState,
  updateMotionState,
  updateOrientationState,
  updateThemeState,
  resetState
} from './store'

import type { MqState } from 'types'

/**
 * Update the breakpoint presets and assign MediaQuery listeners for each of them
 *
 * @public
 * @param {object} config - Configuration object for updating breakpoints
 * @param {object} config.breakpoints - An object of name:min values to set
 * @param {object} config.preset - A breakpoint preset to use
 */
export function updateBreakpoints(breakpoints?: Breakpoint[], preset?: string) {
  const validatedPreset = preset ? validatePreset(preset) : false
  const sanitisedBreakpoints = breakpoints ? sanitiseBreakpoints(breakpoints) : false
  if (validatedPreset === false && !sanitisedBreakpoints) {
    throw new TypeError('Vue3 Mq: You must provide a valid preset, or valid breakpoint settings.')
  } else {
    if (sanitisedBreakpoints) {
      setAvailableBreakpoints(sanitisedBreakpoints)
    } else {
      const _v = sanitiseBreakpoints(validatedPreset)
      if (_v) {
        setAvailableBreakpoints(_v)
      }
    }
  }

  removeListeners()
  resetState()

  // Set matchMedia queries for breakpoints
  const mediaQueries = createMediaQueries()
  for (const key in mediaQueries) {
    const mediaQuery = mediaQueries[key]
    const callback = () => {
      updateState(key)
    }
    subscribeToMediaQuery(mediaQuery, callback)
  }

  // Set matchMedia queries for orientation
  const orientations: Orientation[] = ['portrait', 'landscape']
  orientations.forEach((o) => {
    const orientationCallback = () => {
      updateOrientationState(o)
    }

    subscribeToMediaQuery(`(orientation: ${o})`, orientationCallback)
  })

  // Set matchMedia queries for OS theme
  const themes: Theme[] = ['light', 'dark']
  themes.forEach((t) => {
    const themeCallback = () => {
      updateThemeState(t)
    }

    subscribeToMediaQuery(`(prefers-color-scheme: ${t})`, themeCallback)
  })

  // Set matchMedia queries for OS theme
  const motionPreferences: MotionPreference[] = ['reduce', 'no-preference']
  motionPreferences.forEach((m) => {
    const motionCallback = () => {
      updateMotionState(m)
    }

    subscribeToMediaQuery(`(prefers-reduced-motion: ${m})`, motionCallback)
  })
}

/**
 * Composable function which returns the MQ object provided in the ./plugin.js->install method
 *
 * @public
 * @returns {reactive} - The Vue Reactive object
 */
export const useMq = (): MqState => {
  const mq = inject('mq')
  if (!mq) {
    throw new Error(
      'Vue3Mq is not installed in this app. Please follow the installation instructions and try again.'
    )
  } else return mq as MqState
}
