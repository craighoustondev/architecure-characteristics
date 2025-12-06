<script setup lang="ts">
interface Props {
  name: string
  description: string
  isSelected: boolean
}

defineProps<Props>()
defineEmits<{
  click: []
}>()
</script>

<template>
  <div 
    class="characteristic-card"
    :class="{ selected: isSelected }"
    @click="$emit('click')"
  >
    <h3>{{ name }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<style scoped>
.characteristic-card {
  background-color: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s, border-color 0.2s;
}

.characteristic-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.characteristic-card.selected {
  background-color: #dcfce7;
  border-color: #16a34a;
}

.characteristic-card.selected:hover {
  background-color: #bbf7d0;
}

.characteristic-card h3 {
  margin: 0 0 1rem 0;
  color: #000000;
  font-size: 1.25rem;
  font-weight: 600;
}

.characteristic-card p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
  font-size: 0.95rem;
}
</style>

