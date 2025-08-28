import type { StatsBlock } from "../types/about-types"

interface StatsBlockProps {
  block: StatsBlock
}

export default function StatsBlockComponent({ block }: StatsBlockProps) {
  const { title, stats } = block

  return (
    <section className="px-4 py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        {title && <h2 className="mb-12 text-3xl font-bold text-balance">{title}</h2>}

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-4xl font-bold text-green-600 md:text-5xl">{stat.number}</div>
              <div className="text-sm text-gray-600 md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
