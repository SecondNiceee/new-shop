import type React from "react"
import type { Product } from "@/payload-types"

interface NutrientInformationProps {
  product: Product
}

const NutrientInformation: React.FC<NutrientInformationProps> = ({ product }) => {
  const nutritionalValue = product.nutritionalValue
  const calories = nutritionalValue?.calories || 0
  const proteins = nutritionalValue?.proteins || 0
  const carbohydrates = nutritionalValue?.carbohydrates || 0
  const fats = nutritionalValue?.fats || 0
  const fiber = nutritionalValue?.fiber || 0

  const totalMacros = proteins + carbohydrates + fats + fiber

  const getPercentage = (value: number) => {
    if (totalMacros === 0) return 0
    return Math.round((value / totalMacros) * 100)
  }

  if (!nutritionalValue || totalMacros === 0) {
    return null
  }

  return (
    <div className="px-6 py-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Энергетическая и пищевая ценность</h2>
      <p className="text-gray-500 mb-6">на 100 г продукта</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Calories */}
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{calories}</div>
          <div className="text-sm font-medium text-gray-700 mb-1">Калорийность</div>
          <div className="text-xs text-gray-500">кКал</div>
        </div>

        {/* Proteins */}
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{proteins}</div>
          <div className="text-sm font-medium text-gray-700 mb-1">Белки</div>
          <div className="text-xs text-gray-500">г</div>
        </div>

        {/* Carbohydrates */}
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-1">{carbohydrates}</div>
          <div className="text-sm font-medium text-gray-700 mb-1">Углеводы</div>
          <div className="text-xs text-gray-500">г</div>
        </div>

        {/* Fats */}
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-1">{fats}</div>
          <div className="text-sm font-medium text-gray-700 mb-1">Жиры</div>
          <div className="text-xs text-gray-500">г</div>
        </div>

        {/* Fiber */}
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">{fiber}</div>
          <div className="text-sm font-medium text-gray-700 mb-1">Клетчатка</div>
          <div className="text-xs text-gray-500">г</div>
        </div>
      </div>

      {/* Optional: Simple bar chart visualization */}
      <div className="mt-8 space-y-3">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Соотношение питательных веществ</h3>

        {/* Carbohydrates bar */}
        {carbohydrates > 0 && (
          <div className="flex items-center space-x-3">
            <div className="w-20 text-sm font-medium text-gray-700">Углеводы</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div
                className="bg-orange-500 h-3 rounded-full"
                style={{ width: `${getPercentage(carbohydrates)}%` }}
              ></div>
            </div>
            <div className="w-12 text-sm font-semibold text-gray-900">{carbohydrates} г</div>
          </div>
        )}

        {/* Proteins bar */}
        {proteins > 0 && (
          <div className="flex items-center space-x-3">
            <div className="w-20 text-sm font-medium text-gray-700">Белки</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${getPercentage(proteins)}%` }}></div>
            </div>
            <div className="w-12 text-sm font-semibold text-gray-900">{proteins} г</div>
          </div>
        )}

        {/* Fiber bar */}
        {fiber > 0 && (
          <div className="flex items-center space-x-3">
            <div className="w-20 text-sm font-medium text-gray-700">Клетчатка</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: `${getPercentage(fiber)}%` }}></div>
            </div>
            <div className="w-12 text-sm font-semibold text-gray-900">{fiber} г</div>
          </div>
        )}

        {/* Fats bar */}
        {fats > 0 && (
          <div className="flex items-center space-x-3">
            <div className="w-20 text-sm font-medium text-gray-700">Жиры</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div className="bg-yellow-500 h-3 rounded-full" style={{ width: `${getPercentage(fats)}%` }}></div>
            </div>
            <div className="w-12 text-sm font-semibold text-gray-900">{fats} г</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NutrientInformation
