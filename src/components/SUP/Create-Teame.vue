<template>
  <Header/>
</template>

<script>
import Header from '../Home/Header.vue';

export default {
  components: { Header },  // регистрация
  data() {
    return { /* данные */ }
  },
  data() {
    return {
      openIndex: null,
    }
  },
  methods: {
    toggleAccordion(index) {
      if (this.openIndex === index) {
        this.openIndex = null
      } else {
        this.openIndex = index
      }
    },
  },
}
</script>
