import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:grid-rows-[auto_1fr] lg:items-start">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 grid gap-6 lg:grid-rows-subgrid lg:row-span-2">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 bg-gradient-to-r from-gray-50/80 to-blue-50/50 rounded-2xl border border-gray-100/50"
                  >
                    <Skeleton className="w-20 h-20 rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Skeleton className="w-6 h-6" />
                  <Skeleton className="h-6 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/50 p-5 rounded-2xl border border-blue-100/50 min-h-[120px] flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <Skeleton className="w-8 h-8 rounded-full ml-3" />
                  </div>
                  <Skeleton className="h-3 w-48 mt-3" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment */}
          <div className="grid gap-6 lg:grid-rows-subgrid lg:row-span-2">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Skeleton className="w-6 h-6" />
                  <Skeleton className="h-6 w-20" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="space-y-3 min-h-[120px] flex flex-col justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-12 flex-1 rounded-xl" />
                      <Skeleton className="w-12 h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-2xl border-0 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 text-white overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <Skeleton className="w-6 h-6 bg-white/20" />
                  <Skeleton className="h-6 w-32 bg-white/20" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-3">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-24 bg-white/20" />
                    <Skeleton className="h-5 w-16 bg-white/20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-20 bg-white/20" />
                    <Skeleton className="h-5 w-12 bg-white/20" />
                  </div>
                  <div className="border-t border-white/30 pt-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-7 w-16 bg-white/20" />
                      <Skeleton className="h-7 w-20 bg-white/20" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-14 w-full bg-white/20 rounded-xl mt-4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
