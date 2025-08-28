import type { TeamBlock } from "../types/about-types"
import Image from "next/image"

interface TeamBlockProps {
  block: TeamBlock
}

export default function TeamBlockComponent({ block }: TeamBlockProps) {
  const { title, members } = block

  return (
    <section className="px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-12 text-3xl font-bold text-center text-balance">{title}</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <div key={index} className="p-6 text-center bg-white border rounded-lg shadow-sm">
              {member.photo && typeof member.photo === "object" && (
                <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                  <Image
                    src={member.photo.url || ""}
                    alt={member.photo.alt || member.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <h3 className="mb-2 text-xl font-semibold">{member.name}</h3>

              <p className="mb-3 font-medium text-green-600">{member.position}</p>

              {member.description && <p className="text-sm text-gray-600">{member.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
