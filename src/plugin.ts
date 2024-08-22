import { updateBreakpoints } from './composables'
import { default as MqResponsive } from './component'
import {
  setDefaultBreakpoint,
  setDefaultMotion,
  setDefaultOrientation,
  setDefaultTheme,
  mqState
} from './store'
import { validateOrientation, validateTheme, validateMotion } from './validation'
import type { MotionPreference, Orientation, Theme } from 'types'

/**
 * Install the Vue3Mq plugin on the Vue app instance
 *
 * @param {object} app - The Vue3 app instance
 * @param {object} config - Plugin installation configuration object
 * @param {string} config.preset - A string representing an exported preset from ./presets.js
 * @param {object} config.breakpoints - User defined breakpoints comprising a named key with a minimum width value
 * @param {string} config.defaultBreakpoint - The screen size to set when the plugin is executed in a non-browser context (e.g. SSR)
 * @param {string} config.defaultOrientation - The screen orientation to set when the plugin is executed in a non-browser context (e.g. SSR)
 * @param {string} config.defaultMotion - The motion preference to set when the plugin is executed in a non-browser context (e.g. SSR)
 * @param {string} config.defaultTheme - The theme to set when the plugin is executed in a non-browser context (e.g. SSR) or for users with no OS preference
 * @param {boolean} config.global - Install the MQ Object and component globally in the Vue application
 */
const install = (
  app,
  {
    preset = 'bootstrap5',
    breakpoints = undefined,
    defaultBreakpoint = '',
    defaultOrientation = 'landscape',
    defaultMotion = 'no-preference',
    defaultTheme = 'light',
    global = false
  } = {}
) => {
  try {
    const validatedDefaultOrientation = validateOrientation(defaultOrientation as Orientation)
    const validatedDefaultTheme = validateTheme(defaultTheme as Theme)
    const validatedDefaultMotion = validateMotion(defaultMotion as MotionPreference)

    if (defaultBreakpoint) setDefaultBreakpoint(defaultBreakpoint)
    if (validatedDefaultOrientation) setDefaultOrientation(validatedDefaultOrientation)
    if (validatedDefaultTheme) setDefaultTheme(validatedDefaultTheme)
    if (validatedDefaultMotion) setDefaultMotion(validatedDefaultMotion)

    app.provide('mq', mqState)
    app.provide('updateBreakpoints', updateBreakpoints)

    if (global === true) {
      app.component('MqResponsive', MqResponsive)
      app.config.globalProperties.$mq = mqState
    }

    updateBreakpoints(breakpoints, preset)
  } catch (e) {
    console.error(e)
  }
}

export default {
  install
}
