'use client'
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Database, Calculator, Lock, CheckCircle, Mail } from 'lucide-react';

interface MarioTransparencyPageProps {
  onBack: () => void;
}

export function MarioTransparencyPage({ onBack }: MarioTransparencyPageProps) {
  return (
    <div className="min-h-screen bg-[#F6F4F0]">
      {/* Header */}
      <div 
        className="bg-white sticky top-0 z-20"
        style={{
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mario-transition hover:opacity-75 mario-focus-ring"
            style={{ minHeight: '44px', color: '#2E5077' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontSize: '15px', fontWeight: '600' }}>Back</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(46, 80, 119, 0.05) 0%, rgba(77, 161, 169, 0.12) 100%)',
          padding: '64px 16px'
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#2E5077',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}
          >
            Built on trust and transparency.
          </h1>
          <p 
            style={{
              fontSize: '20px',
              color: '#667085',
              lineHeight: '1.6',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            Mario Health gives you access to clear, accurate pricing data, and we're upfront about how we source, calculate, and protect it.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Pricing Data Sources */}
        <section>
          <Card 
            className="p-8"
            style={{
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(77, 161, 169, 0.15)' }}
              >
                <Database className="w-6 h-6" style={{ color: '#4DA1A9' }} />
              </div>
              <div>
                <h2 
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '12px'
                  }}
                >
                  Pricing Data Sources
                </h2>
                <p 
                  style={{
                    fontSize: '16px',
                    color: '#1A1A1A',
                    lineHeight: '1.7',
                    marginBottom: '16px'
                  }}
                >
                  Our cost estimates combine multiple verified data sets, including:
                </p>
                <ul className="space-y-3">
                  {[
                    'Public Machine-Readable Files (CMS 2024 Transparency in Coverage)',
                    'Proprietary payer and employer datasets',
                    'User-submitted explanations of benefits (EOBs)',
                    'Verified cash prices from direct-to-consumer pharmacies and labs'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#79D7BE' }} />
                      <span style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.6' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <p 
                  style={{
                    fontSize: '15px',
                    color: '#667085',
                    lineHeight: '1.7',
                    marginTop: '16px'
                  }}
                >
                  All prices are normalized and refreshed monthly.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* How We Calculate Your Costs */}
        <section>
          <Card 
            className="p-8"
            style={{
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(46, 80, 119, 0.1)' }}
              >
                <Calculator className="w-6 h-6" style={{ color: '#2E5077' }} />
              </div>
              <div>
                <h2 
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '12px'
                  }}
                >
                  How We Calculate Your Costs
                </h2>
                <ul className="space-y-3">
                  {[
                    'Uses your insurance plan info and ZIP-based market averages',
                    'Excludes surprise facility or out-of-network fees',
                    'Displays both insurance and cash prices side-by-side',
                    'Highlights "Mario\'s Pick" — best combination of cost, quality, and convenience'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div 
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                        style={{ backgroundColor: '#4DA1A9' }}
                      />
                      <span style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.6' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Privacy & Data Ethics */}
        <section>
          <Card 
            className="p-8"
            style={{
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(121, 215, 190, 0.15)' }}
              >
                <Lock className="w-6 h-6" style={{ color: '#79D7BE' }} />
              </div>
              <div>
                <h2 
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '12px'
                  }}
                >
                  Privacy & Data Ethics
                </h2>
                <p 
                  style={{
                    fontSize: '16px',
                    color: '#1A1A1A',
                    lineHeight: '1.7'
                  }}
                >
                  We never sell or share personal health information. Mario Health complies with HIPAA and all applicable privacy laws. Data is encrypted in transit and at rest.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Commitment to Accuracy */}
        <section>
          <Card 
            className="p-8"
            style={{
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <h2 
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#2E5077',
                marginBottom: '12px'
              }}
            >
              Commitment to Accuracy
            </h2>
            <p 
              style={{
                fontSize: '16px',
                color: '#1A1A1A',
                lineHeight: '1.7'
              }}
            >
              While we strive for precision, healthcare pricing is dynamic. We always show when a price was last updated and where the data originated.
            </p>
          </Card>
        </section>

        {/* Reporting Issues */}
        <section>
          <Card 
            className="p-8"
            style={{
              borderRadius: '16px',
              border: '2px solid #4DA1A9',
              backgroundColor: 'rgba(77, 161, 169, 0.05)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#4DA1A9' }}
              >
                <Mail className="w-6 h-6" style={{ color: 'white' }} />
              </div>
              <div>
                <h2 
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '12px'
                  }}
                >
                  Reporting Issues
                </h2>
                <p 
                  style={{
                    fontSize: '16px',
                    color: '#1A1A1A',
                    lineHeight: '1.7',
                    marginBottom: '16px'
                  }}
                >
                  Notice an error or outdated price? We want to know.
                </p>
                <a 
                  href="mailto:transparency@mario.health"
                  className="mario-transition hover:opacity-75"
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#4DA1A9',
                    textDecoration: 'underline'
                  }}
                >
                  transparency@mario.health
                </a>
              </div>
            </div>
          </Card>
        </section>

        {/* Additional Information */}
        <section>
          <Card 
            className="p-6"
            style={{
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#F9FAFB'
            }}
          >
            <p 
              style={{
                fontSize: '14px',
                color: '#667085',
                lineHeight: '1.6',
                textAlign: 'center'
              }}
            >
              Powered by machine-readable insurance files (MRFs) and real-time pharmacy data.
              <br />
              Last updated: October 2024
            </p>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer 
        className="mt-16"
        style={{ 
          padding: '32px 16px',
          backgroundColor: '#F9F9F9',
          borderTop: '1px solid #E5E7EB'
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p style={{ fontSize: '14px', color: '#667085' }}>
            © 2024 Mario Health. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
