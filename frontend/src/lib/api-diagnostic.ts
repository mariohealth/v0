/**
 * Diagnostic utility for testing getProcedureProviders slug variants
 * 
 * This file is for testing purposes only and can be removed after diagnosis.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mario-health-api-gateway-x5pghxd.uc.gateway.dev';

/**
 * Test multiple slug variants for a procedure
 */
export async function testProcedureProvidersSlugs(slug: string) {
    const base = `${API_BASE_URL}/api/v1/procedures`;
    const variants = [
        slug,
        slug.replace(/_/g, '-'),
        slug.replace(/_/g, '_of_'),
        slug.replace(/_/g, ' '),
        slug.replace('brain-mri', 'mri_of_brain'),
        slug.replace('mri_spine', 'mri_of_spine'),
    ];

    console.log(`[Diagnostic] Testing slug variants for: ${slug}`);
    console.log(`[Diagnostic] API Base URL: ${API_BASE_URL}`);
    console.log(`[Diagnostic] Variants to test:`, variants);

    const results: Array<{ variant: string; success: boolean; providersCount?: number; error?: string; responsePreview?: string }> = [];

    for (const variant of variants) {
        const url = `${base}/${variant}/providers`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                results.push({
                    variant,
                    success: false,
                    error: `${response.status} ${response.statusText}`,
                    responsePreview: errorText.substring(0, 200),
                });
                console.warn(`[Diagnostic] ❌ Variant "${variant}" failed: ${response.status} ${response.statusText}`);
                continue;
            }

            const data = await response.json();
            const providersCount = data?.providers?.length || 0;
            const responsePreview = JSON.stringify(data).substring(0, 200);

            if (providersCount > 0) {
                results.push({
                    variant,
                    success: true,
                    providersCount,
                    responsePreview,
                });
                console.log(`[Diagnostic] ✅ Variant "${variant}" succeeded: ${providersCount} providers`);
            } else {
                results.push({
                    variant,
                    success: false,
                    providersCount: 0,
                    error: 'Empty providers array',
                    responsePreview,
                });
                console.warn(`[Diagnostic] ⚠️ Variant "${variant}" returned empty providers array`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            results.push({
                variant,
                success: false,
                error: errorMessage,
            });
            console.error(`[Diagnostic] ❌ Variant "${variant}" error:`, error);
        }
    }

    console.log(`[Diagnostic] Summary:`, results);
    return results;
}

