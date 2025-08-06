import { createClient } from './utils/supabase/client'
import { Resource, Tag } from './utils/supabase/tables'

export async function getTags(userId?: string, types?: string[]): Promise<Tag[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('tags')
    .select('*')
    .order('name')
  
  if (types && types.length > 0) {
    query = query.in('type', types)
  }
  
  if (userId) {
    // For user-created tags, filter by user_id, for system tags, user_id should be null
    query = query.or(`user_id.eq.${userId},user_id.is.null`)
  }
  
  const { data: tags, error } = await query
  
  if (error) {
    console.error('Error fetching tags:', error)
    return []
  }
  
  return tags || []
}

export async function getUserTags(userId: string): Promise<Tag[]> {
  const supabase = createClient()
  
  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .eq('type', 'user_created')
    .eq('user_id', userId)
    .order('name')
  
  if (error) {
    console.error('Error fetching user tags:', error)
    return []
  }
  
  return tags || []
}

export async function createResourceWithTags(userId: string, resourceData: Partial<Resource>, tagIds: string[]) {
  const supabase = createClient()
  
  // Map tag IDs to the tag_1_id through tag_5_id fields
  const tagFields: Record<string, string | undefined> = {}
  tagIds.forEach((tagId, index) => {
    if (index < 5) { // Max 5 tags
      tagFields[`tag_${index + 1}_id`] = tagId
    }
  })
  
  const { data: resource, error } = await supabase
    .from('resources')
    .insert([{ 
      ...resourceData, 
      user_id: userId,
      ...tagFields
    }])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating resource with tags:', error)
    throw error
  }
  
  return resource
}

export async function updateResourceWithTags(resourceId: string, resourceData: Partial<Resource>, tagIds: string[]) {
  const supabase = createClient()
  
  // Map tag IDs to the tag_1_id through tag_5_id fields
  const tagFields: Record<string, string | null> = {
    tag_1_id: null,
    tag_2_id: null,
    tag_3_id: null,
    tag_4_id: null,
    tag_5_id: null
  }
  
  tagIds.forEach((tagId, index) => {
    if (index < 5) { // Max 5 tags
      tagFields[`tag_${index + 1}_id`] = tagId
    }
  })
  
  const { data: resource, error } = await supabase
    .from('resources')
    .update({ 
      ...resourceData, 
      ...tagFields,
      updated_at: new Date() 
    })
    .eq('id', resourceId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating resource with tags:', error)
    throw error
  }
  
  return resource
}