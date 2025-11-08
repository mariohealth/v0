export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
                ))}
            </div>
        </div>
    )
}

