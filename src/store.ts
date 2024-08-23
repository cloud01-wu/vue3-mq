/* ******************************************
 * IMPORTS
 ****************************************** */
import type {
  MqState,
  Breakpoint,
  BreakpointKey,
  BreakpointQuery,
  Orientation,
  Theme,
  MotionPreference
} from 'types'
import { readonly, ref } from 'vue'

/* ******************************************
 * STATE
 ****************************************** */
const _availableBreakpoints = ref<Breakpoint[]>([])
const _defaultBreakpoint = ref<BreakpointKey>('md')
const _defaultOrientation = ref<Orientation>('landscape')
const _defaultTheme = ref<Theme>('light')
const _defaultMotion = ref<MotionPreference>('no-preference')

export class MqStateObject implements MqState {
  current: BreakpointKey
  orientation: Orientation
  isLandscape: boolean
  isPortrait: boolean
  theme: Theme
  isDark: boolean
  isLight: boolean
  motionPreference: MotionPreference
  isMotion: boolean
  isInert: boolean
  queries: BreakpointQuery[]

  constructor() {
    this.current = ''
    this.orientation = _defaultOrientation.value
    this.isLandscape = true
    this.isPortrait = false
    this.theme = _defaultTheme.value
    this.isDark = false
    this.isLight = true
    this.motionPreference = _defaultMotion.value
    this.isMotion = false
    this.isInert = false
    this.queries = []
  }
  public is(key: string): boolean {
    const query = this.queries.find((query) => query.key === key)
    if (query) return query.value
    return false
  }
}
const _mqState = ref<MqState>(new MqStateObject())

export const _listeners: any[] = []
export const _isMounted = ref(false)

/* ******************************************
 * GETTERS
 ****************************************** */
export const availableBreakpoints = readonly(_availableBreakpoints)
export const defaultBreakpoint = readonly(_defaultBreakpoint)
export const defaultOrientation = readonly(_defaultOrientation)
export const defaultTheme = readonly(_defaultTheme)
export const defaultMotion = readonly(_defaultMotion)
export const mqState = readonly<MqState>(_mqState.value)

/* ******************************************
 * MUTATIONS
 ****************************************** */
export const setAvailableBreakpoints = (v: Breakpoint[]): void => {
  _availableBreakpoints.value = v
}

/**
 * @constant
 * @type {Function} - Sets the breakpoint to use when plugin executes in a non-browser context
 */
export const setDefaultBreakpoint = (v: BreakpointKey): void => {
  _defaultBreakpoint.value = v
}

/**
 * @constant
 * @type {Function} - Sets the orientation to use when plugin executes in a non-browser context
 */
export const setDefaultOrientation = (v: Orientation): void => {
  _defaultOrientation.value = v
}

/**
 * @constant
 * @type {Function} - Sets the theme to use when plugin executes in a non-browser context
 */
export const setDefaultTheme = (v: Theme): void => {
  _defaultTheme.value = v
}

/**
 * @constant
 * @type {Function} - Sets the motion preference to use when plugin executes in a non-browser context
 */
export const setDefaultMotion = (v: MotionPreference): void => {
  _defaultMotion.value = v
}

const insertOrUpdateQuery = (key: string, value: boolean): void => {
  const query = _mqState.value.queries.find((query) => query.key === key)
  if (query) {
    query.value = value
  } else {
    _mqState.value.queries.push({ key, value })
  }
}

export const updateState = (v: string = defaultBreakpoint.value): void => {
  _mqState.value.current = v

  const currentIndex = availableBreakpoints.value.findIndex((bp) => bp.name === v)
  const allKeys = availableBreakpoints.value.map((bp) => bp.name)
  for (let idx = 0; idx < allKeys.length; idx++) {
    if (idx > 0 && idx < allKeys.length - 1) {
      const mKey = `${allKeys[idx]}-`
      const pKey = `${allKeys[idx]}+`

      insertOrUpdateQuery(mKey, currentIndex <= idx ? true : false)
      insertOrUpdateQuery(pKey, currentIndex >= idx ? true : false)
    }

    // _mqState.value[allKeys[idx]] = allKeys[idx] === v ? true : false
    insertOrUpdateQuery(allKeys[idx], allKeys[idx] === v ? true : false)
  }
}

/**
 * @constant
 * @type {Function} - Resets the MQ object to its initial values, using defaultBreakpoint and defaultOrientation
 */
export const resetState = (): void => {
  // reset all properties of the target
  _mqState.value = Object.assign(_mqState.value, new MqStateObject())
  _mqState.value.queries = []

  updateState()
  updateOrientationState()
  updateThemeState()
  updateMotionState()
}

/**
 * @constant
 * @type {Function} - Update values for the MQ object's orientation properties
 * @param {string} v - The orientation value to set, either "portrait" or "landscape".
 */
export const updateOrientationState = (v: Orientation = defaultOrientation.value): void => {
  _mqState.value.orientation = v
  _mqState.value.isLandscape = v === 'landscape'
  _mqState.value.isPortrait = v === 'portrait'
}

/**
 * @constant
 * @type {Function} - Update values for the MQ object's theme properties
 * @param {string} v - The theme value to set, either "dark" or "light".
 */
export const updateThemeState = (v: Theme = defaultTheme.value || 'light'): void => {
  _mqState.value.theme = v
  _mqState.value.isDark = v === 'dark'
  _mqState.value.isLight = v === 'light'
}

/**
 * @constant
 * @type {Function} - Update values for the MQ object's motion perferences
 * @param {string} v - The motion preference value to set, either "reduced" or "no-preference".
 */
export const updateMotionState = (
  v: MotionPreference = defaultMotion.value || 'no-preference'
): void => {
  _mqState.value.motionPreference = v
  _mqState.value.isMotion = v === 'no-preference'
  _mqState.value.isInert = v === 'reduce'
}
