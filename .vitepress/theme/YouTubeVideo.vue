<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  videoId: string
  title: string
  caption?: string
  start?: number
}>(), { start: 0 })

const consentKey = 'sessage-youtube-consent-v1'
const allowed = ref(false)
const autoplay = ref(false)
const language = ref('de')
const validVideoId = computed(() => /^[A-Za-z0-9_-]{11}$/.test(props.videoId))
const privacyUrl = computed(() => language.value.startsWith('de')
  ? 'https://sessage.de/de/datenschutz/#youtube'
  : 'https://sessage.com/en/privacy/#youtube')
const playerUrl = computed(() => {
  const params = new URLSearchParams({ rel: '0' })
  if (props.start > 0) params.set('start', String(Math.floor(props.start)))
  if (autoplay.value) params.set('autoplay', '1')
  return `https://www.youtube-nocookie.com/embed/${props.videoId}?${params}`
})

function readConsent() {
  try { return localStorage.getItem(consentKey) === 'granted' } catch { return false }
}

function handleConsent(event: Event) {
  const value = (event as CustomEvent<string>).detail
  allowed.value = value === 'granted'
  if (!allowed.value) autoplay.value = false
}

function activate() {
  autoplay.value = true
  allowed.value = true
  try { localStorage.setItem(consentKey, 'granted') } catch { /* Apply for this page view. */ }
  window.dispatchEvent(new CustomEvent('sessage:youtube-consent', { detail: 'granted' }))
}

onMounted(() => {
  language.value = document.documentElement.lang || 'de'
  allowed.value = readConsent()
  window.addEventListener('sessage:youtube-consent', handleConsent)
})

onBeforeUnmount(() => window.removeEventListener('sessage:youtube-consent', handleConsent))
</script>

<template>
  <figure v-if="validVideoId" class="sessage-youtube-figure">
    <div class="sessage-youtube-embed">
      <iframe
        v-if="allowed"
        :src="playerUrl"
        :title="title"
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
      <div v-else class="sessage-youtube-placeholder">
        <span class="sessage-youtube-play" aria-hidden="true" />
        <strong>{{ title }}</strong>
        <p>{{ language.startsWith('de')
          ? 'Erst nach Ihrer Einwilligung wird eine Verbindung zu YouTube hergestellt.'
          : 'A connection to YouTube is made only after you consent.' }}</p>
        <button type="button" class="sessage-consent-button primary" @click="activate">
          {{ language.startsWith('de') ? 'YouTube-Video laden' : 'Load YouTube video' }}
        </button>
        <a :href="privacyUrl">{{ language.startsWith('de') ? 'Mehr zum Datenschutz' : 'Learn more about privacy' }}</a>
      </div>
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
  <p v-else class="danger custom-block">Invalid YouTube video ID: <code>{{ videoId }}</code></p>
</template>
