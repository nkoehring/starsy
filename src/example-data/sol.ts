import type { StarSystem } from '../types'

const sol: StarSystem = {
  star: {
    designation: 'Sol',
    radius: 400,
  },
  primaryBodies: [
    { type: 'planet', label: 'Mercury', designation: 'Sol-1', radius: 1, distance: 100, satellites: [], rings: 0 },
    { type: 'planet', label: 'Venus', designation: 'Sol-2', radius: 4, distance: 120, satellites: [], rings: 0 },
    { type: 'planet', label: 'Terra', designation: 'Sol-3', radius: 4, distance: 140, satellites: [
      { label: 'ISS', radius: 1, type: 'station' },
      { label: 'Luna', radius: 2, type: 'moon' },
    ], rings: 0 },
    { type: 'planet', label: 'Mars', designation: 'Sol-4', radius: 2, distance: 160, satellites: [
      { label: 'MTO', radius: 1, type: 'station' },
      { label: 'Phobos', radius: 1, type: 'moon' },
      { label: 'Daimos', radius: 1, type: 'moon' },
    ], rings: 0 },
    { type: 'planet', label: 'Jupiter', designation: 'Sol-5', radius: 40, distance: 260, satellites: [
      { label: 'Io', radius: 2, type: 'moon' },
      { label: 'Europa', radius: 2, type: 'moon' },
      { label: 'Ganymede', radius: 4, type: 'moon' },
      { label: 'Callisto', radius: 3, type: 'moon' },
    ], rings: 1 },
    { type: 'planet', label: 'Saturn', designation: 'Sol-6', radius: 36, distance: 410, satellites: [
      { label: 'Mimas', radius: 1, type: 'moon' },
      { label: 'Enceladus', radius: 1, type: 'moon' },
      { label: 'Tethys', radius: 1, type: 'moon' },
      { label: 'Dione', radius: 1, type: 'moon' },
      { label: 'Rhea', radius: 1, type: 'moon' },
      { label: 'Titan', radius: 3, type: 'moon' },
      { label: 'Iapetus', radius: 1, type: 'moon' },
    ], rings: 5 },
    { type: 'planet', label: 'Uranus', designation: 'Sol-7', radius: 16, distance: 680, satellites: [
      { label: 'Miranda', radius: 1, type: 'moon' },
      { label: 'Ariel', radius: 1, type: 'moon' },
      { label: 'Umbriel', radius: 1, type: 'moon' },
      { label: 'Titania', radius: 1, type: 'moon' },
      { label: 'Oberon', radius: 1, type: 'moon' },
    ], rings: 2 },
    { type: 'planet', label: 'Neptune', designation: 'Sol-8', radius: 15, distance: 950, satellites: [
      { label: 'Triton', radius: 1, type: 'moon' },
    ], rings: 0 },
  ],
}

export default sol
