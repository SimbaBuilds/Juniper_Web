'use client'

import { useState, useEffect } from 'react'
import { ResourceType, RESOURCE_TYPES, MAX_CONTENT_LENGTH, MAX_INSTRUCTIONS_LENGTH } from '@/app/lib/repository/types'
import { Resource, Tag } from '@/lib/utils/supabase/tables'
import { EnhancedTagSelector } from './enhanced-tag-selector-portal'
import { createClient } from '@/lib/utils/supabase/client'

interface ResourceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (resource: Partial<Resource>, tagIds: string[]) => void
  resource?: Resource | null
  mode: 'add' | 'edit'
}


export function ResourceModal({ isOpen, onClose, onSave, resource, mode }: ResourceModalProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    instructions: '',
    type: 'memory' as ResourceType,
    tags: [] as Tag[]
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      if (user && !error) {
        setUserId(user.id)
      }
    }
    getCurrentUser()
  }, [])

  // Load existing resource tags when editing
  useEffect(() => {
    const loadResourceTags = async () => {
      if (resource && mode === 'edit' && userId) {
        const supabase = createClient()
        
        // Get the tag IDs from the resource
        const tagIds = [
          resource.tag_1_id,
          resource.tag_2_id, 
          resource.tag_3_id,
          resource.tag_4_id,
          resource.tag_5_id
        ].filter(Boolean)
        
        if (tagIds.length > 0) {
          const { data: tags } = await supabase
            .from('tags')
            .select('*')
            .in('id', tagIds)
          
          if (tags) {
            setFormData(prev => ({ ...prev, tags }))
          }
        }
      }
    }
    loadResourceTags()
  }, [resource, mode, userId])

  useEffect(() => {
    if (resource && mode === 'edit') {
      setFormData(prev => ({
        ...prev,
        title: resource.title || '',
        content: resource.content,
        instructions: resource.instructions || '',
        type: resource.type as ResourceType
      }))
    } else {
      setFormData({
        title: '',
        content: '',
        instructions: '',
        type: 'memory',
        tags: []
      })
    }
    setErrors({})
  }, [resource, mode, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }
    
    if (formData.content.length > MAX_CONTENT_LENGTH) {
      newErrors.content = `Content must be ${MAX_CONTENT_LENGTH} characters or less`
    }
    
    if (formData.instructions.length > MAX_INSTRUCTIONS_LENGTH) {
      newErrors.instructions = `Instructions must be ${MAX_INSTRUCTIONS_LENGTH} characters or less`
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const resourceData: Partial<Resource> = {
      title: formData.title,
      content: formData.content,
      instructions: formData.instructions || undefined,
      type: formData.type,
      ...(mode === 'edit' && resource ? { id: resource.id } : {}),
      relevance_score: resource?.relevance_score || 100,
      decay_factor: resource?.decay_factor || 0.8,
      auto_committed: resource?.auto_committed || false,
      last_accessed: new Date(),
      updated_at: new Date(),
      ...(mode === 'add' ? { created_at: new Date() } : {})
    }

    const tagIds = formData.tags.map(tag => tag.id)
    onSave(resourceData, tagIds)
    onClose()
  }

  const handleTagsChange = (tags: Tag[]) => {
    setFormData(prev => ({ ...prev, tags }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
          <h2 className="text-2xl font-semibold text-foreground">
            {mode === 'add' ? 'Add Resource' : 'Edit Resource'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} id="resource-form" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter resource title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ResourceType }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {RESOURCE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Content * ({formData.content.length}/{MAX_CONTENT_LENGTH})
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
                placeholder="Enter resource content"
              />
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Instructions ({formData.instructions.length}/{MAX_INSTRUCTIONS_LENGTH})
              </label>
              <input
                type="text"
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Usage instructions (optional)"
              />
              {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>}
            </div>

            {userId && (
              <EnhancedTagSelector
                selectedTags={formData.tags}
                userId={userId}
                onTagsChange={handleTagsChange}
                maxTags={4}
              />
            )}

          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border flex justify-end space-x-4 flex-shrink-0 bg-background">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="resource-form"
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {mode === 'add' ? 'Add Resource' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}