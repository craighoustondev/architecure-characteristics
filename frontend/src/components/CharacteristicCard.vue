<script setup lang="ts">
interface Props {
  name: string
  description: string
  isSelected: boolean
  emoji: string
  commentCount?: number
  showDiscussionButton?: boolean
}

withDefaults(defineProps<Props>(), {
  commentCount: 0,
  showDiscussionButton: false
})

defineEmits<{
  click: []
  openDiscussion: []
}>()
</script>

<template>
  <div 
    class="characteristic-card"
    :class="{ selected: isSelected }"
    @click="$emit('click')"
  >
    <h3>
      <span class="emoji">{{ emoji }}</span>
      {{ name }}
    </h3>
    <p>{{ description }}</p>
    
    <button
      v-if="showDiscussionButton"
      class="discussion-button"
      @click.stop="$emit('openDiscussion')"
      :title="commentCount > 0 ? `${commentCount} comment${commentCount !== 1 ? 's' : ''}` : 'Add discussion notes'"
    >
      💬
      <span v-if="commentCount > 0" class="comment-badge">{{ commentCount }}</span>
    </button>
  </div>
</template>

<style scoped>
.characteristic-card {
  background-color: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  position: relative;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.characteristic-card .emoji {
  font-size: 1.5rem;
  line-height: 1;
}

.characteristic-card p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
  font-size: 0.95rem;
  padding-bottom: 3rem;
}

.discussion-button {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background-color: transparent;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  transition: background-color 0.2s, transform 0.2s, border-color 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.discussion-button:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  transform: scale(1.1);
}

.discussion-button:focus {
  outline: none;
}

.discussion-button:active {
  transform: scale(0.95);
}

.discussion-button:active {
  transform: scale(0.95);
}

.comment-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  background-color: #3498db;
  color: white;
  border-radius: 50%;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  border: 2px solid white;
}
</style>

