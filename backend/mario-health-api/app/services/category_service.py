from fastapi import HTTPException
from supabase import Client
from app.models.category import Category, CategoriesResponse, Family, CategoryFamiliesResponse


class CategoryService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_all_categories(self) -> CategoriesResponse:
        """Fetch all categories with family counts."""

        result = self.supabase.rpc("get_categories_with_counts").execute()

        categories = [
            Category(
                id=c["id"],
                name=c["name"],
                slug=c["slug"],
                emoji=c["emoji"],
                description=c.get("description"),
                family_count=c["family_count"]
            )
            for c in result.data
        ]

        return CategoriesResponse(categories=categories)

    async def get_families_by_category(self, slug: str) -> CategoryFamiliesResponse:
        """Fetch families for a category with procedure counts."""

        # Call the RPC function
        result = self.supabase.rpc(
            "get_families_with_counts",
            {"category_slug_input": slug}
        ).execute()

        if not result.data:
            # Verify category exists
            category_check = self.supabase.table("procedure_category") \
                .select("id") \
                .eq("slug", slug) \
                .limit(1) \
                .execute()

            if not category_check.data:
                raise HTTPException(
                    status_code=404,
                    detail=f"Category '{slug}' not found"
                )

            # Category exists but has no families
            return CategoryFamiliesResponse(
                category_slug=slug,
                families=[]
            )

        families = [
            Family(
                id=f["id"],
                name=f["name"],
                slug=f["slug"],
                description=f.get("description"),
                procedure_count=f["procedure_count"]
            )
            for f in result.data
        ]

        return CategoryFamiliesResponse(
            category_slug=slug,
            families=families
        )