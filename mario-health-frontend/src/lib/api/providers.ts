import { createClient } from '@/lib/supabase/server'
import type { Provider, Doctor, TestLocation } from '@/types/database.types'

export interface ProviderFilters {
    specialty?: string
    city?: string
    state?: string
    minRating?: number
    inNetwork?: boolean
}

export interface ProviderSearchResult {
    provider: Provider
    doctors?: Doctor[]
    locations?: TestLocation[]
    rating?: number
    reviewCount?: number
}

/**
 * Search for providers by query string with optional filters
 * @param query - Search query string
 * @param filters - Optional filters for specialty, location, rating, etc.
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of results per page
 * @returns Paginated list of providers matching the search criteria
 */
export async function searchProviders(
    query: string,
    filters: ProviderFilters = {},
    page: number = 1,
    pageSize: number = 20
) {
    try {
        const supabase = await createClient()
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        let queryBuilder = supabase
            .from('providers')
            .select('*', { count: 'exact' })

        // Apply text search
        if (query) {
            queryBuilder = queryBuilder.or(
                `name.ilike.%${query}%,specialty.ilike.%${query}%,city.ilike.%${query}%`
            )
        }

        // Apply filters
        if (filters.specialty) {
            queryBuilder = queryBuilder.eq('specialty', filters.specialty)
        }

        if (filters.city) {
            queryBuilder = queryBuilder.eq('city', filters.city)
        }

        if (filters.state) {
            queryBuilder = queryBuilder.eq('state', filters.state)
        }

        if (filters.minRating) {
            queryBuilder = queryBuilder.gte('rating', filters.minRating)
        }

        // Apply pagination
        queryBuilder = queryBuilder.range(from, to).order('rating', { ascending: false, nullsLast: true })

        const { data, error, count } = await queryBuilder

        if (error) {
            console.error('Error searching providers:', error)
            throw error
        }

        return {
            providers: (data as Provider[]) || [],
            total: count || 0,
            page,
            pageSize,
            totalPages: Math.ceil((count || 0) / pageSize),
        }
    } catch (error) {
        console.error('Error in searchProviders:', error)
        return {
            providers: [],
            total: 0,
            page,
            pageSize,
            totalPages: 0,
        }
    }
}

/**
 * Get a single provider by ID with related doctors and locations
 * @param id - Provider ID
 * @returns Provider details with doctors and locations, or null if not found
 */
export async function getProviderById(id: string): Promise<ProviderSearchResult | null> {
    try {
        const supabase = await createClient()

        // Fetch provider
        const { data: provider, error: providerError } = await supabase
            .from('providers')
            .select('*')
            .eq('id', id)
            .single()

        if (providerError || !provider) {
            console.error('Error fetching provider:', providerError)
            return null
        }

        // Fetch related doctors
        const { data: doctors, error: doctorsError } = await supabase
            .from('doctors')
            .select('*')
            .eq('provider_id', id)

        if (doctorsError) {
            console.error('Error fetching doctors:', doctorsError)
        }

        // Fetch related test locations
        const { data: locations, error: locationsError } = await supabase
            .from('test_locations')
            .select('*')
            .eq('provider_id', id)

        if (locationsError) {
            console.error('Error fetching locations:', locationsError)
        }

        return {
            provider: provider as Provider,
            doctors: (doctors as Doctor[]) || [],
            locations: (locations as TestLocation[]) || [],
            rating: provider.rating || undefined,
            reviewCount: provider.review_count || undefined,
        }
    } catch (error) {
        console.error('Error in getProviderById:', error)
        return null
    }
}

/**
 * Get procedures available at a specific provider
 * @param providerId - Provider ID
 * @returns List of procedures available at the provider
 */
export async function getProviderProcedures(providerId: string) {
    try {
        const supabase = await createClient()

        // This would join through a junction table in a real database
        // For now, we'll return procedures that might be available
        const { data, error } = await supabase
            .from('procedures')
            .select('*')
            .limit(50)

        if (error) {
            console.error('Error fetching provider procedures:', error)
            return []
        }

        return data || []
    } catch (error) {
        console.error('Error in getProviderProcedures:', error)
        return []
    }
}

