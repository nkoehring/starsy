export default {
  star: {
    designation: 'Sol',
    radius: 400,
  },
  objects: [
    { type: 'planet', name: 'Mercury', designation: 'Sol-1', radius: 1, distance: 100, satellites: [], rings: 0 },
    { type: 'planet', name: 'Venus', designation: 'Sol-2', radius: 4, distance: 120, satellites: [], rings: 0 },
    { type: 'planet', name: 'Terra', designation: 'Sol-3', radius: 4, distance: 140, satellites: [
      { name: 'ISS', radius: 1, type: 'station' },
      { name: 'Luna', radius: 2, type: 'moon' },
    ], rings: 0 },
    { type: 'planet', name: 'Mars', designation: 'Sol-4', radius: 2, distance: 160, satellites: [
      { name: 'MTO', radius: 1, type: 'station' },
      { name: 'Phobos', radius: 1, type: 'moon' },
      { name: 'Daimos', radius: 1, type: 'moon' },
    ], rings: 0 },
    { type: 'planet', name: 'Jupiter', designation: 'Sol-5', radius: 40, distance: 260, satellites: [
      { name: 'Io', radius: 2, type: 'moon' },
      { name: 'Europa', radius: 2, type: 'moon' },
      { name: 'Ganymede', radius: 4, type: 'moon' },
      { name: 'Callisto', radius: 3, type: 'moon' },
    ], rings: 1 },
    { type: 'planet', name: 'Saturn', designation: 'Sol-6', radius: 36, distance: 410, satellites: [
      { name: 'Mimas', radius: 1, type: 'moon' },
      { name: 'Enceladus', radius: 1, type: 'moon' },
      { name: 'Tethys', radius: 1, type: 'moon' },
      { name: 'Dione', radius: 1, type: 'moon' },
      { name: 'Rhea', radius: 1, type: 'moon' },
      { name: 'Titan', radius: 3, type: 'moon' },
      { name: 'Iapetus', radius: 1, type: 'moon' },
    ], rings: 5 },
    { type: 'planet', name: 'Uranus', designation: 'Sol-7', radius: 16, distance: 680, satellites: [
      { name: 'Miranda', radius: 1, type: 'moon' },
      { name: 'Ariel', radius: 1, type: 'moon' },
      { name: 'Umbriel', radius: 1, type: 'moon' },
      { name: 'Titania', radius: 1, type: 'moon' },
      { name: 'Oberon', radius: 1, type: 'moon' },
    ], rings: 2 },
    { type: 'planet', name: 'Neptune', designation: 'Sol-8', radius: 15, distance: 950, satellites: [
      { name: 'Triton', radius: 1, type: 'moon' },
    ], rings: 0 },
  ],
}
