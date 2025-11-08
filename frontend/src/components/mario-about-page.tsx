'use client'
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Shield, Heart, Award, Users, CheckCircle } from 'lucide-react';

interface MarioAboutPageProps {
  onBack: () => void;
}

export function MarioAboutPage({ onBack }: MarioAboutPageProps) {
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
            Healthcare transparency, made simple.
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
            Mario Health helps you see what you'll really pay before you go — empowering every member to make confident, cost-smart care choices.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Our Mission */}
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
                <Heart className="w-6 h-6" style={{ color: '#4DA1A9' }} />
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
                  Our Mission
                </h2>
                <p 
                  style={{
                    fontSize: '16px',
                    color: '#1A1A1A',
                    lineHeight: '1.7'
                  }}
                >
                  We believe affordable care should be effortless to find. Mario Health exists to make prices, coverage, and rewards easy to understand — so you can focus on your health, not the paperwork.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* What We Do */}
        <section>
          <h2 
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#2E5077',
              marginBottom: '24px'
            }}
          >
            What We Do
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: <CheckCircle className="w-5 h-5" />,
                text: 'Compare real-time procedure, provider, and medication prices'
              },
              {
                icon: <CheckCircle className="w-5 h-5" />,
                text: 'Show your true, personalized costs with insurance'
              },
              {
                icon: <CheckCircle className="w-5 h-5" />,
                text: 'Book care through our concierge team'
              },
              {
                icon: <CheckCircle className="w-5 h-5" />,
                text: 'Reward you for smart, value-based choices'
              }
            ].map((item, idx) => (
              <Card
                key={idx}
                className="p-4"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: 'white'
                }}
              >
                <div className="flex items-center gap-3">
                  <div style={{ color: '#79D7BE' }}>
                    {item.icon}
                  </div>
                  <p style={{ fontSize: '15px', color: '#1A1A1A', fontWeight: '500' }}>
                    {item.text}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Our Principles */}
        <section>
          <h2 
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#2E5077',
              marginBottom: '24px'
            }}
          >
            Our Principles
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Clarity over complexity',
                description: 'Transparent, plain-language design'
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: 'Trust through transparency',
                description: 'Data security and honesty first'
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: 'Reward, don\'t punish',
                description: 'Celebrate smarter care choices'
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Accessible by default',
                description: 'WCAG AA-compliant, for every user'
              }
            ].map((principle, idx) => (
              <Card
                key={idx}
                className="p-6 text-center"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: 'white'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(46, 80, 119, 0.1)' }}
                >
                  <div style={{ color: '#2E5077' }}>
                    {principle.icon}
                  </div>
                </div>
                <h3 
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '8px'
                  }}
                >
                  {principle.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#667085', lineHeight: '1.5' }}>
                  {principle.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* The Team Behind Mario */}
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
                <Users className="w-6 h-6" style={{ color: '#79D7BE' }} />
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
                  The Team Behind Mario
                </h2>
                <p 
                  style={{
                    fontSize: '16px',
                    color: '#1A1A1A',
                    lineHeight: '1.7'
                  }}
                >
                  We're healthcare technologists, clinicians, and designers united by a single goal: make the U.S. healthcare system finally work for people, not paperwork.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Partners Section */}
        <section>
          <Card 
            className="p-8 text-center"
            style={{
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <h2 
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#2E5077',
                marginBottom: '16px'
              }}
            >
              Our Partners & Employers
            </h2>
            <p 
              style={{
                fontSize: '15px',
                color: '#667085',
                lineHeight: '1.6'
              }}
            >
              Backed by leading investors and healthcare innovators committed to making healthcare more transparent and affordable for everyone.
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
