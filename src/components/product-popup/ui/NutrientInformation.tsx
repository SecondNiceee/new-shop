import React from 'react';

const NutrientInformation = () => {
    return (
              <div className="px-6 py-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Энергетическая и пищевая ценность
                </h2>
                <p className="text-gray-500 mb-6">на 100 г продукта</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Calories */}
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">239</div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Калорийность</div>
                    <div className="text-xs text-gray-500">кКал</div>
                  </div>

                  {/* Proteins */}
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">2,8</div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Белки</div>
                    <div className="text-xs text-gray-500">г</div>
                  </div>

                  {/* Carbohydrates */}
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">57,4</div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Углеводы</div>
                    <div className="text-xs text-gray-500">г</div>
                  </div>

                  {/* Fats */}
                  <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-1">0,6</div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Жиры</div>
                    <div className="text-xs text-gray-500">г</div>
                  </div>

                  {/* Fiber */}
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">5,1</div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Клетчатка</div>
                    <div className="text-xs text-gray-500">г</div>
                  </div>
                </div>

                {/* Optional: Simple bar chart visualization */}
                <div className="mt-8 space-y-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Соотношение питательных веществ
                  </h3>

                  {/* Carbohydrates bar */}
                  <div className="flex items-center space-x-3">
                    <div className="w-20 text-sm font-medium text-gray-700">Углеводы</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full"
                        style={{ width: '85%' }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm font-semibold text-gray-900">57,4 г</div>
                  </div>

                  {/* Proteins bar */}
                  <div className="flex items-center space-x-3">
                    <div className="w-20 text-sm font-medium text-gray-700">Белки</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="w-12 text-sm font-semibold text-gray-900">2,8 г</div>
                  </div>

                  {/* Fiber bar */}
                  <div className="flex items-center space-x-3">
                    <div className="w-20 text-sm font-medium text-gray-700">Клетчатка</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <div className="w-12 text-sm font-semibold text-gray-900">5,1 г</div>
                  </div>

                  {/* Fats bar */}
                  <div className="flex items-center space-x-3">
                    <div className="w-20 text-sm font-medium text-gray-700">Жиры</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                    <div className="w-12 text-sm font-semibold text-gray-900">0,6 г</div>
                  </div>
                </div>
              </div>
    );
};

export default NutrientInformation;