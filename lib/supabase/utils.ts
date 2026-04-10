import { createClient } from './client'

// Helper functions
export const uploadImage = async (file: File, bucket: string = 'products') => {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  let { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file)

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return data.publicUrl
}

export const deleteImage = async (url: string, bucket: string = 'products') => {
  const supabase = createClient()
  const fileName = url.split('/').pop()
  if (!fileName) return

  const { error } = await supabase.storage.from(bucket).remove([fileName])

  if (error) {
    throw error
  }
}
