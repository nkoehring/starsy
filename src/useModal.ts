import { ref, shallowRef, type Component } from 'vue'

/** global flag indicating whether a modal is currently shown or not */ 
const isModalShown = ref(false)
/** The component to be rendered inside the modal */
const ModalContent = shallowRef<null | Component>()
/** Data given to the component via the modal-data property */
const modalData = ref({} as object)

/**
 * Composable for working with Modals
 * @returns Object containing:
 * - isModalShown: flag indicating whether a modal is active
 * - ModalContent: the component rendered inside the modal
 * - modalData: data to be used inside the modal
 * - showModal: Function to show modal with given component
 * - hideModal: Function to hide modal and reset all data
 */
export default function useModal() {

  /**
   * Show modal with the given component
   * @param content - Component to be rendered inside modal
   * @param data - optional to be given to component as modal-data property
   */
  const showModal = (content: Component, data?: object) => {
    ModalContent.value = content
    if (data) modalData.value = data
    isModalShown.value = true
  }

  /**
   * Hide modal and reset all data, like ModalContent and modalData
   */
  const hideModal = () => {
    isModalShown.value = false
    ModalContent.value = null
    modalData.value = {}
  }

  return { isModalShown, ModalContent, modalData, showModal, hideModal }
}
