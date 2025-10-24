export function SavingsCard() {
  return (
    <div className="mx-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-gray-700">You've saved</p>
          <span className="text-3xl font-bold text-gray-900">$1,247</span>
          <span className="text-2xl">🎉</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">this year with Mario</p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-[#4DA1A9] rounded-full" />
        </div>
      </div>
    </div>
  )
}
