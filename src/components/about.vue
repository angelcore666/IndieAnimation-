<template>
  <main>
    <indieheader :is-detail-view="true" @go-home="retourAccueil"/>
    
    <div class="infos-page" v-if="infoPage">

        <h1>{{ infoPage.title.rendered }}</h1>

        <div v-html="infoPage.content.rendered" class="infos-content"></div>

        <p class="update-date">
          Dernière mise à jour : {{ formaterDate(infoPage.modified) }}
        </p>

    </div>

    <div v-else class="loading">
        <img src="@/assets/cute_frog_loading.gif" alt="loading" class="logo">
    </div>
    
    <indiefooter/>
  </main>
</template>

<script setup>
    
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import indieheader from './header.vue'
    import axios from 'axios'

    const $router = useRouter()
    const retourAccueil = () => {
        $router.push('/')
    }

    const infoPage = ref(null)

    const formaterDate = (dateRaw) => {
    const date = new Date(dateRaw)
    return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    })
    }

    onMounted(async () => {
        try {
            const response = await axios.get('https://indieanimation.alwaysdata.net/wp-json/wp/v2/pages/132')
            infoPage.value = response.data
        } catch (error) {
            console.error('.')
        }
    })

</script>

<style scoped>
    .infos-page {
        min-height: 60vh;
        padding: 40px;
        max-width: 800px;
        margin: 70px 5px 50px 5px;
    }

    h1 {
        font-family: 'Poppins-Bold', sans-serif;
        font-size: 30px;
        margin-bottom: 20px;
    }

    .update-date {
        margin-top: 30px;
        font-size: 0.9rem;
        opacity: 0.6;
        font-style: italic;
    }

    .loading {
        min-height: 76.5vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 1.2rem;
        margin-top: 50px;
    }

    .loading img {
        width: 10%;
        height: 100%;
        margin-bottom: 20px;
    }

    .infos-content :deep(a) {
        color: var(--secondary-color);
        text-decoration: underline;
        font-weight: bold;
    }

    /* Responsive styles */
    @media (max-width: 600px) {
            .loading img {
            width: 30%;
            height: 100%;
            margin-bottom: 20px;
        }
    }
</style>