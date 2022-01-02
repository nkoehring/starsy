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
    <circle id="star" :r="star.radius" :cx="starCX" cy="150" />

    <g class="object" :id="o.name" v-for="o in objects">
      <g class="rings" v-for="i in o.rings">
        <circle :r="o.radius - 5 + 2*i" :cx="o.distance" cy="150" />
      </g>

      <text :class="{ tilted: o.radius < 10 }" :x="o.distance" :y="140 - o.radius">{{ o.name }}</text>
      <circle v-if="o.type === 'planet'" :r="o.radius" :cx="o.distance" cy="150" />
      <line v-if="o.satellites.length" :x1="o.distance" y1="150" :x2="o.distance" :y2="150 + o.radius + 10*o.satellites.length" />

      <g class="satellite" v-for="m,i in o.satellites">
        <rect v-if="m.type === 'station'" class="station" :x="o.distance - 2" :y="158 + o.radius + 10*i" width="4" height="4" />
        <circle v-else :r="m.radius" :cx="o.distance" :cy="160 + o.radius + 10*i" />
        <text :x="o.distance + 5" :y="162 + o.radius + 10*i">{{ m.name }}</text>
      </g>

    </g>

    <text id="designation" :class="`title-${selectedFont}`" x="980" y="30">{{ star.designation }}</text>
  </svg>

  <section id="settings">
    <header>
      <h1>Star System Parameters</h1>
      <menu id="system-settings">
        <label>
          Name
          <input type="text" v-model="star.designation" />
        </label>
        <label>
          Star Size
          <input type="range" min="50" max="1500" v-model="star.radius" />
          ({{ star.radius }})
        </label>
      </menu>
    </header>
    <menu id="object-list">
      <div class="menu-item" :class="{ open: selectedObject === o }" v-for="o in objects">
        <label @click="toggleObject(o)">{{ o.name }}</label>
        <div class="object-settings">
          <header>
            <h2><input type="text" v-model="o.name" @blur="checkName(o)"/> settings</h2>
            <p>Distance Δ: {{ o.distance }}</p>
            <p>Radius r: {{ o.radius }}</p>
            <p>Satellites: {{ listSatellites(o) }}</p>
          </header>
          <label>
            Δ
            <input class="planet-distance" type="range" min="50" max="1000" v-model="o.distance" />
          </label>
          <label>
            r
            <input class="planet-radius" type="range" min="1" max="125" v-model="o.radius" />
          </label>
        </div>
      </div>
      <button>add object</button>
    </menu>
  </section>

</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import steepCurve from './steep-curve'

const star = reactive({
  designation: 'Sol',
  radius: 400,
})

const starCX = computed(() => -1 * star.radius * steepCurve(star.radius, 50, 0.955))

const objects = ref([
  { type: 'planet', name: 'Mercury', radius: 1, distance: 100, satellites: [], rings: [] },
  { type: 'planet', name: 'Venus', radius: 4, distance: 120, satellites: [], rings: [] },
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
  ], rings: [] },
])

const selectedObject = ref(null)

function toggleObject (obj) {
  selectedObject.value = selectedObject.value === obj ? null : obj
}
function checkName (obj) {
  if (!obj.name.trim().length) {
    const index = objects.value.indexOf(obj)
    obj.name = `${star.designation}-${index}`
  }
}

const labelFonts = ['douar', 'lack', 'xolonium']
const selectedFont = ref('xolonium')

const themes = ['default', 'retro', 'inverse', 'paper']
const selectedTheme = ref('default')

function setTheme () {
  document.body.className = `theme-${selectedTheme.value}`
}

function listSatellites (obj) {
  if (!obj.satellites || !obj.satellites.length) return 'none'
  return obj.satellites.reduce((acc, satellite) => {
    let s = satellite.name
    if (satellite.type) s += ` (${satellite.type})`
    acc.push(s)
    return acc
  }, []).join(', ')
}
setTheme()
</script>
