import { Button } from "@/components/ui/button"

interface ProcedureCardProps {
  title: string
  price: number
  originalPrice: number
  discount: number
}

export function ProcedureCard({ title, price, originalPrice, discount }: ProcedureCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 w-full">
      <h3 className="font-semibold text-gray-900 mb-3 text-balance text-sm sm:text-base">{title}</h3>

      <div className="space-y-2 mb-4">
        <div className="text-2xl font-bold text-gray-900 sm:text-3xl">${price}</div>
        <div className="text-sm text-gray-500 line-through">${originalPrice}</div>
        <div className="inline-block px-3 py-1 bg-[#4DA1A9]/10 text-[#4DA1A9] text-sm font-medium rounded-full">
          {discount}% off
        </div>
      </div>

      <Button className="w-full bg-[#2E5077] hover:bg-[#2E5077]/90 text-white rounded-lg h-10 text-sm sm:text-base">Find Savings</Button>
    </div>
  )
}
