import { ref, onMounted, onUnmounted } from 'vue'

export function useBreakpoint(breakpoint = 768) {
    // Определяем значение при создании
  const isMobile = ref(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false)

  const checkWidth = () => {
    const newValue = window.innerWidth < breakpoint
    if (isMobile.value !== newValue) {
      console.log(`📱 Ширина: ${window.innerWidth}px, isMobile: ${newValue}`)
      isMobile.value = newValue
    }
  }

  onMounted(() => {
    checkWidth()
    window.addEventListener('resize', checkWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkWidth)
  })

  return { isMobile }
}
