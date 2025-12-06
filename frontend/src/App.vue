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

    <button class="start-button">Start new workshop</button>
  </div>
</template>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #22c55e;
  margin: 0 0 2rem 0;
  text-align: center;
}

.description {
  text-align: left;
  line-height: 1.6;
}

.description p {
  margin: 1.5rem 0;
  color: #16a34a;
  font-size: 1.125rem;
}

.start-button {
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  background-color: #16a34a;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.start-button:hover {
  background-color: #15803d;
}

.start-button:active {
  background-color: #14532d;
}
</style>
