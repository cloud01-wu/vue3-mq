<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-slate-500 text-white shadow-md p-2">
      <h1 class="text-2xl">Vue3-MQ Sandbox</h1>
    </header>
    <main class="flex-grow container mx-auto py-4">
      <div class="flex justify-around">
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded shadow-sm relative before:transition-opacity before:absolute before:inset-0 before:bg-current before:opacity-0 hover:before:opacity-20"
          @click="updateBreakpoints(undefined, 'wordpress')"
        >
          Update Preset to Wordpress
        </button>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded shadow-sm relative before:transition-opacity before:absolute before:inset-0 before:bg-current before:opacity-0 hover:before:opacity-20"
          @click="changeToCustomBreakpoints"
        >
          Update Breakpoints to Custom
        </button>
      </div>
      <div
        v-for="(breakpoint, idx) in availableBreakpoints"
        :key="breakpoint.name"
        class="bg-slate-200"
      >
        <span v-if="idx !== 0 && idx !== availableBreakpoints.length - 1">
          {{ `Is ${breakpoint.name}+: ${$mq.is(`${breakpoint.name}+`)}` }} &emsp;
        </span>
        <span> {{ `Is ${breakpoint.name}: ${$mq.is(`${breakpoint.name}`)}` }} &emsp; </span>
        <span v-if="idx !== 0 && idx !== availableBreakpoints.length - 1">
          {{ `Is ${breakpoint.name}-: ${$mq.is(`${breakpoint.name}-`)}` }} &emsp;
        </span>
        <div>---</div>
      </div>
      <pre>{{ $mq }}</pre>
      <mq-responsive>No props</mq-responsive>
      <mq-responsive inert>Reduced motion is preferred</mq-responsive>
      <mq-responsive motion>Normal motion is preferred</mq-responsive>
      <mq-responsive group>
        <template #motion>Motion slot</template>
        <template #inert>Inert slot</template>
      </mq-responsive>
      <div class="bg-slate-200 p-4 my-4">
        <h4 class="text-xl font-bold">Available Breakpoints:</h4>
        <pre class="text-xs">{{ availableBreakpoints }}</pre>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import type { Breakpoint } from '@cloud01-wu/vue3-mq'
import { onMounted } from 'vue'
import { availableBreakpoints, MqResponsive, updateBreakpoints, useMq } from '@cloud01-wu/vue3-mq'

const $mq = useMq()

onMounted(() => {})

const changeToCustomBreakpoints = () => {
  const breakpoints: Breakpoint[] = [
    { name: 'hellaSmall', min: 0 },
    { name: 'prettySmall', min: 600 },
    { name: 'mediocre', min: 1020 },
    { name: 'sizable', min: 1280 },
    { name: 'big', min: 1600 },
    { name: 'phat', min: 1920 },
    { name: 'awHellNo', min: 2400 }
  ]

  updateBreakpoints(breakpoints)
}
</script>
