export default function ContactPage() {
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#FDFCFA' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#2E5077' }}>Contact Us</h1>
          <p className="text-lg text-muted-foreground">Get in touch with the Mario Health team.</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: '#666666' }}>
            Have questions or feedback? We'd love to hear from you!
          </p>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2" style={{ color: '#2E5077' }}>Email</h2>
              <p className="text-base" style={{ color: '#666666' }}>support@mario.health</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2" style={{ color: '#2E5077' }}>Hours</h2>
              <p className="text-base" style={{ color: '#666666' }}>Monday - Friday, 9am - 5pm EST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


