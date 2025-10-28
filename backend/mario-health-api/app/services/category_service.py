from fastapi import HTTPException
from supabase import Client
from app.models.category import Family, CategoryFamiliesResponse


class CategoryService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_families_by_category(self, slug: str) -> CategoryFamiliesResponse:
        """Fetch families for a category with procedure counts."""

        # Validate category exists
        category_result = self.supabase.table("procedure_category") \
            .select("id, slug") \
            .eq("slug", slug) \
            .limit(1) \
            .execute()

        if not category_result.data:
            raise HTTPException(
                status_code=404,
                detail=f"Category '{slug}' not found"
            )

        # Fetch families with procedure counts
        families_result = self.supabase.table("procedure_family") \
            .select("id, name, slug, description, procedure(count)") \
            .eq("category_slug", slug) \
            .order("name") \
            .execute()

        families = [
            Family(
                id=f["id"],
                name=f["name"],
                slug=f["slug"],
                description=f.get("description"),
                procedure_count=f["procedure"][0]["count"] if f.get("procedure") else 0
            )
            for f in families_result.data
        ]

        return CategoryFamiliesResponse(
            category_slug=slug,
            families=families
        )