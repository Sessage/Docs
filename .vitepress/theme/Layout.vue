<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ConsentManager from './ConsentManager.vue'

function openConsentSettings() {
  window.dispatchEvent(new CustomEvent('sessage:open-consent-settings'))
}
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-bottom>
      <ConsentManager />
    </template>
    <template #doc-footer-before>
      <div class="sessage-privacy-links">
        <a href="https://sessage.de/de/datenschutz/#youtube">Datenschutz / Privacy</a>
        <button type="button" @click="openConsentSettings">Cookie-Einstellungen / Cookie settings</button>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>
