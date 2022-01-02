<template>
  <header>
    <div class="headline">
      <h1>Starsy</h1>
      <p>Starsystem<br/>Generator</p>
    </div>
    <div class="options">
      <label>
        Title Font
        <select v-model="selectedFont">
          <option v-for="f in labelFonts">{{ f }}</option>
        </select>
      </label>
      <label>
        Color Theme
        <select v-model="selectedTheme" @change="setTheme">
          <option v-for="t in themes">{{ t }}</option>
        </select>
      </label>
    </div>
  </header>

  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1000 300">
    <line id="axis" x1="0" y1="150" x2="1000" y2="150" />
    <circle id="star" r="400" cx="-370" cy="150" />

    <g class="object" :id="o.name" v-for="o in objects">
      <text :x="o.distance" :y="140 - o.radius">{{ o.name }}</text>
      <circle v-if="o.type === 'planet'" :r="o.radius" :cx="o.distance" cy="150" />
      <line v-if="o.moons.length" :x1="o.distance" y1="150" :x2="o.distance" :y2="150 + o.radius + 10*o.moons.length" />
      <g class="moon" v-for="m,i in o.moons">
        <circle :r="m.radius" :cx="o.distance" :cy="160 + o.radius + 10*i" />
        <text :x="o.distance + 5" :y="162 + o.radius + 10*i">{{ m.name }}</text>
      </g>
    </g>

    <text id="label" :class="`title-${selectedFont}`" x="980" y="30">{{ label }}</text>
  </svg>

  <div id="settings">
  </div>

</template>

<script setup>
import { ref } from 'vue'

const label = "Sol"

const objects = [
  { type: 'planet', name: 'Mercury', radius: 1, distance: 100, moons: [], stations: [] },
  { type: 'planet', name: 'Venus', radius: 4, distance: 120, moons: [], stations: [] },
  { type: 'planet', name: 'Terra', radius: 4, distance: 140, moons: [
    { name: 'Luna', radius: 2 },
  ], stations: [
    { name: 'ISS' },
  ] },
  { type: 'planet', name: 'Mars', radius: 2, distance: 160, moons: [
    { name: 'Phobos', radius: 1 },
    { name: 'Daimos', radius: 1 },
  ], stations: [
    { name: 'MTS' },
  ] },
  { type: 'planet', name: 'Jupiter', radius: 40, distance: 260, moons: [
    { name: 'Io', radius: 2 },
    { name: 'Europa', radius: 2 },
    { name: 'Ganymede', radius: 4 },
    { name: 'Callisto', radius: 3 },
  ] },
  { type: 'planet', name: 'Saturn', radius: 36, distance: 410, moons: [
    { name: 'Mimas', radius: 1 },
    { name: 'Enceladus', radius: 1 },
    { name: 'Tethys', radius: 1 },
    { name: 'Dione', radius: 1 },
    { name: 'Rhea', radius: 1 },
    { name: 'Titan', radius: 3 },
    { name: 'Iapetus', radius: 1 },
  ] },
  { type: 'planet', name: 'Uranus', radius: 16, distance: 680, moons: [
    { name: 'Miranda', radius: 1 },
    { name: 'Ariel', radius: 1 },
    { name: 'Umbriel', radius: 1 },
    { name: 'Titania', radius: 1 },
    { name: 'Oberon', radius: 1 },
  ] },
  { type: 'planet', name: 'Neptune', radius: 15, distance: 950, moons: [
    { name: 'Triton', radius: 1 },
  ] },
]

const labelFonts = ['douar', 'lack', 'xolonium']
const selectedFont = ref('lack')

const themes = ['default', 'retro', 'inverse', 'paper']
const selectedTheme = ref('default')

function setTheme () {
  document.body.className = `theme-${selectedTheme.value}`
}
</script>