<script setup lang="ts">
import { ref, toRaw } from 'vue'
import useTheme from '../useTheme'
import useLocalFonts, { type FontData } from '../useLocalFonts'

export interface Props {
  modalData?: object
}
export interface Events {
  (e: 'close'): void
}
defineProps<Props>()
const emit = defineEmits<Events>()

const {
  currentTheme,
  themes,
  fonts,
  addTheme,
  overwriteTheme,
  applyTheme,
  removeTheme,
} = useTheme()

const { canQueryLocalFonts, queryLocalFonts, loadFont, localFonts } = useLocalFonts()

const originalLabel = ref(currentTheme.value.label)
const editedTheme = ref(structuredClone(toRaw(currentTheme.value)))
const error = ref<null | { field: string, msg: string }>(null)

const attemptThemeCreation = () => {
  error.value = null

  if (editedTheme.value.label === currentTheme.value.label) {
    error.value = {
      field: 'label',
      msg: 'Label cannot stay the same.'
    }
    return
  }
  const success = addTheme(toRaw(editedTheme.value))
  if (!success) {
    error.value = {
      field: 'label',
      msg: 'A theme with the same name already exists!'
    }
    return
  }
  applyTheme(currentTheme.value.label)
  emit('close')
}

const attemptSave = () => {
  const success = overwriteTheme(originalLabel.value, editedTheme.value)
  if (!success) {
    error.value = {
      field: 'form',
      msg: `Either the theme ${editedTheme.value.label} doesn't exist or it's a system theme and cannot be overwritten.`
    }
    return
  }
  applyTheme(currentTheme.value.label)
  emit('close')
}

const attemptThemeRemoval = () => {
  const isConfirmed = confirm('This will irrevocally delete the theme! Are you sure?')
  if (!isConfirmed) return

  const success = removeTheme(editedTheme.value.label)
  if (!success) {
    error.value = {
      field: 'form',
      msg: `Either the theme ${editedTheme.value.label} doesn't exist or it's a system theme and cannot be deleted.`
    }
    return
  }

  applyTheme(themes.value[0])
  emit('close')
}
</script>

<template>
  <header class="modal-header">
    <h1>Theme Editor</h1>
  </header>

  <div class="modal-content">
    <form>

      <label>
        <div class="labelinput">
          Theme Label
          <input type="text" v-model="editedTheme.label">
        </div>
        <div class="error-message" v-if="error?.field === 'label'">
          {{ error.msg }}
        </div>
      </label>

      <label>
        <div class="labelinput">
          Theme Font
          <select v-model="editedTheme.font">
            <option v-for="f in fonts">{{ f }}</option>
            <option v-for="lf in localFonts">{{ lf.fullName }}</option>
          </select>

          <button v-if="canQueryLocalFonts"
            type="button"
            @click="queryLocalFonts()"
            title="Allow querying local fonts to add fonts that are installed on your computer. This might not work for all fonts."
          >
            allow local
          </button>
        </div>
        <div class="error-message" v-if="error?.field === 'font'">
          {{ error.msg }}
        </div>
      </label>

      <div class="font-example"
        :style="{
          fontFamily: editedTheme.font,
          color: editedTheme.fgGraphic,
          background: editedTheme.bgGraphic,
        }"
        contenteditable
      >
        Editable Font Example
      </div>

      <label>
        <div class="labelinput">
          Diagram Star Color
          <div>
            <button type="button" @click="editedTheme.fillStar = 'auto'"
              disabled
              :class="{ selected: editedTheme.fillStar === 'auto' }"
              title="- COMING SOON - Automatically set the star color according to its size, from dark red dwarfs to bright blue giants."
            >
              auto
            </button>
            <input
              v-model="editedTheme.fillStar"
              type="color"
            >
          </div>
        </div>
        <div class="error-message" v-if="error?.field === 'fillStar'">
          {{ error.msg }}
        </div>
      </label>

      <label>
        <div class="labelinput">
          Diagram Object Color
          <input type="color" v-model="editedTheme.fgGraphic">
        </div>
        <div class="error-message" v-if="error?.field === 'fgGraphic'">
          {{ error.msg }}
        </div>
      </label>

      <label>
        <div class="labelinput">
          Diagram Highlight Color
          <input type="color" v-model="editedTheme.hlGraphic">
        </div>
        <div class="error-message" v-if="error?.field === 'hlGraphic'">
          {{ error.msg }}
        </div>
      </label>

      <label>
        <div class="labelinput">
          Diagram Background Color
          <input type="color" v-model="editedTheme.bgGraphic">
        </div>
        <div class="error-message" v-if="error?.field === 'bgGraphic'">
          {{ error.msg }}
        </div>
      </label>

      <label>
        <div class="labelinput">
          Application Text Color
          <input type="color" v-model="editedTheme.fgApp">
        </div>
        <div class="error-message" v-if="error?.field === 'fgApp'">
          {{ error.msg }}
        </div>
      </label>

      <label>
        <div class="labelinput">
          Application Warning Color
          <input type="color" v-model="editedTheme.fgDanger">
        </div>
        <div class="error-message" v-if="error?.field === 'fgDanger'">
          {{ error.msg }}
        </div>
      </label>

      <label>
        <div class="labelinput">
          Application Background Color
          <input type="color" v-model="editedTheme.bgApp">
        </div>
        <div class="error-message" v-if="error?.field === 'bgApp'">
          {{ error.msg }}
        </div>
      </label>

      <label>
        <div class="labelinput">
          Dark or bright buttons?
          <div>
            <button type="button"
              @click="editedTheme.isBright = true"
              class="action example bright"
              :class="{ selected: editedTheme.isBright }"
            />
            <button type="button"
              @click="editedTheme.isBright = false"
              class="action example dark"
              :class="{ selected: !editedTheme.isBright }"
            />
          </div>
        </div>
        <div class="error-message" v-if="error?.field === 'bgApp'">
          {{ error.msg }}
        </div>
      </label>

      <div class="form-actions">
        <button type="button" class="cta danger"
          :disabled="currentTheme.system"
          :title="currentTheme.system ? 'System themes cannot be deleted' : ''"
          @click="attemptThemeRemoval()"
        >
          Delete
        </button>

        <button type="button" class="cta" @click="attemptThemeCreation()">
          Save as New
        </button>

        <button type="button" class="cta"
          :disabled="currentTheme.system"
          :title="currentTheme.system ? 'System themes cannot be overwritten' : ''"
          @click="attemptSave()"
        >
          Save
        </button>
      </div>
      <div class="error-message" v-if="error?.field === 'form'">
        {{ error.msg }}
      </div>
    </form>
  </div>
</template>
