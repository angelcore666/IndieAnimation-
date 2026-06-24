<template>

    <footer>
      <figure
        @click="$emit('go-home')">
        <img src="@/assets/logo-indieanimation.png" alt="IndieAnimation" class="logo-footer">
      </figure>
      <p>©2026 IndieAnimation+</p>
   </footer>
   
</template>

<script setup>
   
    defineProps({
        isDetailView: {
          type: Boolean,
          default: false
        }
      })

      defineEmits(['go-home'])
  </script>