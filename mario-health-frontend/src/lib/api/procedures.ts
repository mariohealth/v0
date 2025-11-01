import { createClient } from '@/lib/supabase/server'
import type { Procedure as ProcedureType } from '@/types/database.types'

export interface ProcedureFilters {
    category?: string
    family?: string
}

export interface ProcedureSearchResult {
    procedures: ProcedureType[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

/**
 * Search for procedures by query string with optional filters
 * @param query - Search query string
 * @param filters - Optional filters for category, family, etc.
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of results per page
 * @returns Paginated list of procedures matching the search criteria
 */
export async function searchProcedures(
    query: string,
    filters: ProcedureFilters = {},
    page: number = 1,
    pageSize: number = 20
): Promise<ProcedureSearchResult> {
    try {
        const supabase = await createClient()
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        let queryBuilder = supabase
            .from('procedures')
            .select('*', { count: 'exact' })

        // Apply text search
        if (query) {
            queryBuilder = queryBuilder.or(
                `name.ilike.%${query}%,description.ilike.%${query}%,cpt_code.ilike.%${query}%`
            )
        }

        // Apply filters
        if (filters.category) {
            queryBuilder = queryBuilder.eq('category', filters.category)
        }

        if (filters.family) {
            queryBuilder = queryBuilder.eq('family', filters.family)
        }

        // Apply pagination
        queryBuilder = queryBuilder.range(from, to).order('name', { ascending: true })

        const { data, error, count } = await queryBuilder

        if (error) {
            console.error('Error searching procedures:', error)
            throw error
        }

        return {
            procedures: (data as ProcedureType[]) || [],
            total: count || 0,
            page,
            pageSize,
            totalPages: Math.ceil((count || 0) / pageSize),
        }
    } catch (error) {
        console.error('Error in searchProcedures:', error)
        return {
            procedures: [],
            total: 0,
            page,
            pageSize,
            totalPages: 0,
        }
    }
}

/**
 * Get a single procedure by ID
 * @param id - Procedure ID
 * @returns Procedure details, or null if not found
 */
export async function getProcedureById(id: string): Promise<ProcedureType | null> {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('procedures')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !data) {
            console.error('Error fetching procedure:', error)
            return null
        }

        return data as ProcedureType
    } catch (error) {
        console.error('Error in getProcedureById:', error)
        return null
    }
}

/**
 * Get providers that offer a specific procedure
 * @param procedureId - Procedure ID
 * @returns List of providers offering the procedure
 */
export async function getProvidersByProcedure(procedureId: string) {
    try {
        const supabase = await createClient()

        // This would join through a junction table in a real database
        // For now, we'll return all providers (this is a placeholder)
        const { data, error } = await supabase
            .from('providers')
            .select('*')
            .limit(20)

        if (error) {
            console.error('Error fetching providers by procedure:', error)
            return []
        }

        return data || []
    } catch (error) {
        console.error('Error in getProvidersByProcedure:', error)
        return []
    }
}

