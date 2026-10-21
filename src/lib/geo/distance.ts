/**
 * Calculates great-circle distance between two points on the Earth's surface
 * using the Haversine formula (in kilometers).
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm} km away`;
}

/**
 * Centroid coordinate estimates for common Indian PIN code clusters
 * to enable instant distance calculations even if GPS permissions are denied
 */
export const PINCODE_COORDINATES: Record<string, { lat: number; lng: number; city: string }> = {
  // Delhi NCR
  '110001': { lat: 28.6315, lng: 77.2167, city: 'Connaught Place, New Delhi' },
  '110029': { lat: 28.5672, lng: 77.2100, city: 'Ansari Nagar, New Delhi' },
  '110016': { lat: 28.5492, lng: 77.1997, city: 'Hauz Khas, New Delhi' },
  '110092': { lat: 28.6297, lng: 77.3015, city: 'Laxmi Nagar, East Delhi' },

  // Uttar Pradesh
  '226001': { lat: 26.8500, lng: 80.9400, city: 'Hazratganj, Lucknow' },
  '226003': { lat: 26.8710, lng: 80.9140, city: 'Chowk, Lucknow' },
  '221005': { lat: 25.2750, lng: 82.9980, city: 'BHU Lanka, Varanasi' },
  '201301': { lat: 28.5800, lng: 77.3300, city: 'Noida, UP' },

  // Maharashtra
  '400001': { lat: 18.9322, lng: 72.8354, city: 'Fort, Mumbai' },
  '400028': { lat: 19.0178, lng: 72.8478, city: 'Dadar, Mumbai' },
  '400069': { lat: 19.1197, lng: 72.8468, city: 'Andheri East, Mumbai' },
  '411001': { lat: 18.5204, lng: 73.8567, city: 'Pune City' },

  // Karnataka
  '560001': { lat: 12.9716, lng: 77.5946, city: 'MG Road, Bengaluru' },
  '560009': { lat: 12.9767, lng: 77.5713, city: 'Majestic, Bengaluru' },
  '560011': { lat: 12.9298, lng: 77.5838, city: 'Jayanagar, Bengaluru' },

  // Tamil Nadu
  '600001': { lat: 13.0878, lng: 80.2785, city: 'George Town, Chennai' },
  '600003': { lat: 13.0827, lng: 80.2707, city: 'Park Town, Chennai' },

  // West Bengal
  '700001': { lat: 22.5726, lng: 88.3639, city: 'BBD Bagh, Kolkata' },
  '700073': { lat: 22.5726, lng: 88.3639, city: 'College Street, Kolkata' },

  // Telangana
  '500001': { lat: 17.3850, lng: 78.4867, city: 'Abids, Hyderabad' },
  '500003': { lat: 17.4399, lng: 78.4983, city: 'Secunderabad' },
};
