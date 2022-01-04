export default [
  { type: 'planet', name: 'Mercury', radius: 1, distance: 100, satellites: [], rings: 0 },
  { type: 'planet', name: 'Venus', radius: 4, distance: 120, satellites: [], rings: 0 },
  { type: 'planet', name: 'Terra', radius: 4, distance: 140, satellites: [
    { name: 'ISS', type: 'station' },
    { name: 'Luna', radius: 2 },
  ], rings: 0 },
  { type: 'planet', name: 'Mars', radius: 2, distance: 160, satellites: [
    { name: 'MTO', type: 'station' },
    { name: 'Phobos', radius: 1 },
    { name: 'Daimos', radius: 1 },
  ], rings: 0 },
  { type: 'planet', name: 'Jupiter', radius: 40, distance: 260, satellites: [
    { name: 'Io', radius: 2 },
    { name: 'Europa', radius: 2 },
    { name: 'Ganymede', radius: 4 },
    { name: 'Callisto', radius: 3 },
  ], rings: 1 },
  { type: 'planet', name: 'Saturn', radius: 36, distance: 410, satellites: [
    { name: 'Mimas', radius: 1 },
    { name: 'Enceladus', radius: 1 },
    { name: 'Tethys', radius: 1 },
    { name: 'Dione', radius: 1 },
    { name: 'Rhea', radius: 1 },
    { name: 'Titan', radius: 3 },
    { name: 'Iapetus', radius: 1 },
  ], rings: 5 },
  { type: 'planet', name: 'Uranus', radius: 16, distance: 680, satellites: [
    { name: 'Miranda', radius: 1 },
    { name: 'Ariel', radius: 1 },
    { name: 'Umbriel', radius: 1 },
    { name: 'Titania', radius: 1 },
    { name: 'Oberon', radius: 1 },
  ], rings: 2 },
  { type: 'planet', name: 'Neptune', radius: 15, distance: 950, satellites: [
    { name: 'Triton', radius: 1 },
  ], rings: 0 },
]
