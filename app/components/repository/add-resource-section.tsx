'use client'

import { useState, useEffect } from 'react'
import { ResourceType, RESOURCE_TYPES, MAX_CONTENT_LENGTH, MAX_INSTRUCTIONS_LENGTH } from '@/app/lib/repository/types'
import { Resource, Tag } from '@/lib/utils/supabase/tables'
import { EnhancedTagSelector } from './enhanced-tag-selector'
import { createClient } from '@/lib/utils/supabase/client'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'

interface AddResourceSectionProps {
  onSave: (resource: Partial<Resource>, tagIds: string[]) => void
}

export function AddResourceSection({ onSave }: AddResourceSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
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
      relevance_score: 100,
      decay_factor: 0.8,
      auto_committed: false,
      last_accessed: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }

    const tagIds = formData.tags.map(tag => tag.id)
    onSave(resourceData, tagIds)
    
    // Reset form
    setFormData({
      title: '',
      content: '',
      instructions: '',
      type: 'memory',
      tags: []
    })
    setErrors({})
    setIsExpanded(false)
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      content: '',
      instructions: '',
      type: 'memory',
      tags: []
    })
    setErrors({})
    setIsExpanded(false)
  }

  const handleTagsChange = (tags: Tag[]) => {
    setFormData(prev => ({ ...prev, tags }))
  }

  return (
    <div className="bg-card rounded-lg border border-border">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          <span className="text-lg font-medium text-foreground">Add New Resource</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Content * ({formData.content.length}/{MAX_CONTENT_LENGTH})
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
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

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Add Resource
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}