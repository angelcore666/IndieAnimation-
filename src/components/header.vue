   <template>

    <nav>
      <button class="btn-back" v-if="isDetailView"
        @click="$emit('go-home')">
        <img src="@/assets/back-icon.svg" alt="" >
      </button>
      
     <figure>
       <img src="@/assets/logo-indieanimation.png" alt="IndieAnimation" class="logo">
     </figure>
    </nav>

  </template>

  <style scoped>


  </style>


  <script setup>
   
    defineProps({
        isDetailView: {
          type: Boolean,
          default: false
        }
      })

      defineEmits(['go-home'])
  </script>

 