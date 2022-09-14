

export function getDistanceFromLatLonInMi([lat1,lon1] : [number, number], [lat2,lon2]: [number, number]): number {
  let R = 3958.8; // Radius of the earth in miles
  let dLat = deg2rad(lat2-lat1);  // deg2rad below
  let dLon = deg2rad(lon2-lon1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  let d = R * c; // Distance in km
  return d;
}

export function isWithinMi([lat1, lon1]: [number, number], [lat2, lon2]: [number, number], mile: number): boolean {
  let distance = getDistanceFromLatLonInMi([lat1, lon1], [lat2, lon2])
  if (distance <= mile) return true
  else return false
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180)
}