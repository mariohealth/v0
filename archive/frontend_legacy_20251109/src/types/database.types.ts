export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            providers: {
                Row: {
                    id: string
                    name: string
                    specialty: string | null
                    address: string | null
                    city: string | null
                    state: string | null
                    zip_code: string | null
                    phone: string | null
                    website: string | null
                    rating: number | null
                    review_count: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    specialty?: string | null
                    address?: string | null
                    city?: string | null
                    state?: string | null
                    zip_code?: string | null
                    phone?: string | null
                    website?: string | null
                    rating?: number | null
                    review_count?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    specialty?: string | null
                    address?: string | null
                    city?: string | null
                    state?: string | null
                    zip_code?: string | null
                    phone?: string | null
                    website?: string | null
                    rating?: number | null
                    review_count?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            procedures: {
                Row: {
                    id: string
                    name: string
                    category: string | null
                    family: string | null
                    description: string | null
                    cpt_code: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    category?: string | null
                    family?: string | null
                    description?: string | null
                    cpt_code?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    category?: string | null
                    family?: string | null
                    description?: string | null
                    cpt_code?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            doctors: {
                Row: {
                    id: string
                    provider_id: string | null
                    first_name: string
                    last_name: string
                    specialty: string | null
                    credentials: string | null
                    bio: string | null
                    image_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    provider_id?: string | null
                    first_name: string
                    last_name: string
                    specialty?: string | null
                    credentials?: string | null
                    bio?: string | null
                    image_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    provider_id?: string | null
                    first_name?: string
                    last_name?: string
                    specialty?: string | null
                    credentials?: string | null
                    bio?: string | null
                    image_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            test_locations: {
                Row: {
                    id: string
                    provider_id: string | null
                    name: string
                    address: string | null
                    city: string | null
                    state: string | null
                    zip_code: string | null
                    phone: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    provider_id?: string | null
                    name: string
                    address?: string | null
                    city?: string | null
                    state?: string | null
                    zip_code?: string | null
                    phone?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    provider_id?: string | null
                    name?: string
                    address?: string | null
                    city?: string | null
                    state?: string | null
                    zip_code?: string | null
                    phone?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// Convenience types
export type Provider = Database['public']['Tables']['providers']['Row']
export type Procedure = Database['public']['Tables']['procedures']['Row']
export type Doctor = Database['public']['Tables']['doctors']['Row']
export type TestLocation = Database['public']['Tables']['test_locations']['Row']

export type ProviderInsert = Database['public']['Tables']['providers']['Insert']
export type ProcedureInsert = Database['public']['Tables']['procedures']['Insert']
export type DoctorInsert = Database['public']['Tables']['doctors']['Insert']
export type TestLocationInsert = Database['public']['Tables']['test_locations']['Insert']

export type ProviderUpdate = Database['public']['Tables']['providers']['Update']
export type ProcedureUpdate = Database['public']['Tables']['procedures']['Update']
export type DoctorUpdate = Database['public']['Tables']['doctors']['Update']
export type TestLocationUpdate = Database['public']['Tables']['test_locations']['Update']

// Search result type
export interface SearchResult {
    id: string
    type: 'provider' | 'procedure' | 'doctor'
    name: string
    subtitle?: string
    description?: string
    image_url?: string
    rating?: number
    price?: number
}

