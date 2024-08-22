import type { Ref } from 'vue'
import type { Orientation, Theme, MotionPreference, Breakpoint, BreakpointObject } from 'types'
import { _listeners as listeners, availableBreakpoints, _isMounted as isMounted } from './store'

/**
 * Remove all MediaMatch listeners from the window object and empty the listeners array
 *
 * @type {Function} - Sets the orientation to use when plugin executes in a non-browser context
 */
export const removeListeners = (): void => {
  while (listeners.length > 0) {
    const listener = listeners.shift()
    if (listener && typeof listener === 'object') {
      const { mql, cb } = listener
      const supportsAEL = mql.addEventListener && typeof mql.addEventListener === 'function'
      if (supportsAEL) mql.removeEventListener('change', cb)
      else mql.removeListener(cb)
    }
  }
}

/**
 * Convert available breakpoints in to media query strings
 *
 * @type {Function} - Sets the orientation to use when plugin executes in a non-browser context
 * @returns {string[]} - An array of media query strings
 */
export const createMediaQueries = () => {
  const mediaQueries = availableBreakpoints.value.reduce((acc, curr, index, arr) => {
    const min = `(min-width: ${curr.min}px)`
    const max = index < arr.length - 1 ? `(max-width: ${arr[index + 1].min - 1}px)` : null
    const query = min + (max ? ' and ' + max : '')
    return Object.assign(acc, {
      [curr.name]: query
    })
  }, {})

  return mediaQueries
}

/**
 * Subscribe to a given media query and execute a callback when matched
 *
 * @type {Function} - Adds a listener using the matchMedia method on the window
 * @param {string} mediaQuery - The media query to listen for match status
 * @param {Function} callback - The callback to execute when the mediaQuery is matched
 */
export const subscribeToMediaQuery = (mediaQuery: string, callback: Function): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  else if (typeof window !== 'undefined' && !window.matchMedia) {
    console.error(
      'Vue3 Mq: No MatchMedia support detected in this browser. Responsive breakpoints not available.'
    )
    return false
  } else {
    isMounted.value = true

    const mql = window.matchMedia(mediaQuery)
    const cb = ({ matches }) => {
      if (matches) callback()
    }
    listeners.push({ mql, cb })

    const supportsAEL = mql.addEventListener && typeof mql.addEventListener === 'function'

    if (supportsAEL) mql.addEventListener('change', cb)
    else mql.addListener(cb)

    cb(mql)

    return true
  }
}

/**
 * @constant {Function} validateBreakpoint - Checks that the given breakpoint matches against the given breakpoints in config
 * @param {string} bp - The breakpoint to validate
 * @returns {boolean} - The validity of the breakpoint
 */
const validateBreakpoint = (bp: Breakpoint): boolean => {
  return availableBreakpoints.value.some((available) => available.name === bp)
}

/**
 * @constant {Function} calculateBreakpointsToRender - Checks that the given breakpoint matches against the available breakpoints in config
 * @param {string} bp - The breakpoint to validate
 * @param {ref} available - A Vue REF holding an array of objects denoting breakpoints registered with the plugin
 * @returns {string[]} - An array of breakpoint keys that should be rendered based on the current breakpoint
 */
export const calculateBreakpointsToRender = (bp: string, available: Ref): Breakpoint[] => {
  const allKeys = available.value.map((a: BreakpointObject) => a.name)

  // No setting
  if (!bp) return allKeys
  // Array of breakpoints
  else if (Array.isArray(bp)) {
    return bp.filter((n) => validateBreakpoint(n))
  }
  // Breakpoint plus
  else if (typeof bp === 'string' && /\w+\+$/.test(bp)) {
    bp = bp.replace(/\+$/, '')
    if (validateBreakpoint(bp) === false) {
      console.error(`Vue3 Mq: ${bp} is not a valid breakpoint key. Invalid range.`)
      return allKeys
    }
    const fromIndex = available.value.findIndex((n) => n.name === bp)
    return available.value.slice(fromIndex).map((n) => n.name)
  }
  // Breakpoint minus
  else if (typeof bp === 'string' && /\w+-$/.test(bp)) {
    bp = bp.replace(/-$/, '')
    if (validateBreakpoint(bp) === false) {
      console.error(`Vue3 Mq: ${bp} is not a valid breakpoint key. Invalid range.`)
      return allKeys
    }
    const toIndex = available.value.findIndex((n) => n.name === bp)
    return available.value.slice(0, toIndex + 1).map((n) => n.name)
  }
  // Breakpoint range
  else if (typeof bp === 'string' && /^\w+-\w+$/.test(bp)) {
    const [fromKey, toKey] = bp.split('-')
    if (validateBreakpoint(fromKey) === false) {
      console.error(`Vue3 Mq: ${fromKey} is not a valid breakpoint key. Invalid range.`)
      return allKeys
    } else if (validateBreakpoint(toKey) === false) {
      console.error(`Vue3 Mq: ${toKey} is not a valid breakpoint key. Invalid range.`)
      return allKeys
    }
    const fromIndex = available.value.findIndex((n) => n.name === fromKey)
    const toIndex = available.value.findIndex((n) => n.name === toKey)
    return available.value.slice(fromIndex, toIndex + 1).map((n) => n.name)
  }
  // Single breakpoint
  else if (typeof bp === 'string' && validateBreakpoint(bp) === true) {
    return [bp]
  }
  // Fallback
  else return allKeys
}

/**
 * @constant {Function} calculateOrientationsToRender - Creates an array of the orientations that should be rendered
 * @param {boolean} landscape - Render only in landscape mode
 * @param {boolean} portrait - Render only in portrait mode
 * @returns {string[]} - An array of orientations that should be rendered based on the current value
 */
export const calculateOrientationsToRender = (
  isLandscape: boolean,
  isPortrait: boolean
): Orientation[] => {
  const arr: Orientation[] = []
  if (!isLandscape && !isPortrait) return ['landscape', 'portrait']
  if (isLandscape) arr.push('landscape')
  if (isPortrait) arr.push('portrait')
  return arr
}

/**
 * @constant {Function} calculateThemesToRender - Creates an array of the themes that should be rendered on
 * @param {boolean} dark - Render only in dark mode
 * @param {boolean} light - Render only in light mode
 * @returns {string[]} - The array of themes to render on based upon the current value
 */
export const calculateThemesToRender = (isDark: boolean, isLight: boolean): Theme[] => {
  const arr: Theme[] = []
  if (!isLight && !isDark) return ['light', 'dark']
  if (isLight) arr.push('light')
  if (isDark) arr.push('dark')
  return arr
}

/**
 * @constant {Function} calculateMotionToRender - Creates an array of the motion preferences that should be rendered on
 * @param {boolean} inert - Render only in reduced motion mode
 * @param {boolean} motion - Render only in normal motion mode
 * @returns {string[]} - The array of motion preferences to render on based upon the current value
 */
export const calculateMotionToRender = (
  isInert: boolean,
  isMotion: boolean
): MotionPreference[] => {
  const arr: MotionPreference[] = []
  if (!isInert && !isMotion) return ['reduce', 'no-preference']
  if (isInert) arr.push('reduce')
  if (isMotion) arr.push('no-preference')
  return arr
}
