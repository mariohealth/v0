import { MarioHeader } from "@/components/mario-header"
import { HeroSearch } from "@/components/hero-search"
import { SavingsCard } from "@/components/savings-card"
import { ProcedureCard } from "@/components/procedure-card"
import { ProviderCard } from "@/components/provider-card"
import { ActionListItem } from "@/components/action-list-item"
import { BottomNav } from "@/components/bottom-nav"
import { Search, Stethoscope, User, FileText, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MarioHeader />

      <main>
        <HeroSearch />

        <SavingsCard />

        {/* Save on These Section */}
        <section className="px-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Save on These</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
            <ProcedureCard title="MRI Scan (Brain)" price="$850" originalPrice="$1,400" discount="39% off" />
            <ProcedureCard title="Annual Physical Exam" price="$95" originalPrice="$220" discount="57% off" />
          </div>
        </section>

        {/* Provider Card Example */}
        <section className="px-4 mb-8">
          <ProviderCard
            title="Orthopedic Consultation"
            subtitle="Bone and joint specialist"
            price="$28"
            originalPrice="$425"
            savings="Save 34% ($145)"
            locationCount={12}
          />
        </section>

        {/* Search Bar */}
        <section className="px-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Ask MarioAI anything..."
              className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-300 focus:border-[#4DA1A9] focus:outline-none text-base bg-white"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm whitespace-nowrap hover:border-[#4DA1A9] transition-colors">
              <Sparkles className="w-4 h-4 inline mr-1" />I have a health concern
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm whitespace-nowrap hover:border-[#4DA1A9] transition-colors">
              Book a visit
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm whitespace-nowrap hover:border-[#4DA1A9] transition-colors">
              Rx renewal
            </button>
          </div>
        </section>

        {/* Common Actions */}
        <section className="px-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Common Actions</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
            <ActionListItem icon={FileText} title="Browse Procedures" subtitle="Find and compare medical procedures" />
            <ActionListItem icon={Stethoscope} title="Find Doctors" subtitle="Search by specialty and location" />
            <ActionListItem
              icon={User}
              title="MarioCare"
              subtitle="On-demand urgent care (24/7), scheduled primary care"
            />
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
