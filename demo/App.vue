<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-slate-500 text-white shadow-md p-2">
      <h1 class="text-2xl">Vue3-MQ Sandbox</h1>
    </header>
    <main class="flex-grow container mx-auto py-4">
      <pre>{{ $mq }}</pre>
      <MqResponsive>No props</MqResponsive>
      <MqResponsive inert>Reduced motion is preferred</MqResponsive>
      <MqResponsive motion>Normal motion is preferred</MqResponsive>
      <MqResponsive group>
        <template #motion>Motion slot</template>
        <template #inert>Inert slot</template>
      </MqResponsive>
      <div class="bg-slate-200 p-4 my-4">
        <h4 class="text-xl font-bold">Available Breakpoints:</h4>
        <pre class="text-xs">
          {{ availableBreakpoints }}
				</pre
        >
      </div>
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
    </main>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { availableBreakpoints, MqResponsive, updateBreakpoints, useMq } from 'vue3-mq'

const $mq = useMq()

onMounted(() => {})

const changeToCustomBreakpoints = () => {
  const breakpoints = {
    hellaSmall: 0,
    prettySmall: 600,
    mediocre: 1020,
    sizable: 1280,
    big: 1600,
    phat: 1920,
    awHellNo: 2400
  }
  updateBreakpoints(breakpoints)
}
</script>
