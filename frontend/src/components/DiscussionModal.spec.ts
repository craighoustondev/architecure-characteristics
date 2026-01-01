import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DiscussionModal from './DiscussionModal.vue'
import type { Comment } from '../types'

describe('DiscussionModal', () => {
  const mockProps = {
    show: true,
    characteristicName: 'Scalability',
    characteristicEmoji: '📈',
    comments: [] as Comment[]
  }

  describe('Rendering', () => {
    it('should render when show is true', () => {
      const wrapper = mount(DiscussionModal, {
        props: mockProps
      })
      
      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    })

    it('should not render when show is false', () => {
      const wrapper = mount(DiscussionModal, {
        props: { ...mockProps, show: false }
      })
      
      expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })

    it('should display characteristic name and emoji in header', () => {
      const wrapper = mount(DiscussionModal, {
        props: mockProps
      })
      
      const header = wrapper.find('.modal-header h2')
      expect(header.text()).toContain('📈')
      expect(header.text()).toContain('Scalability')
    })

    it('should show "no comments" message when comments array is empty', () => {
      const wrapper = mount(DiscussionModal, {
        props: mockProps
      })
      
      expect(wrapper.find('.no-comments').exists()).toBe(true)
      expect(wrapper.find('.no-comments').text()).toContain('No comments yet')
    })

    it('should display comments when they exist', () => {
      const comments: Comment[] = [
        { id: '1', text: 'First comment' },
        { id: '2', text: 'Second comment' }
      ]
      
      const wrapper = mount(DiscussionModal, {
        props: { ...mockProps, comments }
      })
      
      expect(wrapper.findAll('.comment-item')).toHaveLength(2)
      expect(wrapper.find('.no-comments').exists()).toBe(false)
    })

    it('should display comment count in header', () => {
      const comments: Comment[] = [
        { id: '1', text: 'First comment' },
        { id: '2', text: 'Second comment' },
        { id: '3', text: 'Third comment' }
      ]
      
      const wrapper = mount(DiscussionModal, {
        props: { ...mockProps, comments }
      })
      
      expect(wrapper.find('.comments-section h3').text()).toContain('Comments (3)')
    })
  })

  describe('Adding comments', () => {
    it('should emit addComment when add button is clicked with text', async () => {
      const wrapper = mount(DiscussionModal, {
        props: mockProps
      })
      
      const textarea = wrapper.find('.add-comment-section textarea')
      await textarea.setValue('New comment text')
      
      await wrapper.find('.add-comment-button').trigger('click')
      
      expect(wrapper.emitted()).toHaveProperty('addComment')
      expect(wrapper.emitted('addComment')?.[0]).toEqual(['New comment text'])
    })

    it('should not emit addComment when text is empty', async () => {
      const wrapper = mount(DiscussionModal, {
        props: mockProps
      })
      
      await wrapper.find('.add-comment-button').trigger('click')
      
      expect(wrapper.emitted('addComment')).toBeUndefined()
    })

    it('should trim whitespace from comment text', async () => {
      const wrapper = mount(DiscussionModal, {
        props: mockProps
      })
      
      const textarea = wrapper.find('.add-comment-section textarea')
      await textarea.setValue('  Comment with spaces  ')
      
      await wrapper.find('.add-comment-button').trigger('click')
      
      expect(wrapper.emitted('addComment')?.[0]).toEqual(['Comment with spaces'])
    })

    it('should clear input after adding comment', async () => {
      const wrapper = mount(DiscussionModal, {
        props: mockProps
      })
      
      const textarea = wrapper.find('.add-comment-section textarea')
      await textarea.setValue('New comment')
      await wrapper.find('.add-comment-button').trigger('click')
      
      expect((textarea.element as HTMLTextAreaElement).value).toBe('')
    })
  })

  describe('Editing comments', () => {
    const comments: Comment[] = [
      { id: '1', text: 'Original comment' }
    ]

    it('should show edit mode when edit button is clicked', async () => {
      const wrapper = mount(DiscussionModal, {
        props: { ...mockProps, comments }
      })
      
      await wrapper.find('.edit-icon-button').trigger('click')
      
      expect(wrapper.find('.edit-mode').exists()).toBe(true)
      expect(wrapper.find('.view-mode').exists()).toBe(false)
    })

    it('should populate textarea with current comment text in edit mode', async () => {
      const wrapper = mount(DiscussionModal, {
        props: { ...mockProps, comments }
      })
      
      await wrapper.find('.edit-icon-button').trigger('click')
      
      const editTextarea = wrapper.find('.edit-mode textarea')
      expect((editTextarea.element as HTMLTextAreaElement).value).toBe('Original comment')
    })

    it('should emit updateComment when save button is clicked', async () => {
      const wrapper = mount(DiscussionModal, {
        props: { ...mockProps, comments }
      })
      
      await wrapper.find('.edit-icon-button').trigger('click')
      
      const editTextarea = wrapper.find('.edit-mode textarea')
      await editTextarea.setValue('Updated comment')
      
      await wrapper.find('.save-button').trigger('click')
      
      expect(wrapper.emitted()).toHaveProperty('updateComment')
      expect(wrapper.emitted('updateComment')?.[0]).toEqual(['1', 'Updated comment'])
    })

    it('should cancel edit mode when cancel button is clicked', async () => {
      const wrapper = mount(DiscussionModal, {
        props: { ...mockProps, comments }
      })
      
      await wrapper.find('.edit-icon-button').trigger('click')
      expect(wrapper.find('.edit-mode').exists()).toBe(true)
      
      await wrapper.find('.cancel-button').trigger('click')
      
      expect(wrapper.find('.edit-mode').exists()).toBe(false)
      expect(wrapper.find('.view-mode').exists()).toBe(true)
    })
  })

  describe('Deleting comments', () => {
    const comments: Comment[] = [
      { id: '1', text: 'Comment to delete' }
    ]

    it('should emit deleteComment when delete is confirmed', async () => {
      // Mock window.confirm to return true
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      
      const wrapper = mount(DiscussionModal, {
        props: { ...mockProps, comments }
      })
      
      await wrapper.find('.delete-icon-button').trigger('click')
      
      expect(confirmSpy).toHaveBeenCalled()
      expect(wrapper.emitted()).toHaveProperty('deleteComment')
      expect(wrapper.emitted('deleteComment')?.[0]).toEqual(['1'])
      
      confirmSpy.mockRestore()
    })

    it('should not emit deleteComment when delete is cancelled', async () => {
      // Mock window.confirm to return false
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      
      const wrapper = mount(DiscussionModal, {
        props: { ...mockProps, comments }
      })
      
      await wrapper.find('.delete-icon-button').trigger('click')
      
      expect(confirmSpy).toHaveBeenCalled()
      expect(wrapper.emitted('deleteComment')).toBeUndefined()
      
      confirmSpy.mockRestore()
    })
  })

  describe('Closing modal', () => {
    it('should emit close when close button is clicked', async () => {
      const wrapper = mount(DiscussionModal, {
        props: mockProps
      })
      
      await wrapper.find('.close-button').trigger('click')
      
      expect(wrapper.emitted()).toHaveProperty('close')
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('should emit close when footer close button is clicked', async () => {
      const wrapper = mount(DiscussionModal, {
        props: mockProps
      })
      
      await wrapper.find('.close-footer-button').trigger('click')
      
      expect(wrapper.emitted()).toHaveProperty('close')
    })

    it('should emit close when overlay is clicked', async () => {
      const wrapper = mount(DiscussionModal, {
        props: mockProps
      })
      
      await wrapper.find('.modal-overlay').trigger('click')
      
      expect(wrapper.emitted()).toHaveProperty('close')
    })

    it('should not emit close when modal dialog is clicked', async () => {
      const wrapper = mount(DiscussionModal, {
        props: mockProps
      })
      
      await wrapper.find('.modal-dialog').trigger('click')
      
      expect(wrapper.emitted('close')).toBeUndefined()
    })
  })

  describe('Comment formatting', () => {
    it('should preserve line breaks in comment text', () => {
      const comments: Comment[] = [
        { id: '1', text: 'Line 1\nLine 2\nLine 3' }
      ]
      
      const wrapper = mount(DiscussionModal, {
        props: { ...mockProps, comments }
      })
      
      const commentText = wrapper.find('.comment-text')
      expect(commentText.text()).toContain('Line 1')
      expect(commentText.text()).toContain('Line 2')
      expect(commentText.text()).toContain('Line 3')
    })
  })
})

