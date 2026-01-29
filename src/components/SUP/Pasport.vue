<template>
  <Header/>
  <div class="w-full flex flex-col items-center lg:mt-20 mt-18">
    <!-- Заголовок -->
    <h1 class="lg:text-5xl text-[33px] font-bold lg:mb-12 mb-8">О проекте <span class="text-[#222222]"></span></h1>
  </div>

</template>

<script>
import Header from '../Home/Header.vue';

export default {
  components: { Header },

  data() {
    return {
      showModal: false,
      selectedUsers: []
    }
  },

  methods: {
    setUsers(users) {
      this.selectedUsers = users
    },
    removeUser(id) {
      this.selectedUsers = this.selectedUsers.filter(u => u.id !== id)
    }
  }
}
</script>
