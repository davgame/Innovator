<template>
  <Header/>

  <div class="flex lg:flex-row flex-col justify-center items-center" style="height: calc(105vh - 80px);">
    <img src="/src/assets/images/505.svg" alt="502" class="lg:w-[545px] lg:h-[396px] w-[350px] h-[200px]">

    <div class=" flex flex-col lg:pl-5 items-center lg:items-start lg:mb-11">
      <h1 class="font-bold lg:text-[80px] text-[30px]">СЕРВАК УПАЛ!</h1>
      <p class="text-[#000000]/42 lg:text-[18px] text-[12px]">Пытаемся востановить работу сервера <br/> попробуйте перезагрузить страницу</p>

      <button @click="goBack" class="border border-[#CBCBCB] hover:bg-[#F9F9F9] lg:w-[200px] lg:h-[70px] w-[190px] h-[60px] rounded-full mt-5 flex items-center justify-center gap-2 cursor-pointer">
        <img src="/src/assets/images/Restart.svg" alt="strelka" class="lg:w-[25px] lg:h-[25px] w-[23px] ">
        <p class="font-medium lg:text-[20px] text-[17px]">Обновить</p>
      </button>
    </div>
   </div>
</template>

<script>
import Header from '../Home/Header.vue';

export default {
  name: 'Error_502',
  components: {Header },  // регистрация
  methods: {
    reloadPage() {
      window.location.reload();
    }
  }
}
</script>
