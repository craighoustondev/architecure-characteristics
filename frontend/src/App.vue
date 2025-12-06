<script setup lang="ts">
</script>

<template>
  <div class="landing-page">
    <h1>Architecture characteristics</h1>
    
    <div class="description">
      <p>
        Architecture characteristics describe the capabilities of a software system that are not directly related to domain functionality.
      </p>
      
      <p>
        They are often suffixed with -ility E.g. scalability, extensibility, adaptability.
      </p>
      
      <p>
        The appropriateness of each characteristic is context specific and involves trade-offs analysis to understand which ones should be accommodated.
      </p>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 2rem 0;
  text-align: center;
}

.description {
  text-align: left;
  line-height: 1.6;
}

.description p {
  margin: 1.5rem 0;
  color: #4a5568;
  font-size: 1.125rem;
}
</style>
