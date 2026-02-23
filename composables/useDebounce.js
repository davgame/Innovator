import { ref } from 'vue'

export function useDebounce(fn, delay) {
  const timeout = ref(null)

  return (...args) => {
    if (timeout.value) clearTimeout(timeout.value)
    timeout.value = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
