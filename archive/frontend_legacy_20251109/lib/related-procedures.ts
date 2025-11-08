/**
 * Related Procedures Algorithm
 * 
 * Determines related procedures based on:
 * - Category similarity
 * - Family similarity
 * - Search co-occurrence (if we had analytics)
 */

import type { SearchResult } from '@/lib/backend-api';

interface RelatedProcedure {
    id: string;
    slug: string;
    name: string;
    category: string;
    family: string;
    score: number;
}

/**
 * Find related procedures based on current search results
 * Uses category and family matching
 */
export function findRelatedProcedures(
    currentQuery: string,
    currentResults: SearchResult[],
    allResults: SearchResult[],
    limit: number = 5
): RelatedProcedure[] {
    if (currentResults.length === 0 || allResults.length === 0) {
        return [];
    }

    // Extract categories and families from current results
    const currentCategories = new Set(
        currentResults.map(r => r.categorySlug)
    );
    const currentFamilies = new Set(
        currentResults.map(r => r.familySlug)
    );
    const currentProcedureIds = new Set(
        currentResults.map(r => r.procedureId)
    );

    // Score related procedures
    const scored: Map<string, RelatedProcedure> = new Map();

    for (const result of allResults) {
        // Skip if already in current results
        if (currentProcedureIds.has(result.procedureId)) {
            continue;
        }

        const id = result.procedureId;
        let score = 0;

        // Category match (high weight)
        if (currentCategories.has(result.categorySlug)) {
            score += 3;
        }

        // Family match (very high weight)
        if (currentFamilies.has(result.familySlug)) {
            score += 5;
        }

        // Name similarity (lower weight)
        const nameSimilarity = calculateNameSimilarity(
            currentQuery.toLowerCase(),
            result.procedureName.toLowerCase()
        );
        score += nameSimilarity * 2;

        // Only include if has some relevance
        if (score > 0) {
            if (!scored.has(id) || scored.get(id)!.score < score) {
                scored.set(id, {
                    id: result.procedureId,
                    slug: result.procedureSlug,
                    name: result.procedureName,
                    category: result.categoryName,
                    family: result.familyName,
                    score,
                });
            }
        }
    }

    // Sort by score and return top results
    return Array.from(scored.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

/**
 * Calculate similarity between query and procedure name
 * Simple word overlap scoring
 */
function calculateNameSimilarity(query: string, name: string): number {
    const queryWords = query.split(/\s+/).filter(w => w.length > 2);
    const nameWords = name.split(/\s+/).filter(w => w.length > 2);

    if (queryWords.length === 0 || nameWords.length === 0) {
        return 0;
    }

    let matches = 0;
    for (const qWord of queryWords) {
        for (const nWord of nameWords) {
            if (nWord.includes(qWord) || qWord.includes(nWord)) {
                matches++;
                break;
            }
        }
    }

    return matches / Math.max(queryWords.length, nameWords.length);
}

/**
 * Get related procedures from same category
 * Simple fallback when full search results aren't available
 */
export function getRelatedByCategory(
    categorySlug: string,
    excludeIds: string[],
    procedures: SearchResult[],
    limit: number = 5
): RelatedProcedure[] {
    return procedures
        .filter(p =>
            p.categorySlug === categorySlug &&
            !excludeIds.includes(p.procedureId)
        )
        .slice(0, limit)
        .map(p => ({
            id: p.procedureId,
            slug: p.procedureSlug,
            name: p.procedureName,
            category: p.categoryName,
            family: p.familyName,
            score: 1,
        }));
}

