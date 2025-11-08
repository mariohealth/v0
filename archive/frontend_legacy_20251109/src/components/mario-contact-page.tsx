'use client'
import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Mail, MessageCircle, Briefcase, Newspaper, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

interface MarioContactPageProps {
  onBack: () => void;
}

export function MarioContactPage({ onBack }: MarioContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    toast.success('Thanks! We\'ll be in touch soon.', {
      description: 'Your message has been received by our team.'
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

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
            We're here to help.
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
            Whether you're a member with a question or a partner exploring collaboration, the Mario team is ready to listen.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* Contact Methods Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Member Support */}
          <Card 
            className="p-6"
            style={{
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(77, 161, 169, 0.15)' }}
              >
                <Mail className="w-6 h-6" style={{ color: '#4DA1A9' }} />
              </div>
              <div>
                <h3 
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '8px'
                  }}
                >
                  Member Support
                </h3>
              </div>
            </div>
            
            <div className="space-y-3 ml-16">
              <div>
                <p style={{ fontSize: '14px', color: '#667085', marginBottom: '4px' }}>
                  📧 Email
                </p>
                <a 
                  href="mailto:support@mario.health"
                  className="mario-transition hover:opacity-75"
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#4DA1A9',
                    textDecoration: 'underline'
                  }}
                >
                  support@mario.health
                </a>
              </div>
              
              <div>
                <p style={{ fontSize: '14px', color: '#667085', marginBottom: '4px' }}>
                  💬 In-app Concierge
                </p>
                <p style={{ fontSize: '15px', color: '#1A1A1A' }}>
                  "Ask Mario" chat (24/7 AI-assisted)
                </p>
              </div>
              
              <div>
                <p style={{ fontSize: '14px', color: '#667085', marginBottom: '4px' }}>
                  ⏰ Response time
                </p>
                <p style={{ fontSize: '15px', color: '#1A1A1A' }}>
                  Typically within 24 hours
                </p>
              </div>
            </div>
          </Card>

          {/* Employer & Partner Inquiries */}
          <Card 
            className="p-6"
            style={{
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(46, 80, 119, 0.1)' }}
              >
                <Briefcase className="w-6 h-6" style={{ color: '#2E5077' }} />
              </div>
              <div>
                <h3 
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '8px'
                  }}
                >
                  Employer & Partner Inquiries
                </h3>
              </div>
            </div>
            
            <div className="space-y-3 ml-16">
              <div>
                <p style={{ fontSize: '14px', color: '#667085', marginBottom: '4px' }}>
                  💼 Email
                </p>
                <a 
                  href="mailto:partners@mario.health"
                  className="mario-transition hover:opacity-75"
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#4DA1A9',
                    textDecoration: 'underline'
                  }}
                >
                  partners@mario.health
                </a>
              </div>
              
              <Button
                style={{
                  backgroundColor: '#2E5077',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  minHeight: '44px',
                  width: '100%'
                }}
              >
                Book a Demo
              </Button>
            </div>
          </Card>

          {/* Press & Media */}
          <Card 
            className="p-6"
            style={{
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(121, 215, 190, 0.15)' }}
              >
                <Newspaper className="w-6 h-6" style={{ color: '#79D7BE' }} />
              </div>
              <div>
                <h3 
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '8px'
                  }}
                >
                  Press & Media
                </h3>
              </div>
            </div>
            
            <div className="space-y-3 ml-16">
              <div>
                <p style={{ fontSize: '14px', color: '#667085', marginBottom: '4px' }}>
                  📰 Email
                </p>
                <a 
                  href="mailto:press@mario.health"
                  className="mario-transition hover:opacity-75"
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#4DA1A9',
                    textDecoration: 'underline'
                  }}
                >
                  press@mario.health
                </a>
              </div>
              
              <p style={{ fontSize: '14px', color: '#667085', lineHeight: '1.5' }}>
                For story ideas, interviews, or speaking requests.
              </p>
            </div>
          </Card>

          {/* Office / Mailing */}
          <Card 
            className="p-6"
            style={{
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(46, 80, 119, 0.1)' }}
              >
                <MapPin className="w-6 h-6" style={{ color: '#2E5077' }} />
              </div>
              <div>
                <h3 
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '8px'
                  }}
                >
                  Office / Mailing
                </h3>
              </div>
            </div>
            
            <div className="ml-16">
              <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.6' }}>
                Mario Health HQ (Remote-first)
                <br />
                228 Park Ave S #12345
                <br />
                New York, NY 10003
              </p>
            </div>
          </Card>
        </div>

        {/* Feedback Form */}
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
                <MessageCircle className="w-6 h-6" style={{ color: '#4DA1A9' }} />
              </div>
              <div>
                <h3 
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '8px'
                  }}
                >
                  Send us a message
                </h3>
                <p style={{ fontSize: '15px', color: '#667085' }}>
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label 
                    htmlFor="name"
                    className="block mb-2"
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#2E5077'
                    }}
                  >
                    Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{
                      borderRadius: '8px',
                      minHeight: '44px'
                    }}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="email"
                    className="block mb-2"
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#2E5077'
                    }}
                  >
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{
                      borderRadius: '8px',
                      minHeight: '44px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="subject"
                  className="block mb-2"
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#2E5077'
                  }}
                >
                  Subject *
                </label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  style={{
                    borderRadius: '8px',
                    minHeight: '44px'
                  }}
                />
              </div>

              <div>
                <label 
                  htmlFor="message"
                  className="block mb-2"
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#2E5077'
                  }}
                >
                  Message *
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us more..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  style={{
                    borderRadius: '8px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto"
                style={{
                  backgroundColor: '#4DA1A9',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  minHeight: '48px',
                  paddingLeft: '32px',
                  paddingRight: '32px'
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
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
