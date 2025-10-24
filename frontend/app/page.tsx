'use client';

import { MarioHeader } from '../src/components/mario-header';
import SearchBar from '../src/components/home/SearchBar';
import { SavingsCard } from '../src/components/savings-card';
import { ProcedureCard } from '../src/components/procedure-card';
import { ActionListItem } from '../src/components/action-list-item';
import { BottomNav } from '../src/components/bottom-nav';
import { Stethoscope, UserRound, Pill, Phone } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fixed Top */}
      <MarioHeader />

      {/* Main Content - Scrollable with padding for fixed header/nav */}
      <main className="pt-16 pb-24 px-4 max-w-md mx-auto">
        {/* Hero Section with NEW Search */}
        <section className="mt-6">
          <SearchBar />
        </section>

        {/* Savings Card - Only for returning users */}
        <section className="mt-6">
          <SavingsCard amount={1247} message="this year with Mario" />
        </section>

        {/* Save on These Section */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Save on These</h2>
          <div className="space-y-4">
            <ProcedureCard
              title="MRI Scan (Brain)"
              price={850}
              originalPrice={1400}
              discount={39}
            />
            <ProcedureCard
              title="Annual Physical Exam"
              price={95}
              originalPrice={220}
              discount={57}
            />
          </div>
        </section>

        {/* Ask MarioAI - Coming Soon */}
        <section className="mt-6">
          <button
            onClick={() =>
              alert('Coming soon! Would you find AI chat helpful for searching healthcare?')
            }
            className="w-full py-3 px-4 border-2 border-[#4DA1A9] text-[#4DA1A9] rounded-full font-medium hover:bg-[#4DA1A9] hover:text-white transition-colors"
          >
            🤖 Ask MarioAI anything...
          </button>
        </section>

        {/* Quick Action Chips */}
        <section className="mt-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button className="px-4 py-2 bg-white rounded-full text-sm font-medium text-[#2E5077] border border-gray-200 whitespace-nowrap hover:bg-gray-50">
              ✨ I have a health concern
            </button>
            <button className="px-4 py-2 bg-white rounded-full text-sm font-medium text-[#2E5077] border border-gray-200 whitespace-nowrap hover:bg-gray-50">
              📅 Book a visit
            </button>
            <button className="px-4 py-2 bg-white rounded-full text-sm font-medium text-[#2E5077] border border-gray-200 whitespace-nowrap hover:bg-gray-50">
              💊 Rx renewal
            </button>
          </div>
        </section>

        {/* Common Actions */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Actions</h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm divide-y divide-gray-100">
            <ActionListItem
              icon={Stethoscope}
              title="Browse Procedures"
              description="Find and compare medical procedures"
              onClick={() => console.log('Browse Procedures clicked')}
            />
            <ActionListItem
              icon={UserRound}
              title="Find Doctors"
              description="Search by specialty and location"
              onClick={() => console.log('Find Doctors clicked')}
            />
            <ActionListItem
              icon={Pill}
              title="Medications"
              description="Compare prescription prices"
              onClick={() => console.log('Medications clicked')}
            />
            <ActionListItem
              icon={Phone}
              title="MarioCare"
              description="On-demand urgent care (24/7), scheduled primary"
              onClick={() => console.log('MarioCare clicked')}
            />
          </div>
        </section>
      </main>

      {/* Bottom Navigation - Fixed Bottom */}
      <BottomNav />
    </div>
  );
}
