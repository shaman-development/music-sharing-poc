import type { Database } from '@/plugins/supabase.types'

export type RequiredProperties<Type> = {
  [Key in keyof Type]-?: RequiredProperties<NonNullable<Type[Key]>>
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Follow = RequiredProperties<Database['public']['Views']['detailed_follows']['Row']>
export type Post = RequiredProperties<Database['public']['Views']['detailed_posts']['Row']>
