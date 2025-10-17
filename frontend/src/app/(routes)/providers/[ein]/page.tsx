type PageProps = { params: { ein: string } };

export default function Page({ params }: PageProps) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Provider {params.ein}</h1>
    </main>
  );
}
