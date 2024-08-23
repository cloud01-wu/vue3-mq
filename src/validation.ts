import type { Breakpoint, Orientation, Theme, MotionPreference } from 'types'
import * as presets from './presets'

export const validatePreset = (preset) => {
  if (typeof preset === 'string' && presets[preset]) return presets[preset]
  else {
    const availablePresets = Object.keys(presets)
    console.error(
      `Vue3 Mq: "${preset}" is not a valid preset. Available options are: ${availablePresets.join(
        ', '
      )}`
    )
    return false
  }
}

export const validateOrientation = (orientation: Orientation) => {
  const isValid = ['landscape', 'portrait'].includes(orientation)
  if (isValid === false) {
    console.error(
      `Vue3 Mq: "${orientation}" is not a valid default orientation. Reverting to unset value.`
    )
    return null
  } else return orientation
}

export const validateTheme = (theme?: Theme): Theme | null => {
  if (!theme) return null

  const isValid = ['dark', 'light'].includes(theme)
  if (isValid === false && theme !== null) {
    console.error(`Vue3 Mq: "${theme}" is not a valid default theme. Reverting to unset value.`)
    return null
  } else {
    return theme
  }
}

export const validateMotion = (motion?: MotionPreference): MotionPreference | null => {
  if (!motion) return null

  const isValid = ['no-preference', 'reduce'].includes(motion)
  if (isValid === false && motion !== null) {
    console.error(
      `Vue3 Mq: "${motion}" is not a valid default motion preference. Reverting to unset value.`
    )
    return null
  } else return motion
}

export const sanitiseBreakpoints = (breakpoints: Breakpoint[]) => {
  if (!breakpoints || !Array.isArray(breakpoints)) return false
  const sanitisedBreakpoints: Breakpoint[] = []

  for (const [idx, breakpoint] of breakpoints.entries()) {
    const { name, min } = breakpoint
    if (!name) {
      console.warn(`Vue3 Mq: Invalid or missing breakpoint key at item index #${idx}. Skipping.`)
      continue
    } else if (/^[^a-z]/i.test(name) || /[^a-zA-Z0-9_]/.test(name)) {
      console.warn(
        `Vue3 Mq: "${name}" is an invalid breakpoint key. Breakpoint keys must start with a letter and contain only alphanumeric characters and underscores. Skipping.`
      )
      continue
    } else if ((!min && min !== 0) || isNaN(min) || min < 0) {
      console.warn(
        `Vue3 Mq: "${name}: ${min}" is not a valid breakpoint value. Breakpoints should be a number of zero or above. Skipping.`
      )
      continue
    }

    sanitisedBreakpoints.push(breakpoint)
  }

  const hasZero = sanitisedBreakpoints.some((breakpoint) => breakpoint.min === 0)
  if (!hasZero) {
    console.warn(
      `Vue3 Mq: You have not declared a breakpoint with a minimum value of 0. There may be screen sizes to which Vue3Mq does not respond.`
    )
  }

  const uniqueValues = new Set(sanitisedBreakpoints.map((breakpoint) => breakpoint.min))
  if (uniqueValues.size < sanitisedBreakpoints.length) {
    console.warn(
      `Vue3 Mq: Your breakpoint configuration contains duplicate values. Behaviour may be unpredictable.`
    )
  }

  if (sanitisedBreakpoints.length === 0) return false
  else return sanitisedBreakpoints.sort((a, b) => a.min - b.min)
}

export const extractSlotNameProperties = (name: string) => {
  const options = name.split(':')
  const optionsObject: any = {}
  for (const option of options) {
    // If the option is a slot number, discard it
    if (/\D/.test(option) === false) continue
    // If it's an orientation, apply
    else if (['landscape', 'portrait'].includes(option)) optionsObject.slotOrientation = option
    // If it's a theme, apply
    else if (['light', 'dark'].includes(option)) optionsObject.slotTheme = option
    // If it's a motion preference, apply
    else if (['inert', 'motion'].includes(option)) optionsObject.slotMotion = option
    // Otherwise, assume it's a breakpoint
    else optionsObject.slotBp = option
  }
  return optionsObject
}
