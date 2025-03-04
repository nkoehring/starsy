import { ref, shallowRef, type Component } from 'vue'

const isModalShown = ref(false)
const ModalContent = shallowRef<null | Component>()
const modalData = ref({} as object)

export default function() {
  const showModal = (content: Component, data?: object) => {
    ModalContent.value = content
    if (data) modalData.value = data
    isModalShown.value = true
  }

  const hideModal = () => {
    isModalShown.value = false
    ModalContent.value = null
    modalData.value = {}
  }

  return { isModalShown, ModalContent, showModal, hideModal, modalData }
}
