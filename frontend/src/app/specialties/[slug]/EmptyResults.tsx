import Link from "next/link";

interface EmptyResultsProps {
  specialtyName: string;
  searchRadius: number;
}

export function EmptyResults({ specialtyName, searchRadius }: EmptyResultsProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-3">
      <h2 className="text-lg font-semibold text-foreground">
        No {specialtyName} found within {searchRadius} miles
      </h2>
      <p className="text-sm text-muted-foreground">
        Try widening the search radius or using a different ZIP code.
      </p>
      <div className="flex gap-3 text-sm">
        <Link href="/" className="text-primary hover:underline">
          Back to home
        </Link>
        <Link href="/specialties" className="text-primary hover:underline">
          View all specialties
        </Link>
      </div>
    </div>
  );
}

