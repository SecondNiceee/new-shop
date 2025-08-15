
// на самом деле коллекция Addresses содержит street, в коллекции Orders address то же самое что street в коллекции
// Addresses, поэтому указано street и address вместе быть не может
export const getFullAddress = (address: any) => {
    if (!address) return ""
    const parts = []
    if (address.street) parts.push(address.street);
    if (address.address) parts.push(address.address)
    if (address.apartment) parts.push(address.apartment)
    if (address.entrance) parts.push(`подъезд ${address.entrance}`)
    if (address.floor) parts.push(`этаж ${address.floor}`)
    return parts.join(", ")
  }