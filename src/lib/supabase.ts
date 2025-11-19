import { createClient } from '@supabase/supabase-js'

// URL y Key pública de Supabase
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://jgengsvprincryzpqndd.supabase.co'
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnZW5nc3ZwcmluY3J5enBxbmRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTMyMjgsImV4cCI6MjA3ODg4OTIyOH0.plWG2-Z8kj2IUrRNTiauSpCxi9-FlUOHsT1Aig-A0rY'

// Crear cliente de Supabase para SSR/SSG (sin persistencia de sesión)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Tipos de la base de datos
export interface Database {
  public: {
    Tables: {
      services: {
        Row: Service
      }
      testimonials: {
        Row: Testimonial
      }
      site_content: {
        Row: SiteContent
      }
    }
  }
}

export interface Service {
  id: string
  title: string
  slug: string
  description: string
  detailed_description: string | null
  image: string
  gallery_images: string[] | null
  cta_text: string
  cta_link: string | null
  features: string[] | null
  pricing: {
    base?: number
    currency?: string
    packages?: Array<{ name: string; price: number }>
  } | null
  is_active: boolean
  order: number
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  client_name: string
  text: string
  rating: number
  image: string | null
  position: string | null
  is_visible: boolean
  order: number
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  service_type: string
  event_date: string | null
  message: string
  how_found_us: string | null
  status: 'pending' | 'read' | 'responded' | 'archived'
  responded_at: string | null
  response: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface SiteContent {
  id: string
  key: string
  value: string
  type: string
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface ImageCategory {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface PortfolioImage {
  id: string
  image_url: string
  thumbnail_url: string | null
  title: string | null
  alt: string | null
  category_id: string | null
  category?: ImageCategory | null
  is_featured: boolean
  featured_order: number | null
  order: number
  is_visible: boolean
  link_url: string | null
  service_id: string | null
  created_at: string
  updated_at: string
}
