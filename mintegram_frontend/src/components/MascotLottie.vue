<template>
  <div class="flex items-center justify-center">
    <div class="mascot-wrapper w-64 h-64">
      <div class="mascot-hat" aria-hidden="true"></div>
      <div
        ref="container"
        class="w-64 h-64 select-none"
        :aria-label="ariaLabel || ''"
        role="img"
        @mouseenter="onHover(true)"
        @mouseleave="onHover(false)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import lottie from 'lottie-web'
import type { AnimationItem, AnimationConfig } from 'lottie-web'

/**
 * Props
 * - src: path or URL to your Lottie JSON. Example: src/assets/mascot.json
 * - autoplay: start immediately
 * - loop: loop animation
 * - hoverPlay: pause when not hovered, play when hovered
 * - speed: playback speed (1 = normal)
 * - ariaLabel: accessibility label
 */
const props = withDefaults(defineProps<{
  src: string | object
  autoplay?: boolean
  loop?: boolean
  hoverPlay?: boolean
  speed?: number
  ariaLabel?: string
}>(), {
  autoplay: true,
  loop: true,
  hoverPlay: true,
  speed: 1,
  ariaLabel: 'mascot animation'
})

const container = ref<HTMLDivElement | null>(null)
let anim: AnimationItem | null = null


const config = computed<AnimationConfig>(() => {
  const base: AnimationConfig = {
    container: container.value!,
    renderer: 'svg',
    loop: props.loop,
    autoplay: props.autoplay,
    rendererSettings: {
      progressiveLoad: true,
      preserveAspectRatio: 'xMidYMid meet'
    }
  }
  if (typeof props.src === 'string') {
    return { ...base, path: props.src }
  } else {
    return { ...base, animationData: props.src }
  }
})


onMounted(() => {
  if (!container.value) return
  anim = lottie.loadAnimation(config.value)
  anim.setSpeed(props.speed)
})

onBeforeUnmount(() => {
  anim?.destroy()
  anim = null
})

watch(() => props.speed, (val) => {
  anim?.setSpeed(val)
})

watch(() => props.src, (val) => {
  // Hot-swap animation if src changes
  if (!container.value) return
  anim?.destroy()
  if (typeof val === 'string') {
    anim = lottie.loadAnimation({ ...config.value, path: val })
  } else {
    anim = lottie.loadAnimation({ ...config.value, animationData: val })
  }
  anim.setSpeed(props.speed)
})

function onHover(hovering: boolean) {
  if (!props.hoverPlay || !anim) return
  if (hovering) {
    anim.play()
  } else {
    anim.pause()
  }
}
</script>

<style scoped>
/* Optional: responsive sizing via CSS variables */
:host, .w-64, .h-64 { max-width: 100%; max-height: 100%; }

.mascot-wrapper { position: relative; }
.mascot-hat { display:none; position:absolute; top:4px; left:50%; transform:translateX(-50%); width:72px; height:42px; }
.mascot-hat:before { content:''; position:absolute; left:0; right:0; top:0; height:0; width:0; margin:0 auto; border-left:36px solid transparent; border-right:36px solid transparent; border-bottom:42px solid #c62828; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
.mascot-hat:after { content:''; position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); width:80px; height:12px; background:#fff; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.25); }
body.theme-christmas .mascot-hat { display:block; animation: hatBounce 3s ease-in-out infinite; }
@keyframes hatBounce { 0%,100% { transform:translate(-50%,0); } 50% { transform:translate(-50%,4px); } }
</style>
