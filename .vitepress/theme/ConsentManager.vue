<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type Consent = 'granted' | 'denied' | null

const consentKey = 'sessage-youtube-consent-v1'
const choice = ref<Consent>(null)
const settingsOpen = ref(false)
const language = ref('de')
const isGerman = computed(() => language.value.startsWith('de'))
const privacyUrl = computed(() => isGerman.value
  ? 'https://sessage.de/de/datenschutz/#youtube'
  : 'https://sessage.com/en/privacy/#youtube')

function readConsent(): Consent {
  try {
    const value = localStorage.getItem(consentKey)
    return value === 'granted' || value === 'denied' ? value : null
  } catch { return null }
}

function saveConsent(value: Exclude<Consent, null>) {
  choice.value = value
  try { localStorage.setItem(consentKey, value) } catch { /* Apply for this page view. */ }
  window.dispatchEvent(new CustomEvent('sessage:youtube-consent', { detail: value }))
  settingsOpen.value = false
}

function openSettings() {
  settingsOpen.value = true
}

function handleConsent(event: Event) {
  const value = (event as CustomEvent<string>).detail
  if (value === 'granted' || value === 'denied') choice.value = value
}

onMounted(() => {
  language.value = document.documentElement.lang || 'de'
  choice.value = readConsent()
  window.addEventListener('sessage:open-consent-settings', openSettings)
  window.addEventListener('sessage:youtube-consent', handleConsent)
})

onBeforeUnmount(() => {
  window.removeEventListener('sessage:open-consent-settings', openSettings)
  window.removeEventListener('sessage:youtube-consent', handleConsent)
})
</script>

<template>
  <aside v-if="choice === null" class="sessage-consent-banner" :aria-label="isGerman ? 'Datenschutzeinstellungen' : 'Privacy settings'">
    <div>
      <strong>{{ isGerman ? 'Externe YouTube-Videos' : 'External YouTube videos' }}</strong>
      <p>
        {{ isGerman
          ? 'Wir laden YouTube erst nach Ihrer Einwilligung. Dabei können Daten an Google übermittelt und Cookies oder ähnliche Technologien eingesetzt werden.'
          : 'We load YouTube only after your consent. Data may be transferred to Google and cookies or similar technologies may be used.' }}
        <a :href="privacyUrl">Details</a>
      </p>
    </div>
    <div class="sessage-consent-actions">
      <button type="button" class="sessage-consent-button" @click="saveConsent('denied')">{{ isGerman ? 'Optionale ablehnen' : 'Reject optional' }}</button>
      <button type="button" class="sessage-consent-button primary" @click="saveConsent('granted')">{{ isGerman ? 'YouTube erlauben' : 'Allow YouTube' }}</button>
    </div>
  </aside>

  <div v-if="settingsOpen" class="sessage-consent-backdrop" @click.self="settingsOpen = false">
    <section class="sessage-consent-dialog" role="dialog" aria-modal="true" :aria-label="isGerman ? 'YouTube-Einstellung' : 'YouTube setting'">
      <button class="sessage-consent-close" type="button" :aria-label="isGerman ? 'Schließen' : 'Close'" @click="settingsOpen = false">×</button>
      <small>{{ isGerman ? 'DATENSCHUTZ' : 'PRIVACY' }}</small>
      <h2>{{ isGerman ? 'YouTube-Einstellung' : 'YouTube setting' }}</h2>
      <p>{{ isGerman
        ? 'YouTube ist optional. Ohne Einwilligung bleiben alle Videos blockiert und es fließen keine Daten von dieser Seite an YouTube.'
        : 'YouTube is optional. Without consent, all videos remain blocked and this page sends no data to YouTube.' }}</p>
      <p class="sessage-consent-status">{{ choice === 'granted'
        ? (isGerman ? 'Aktuell: YouTube ist erlaubt.' : 'Current setting: YouTube is allowed.')
        : (isGerman ? 'Aktuell: YouTube ist blockiert.' : 'Current setting: YouTube is blocked.') }}</p>
      <div class="sessage-consent-actions">
        <button type="button" class="sessage-consent-button" @click="saveConsent('denied')">{{ isGerman ? 'Einwilligung widerrufen' : 'Withdraw consent' }}</button>
        <button type="button" class="sessage-consent-button primary" @click="saveConsent('granted')">{{ isGerman ? 'YouTube erlauben' : 'Allow YouTube' }}</button>
      </div>
      <a :href="privacyUrl">{{ isGerman ? 'Datenschutzerklärung öffnen' : 'Open privacy policy' }}</a>
    </section>
  </div>
</template>
