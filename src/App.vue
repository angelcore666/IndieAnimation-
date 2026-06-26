<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import axios from 'axios'
import indieheader from '@/components/header.vue'
import indiefooter from '@/components/footer.vue'
//import of things like components


//this part is for gsap (retrieved directly from the window)
const gsap = window.gsap
const Flip = window.Flip
const ScrollSmoother = window.ScrollSmoother
const ScrollTrigger = window.ScrollTrigger

if (gsap && Flip) {
  gsap.registerPlugin(Flip)
  gsap.registerPlugin(ScrollSmoother, ScrollTrigger)
}

const infos = ref([]) 
const filtre = ref('')
const selectGenre = ref(null)
const selectedAnimation = ref(null)

//get animation info with axios
const fetchAnimations = async () => {
  try {
    const response = await axios.get('https://indieanimation.alwaysdata.net/wp-json/api/v2/animations')
    infos.value = response.data 
  } catch (error) {
    console.error("erreur recup d'info", error)
  }
}

onMounted(async () => {
  await fetchAnimations()
  await nextTick() // wait for vue to finish the html

  //scrollsmoother
  if (window.ScrollSmoother) {
    window.ScrollSmoother.create({
      smooth: 1.2,
      effects: true,
      smoothTouch: false
    })
  }

  // check if mobile to avoid drag conflict
  const isTactile = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (!isTactile) {
      const slider = document.querySelector('.genre-list')
      if (slider) {
        let isDown = false
        let startX
        let scrollLeft

        slider.addEventListener('mousedown', (e) => {
          isDown = true
          startX = e.pageX - slider.offsetLeft
          scrollLeft = slider.scrollLeft
          slider.style.cursor = 'grabbing'
        })

        slider.addEventListener('mouseleave', () => {
          isDown = false
          slider.style.cursor = 'grab'
        })

        slider.addEventListener('mouseup', () => {
          isDown = false
          slider.style.cursor = 'grab'
        })

        slider.addEventListener('mousemove', (e) => {
          if (!isDown) return
          e.preventDefault()
          const x = e.pageX - slider.offsetLeft
          const walk = (x - startX) * 1.5
          slider.scrollLeft = scrollLeft - walk
        })
      }
    }
})



// to get images from animations
const getIdFromUrl = (url) => {
 const parts = url.split('/').filter(Boolean)
 return parts[parts.length - 1]
}

//capitalize first letter of a word
const capitalizeFirstLetter = (text) => {
  if (!text) return ''
  return text.toLowerCase().charAt(0).toUpperCase() + text.toLowerCase().slice(1)
}

//look for taxonomies
//is directly linked to the genres const
const listGenres = computed(() => {
  const genreSet = []

  infos.value.forEach(animation => {
    if (animation.taxonomies) {
      // call it "genre" here
      animation.taxonomies.forEach(genre => { 
        // and use "genre.term_id" everywhere
        if (!genreSet.some(g => g.term_id === genre.term_id)) {
          genreSet.push(genre)
        }
      })
    }
  })
  
  return genreSet
})



// function triggered on click to load a details page of an animation
const selectAnimation = (animation) => {
  window.scrollTo({top: 0,}) //puts back to the top

  console.log("animation sélectionnée ", animation.titre) // avoid getting pranked
  selectedAnimation.value = animation //store the obj directly
}

//selected taxo and research
//computed property for the search filter
//globaly computed use dependance like some genre
const filteredAnimations = computed (() => {

    return infos.value.filter (animation => {
        //search bar filter
        const correspondSearch = animation
        ? animation.titre.toLowerCase().includes(filtre.value.toLocaleLowerCase())
        : false

        //gender tag filter
        let correspondGenre = true

        if (selectGenre.value) {
          correspondGenre = animation.taxonomies
          ? animation.taxonomies.some(g => g.term_id === selectGenre.value.term_id)
          :false 
        }
        // need both to be true
        return correspondSearch && correspondGenre
    })
})

// gsap part
const cycleStack = () => {

  //security to stop cycling on touch if we are on pc
  if(window.innerWidth >= 850) return
  
  if (filteredAnimations.value.length <= 1) return

  const state = Flip.getState(".card")

  // take the first card and put it at the end
  const firstItem = infos.value[0]
  infos.value.shift()
  infos.value.push(firstItem)
 
}

const isSpinning = ref(false)

const stopSpinning = () => {
  isSpinning.value = false
}

const randomizeStack = () => {
  if (infos.value.length <= 1) return

  isSpinning.value = true


  // mix the array randomly
  for (let i = infos.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [infos.value[i], infos.value[j]] = [infos.value[j], infos.value[i]]
  }

}

