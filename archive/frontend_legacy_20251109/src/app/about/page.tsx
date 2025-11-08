export default function AboutPage() {
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#FDFCFA' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#2E5077' }}>About Mario Health</h1>
          <p className="text-lg text-muted-foreground">Information about our mission and team.</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: '#666666' }}>
            Mario Health is dedicated to making healthcare more affordable and accessible for everyone.
            Our platform helps users compare prices, find the best providers, and maximize their healthcare savings.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: '#666666' }}>
            We believe that transparency in healthcare pricing is essential for creating a better healthcare system.
            By empowering users with the information they need, we help them make informed decisions about their health.
          </p>
        </div>
      </div>
    </div>
  );
}


