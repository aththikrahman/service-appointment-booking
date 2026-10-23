import { TimeSlot, Specialist, Appointment, BusinessConfig } from '../types/booking';

export function formatDatePretty(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatTime12h(timeStr: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMins = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMins / 60);
  const endMins = totalMins % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
}

// Generate slot list for a given date
export function getDailySlots(
  dateStr: string,
  specialist: Specialist | null,
  existingAppointments: Appointment[],
  blockedSlotKeys: string[] = []
): TimeSlot[] {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = dateObj.getDay();

  // If specialist selected and doesn't work that day
  if (specialist && !specialist.availableDays.includes(dayOfWeek)) {
    return [];
  }

  // Define operational hours: default 09:00 to 19:30
  const startHour = specialist ? parseInt(specialist.availableHours.start.split(':')[0], 10) : 9;
  const endHour = specialist ? parseInt(specialist.availableHours.end.split(':')[0], 10) : 19;

  const slots: TimeSlot[] = [];

  for (let h = startHour; h <= endHour; h++) {
    for (const m of [0, 30]) {
      if (h === endHour && m > 0) continue;
      const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      const slotKey = `${dateStr}_${time}_${specialist?.id || 'any'}`;

      // Check if blocked by admin
      if (blockedSlotKeys.includes(slotKey) || blockedSlotKeys.includes(`${dateStr}_${time}_all`)) {
        slots.push({ time, status: 'blocked' });
        continue;
      }

      // Check existing appointments on this date
      const isBooked = existingAppointments.some((apt) => {
        if (apt.date !== dateStr || apt.status === 'cancelled') return false;
        // If specific specialist, check specialist match
        if (specialist && apt.specialist.id !== specialist.id) return false;

        const aptStart = apt.startTime;
        const aptEnd = apt.endTime;
        return time >= aptStart && time < aptEnd;
      });

      if (isBooked) {
        slots.push({ time, status: 'booked' });
      } else {
        // Some realistic variability: pseudo filling-fast for certain popular peak times
        const isPeak = (h === 11 && m === 30) || (h === 16 && m === 0);
        slots.push({
          time,
          status: isPeak ? 'filling-fast' : 'available'
        });
      }
    }
  }

  return slots;
}

// Generate valid RFC 5545 iCalendar .ics string
export function generateIcsContent(apt: Appointment, business: BusinessConfig): string {
  const [year, month, day] = apt.date.split('-').map(Number);
  const [startH, startM] = apt.startTime.split(':').map(Number);
  const [endH, endM] = apt.endTime.split(':').map(Number);

  const formatIcsDate = (y: number, m: number, d: number, hr: number, min: number) => {
    return `${y}${m.toString().padStart(2, '0')}${d.toString().padStart(2, '0')}T${hr.toString().padStart(2, '0')}${min.toString().padStart(2, '0')}00`;
  };

  const startFormatted = formatIcsDate(year, month, day, startH, startM);
  const endFormatted = formatIcsDate(year, month, day, endH, endM);
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const summary = `${apt.service.name} at ${business.name}`;
  const description = `Appointment Reference: ${apt.referenceNumber}\\n` +
    `Service: ${apt.service.name}\\n` +
    `Specialist: ${apt.specialist.name} (${apt.specialist.title})\\n` +
    `Client: ${apt.customer.fullName}\\n` +
    `Location: ${business.address}\\n` +
    `Phone: ${business.phone}\\n` +
    `Total: ${business.currencySymbol}${apt.totalPrice}\\n` +
    `Notes: ${apt.customer.notes || 'None'}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lumiere Atelier//Appointment Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${apt.id}-${apt.referenceNumber}@lumiere-booking.internal`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${business.address}`,
    `STATUS:CONFIRMED`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Your upcoming appointment at ' + business.name,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

// Download .ics file in browser
export function downloadIcsFile(apt: Appointment, business: BusinessConfig) {
  const content = generateIcsContent(apt, business);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `appointment-${apt.referenceNumber}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Direct Google Calendar Add link
export function getGoogleCalendarUrl(apt: Appointment, business: BusinessConfig): string {
  const [year, month, day] = apt.date.split('-').map(Number);
  const [startH, startM] = apt.startTime.split(':').map(Number);
  const [endH, endM] = apt.endTime.split(':').map(Number);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const dStart = `${year}${pad(month)}${pad(day)}T${pad(startH)}${pad(startM)}00`;
  const dEnd = `${year}${pad(month)}${pad(day)}T${pad(endH)}${pad(endM)}00`;

  const title = encodeURIComponent(`${apt.service.name} · ${business.name}`);
  const details = encodeURIComponent(
    `Reference: ${apt.referenceNumber}\nSpecialist: ${apt.specialist.name}\nTotal: ${business.currencySymbol}${apt.totalPrice}\nAddress: ${business.address}\nPhone: ${business.phone}`
  );
  const location = encodeURIComponent(business.address);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dStart}/${dEnd}&details=${details}&location=${location}`;
}
