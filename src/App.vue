<script setup lang="ts">
import { ref, computed } from 'vue'

import Headline from './components/Headline.vue'
import SystemDiagram from './components/SystemDiagram.vue'
import AppMenu from './components/AppMenu.vue'
import Tips from './components/Tips.vue'
import SystemSettings from './components/SystemSettings.vue'
import ObjectList from './components/ObjectList.vue'
import ObjectSettings from './components/ObjectSettings.vue'
import PresetLoader from './components/PresetLoader.vue'
import PresetSaver from './components/PresetSaver.vue'
import ThemeEditor from './components/ThemeEditor.vue'
import PopupMenu from './components/PopupMenu.vue'

import useObjects from './useObjects'
import useTheme from './useTheme'
import useLocalFonts from './useLocalFonts'
import useModal from './useModal'
import useAppMenu from './useAppMenu'

const { selectedObject } = useObjects()
const { fonts, themes, currentTheme, applyTheme } = useTheme()
const { loadFont } = useLocalFonts()
const { isModalShown, ModalContent, modalData, showModal, hideModal } = useModal()
const { isShowingMenu, appMenuPosition, toggleAppMenu } = useAppMenu()

const isPrintingMode = ref(false)
const appMenuItems = [
  { label: 'Add/Edit Theme', value: 'theme-editor' },
  // { label: 'Export', value: 'export' },
]

// check if theme uses a local font, and install it
if (fonts.indexOf(currentTheme.value.font) <= 0) {
  loadFont(currentTheme.value.font)
}

const handleAppMenuSelection = (selection: string) => {
  switch (selection) {
    case "theme-editor":
      showModal(ThemeEditor)
      break
  }
}

function showAbout() {
  const aboutEl = document.getElementById('about')
  if (!aboutEl) return

  aboutEl.classList.remove('hidden')
  aboutEl.addEventListener('click', () => aboutEl.classList.add('hidden'))
}
</script>

<template>
  <Headline v-show="!isPrintingMode"
    v-bind="{ fonts, themes, currentTheme }"
    @select:theme="applyTheme($event)"
    @select:menu="toggleAppMenu($event)"
  />
  <SystemDiagram />

  <section id="settings">
    <ObjectSettings v-if="selectedObject" />
    <AppMenu default-slot="tips">
      <template #tips>
        <ul>
          <li>Edit planets by clicking directly inside the graphic or in the table below.</li>
          <li>Drag planets around to change their distance.</li>
          <li>The last removed planet can be restored from the table.</li>
          <li><strong>ONLY THE LAST</strong> removed planet can be restored.</li>
          <li>Click on a planet to get more tips.</li>
        </ul>
      </template>
      <template #load>
        <PresetLoader />
      </template>
      <template #save>
        <PresetSaver />
      </template>
      <template #collapse>
        <!-- empty template to "close" the menu -->
      </template>
    </AppMenu>
    <SystemSettings />
    <ObjectList />
  </section>

  <footer>
    An experiment by
    <a target="_blank" rel="noopener" href="https://koehr.ing">koehr</a> |
    © 2022 - today |
    <a target="_blank" rel="noopener" href="https://reddit.com/r/starsy">discuss on reddit</a> |
    <a target="_blank" rel="noopener" href="https://github.com/nkoehring/starsy">open source</a> |
    <button class="about-button" type="button" @click="showAbout()">about starsy</button>
  </footer>

  <div id="modal-container" v-if="isModalShown">
    <div class="content">
      <template v-if="ModalContent">
        <ModalContent :modal-data="modalData" @close="hideModal()" />
      </template>
      <button class="close action" @click="hideModal()" />
    </div>
  </div>

  <PopupMenu v-model="isShowingMenu"
    :menu-items="appMenuItems"
    :position="appMenuPosition"
    @select="handleAppMenuSelection($event)"
  />
</template>
