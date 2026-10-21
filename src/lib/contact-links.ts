export function cleanPhoneNumber(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `233${digits.slice(1)}`;
  return digits;
}

export function phoneHref(value: string): string {
  const digits = cleanPhoneNumber(value);
  return `tel:${digits.startsWith("233") ? `+${digits}` : digits}`;
}

export function whatsappHref(
  phone: string,
  title: string,
  location: string,
  rent: number,
): string {
  const message = `Hello! I am interested in your listing: ${title} in ${location} (GH₵ ${rent}/month) on Sogakope Rentals. Is it still available?`;
  return `https://wa.me/${cleanPhoneNumber(phone)}?text=${encodeURIComponent(message)}`;
}