// fonction pour transformer un lien YouTube classique en lien "embed" pour l'iframe
const getEmbedUrl = (url) => {
  if (!url) return ''
  
  //cut the link to put in an id and then add in the new link
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1].split('?')[0]
    return `https://www.youtube.com/embed/${id}`
  }
  
  //same just for ytb short link
  if (url.includes('v=')) {
    const id = url.split('v=')[1].split('&')[0]
    return `https://www.youtube.com/embed/${id}`
  }
  
  return url
}

const resetToHome = () => {
  window.scrollTo({ top: 0,})
  selectedAnimation.value = null
}



// do not forget that constants can be called in the class later
// with v-for and v-if

</script>


<template>
 <main>

    <indieheader :is-detail-view="selectedAnimation !== null" @go-home="resetToHome"/>
      
    <div v-if="!selectedAnimation" key="home-page">

      <div class="general-search">
      <!-- search part-->
        <div class="search-bar">
          <input type="search" placeholder="Rechercher..." v-model="filtre">
        </div>

        <!-- gender skibidi list-->
        <div class="genre-list">
            <button class="genre-item-list":class="{active: selectGenre === null}" @click="selectGenre = null">Tout</button>

            <button class="genre-item-list" v-for="genre in listGenres" :key="genre.term_id" :class="{ active: selectGenre?.term_id === genre.term_id }" @click="selectGenre = genre">
              {{ genre.name }}
            </button>

        </div>
      </div>

        <!--animations list with cards-->
        <div class="animation-list slider">

            <button class="randomizer" @click="randomizeStack">
                    <svg
                    :class="{ spinning: isSpinning }" 
                    @animationend="stopSpinning" xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path d="M4.7578 15.9088C1.86146 12.7946 1.91267 7.91341 4.9217 4.8825C6.10077 3.68917 7.63427 2.90936 9.29311 2.65957L9.20476 0C6.87584 0.27999 4.7106 1.34121 3.06251 3.01043C-0.96959 7.06957 -1.01825 13.6244 2.90501 17.7757L0.675771 20.0191L7.73098 20.4046L7.71177 12.9342L4.7578 15.9088ZM13.2689 0.595427L13.2881 8.06579L16.242 5.0925C19.1384 8.20921 19.0872 13.0904 16.0781 16.1188C14.8991 17.3121 13.3656 18.0919 11.7067 18.3417L11.7951 21C14.1237 20.7187 16.2888 19.6582 17.9386 17.9909C21.9694 13.9291 22.0181 7.37433 18.0948 3.22555L20.3241 0.979573L13.2689 0.595427Z"/>
                    </svg>
                  Randomizer
            </button>

            <div class="card-container">
              
                  <div 
                    v-for="(animation, index) in filteredAnimations" 
                    :key="animation.titre" 
                    class="card" 
                    :style="{ zIndex: filteredAnimations.length - index }"
                  >
                  
                    <img 
                      v-if="animation.illustration" 
                      :src="animation.illustration.url" 
                      :alt="animation.titre" 
                      class="card-image"
                      @click="index === 0 ? cycleStack() : null" 
                      style="cursor: pointer;"
                    >
                    <div class="card-content" >
                      
                      <h3 @click="index === 0 ? cycleStack() : null" 
                      style="cursor: pointer;" >{{ animation.titre }}</h3>
                      
                      <p class="date-tag"><img src="@/assets/calendar-icon.svg" alt="Calendar" /><span>{{animation.date_sortie}}</span></p>
                      
                      <div class="tags-container">
                        <p class="genre-tag"
                        v-for="genre in animation.taxonomies.slice(0, 3)"
                        :key="genre.term_id">{{ genre.name }}</p>
                      </div>


                      <div class="tags-container">
                        <p class="type-tag"
                        v-for="(type,index) in animation.type_contenu"
                        :key="type.term_id">{{ type.name }}<span v-if="index < animation.type_contenu.length - 1">, </span></p>
                      </div>

                      <button class="button-card" @click="selectAnimation(animation)">
                        Voir plus
                      </button>

                    </div>

                  </div>
                
            </div>

        </div>
        </div>

        <div v-else key="detail-page" class="detail-page-wrapper">

          <div class="detail-content">
            <div class="detail-banner">
              <img v-if="selectedAnimation.image_banniere" :src="selectedAnimation.image_banniere.url" :alt="selectedAnimation.titre">
            </div>

            <div class="details">
              <div class="infos-hero">
                  <img 
                    v-if="selectedAnimation.illustration" 
                    :src="selectedAnimation.illustration.url" 
                    :alt="selectedAnimation.titre" 
                    class="detail-illustration"
                  >
                  <div class="hero-content">
                    <h2>{{ selectedAnimation.titre }}</h2>
                    <p class="auteur">{{ selectedAnimation.auteur }}</p>
                    <p>Origine {{ selectedAnimation.origine_animation }}</p>
                    <p class="detail-date"><span>{{ selectedAnimation.date_sortie }}</span></p>
                    <div class="hero-tag">
                      <p
                          v-for="genre in selectedAnimation.taxonomies.slice(0, 2)" 
                          :key="genre.term_id" 
                          class="genre-tag"
                        >
                          {{ genre.name }}
                      </p>
                    </div>
                  </div>


              </div>
              
              <div class="first-part">
                <div class="infos-format">
                  <p><img src="@/assets/clock-icon.svg" alt="" aria-hidden="true" />~{{ selectedAnimation.duree_episode }} min / episode</p>

                  <p v-if="selectedAnimation.nombre_episode > 1 || !selectedAnimation.type_contenu?.some(t => ['court métrage', 'film'].includes(t.name.toLowerCase()))">
                    {{ selectedAnimation.nombre_episode }} épisode{{ selectedAnimation.nombre_episode > 1 ? 's' : '' }}
                  </p>

                  <p v-if="!selectedAnimation.nombre_saisons || selectedAnimation.nombre_saisons == 0">
                    {{ 
                        selectedAnimation.type_contenu?.find(t => ['court métrage', 'film'].includes(t.name.toLowerCase()))?.name 
                        || selectedAnimation.type_contenu?.[0]?.name 
                        || 'Format inconnu' 
                      }}
                  </p>

                  <p v-else>{{ selectedAnimation.nombre_saisons }} Saison{{ selectedAnimation.nombre_saisons > 1 ? 's' : '' }}</p>
                </div>

                
                <div v-if="selectedAnimation.description" class="description-box">
                  <h3>Description</h3>
                  <p>{{ selectedAnimation.description }}</p>
                </div>
              </div>
              
              <div class="video">
                <div v-if="selectedAnimation.lien_bande_annonce" class="video-container">
                  <!--<h3>Bande-annonce / Film</h3>-->
                  <svg xmlns="http://www.w3.org/2000/svg" width="47" height="39" viewBox="0 0 47 39" fill="none">
                    <path class="eye-contour" d="M38.2562 30.7691C38.2564 30.7685 38.2558 30.7679 38.2552 30.768L29.7081 32.4797C22.9325 33.8359 15.8962 32.606 9.98367 29.0306L4.67156 25.818C4.47157 25.697 4.50534 25.3973 4.72722 25.3238L14.7587 22.0041C19.2586 20.5141 24.1951 21.2049 28.1147 23.8718L38.2548 30.7697C38.2554 30.77 38.2561 30.7697 38.2562 30.7691Z" fill="white" stroke="#D300FF" stroke-width="2.65547" stroke-miterlimit="10"/>
                    <path class="eye-pupil" d="M22.7156 33.0309C25.5868 33.6229 28.3943 31.7752 28.9863 28.9039C29.5783 26.0327 27.7306 23.2252 24.8594 22.6332C21.9881 22.0412 19.1806 23.8889 18.5886 26.7601C17.9966 29.6314 19.8443 32.4389 22.7156 33.0309Z" fill="#D300FF"/>
                    <path d="M11.0962 17.0237C10.3921 15.8174 11.2039 15.3231 10.497 14.1163C9.79287 12.9101 8.98372 13.405 8.27955 12.1988C7.57539 10.9926 8.38454 10.4976 7.68092 9.28867C6.9773 8.0797 6.16492 8.57682 5.46075 7.37061" stroke="#D300FF" stroke-width="2.09924" stroke-miterlimit="10" stroke-linecap="round"/>
                    <path d="M21.7771 15.0557C21.8641 13.6542 22.8051 13.717 22.8916 12.3182C22.9787 10.9167 22.035 10.8534 22.1188 9.45406C22.2027 8.05474 23.1469 8.11531 23.234 6.71381C23.321 5.31232 22.3774 5.24899 22.4617 3.84692" stroke="#D300FF" stroke-width="2.09924" stroke-miterlimit="10" stroke-linecap="round"/>
                    <path d="M31.38 19.0568C32.3796 18.0985 33.0269 18.8059 34.0238 17.847C35.0234 16.8887 34.3761 16.1813 35.3731 15.2224C36.3727 14.2641 37.0199 14.9715 38.0168 14.0126C39.0164 13.0543 38.3692 12.3469 39.3661 11.388" stroke="#D300FF" stroke-width="2.09924" stroke-miterlimit="10" stroke-linecap="round"/>
                  </svg>
                  <iframe 
                    width="100%" 
                    height="450" 
                    :src="getEmbedUrl(selectedAnimation.lien_bande_annonce)" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen
                  ></iframe>

                  <div v-if="selectedAnimation.synopsis" class="synopsis-box">
                    <h3>Synopsis</h3>
                    <p>{{ selectedAnimation.synopsis }}</p>
                  </div>
                </div>
              </div>

              
            </div>


          </div>

    </div>

    <indiefooter @go-home="resetToHome"/>

 </main>

 
</template>
<style scoped>



</style>
