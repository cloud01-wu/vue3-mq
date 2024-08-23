import { computed, h, Transition, TransitionGroup } from 'vue'
import { availableBreakpoints, mqState } from './store'
import {
  calculateBreakpointsToRender,
  calculateOrientationsToRender,
  calculateThemesToRender,
  calculateMotionToRender
} from './helpers'
import { extractSlotNameProperties } from './validation'
import { Breakpoint } from 'types'

const defaultTransitionOptions = {
  name: 'fade',
  mode: 'out-in'
}

export default {
  name: 'MqResponsive',
  props: {
    /**
     * Breakpoints to target when rendering component
     */
    target: [String, Array],
    /**
     * Only render in a landscape view
     */
    landscape: {
      type: Boolean,
      default: false
    },
    /**
     * Only render in a portrait view
     */
    portrait: {
      type: Boolean,
      default: false
    },
    /**
     * Only render when dark mode is preferred
     */
    dark: {
      type: Boolean,
      default: false
    },
    /**
     * Only render when light mode is preferred
     */
    light: {
      type: Boolean,
      default: false
    },
    /**
     * Only render when reduced motion is preferred
     */
    inert: {
      type: Boolean,
      default: false
    },
    /**
     * Only render when normal motion is preferred
     */
    motion: {
      type: Boolean,
      default: false
    },
    /**
     * HTML tag to use when rendering
     */
    tag: {
      type: String,
      default: 'div'
    },
    /**
     * When in group mode, the HTML tag to use on list items
     */
    listTag: {
      type: String,
      default: 'div'
    },
    /**
     * Render items as part of a transition group
     */
    group: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { attrs, slots }) {
    const breakpointsToRender = computed(() => {
      return calculateBreakpointsToRender(props.target, availableBreakpoints.value as Breakpoint[])
    })
    const orientationsToRender = computed(() => {
      return calculateOrientationsToRender(props.landscape, props.portrait)
    })
    const themesToRender = computed(() => {
      return calculateThemesToRender(props.dark, props.light)
    })
    const motionToRender = computed(() => {
      return calculateMotionToRender(props.inert, props.motion)
    })
    const shouldRenderDefault = computed(() => {
      return (
        breakpointsToRender.value.findIndex((breakpoint) => breakpoint === mqState.current) !==
          -1 &&
        orientationsToRender.value.includes(mqState.orientation) &&
        themesToRender.value.includes(mqState.theme) &&
        motionToRender.value.includes(mqState.motionPreference)
      )
    })
    const renderSlots = (tag) => {
      // If not using a transition-group and named slots are used, render them all.
      if (!props.group && slots.length > 0) return slots

      const slotsToRender: any[] = []
      for (const slot in slots) {
        // Extract render options from slot name.
        const { slotBp, slotOrientation, slotTheme, slotMotion } = extractSlotNameProperties(slot)
        // Compute an array of breakpoints in which the slot should render
        const breakpointsToRenderSlot = computed(() => {
          return calculateBreakpointsToRender(slotBp, availableBreakpoints.value as Breakpoint[])
        })

        // Compute an array of orientations on which the slot should render
        const orientationsToRenderSlot = computed(() => {
          return calculateOrientationsToRender(
            slotOrientation === 'landscape',
            slotOrientation === 'portrait'
          )
        })

        // Compute an array of themes under which the slot should render
        const themesToRenderSlot = computed(() => {
          return calculateThemesToRender(slotTheme === 'dark', slotTheme === 'light')
        })

        // Compute an array of motion preference under which the slot should render
        const motionToRenderSlot = computed(() => {
          return calculateMotionToRender(slotMotion === 'inert', slotMotion === 'motion')
        })

        // Compute if this slot should be rendered
        const shouldRenderSlot = computed(() => {
          return (
            breakpointsToRenderSlot.value.findIndex(
              (breakpoint) => breakpoint === mqState.current
            ) !== -1 &&
            orientationsToRenderSlot.value.includes(mqState.orientation) &&
            themesToRenderSlot.value.includes(mqState.theme) &&
            motionToRenderSlot.value.includes(mqState.motionPreference)
          )
        })

        // If yes, push it onto the rendering array
        if (shouldRenderSlot.value === true) {
          slotsToRender.push(
            h(tag ? tag : slots[slot], { key: slot }, tag ? slots[slot]() : undefined)
          )
        }
      }
      // If there is anything to render, return it
      return slotsToRender.length > 0 ? slotsToRender : undefined
    }

    // If the component is using the default slot
    if (slots.default) {
      return () =>
        shouldRenderDefault.value ? h(props.tag, { ...attrs }, slots.default()) : undefined
    }
    // If the component is using named slots
    else {
      return () => {
        const transitionOptions = Object.assign({}, defaultTransitionOptions, attrs, {
          tag: props.tag
        })
        const el = props.group ? TransitionGroup : Transition

        return h(el as any, transitionOptions, () => renderSlots(props.listTag))
      }
    }
  }
}
