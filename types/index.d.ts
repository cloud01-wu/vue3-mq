export type Orientation = 'landscape' | 'portrait'
export type Theme = 'dark' | 'light'
export type MotionPreference = 'reduce' | 'no-preference'
export type Breakpoint = string

export interface BreakpointObject {
  name: string
  min: number
}

export interface BreakpointQuery {
  key: string
  value: boolean
}

export interface MqState {
  current: Breakpoint
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

  is(key: string): boolean
}
