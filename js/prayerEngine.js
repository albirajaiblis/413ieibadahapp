/* Mathematical Offline Prayer Time Calculator (Kemenag RI & Standard Methods) */

// Helper Trigonometry Functions in Radians
const rad = deg => (deg * Math.PI) / 180;
const deg = rad => (rad * 180) / Math.PI;

function normalizeAngle(angle) {
  let b = angle - 360 * Math.floor(angle / 360);
  return b < 0 ? b + 360 : b;
}

function normalizeHours(hours) {
  let b = hours - 24 * Math.floor(hours / 24);
  return b < 0 ? b + 24 : b;
}

// Calculate Solar Position (Declination & Equation of Time) for Julian Date
function calculateSunPosition(julianDate) {
  const D = julianDate - 2451545.0;
  const g = normalizeAngle(357.529 + 0.98560028 * D);
  const q = normalizeAngle(280.459 + 0.98564736 * D);
  const L = normalizeAngle(q + 1.915 * Math.sin(rad(g)) + 0.020 * Math.sin(rad(2 * g)));
  const e = 23.439 - 0.00000036 * D;

  const ra = deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(L)), Math.cos(rad(L)))) / 15;
  const decl = deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(L))));
  const eqt = q / 15 - normalizeHours(ra);

  return { declination: decl, equationOfTime: eqt };
}

function getJulianDate(year, month, day) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Calculate Hour Angle for specific solar altitude angle (alpha)
function calculateHourAngle(alpha, lat, decl) {
  const cosH = (Math.sin(rad(alpha)) - Math.sin(rad(lat)) * Math.sin(rad(decl))) /
               (Math.cos(rad(lat)) * Math.cos(rad(decl)));
  if (cosH > 1) return 0; // Never rises
  if (cosH < -1) return 12; // Never sets
  return deg(Math.acos(cosH)) / 15;
}

// Asr Hour Angle calculation (Factor = 1 for Standard/Shafi'i, 2 for Hanafi)
function calculateAsrHourAngle(factor, lat, decl) {
  const phi = Math.abs(lat - decl);
  const alpha = deg(Math.atan(1 / (factor + Math.tan(rad(phi)))));
  return calculateHourAngle(alpha, lat, decl);
}

export function calculatePrayerTimes(date, lat, lng, timezone, methodParams = {}, manualOffsets = {}) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const julianDate = getJulianDate(year, month, day);
  const sun = calculateSunPosition(julianDate);

  // Method Angles (Default Kemenag RI: Fajr 20°, Isha 18°, +2 min safety buffer)
  const fajrAngle = methodParams.fajrAngle || 20;
  const ishaAngle = methodParams.ishaAngle || 18;

  // Transit (Dhuhr) in Local Time
  const dhuhrTransit = 12 + timezone - lng / 15 - sun.equationOfTime;

  // Calculate Prayer Hour Angles
  const fajrHA = calculateHourAngle(-fajrAngle, lat, sun.declination);
  const sunriseHA = calculateHourAngle(-0.833, lat, sun.declination);
  const duhaHA = calculateHourAngle(4.5, lat, sun.declination); // ~15-20 min after sunrise
  const asrHA = calculateAsrHourAngle(1, lat, sun.declination);
  const sunsetHA = calculateHourAngle(-0.833, lat, sun.declination);
  const ishaHA = calculateHourAngle(-ishaAngle, lat, sun.declination);

  // Times in Hours
  let fajrTime = dhuhrTransit - fajrHA;
  let imsakTime = fajrTime - (10 / 60); // 10 minutes before Subuh
  let sunriseTime = dhuhrTransit - sunriseHA;
  let duhaTime = dhuhrTransit - duhaHA;
  let dhuhrTime = dhuhrTransit + (2 / 60); // +2 min safety
  let asrTime = dhuhrTransit + asrHA + (2 / 60);
  let maghribTime = dhuhrTransit + sunsetHA + (2 / 60);
  let ishaTime = dhuhrTransit + ishaHA + (2 / 60);

  // Apply Manual Offsets (in minutes)
  fajrTime += (manualOffsets.fajr || 0) / 60;
  dhuhrTime += (manualOffsets.dhuhr || 0) / 60;
  asrTime += (manualOffsets.asr || 0) / 60;
  maghribTime += (manualOffsets.maghrib || 0) / 60;
  ishaTime += (manualOffsets.isha || 0) / 60;

  const formatTime = (hoursFloat) => {
    let h = Math.floor(hoursFloat);
    let m = Math.round((hoursFloat - h) * 60);
    if (m >= 60) {
      h += 1;
      m -= 60;
    }
    h = (h + 24) % 24;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const parseToDate = (hoursFloat) => {
    let h = Math.floor(hoursFloat);
    let m = Math.round((hoursFloat - h) * 60);
    if (m >= 60) {
      h += 1;
      m -= 60;
    }
    h = (h + 24) % 24;
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d;
  };

  return {
    imsak: formatTime(imsakTime),
    subuh: formatTime(fajrTime),
    terbit: formatTime(sunriseTime),
    duha: formatTime(duhaTime),
    dzuhur: formatTime(dhuhrTime),
    ashar: formatTime(asrTime),
    maghrib: formatTime(maghribTime),
    isya: formatTime(ishaTime),

    // Date objects for countdown & logic
    dates: {
      imsak: parseToDate(imsakTime),
      subuh: parseToDate(fajrTime),
      terbit: parseToDate(sunriseTime),
      duha: parseToDate(duhaTime),
      dzuhur: parseToDate(dhuhrTime),
      ashar: parseToDate(asrTime),
      maghrib: parseToDate(maghribTime),
      isya: parseToDate(ishaTime)
    }
  };
}

// Convert Gregorian Date to estimated Hijri Date String
export function getHijriDateString(date = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return formatter.format(date) + ' H';
  } catch (e) {
    return '1447 H';
  }
}

// Determine next prayer time & countdown
export function getNextPrayerInfo(prayerTimesObj, now = new Date()) {
  const list = [
    { key: 'subuh', name: 'Subuh', timeStr: prayerTimesObj.subuh, dateObj: prayerTimesObj.dates.subuh },
    { key: 'dzuhur', name: 'Dzuhur', timeStr: prayerTimesObj.dzuhur, dateObj: prayerTimesObj.dates.dzuhur },
    { key: 'ashar', name: 'Ashar', timeStr: prayerTimesObj.ashar, dateObj: prayerTimesObj.dates.ashar },
    { key: 'maghrib', name: 'Maghrib', timeStr: prayerTimesObj.maghrib, dateObj: prayerTimesObj.dates.maghrib },
    { key: 'isya', name: 'Isya', timeStr: prayerTimesObj.isya, dateObj: prayerTimesObj.dates.isya }
  ];

  for (let i = 0; i < list.length; i++) {
    if (now < list[i].dateObj) {
      const diffMs = list[i].dateObj - now;
      return { next: list[i], remainingMs: diffMs, currentKey: i > 0 ? list[i - 1].key : 'isya' };
    }
  }

  // If past Isya today, next prayer is Subuh tomorrow
  const tomorrowSubuh = new Date(prayerTimesObj.dates.subuh);
  tomorrowSubuh.setDate(tomorrowSubuh.getDate() + 1);
  const diffMs = tomorrowSubuh - now;
  return { next: { key: 'subuh', name: 'Subuh', timeStr: prayerTimesObj.subuh, dateObj: tomorrowSubuh }, remainingMs: diffMs, currentKey: 'isya' };
}
