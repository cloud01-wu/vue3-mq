export type BreakpointKey = string
export type MotionPreference = 'reduce' | 'no-preference'
export type Orientation = 'landscape' | 'portrait'
export type Theme = 'dark' | 'light'

export interface Breakpoint {
  name: BreakpointKey
  min: number
}

export interface BreakpointQuery {
  key: BreakpointKey
  value: boolean
}

export interface MqState {
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

  is(key: BreakpointKey): boolean
}
