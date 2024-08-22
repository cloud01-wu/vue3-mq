export type Orientation = 'landscape' | 'portrait'
export type Theme = 'dark' | 'light'
export type MotionPreference = 'reduce' | 'no-preference'
export type Breakpoint = string

export interface BreakpointObject {
  name: string
  min: number
}

export interface MqState {
  current: Breakpoint
  xs: boolean
  smMinus: boolean
  smPlus: boolean
  sm: boolean
  mdMinus: boolean
  mdPlus: boolean
  md: boolean
  lgMinus: boolean
  lgPlus: boolean
  lg: boolean
  xlMinus: boolean
  xlPlus: boolean
  xl: boolean
  xxl: boolean
  orientation: Orientation
  isLandscape: boolean
  isPortrait: boolean
  theme: Theme
  isDark: boolean
  isLight: boolean
  motionPreference: MotionPreference
  isMotion: boolean
  isInert: boolean
}
