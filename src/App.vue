<script setup lang="ts">
import { computed } from 'vue'

import Headline from './components/Headline.vue'
import SystemDiagram from './components/SystemDiagram.vue'
import AppMenu from './components/AppMenu.vue'
import Tips from './components/Tips.vue'
import SystemSettings from './components/SystemSettings.vue'
import ObjectList from './components/ObjectList.vue'
import ObjectSettings from './components/ObjectSettings.vue'
import PresetLoader from './components/PresetLoader.vue'
import PresetSaver from './components/PresetSaver.vue'

import useObjects from './useObjects'
import useTheme from './useTheme'
import useModal from './useModal'

const { selectedObject } = useObjects()
const { fonts, themes, currentTheme, applyTheme } = useTheme()
const { isModalShown, ModalContent, modalData, hideModal } = useModal()
</script>

<template>
  <Headline
    v-bind="{ fonts, themes, currentTheme }"
    @select:theme="applyTheme($event)"
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
    <a target="_blank" rel="noopener" href="https://github.com/nkoehring/starsy">open source</a>
  </footer>

  <div id="modal-container" v-if="isModalShown">
    <div class="content">
      <template v-if="ModalContent">
        <ModalContent :modal-data="modalData" @close="hideModal()" />
      </template>
      <button class="close action" @click="hideModal()" />
    </div>
  </div>
</template>
