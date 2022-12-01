<script>
export default {
    props: [
        'summonerDetails'
    ]
}  
</script>

<template>
    <header class="summoner-profile-header">
        <img :src="`https://ddragon.leagueoflegends.com/cdn/12.20.1/img/profileicon/${ summonerDetails.profileIconId }.png`">
        <div>
            <h1>Name: {{ summonerDetails.name }}</h1>
            <span>Level: {{ summonerDetails.summonerLevel }}</span>
        </div>
    </header>
</template>


<style lang="scss">
.summoner-profile-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    padding: 1rem;
    gap: 50px;
    text-align: left;
    img {
        width: 10rem;
        height: 10rem;
        border-radius: 50%;
        margin-bottom: 1rem;
    }
    h1 {
        font-size: 2rem;
        margin: 0;
    }
    span {
        font-size: 1.5rem;
    }
}



</style>

