<script setup lang="ts">
import { onMounted, ref } from 'vue'
import 'swagger-ui-dist/swagger-ui.css'

const container = ref<HTMLElement | null>(null)

onMounted(async () => {
  const { default: SwaggerUI } = await import('swagger-ui-dist/swagger-ui-es-bundle.js')
  SwaggerUI({
    url: '/openapi/sessage-v1.json',
    domNode: container.value!,
    deepLinking: true,
    displayRequestDuration: true,
    filter: true,
    persistAuthorization: false,
    supportedSubmitMethods: [],
    tryItOutEnabled: false
  })
})
</script>

<template>
  <div ref="container" class="sessage-swagger-viewer" aria-label="Sessage API-Referenz" />
</template>
