export function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// Convert "2026-05-20T08:00:00" to "08:00 AM" avoiding timezone shifts
export function formatTime(isoString: string): string {
  if (!isoString) return '';
  // Ensure we handle strings with or without 'Z' by treating them as naive local time for the venue
  // If we want to show EXACTLY what is saved, we can split at 'T' and ':'
  const timePart = isoString.includes('T') ? isoString.split('T')[1] : isoString;
  const [hoursRaw, minutesRaw] = timePart.split(':');
  
  let hours = parseInt(hoursRaw, 10);
  const minutes = parseInt(minutesRaw, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
}

export function formatDateStr(isoString: string): string {
  if (!isoString) return '';
  // Use a regex to extract parts to avoid Date object timezone shifting
  const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return isoString;
  
  const [_, year, month, day] = match;
  // Create Date object using local time constructor to avoid UTC shift
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  const formatter = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  const formatted = formatter.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
