<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Comment } from '../types'

interface Props {
  show: boolean
  characteristicName: string
  characteristicEmoji: string
  comments: Comment[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  addComment: [text: string]
  updateComment: [id: string, text: string]
  deleteComment: [id: string]
}>()

const newCommentText = ref('')
const editingCommentId = ref<string | null>(null)
const editingCommentText = ref('')

watch(() => props.show, (newVal: boolean) => {
  if (!newVal) {
    newCommentText.value = ''
    editingCommentId.value = null
    editingCommentText.value = ''
  }
})

const handleAddComment = () => {
  if (newCommentText.value.trim()) {
    emit('addComment', newCommentText.value.trim())
    newCommentText.value = ''
  }
}

const startEdit = (comment: Comment) => {
  editingCommentId.value = comment.id
  editingCommentText.value = comment.text
}

const cancelEdit = () => {
  editingCommentId.value = null
  editingCommentText.value = ''
}

const saveEdit = () => {
  if (editingCommentId.value && editingCommentText.value.trim()) {
    emit('updateComment', editingCommentId.value, editingCommentText.value.trim())
    editingCommentId.value = null
    editingCommentText.value = ''
  }
}

const handleDelete = (id: string) => {
  if (confirm('Are you sure you want to delete this comment?')) {
    emit('deleteComment', id)
  }
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="emit('close')">
    <div class="modal-dialog" @click.stop>
      <div class="modal-header">
        <h2>
          <span class="emoji">{{ characteristicEmoji }}</span>
          {{ characteristicName }} - Discussion Notes
        </h2>
        <button class="close-button" @click="emit('close')">×</button>
      </div>

      <div class="modal-content">
        <!-- Add New Comment -->
        <div class="add-comment-section">
          <h3>Add a Comment</h3>
          <textarea
            v-model="newCommentText"
            placeholder="Enter your discussion notes here..."
            rows="4"
            @keyup.ctrl.enter="handleAddComment"
          />
          <button class="add-comment-button" @click="handleAddComment">
            Add Comment
          </button>
        </div>

        <!-- Comments List -->
        <div class="comments-section">
          <h3>Comments ({{ comments.length }})</h3>
          
          <div v-if="comments.length === 0" class="no-comments">
            No comments yet. Add your first discussion note above.
          </div>

          <div v-else class="comments-list">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="comment-item"
            >
              <div v-if="editingCommentId === comment.id" class="edit-mode">
                <textarea
                  v-model="editingCommentText"
                  rows="3"
                  @keyup.ctrl.enter="saveEdit"
                />
                <div class="edit-actions">
                  <button class="save-button" @click="saveEdit">Save</button>
                  <button class="cancel-button" @click="cancelEdit">Cancel</button>
                </div>
              </div>

              <div v-else class="view-mode">
                <div class="comment-header">
                  <div class="comment-actions">
                    <button class="edit-icon-button" @click="startEdit(comment)" title="Edit">
                      ✏️
                    </button>
                    <button class="delete-icon-button" @click="handleDelete(comment.id)" title="Delete">
                      🗑️
                    </button>
                  </div>
                </div>
                <p class="comment-text">{{ comment.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="close-footer-button" @click="emit('close')">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-dialog {
  background: white;
  border-radius: 0.75rem;
  max-width: 800px;
  width: 95%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  gap: 1rem;
  flex-shrink: 0;
}

.modal-header h2 {
  margin: 0;
  color: #000000;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal-header .emoji {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  transition: background-color 0.2s, color 0.2s;
  flex-shrink: 0;
}

.close-button:hover {
  background-color: #f3f4f6;
  color: #000000;
}

.modal-content {
  padding: 1.25rem 1.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
}

.add-comment-section {
  margin-bottom: 2rem;
}

.add-comment-section h3 {
  color: #000000;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
}

.add-comment-section textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
  margin-bottom: 0.75rem;
}

.add-comment-section textarea:focus {
  outline: none;
  border-color: #8b5cf6;
}

.add-comment-button {
  padding: 0.625rem 1.5rem;
  background-color: #8b5cf6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-comment-button:hover {
  background-color: #7c3aed;
}

.comments-section h3 {
  color: #000000;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.no-comments {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-style: italic;
  background-color: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-item {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
}

.comment-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-icon-button,
.delete-icon-button {
  background: none;
  border: none;
  font-size: 1.125rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.edit-icon-button:hover {
  background-color: #e5e7eb;
}

.delete-icon-button:hover {
  background-color: #fee2e2;
}

.comment-text {
  color: #000000;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.edit-mode textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #8b5cf6;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 0.5rem;
}

.edit-mode textarea:focus {
  outline: none;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.save-button,
.cancel-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button {
  background-color: #16a34a;
  color: white;
}

.save-button:hover {
  background-color: #15803d;
}

.cancel-button {
  background-color: #e5e7eb;
  color: #374151;
}

.cancel-button:hover {
  background-color: #d1d5db;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
  background-color: #f9fafb;
}

.close-footer-button {
  padding: 0.625rem 1.5rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-footer-button:hover {
  background-color: #4b5563;
}
</style>

