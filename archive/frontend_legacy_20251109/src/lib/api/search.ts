import { createClient } from '@/lib/supabase/server'
import type { SearchResult } from '@/types/database.types'
import { searchProviders } from './providers'
import { searchProcedures } from './procedures'

export interface UniversalSearchOptions {
    limit?: number
    filters?: {
        specialty?: string
        category?: string
        city?: string
        state?: string
    }
}

/**
 * Universal search across providers, procedures, and doctors
 * @param query - Search query string
 * @param options - Search options including limit and filters
 * @returns Combined search results from providers, procedures, and doctors
 */
export async function universalSearch(
    query: string,
    options: UniversalSearchOptions = {}
): Promise<SearchResult[]> {
    try {
        const limit = options.limit || 10
        const results: SearchResult[] = []

        // Search providers
        const providerResults = await searchProviders(query, {
            specialty: options.filters?.specialty,
            city: options.filters?.city,
            state: options.filters?.state,
        }, 1, Math.ceil(limit / 3))

        providerResults.providers.forEach((provider) => {
            results.push({
                id: provider.id,
                type: 'provider',
                name: provider.name,
                subtitle: provider.specialty || undefined,
                description: provider.address ? `${provider.address}, ${provider.city || ''}, ${provider.state || ''}` : undefined,
                rating: provider.rating || undefined,
            })
        })

        // Search procedures
        const procedureResults = await searchProcedures(query, {
            category: options.filters?.category,
        }, 1, Math.ceil(limit / 3))

        procedureResults.procedures.forEach((procedure) => {
            results.push({
                id: procedure.id,
                type: 'procedure',
                name: procedure.name,
                subtitle: procedure.category || undefined,
                description: procedure.description || undefined,
            })
        })

        // Search doctors
        const supabase = await createClient()
        const { data: doctors, error: doctorsError } = await supabase
            .from('doctors')
            .select('*, providers(*)')
            .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,specialty.ilike.%${query}%`)
            .limit(Math.ceil(limit / 3))

        if (!doctorsError && doctors) {
            doctors.forEach((doctor: any) => {
                results.push({
                    id: doctor.id,
                    type: 'doctor',
                    name: `${doctor.first_name} ${doctor.last_name}`,
                    subtitle: doctor.specialty || undefined,
                    description: doctor.bio || undefined,
                    image_url: doctor.image_url || undefined,
                })
            })
        }

        // Sort by relevance (provider > procedure > doctor for now)
        results.sort((a, b) => {
            const typeOrder = { provider: 0, procedure: 1, doctor: 2 }
            return (typeOrder[a.type] || 0) - (typeOrder[b.type] || 0)
        })

        return results.slice(0, limit)
    } catch (error) {
        console.error('Error in universalSearch:', error)
        return []
    }
}

/**
 * Get search suggestions/autocomplete results
 * @param query - Partial search query
 * @param limit - Maximum number of suggestions
 * @returns List of search suggestions
 */
export async function getSearchSuggestions(query: string, limit: number = 5): Promise<SearchResult[]> {
    if (!query || query.length < 2) {
        return []
    }

    try {
        const supabase = await createClient()
        const results: SearchResult[] = []

        // Get provider suggestions
        const { data: providers } = await supabase
            .from('providers')
            .select('id, name, specialty')
            .ilike('name', `%${query}%`)
            .limit(limit)

        if (providers) {
            providers.forEach((provider) => {
                results.push({
                    id: provider.id,
                    type: 'provider',
                    name: provider.name,
                    subtitle: provider.specialty || undefined,
                })
            })
        }

        // Get procedure suggestions
        const { data: procedures } = await supabase
            .from('procedures')
            .select('id, name, category')
            .ilike('name', `%${query}%`)
            .limit(limit)

        if (procedures) {
            procedures.forEach((procedure) => {
                results.push({
                    id: procedure.id,
                    type: 'procedure',
                    name: procedure.name,
                    subtitle: procedure.category || undefined,
                })
            })
        }

        return results.slice(0, limit)
    } catch (error) {
        console.error('Error in getSearchSuggestions:', error)
        return []
    }
}

