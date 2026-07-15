<script setup>
    
    import { ref, onMounted, watch} from 'vue'
    import { useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import indieheader from './header.vue'
    import axios from 'axios'

    const $router = useRouter()
    const retourAccueil = () => {
        $router.push('/')
    }

    const infoPage = ref(null)
    const { locale } = useI18n();

    //date and time
    const dateFormat = (dateRaw) => {
        const date = new Date (dateRaw)
        return date.toLocaleDateString(locale.value == 'en' ? 'us-US' : "fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    }

    const reloadPage = () => {
        infoPage.value = null;

        axios.get(`https://indieanimation.alwaysdata.net/wp-json/wp/v2/pages?slug=about-${locale.value}`)
        .then(response => {
        if (response.data.length > 0) {
            infoPage.value = response.data[0];
        }
        })
        .catch(error => {
        console.error(error);
        });
    };

    watch(locale, () => {
        reloadPage();
    });

    onMounted(() => {
        reloadPage();
    });


    const setRandomRotate = (event) => {
    const imgAngle = Math.floor(Math.random() * 21) - 15;
    
    let textAngle = Math.floor(Math.random() * 21) - 15;

    if (textAngle === imgAngle) {
        textAngle = imgAngle > 0 ? imgAngle - 5 : imgAngle + 5;
    }

    const container = event.currentTarget;
    container.style.setProperty('--image-rotate', `${imgAngle}deg`);
    container.style.setProperty('--text-rotate', `${textAngle}deg`);
    };

    const resetRotate = (event) => {
    const container = event.currentTarget;
    container.style.setProperty('--image-rotate', '0deg');
    container.style.setProperty('--text-rotate', '0deg');
    };

</script>

<template>
  <main>
    <indieheader :is-detail-view="true" @go-home="retourAccueil"/>
    
    <div class="infos-page" v-if="infoPage" >

        <div class="icon" @mouseenter="setRandomRotate"
            @mouseleave="resetRotate">
            <a href="https://www.tiktok.com/@holyestrogen" target="_blank" rel="noopener noreferrer"><img src="@/assets/just_mEEE.png" alt="meeeeeeeeeeeeeee"></a>
            <span class="hover-text">@holyestrogen</span>
        </div>

        <div v-html="infoPage.content.rendered" class="infos-content"></div>

        <p class="update-date">
          {{ $t('apropos_page.date_maj') }} {{ dateFormat(infoPage.modified) }}
        </p>

    </div>

    <div v-else class="loading">
      <lottie-player class="loader-player"
        src="/indieanimation/animation/loader-animation.json"
        background="transparent"
        speed="1"
        loop
        autoplay>
      </lottie-player>
    </div>
    
    <indiefooter/>
  </main>
</template>



<style scoped>
    main {
        display: flex;
        justify-content: center;
        text-align: center;
    }

    .icon {
        position: relative;
        animation: float 2s ease-in-out infinite;
        width: 275px;
        display: inline-block;
    }

    .icon img {
        width: 100%;
        height: auto;
        transition: transform 0.15s cubic-bezier(0.34, 1.8, 0.64, 1);
    }

    .hover-text {
        position: absolute;
        top: 50%;
        left: 50%;

        transform: translate(-50%, -50%) scaleY(0) rotate(0deg);
        opacity: 0;
        
        color: #ffffff;
        text-shadow: 
        /* Les diagonales principales */
            -4px -4px 0 #D300FF,  
            4px -4px 0 #D300FF,
            -4px  4px 0 #D300FF,
            4px  4px 0 #D300FF,
            /* Les côtés cardinaux (très épais) */
            0px  6px 0 #D300FF,
            0px -6px 0 #D300FF,
            -6px  0px 0 #D300FF,
            6px  0px 0 #D300FF,
            /* Les diagonales secondaires pour boucher tous les espaces vides */
            -6px -3px 0 #D300FF,
            -6px  3px 0 #D300FF,
            6px -3px 0 #D300FF,
            6px  3px 0 #D300FF,
            -3px -6px 0 #D300FF,
            3px -6px 0 #D300FF,
            -3px  6px 0 #D300FF,
            3px  6px 0 #D300FF;
        font-family: 'Poppins-Bold', sans-serif;
        font-size: 2rem;
        pointer-events: none;
        
        transition: transform 0.15s cubic-bezier(0.34, 2, 0.64, 1), opacity 0.2s ease;
    }

    .icon:hover {
        animation-play-state: paused; 
    }

    .icon:hover img {
        transform: scale(1.2) rotate(var(--image-rotate, -5deg));
        filter: brightness(1.7);
    }

    .icon:hover .hover-text {
        transform: translate(-50%, -50%) scaleY(1) rotate(var(--text-rotate, 5deg));
        opacity: 1;
    }

    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }

    @media (max-width: 480px) {
        .maintenance-card {
            padding: 25px 20px;
        }
    }

    .infos-page {
        min-height: 60vh;
        padding: 40px;
        max-width: 800px;
        margin: 70px 5px 50px 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
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

    .loader-player {
        width: 15%;
        height: 100%;
        margin-bottom: 20px;
    }

    .infos-content {
        z-index: 50;
    }

    .infos-content :deep(a) {
        color: var(--secondary-color);
        text-decoration: underline;
        font-weight: bold;
        
    }

    /* Responsive styles */
    @media (max-width: 600px) {
            .loader-player {
            width: 30%;
            height: 100%;
            margin-bottom: 20px;
        }
    }
</style>