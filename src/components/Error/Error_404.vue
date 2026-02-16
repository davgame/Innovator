<template>
  <Header/>

  <div class="flex lg:flex-row flex-col justify-center items-center" style="height: calc(105vh - 80px);">
    <img src="/src/assets/images/404.svg" alt="404" class="lg:w-[545px] lg:h-[396px] w-[320px] h-[185px]">

    <div class=" flex flex-col lg:pl-5 items-center lg:items-start lg:mb-11">
      <h1 class="font-bold lg:text-[105px] text-[45px]">УПС!</h1>
      <p class="text-[#000000]/42 lg:text-[18px] text-[12px]">Мы не смогли найти страницу, которую <br/>вы искали, повторите попытку позже</p>

      <button @click="goBack" class="border border-[#CBCBCB] hover:bg-[#F9F9F9] lg:w-[200px] lg:h-[70px] w-[190px] h-[60px] rounded-full mt-5 flex items-center justify-center gap-1 cursor-pointer">
        <img src="/src/assets/images/strelka.svg" alt="strelka" class="lg:w-[32px] lg:h-[32px] w-[27px]">
        <p class="font-medium lg:text-[20px] text-[17px]">Обратно</p>
      </button>
    </div>
   </div>
</template>

<script>
import Header from '../Home/Header.vue';

export default {
  name: 'Error_404',
  components: {Header },  // регистрация
  data() {
    return { /* данные */ }
  },
  data() {
    return {
      openIndex: null,
    }
  },
  methods: {
    goBack() {
      // возврат на предыдущую страницу
      this.$router.go(-1)
      // или на главную:
      // this.$router.push('/')
    }
  }
}
</script>
