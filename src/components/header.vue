   <template>

    <nav>
      <!--back button appera when info is displayed-->
      <button class="btn-back" v-if="isDetailView"
        @click="$emit('go-home')">
        <img src="@/assets/back-icon.svg" alt="" >
      </button>

        <figure
            @click="$emit('go-home')">
          <img src="@/assets/logo-indieanimation.png" alt="IndieAnimation" class="logo">
        </figure>

        <div class="lang-dropdown mobile-dropdown" :class="{ 'is-open': isOpen }" @click="isOpen = !isOpen">
          <div class="current-lang">
            {{ $i18n.locale.toUpperCase() }}
            <span class="arrow">▼</span>
          </div>
          
          <div class="dropdown-options">
            <button v-if="$i18n.locale === 'fr'" @click.stop="$i18n.locale = 'en'" class="dropdown-btn">
              EN
            </button>
            
            <button v-if="$i18n.locale === 'en'" @click.stop="$i18n.locale = 'fr'" class="dropdown-btn">
              FR
            </button>
          </div>
        </div>

        <div class="toggle-container" :class="{ 'is-fr': $i18n.locale === 'fr' }">
          <div class="lang-slider"></div>

          <button 
            @click="$i18n.locale = 'en'" 
            :class="{ active: $i18n.locale === 'en' }"
            class="toggle-btn">
            EN
          </button>

          <button 
            @click="$i18n.locale = 'fr'" 
            :class="{ active: $i18n.locale === 'fr' }"
            class="toggle-btn">
            FR
          </button>
        </div>
    </nav>

  </template>

  <style scoped>


  </style>


  <script setup>

    import { ref } from 'vue'

    const isOpen = ref(false)
   
    defineProps({
        isDetailView: {
          type: Boolean,
          default: false
        }
      })

      defineEmits(['go-home'])
  </script>

 