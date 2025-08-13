export const formatAddress = (displayName: string): string => {
  const parts = displayName.split(", ").map(part => part.trim())

  const stIndex = parts.findIndex(part =>
    part.toLowerCase().includes("ставрополь")
  )

  return stIndex !== -1 ? parts.slice(0, stIndex).join(", ") : parts.join(", ")
}