export default function TransparencyPage() {
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#FDFCFA' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#2E5077' }}>Transparency Statement</h1>
          <p className="text-lg text-muted-foreground">Our commitment to transparency in healthcare pricing.</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: '#666666' }}>
            At Mario Health, we are committed to full transparency in healthcare pricing. We believe that patients
            deserve to know the true cost of their healthcare services before making decisions.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: '#666666' }}>
            Our platform provides real-time pricing information, allowing users to compare costs across different
            providers and make informed choices about their healthcare. We source our data from verified providers
            and update it regularly to ensure accuracy.
          </p>
          <p className="text-base leading-relaxed" style={{ color: '#666666' }}>
            We are transparent about our business model and how we help users save money on their healthcare expenses.
          </p>
        </div>
      </div>
    </div>
  );
}

