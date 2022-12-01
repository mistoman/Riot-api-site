<template>
<nav>
      <router-link v-if="(store.getters.userId !== null)" v-bind:to="'/user/' + userID">
        <button>My Profile</button>
      </router-link>
      <form class="summoner-search" @submit.prevent="getSummonerDetails">
        <select @change="changeRegion" name="" id="" v-model="playerRegion" required>
          <option value="eun1">EUNE</option>
          <option value="euw1">EUW</option>
          <option value="na1">NA</option>
          <option value="kr">KR</option>
          <option value="jp1">JP</option>
          <option value="br1">BR</option>
          <option value="la1">LAN</option>
          <option value="la2">LAS</option>
          <option value="oc1">OCE</option>
          <option value="ru">RU</option>
          <option value="tr1">TR</option>
        </select>
        <input type="text" placeholder="Summoner Name" v-model="playerNameRef" required>
        <button>Search</button>
      </form>


</nav>
  <div>

    <div class="summoner-panel" v-if="summonerDetails && SummonerMatchHistoryDetails">

      <SummonerProfile :summonerDetails="summonerDetails"/>
      
      <div class="match-history">
        <div class="match-history-item" :key="item" v-for="item in SummonerMatchHistoryDetails[0]"
          @click="toggleDetailedInfo">
          <div class="match-basic-info" :key="players"
            v-for="(players)  in [item.info.participants.find(pr => pr.summonerName.toLowerCase() == playerName)]">
            <div class="player-match-info">
              <span class="game-mode">{{item.info.gameMode}}</span>
              <span
                class="game-date">{{new Date(item.info.gameStartTimestamp).getDate()}}/{{new Date(item.info.gameStartTimestamp).getMonth()+1}}/{{new Date(item.info.gameStartTimestamp).getFullYear()}}</span>
              <hr>
              <span class="winner" v-if="players.win">Won</span>
              <span class="loser" v-else>Lost</span>
              <span class="game-time">{{Math.floor(item.info.gameDuration/60)}}min
                {{item.info.gameDuration%60}}sec</span>
            </div>
            <div class="player-char-details">
              <div class="player-info-panel">
                <img :src="`https://ddragon.leagueoflegends.com/cdn/12.21.1/img/champion/${ players.championName }.png`">
                <div class="summoner-spells">
                  <img :src="`https://ddragon.leagueoflegends.com/cdn/12.21.1/img/spell/${ getSpellName(players.summoner1Id) }.png`" alt="">
                  <img :src="`https://ddragon.leagueoflegends.com/cdn/12.21.1/img/spell/${ getSpellName(players.summoner2Id) }.png`" alt="">
                </div>
                <span> {{ players.championName }} </span>
              </div>
              <div class="player-item-set">
                <div class="detailed-info-hero-item__item-image" :key="lItems"
                  v-for="lItems in ['item0','item1','item2','item3','item4','item5','item6']">
                  <div alt="" :style="players[lItems] == 0 ? '' : `background-image: url('https://ddragon.leagueoflegends.com/cdn/12.21.1/img/item/${ players[lItems] }.png');`">
                    <img width="100" height="100" />
                    <ItemTooltip :itemInfo="leagueItems[players[lItems]]" v-if="leagueItems[players[lItems]]" />
                  </div>
                </div>
              </div>
            </div>
            <div class="match-history-teams">
              <div class="match-history-team">
                <div class="match-history-name" :key="teamPlayer"
                  v-for="(teamPlayer)  in item.info.participants.slice(0,5)">
                  <img
                    :src="`https://ddragon.leagueoflegends.com/cdn/12.21.1/img/champion/${ teamPlayer.championName }.png`">
                  <span> {{ teamPlayer.summonerName }} </span>
                </div>
              </div>
              <div class="match-history-team">
                <div class="match-history-name" :key="teamPlayer"
                  v-for="(teamPlayer)  in item.info.participants.slice(5,10)">
                  <img
                    :src="`https://ddragon.leagueoflegends.com/cdn/12.21.1/img/champion/${ teamPlayer.championName }.png`">
                  <span> {{ teamPlayer.summonerName }} </span>
                </div>
              </div>
            </div>
          </div>
          <div class="match-history-detailed-info hidden">
            <div :class="item.info.participants[0].win ? 'detailed-info-hero winner':'detailed-info-hero defeat'">
              <div class="detailed-info-hero-item header">
                <div class="detailed-info-hero-item__hero">
                  <span v-if="item.info.participants[0].win">Victory</span>
                  <span v-else>Defeat</span>
                  <span v-if="item.info.participants[0].teamId === 100">Blue Team</span>
                  <span v-else>Red Team</span>
                </div>
                <div class="detailed-info-hero-item__kda">
                  <span>KDA</span>
                </div>
                <div class="detailed-info-hero-item__dmg">
                  <span>Damage</span>
                </div>
                <div class="detailed-info-hero-item__wards">
                  <span>Wards</span>
                </div>
                <div class="detailed-info-hero-item__cs">
                  <span>CS</span>
                </div>
                <div class="detailed-info-hero-item__item">
                  <span>Items</span>
                </div>
              </div>
              <div class="detailed-info-hero-item" :key="players"
                v-for="(players)  in item.info.participants.slice(0,5)">
                <div class="detailed-info-hero-item__hero">
                  <img
                    :src="`https://ddragon.leagueoflegends.com/cdn/12.21.1/img/champion/${ players.championName }.png`">
                  <span> {{ players.summonerName }} </span>
                </div>
                <div class="detailed-info-hero-item__kda">
                  {{players.kills}}/{{players.deaths}}/{{players.assists}}
                </div>
                <div class="detailed-info-hero-item__dmg">
                  <div> {{players.totalDamageTaken}} </div>
                  <div>{{players.totalDamageDealtToChampions}}</div>
                </div>
                <div class="detailed-info-hero-item__wards">
                  <div> {{players.challenges.controlWardsPlaced}}</div>
                  <div> {{players.visionWardsBoughtInGame}} </div>
                  <div>{{players.wardsPlaced}}</div>
                </div>
                <div class="detailed-info-hero-item__cs">
                  <div> {{players.totalMinionsKilled}} </div>
                  <div> {{Number(players.totalMinionsKilled/(item.info.gameDuration/60)).toFixed(1) }}/m</div>
                </div>
                <div class="detailed-info-hero-item__item">
                  <div class="detailed-info-hero-item__item-image" :key="lItems"
                    v-for="lItems in ['item0','item1','item2','item3','item4','item5','item6']">
                    <div alt="" :style="players[lItems] == 0 ? '' : `background-image: url('https://ddragon.leagueoflegends.com/cdn/12.21.1/img/item/${ players[lItems] }.png');`">
                      <img width="100" height="100" />
                      <ItemTooltip :itemInfo="leagueItems[players[lItems]]" v-if="leagueItems[players[lItems]]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div :class="item.info.participants[5].win ? 'detailed-info-hero winner':'detailed-info-hero defeat' ">
              <div class="detailed-info-hero-item header">
                <div class="detailed-info-hero-item__hero">
                  <span v-if="item.info.participants[5].win">Victory</span>
                  <span v-else>Defeat</span>
                  <span v-if="item.info.participants[5].teamId === 100">Blue Team</span>
                  <span v-else>Red Team</span>
                </div>
                <div class="detailed-info-hero-item__kda">
                  <span>KDA</span>
                </div>
                <div class="detailed-info-hero-item__dmg">
                  <span>Damage</span>
                </div>
                <div class="detailed-info-hero-item__wards">
                  <span>Wards</span>
                </div>
                <div class="detailed-info-hero-item__cs">
                  <span>CS</span>
                </div>
                <div class="detailed-info-hero-item__item">
                  <span>Items</span>
                </div>
              </div>

              <div class="detailed-info-hero-item" :key="players"
                v-for="(players)  in item.info.participants.slice(5,10)">
                <div class="detailed-info-hero-item__hero">
                  <img
                    :src="`https://ddragon.leagueoflegends.com/cdn/12.21.1/img/champion/${ players.championName }.png`">
                  <span> {{ players.summonerName }} </span>
                </div>
                <div class="detailed-info-hero-item__kda">
                  {{players.kills}}/{{players.deaths}}/{{players.assists}}
                </div>
                <div class="detailed-info-hero-item__dmg">
                  <div> {{players.totalDamageTaken}} </div>
                  <div>{{players.totalDamageDealtToChampions}}</div>
                </div>
                <div class="detailed-info-hero-item__wards">
                  <div> {{players.challenges.controlWardsPlaced}}</div>
                  <div> {{players.visionWardsBoughtInGame}} </div>
                  <div title="Wards placed">{{players.wardsPlaced}}</div>
                </div>
                <div class="detailed-info-hero-item__cs">
                  <div> {{players.totalMinionsKilled}} </div>
                  <div> {{Number(players.totalMinionsKilled/(item.info.gameDuration/60)).toFixed(1) }}/m</div>
                </div>
                <div class="detailed-info-hero-item__item">
                  <div class="detailed-info-hero-item__item-image" :key="lItems"
                    v-for="lItems in ['item0','item1','item2','item3','item4','item5','item6']">
                    <div alt="" :style="players[lItems] == 0 ? '' : `background-image: url('https://ddragon.leagueoflegends.com/cdn/12.21.1/img/item/${ players[lItems] }.png');`">
                      <img width="100" height="100" />
                      <ItemTooltip :itemInfo="leagueItems[players[lItems]]" v-if="leagueItems[players[lItems]]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {ref} from 'vue';
  import store from '@/modules/main';
  import SummonerProfile from '@/components/SummonerProfile.vue';
  import ItemTooltip from '@/components/ItemTooltip.vue';
  

  let playerNameRef = ref(null);
  let playerName = ref(null);
  let playerRegion = ref(null);
  let playerServerRegion;
  let summonerDetails = ref();
  let summonerMatchHistory = ref();
  let SummonerMatchHistoryDetails = ref();
  let leagueItems = ref();
  let leagueSpells = ref();
  const userID = store.getters.userId;

  //api key only last for 24hrs
  const myapikey = "RGAPI-1c1e3e12-f76d-4026-850f-6eb6748bfc89";

  //gets the name of the spell from the id which is used to get the image 
  function getSpellName(spellId) {
    return leagueSpells.value.find(spell => spell[1].key == spellId)[0];
  }
  //gets the info about summoners spells so you can get the name from the id to load the image
  async function getLolSpells() {
    //console.log("getSummonerDetails runs");

    const info = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/12.21.1/data/en_US/summoner.json`
    );
    await info.json().then((data) => {
      leagueSpells.value = Object.entries(data.data);
      //console.log(leagueSpells.value);
    });
  }
  //gets info about the items so you can show the name and description of the item
  async function getLolItems() {
    //console.log("getSummonerDetails runs");

    const info = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/12.21.1/data/en_US/item.json`
    );
    await info.json().then((data) => {
      leagueItems.value = data.data;
      //console.log(leagueItems.value);
    });
  }
  //loops through parent element untill it finds the one with a specific class used for click event handling
  function findParentElementWithClass(element, className) {
    if (element.classList.contains(className)) {
      return element;
    } else {
      return findParentElementWithClass(element.parentElement, className);
    }
  }
  //hides and shows the detailed info of the match
  function toggleDetailedInfo(event) {
    const element = findParentElementWithClass(event.target, 'match-history-item');
    element.querySelector('.match-history-detailed-info').classList.toggle('hidden');
  }
  //changes the region of the player depending on what player region is selected
  function changeRegion() {
    //console.log("changin region");
    //console.log(playerRegion.value);
    switch (playerRegion.value) {
      case "euw1":
        playerServerRegion = "europe";
        break;
      case "eun1":
        playerServerRegion = "europe";
        break;
      case "na1":
        playerServerRegion = "americas";
        break;
      case "kr":
        playerServerRegion = "asia";
        break;
      case "jp1":
        playerServerRegion = "asia";
        break;
      case "la1":
        playerServerRegion = "americas";
        break;
      case "la2":
        playerServerRegion = "americas";
        break;
      case "oc1":
        playerServerRegion = "sea";
        break;
      case "ru":
        playerServerRegion = "europe";
        break;
      case "tr1":
        playerServerRegion = "europe";
        break;
      case "br1":
        playerServerRegion = "americas";
        break;
    }
  }
  //gets the info about the player called giving the puuid which is used to get the match history
  async function getSummonerDetails() {
    summonerDetails.value = null;
    summonerMatchHistory.value = null;
    SummonerMatchHistoryDetails.value = null;
    playerName.value = playerNameRef.value.toLowerCase();
    
    const info = await fetch(
      `https://${ playerRegion.value }.api.riotgames.com/lol/summoner/v4/summoners/by-name/${ playerNameRef.value.toLowerCase() }?api_key=${myapikey}`
    );
    await info.json().then((data) => {
      summonerDetails.value = data;
      getSummonerMatchHistory(data.puuid);
      console.log(data);
    });
  }
  //gets the match history of the player using the puuid with it you can get indept match details
  async function getSummonerMatchHistory(puuid) {
    //console.log("getSummonerMatchHistory runs");
    const info = await fetch(`https://${playerServerRegion}.api.riotgames.com/lol/match/v5/matches/by-puuid/${ puuid }/ids?start=0&count=2&api_key=${ myapikey }`);
    await info.json().then((data) => {
      summonerMatchHistory.value = data;
      let matches = [];
      Object.values(data).forEach(match => {
        getSummonerMatchHistoryDetails(match).then((data) => {
          matches.push(data);
          SummonerMatchHistoryDetails.value = [matches];
          //console.log(matches);
        });
      });
    });
  }
  //gets details about the match giving you the info you need to display
  async function getSummonerMatchHistoryDetails(matchId) {
    //console.log("getSummonerMatchHistoryDetails runs");
    
    const info = await fetch(
      `https://${playerServerRegion}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${myapikey}`);
    const json = await info.json();
    return json;
  }

  getLolItems();
  getLolSpells();
</script>

<style lang="scss">


  .summoner-panel {
    padding: 10px 0;
  }
  .summoner-search {
    display: flex;
    justify-content: center;
    align-items: stretch;
    padding: 10px;
    border-bottom: 1px solid gainsboro;
    select, input {
      padding: 6px;
      font-size: 14px;
      border-radius: 0;
      border: 1px solid gainsboro;


    }
    input {
      border-left: 0;
    }
    select {
      font-weight: bold;
    }
    button {
      margin-left: 5px;
      border: 1px solid gainsboro;
      cursor: pointer;
    }

  }
  

  .match-history-detailed-info {
    width: 100%;

    &.hidden {
      display: none;
    }
  }

  .player-item-set {
    display: flex;
    gap: 5px;

    div {
      background-size: cover;
      background-repeat: no-repeat;
    }

    img {
      display: block;
      width: 100%;
      visibility: hidden;
      height: auto;
    }

    &>div {
      position: relative;
      width: 40px;
      height: 40px;
      background: green;
      border-radius: 5px;
      background-size: contain;

      &:hover {
        .item-tooltip {
          opacity: 1;
          transform: translate(-50%, -100%);
        }
      }
    }
  }

  .detailed-info-hero {
    display: flex;
    flex-direction: column;
    gap: 2px;

    &.defeat {
      background: #fdd0d0;

      .detailed-info-hero-item {
        &:nth-of-type(even) {
          background: #fbd5d5;

        }

        &.header {

          background: #fbb;
          border-bottom: 1px solid #f3afaf;
        }
      }
    }

    &.winner {

      background: #d4ebff;

      .detailed-info-hero-item {
        &:nth-of-type(even) {
          background: #d8e9f8;
        }

        &.header {
          background: #badfff;
          border-bottom: 1px solid #a2d1f9;
        }
      }
    }

    &-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 10px;

      &.header {
        padding: 20px 0 0 0;
      }

      &__hero {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-grow: 0;
        width: 185px;

        span {
          margin-left: 10px;
          word-break: break-all;
        }

        img {
          width: 30px;
          height: 30px;
        }
      }

      &__kda,&__dmg,&__wards,&__cs {
        flex-grow: 1;
      }

      &__item {
        position: relative;
        display: flex;
        gap: 2px;
        width: calc(100% / 3);

        .detailed-info-hero-item__item-image {
          width: calc(100% / 7);
          height: auto;
          background: green;
          border-radius: 5px;

          div {
            background-size: cover;
            background-repeat: no-repeat;
          }

          img {
            display: block;
            width: 100%;
            visibility: hidden;
            height: auto;
          }

          &:hover {
            .item-tooltip {
              opacity: 1;
              transform: translate(-50%, -100%);
            }
          }
        }
      }
    }
  }

  .match-basic-info {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    gap: 20px;
    padding: 10px;
    border: 1px solid gainsboro;

    &:first-of-type {
      border-bottom: 0;
    }

    &:nth-child(odd) {
      background: #f5f5f5;
    }

    .player-match-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: left;
      width: 100px;

      hr {
        width: 100%;
      }

      .game-mode {
        font-weight: bold;
      }

      .winner,
      .loser {
        font-weight: bold;
      }
    }

    .player-char-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;

      .player-info-panel {
        display: flex;
        align-items: stretch;
        gap: 10px;

        img {
          width: 60px;
          height: 60px;
        }

        span {
          font-size: 18px;
          font-weight: bold;
          align-self: center;
        }

        .summoner-spells {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          img {
            display: block;
            width: 25px;
            height: 25px;
          }
        }
      }
    }
  }

  .match-history {
    display: flex;
    flex-direction: column;
    max-width: 772px;
    margin: 0 auto;

    &-item {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
  }

  .match-history-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    text-align: left;

    span {
      display: inline-block;
      flex-grow: 1;
      font-size: 12px;
    }

    img {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      margin-right: 10px;

    }
  }

  .match-history-teams {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 300px;

    .match-history-team {
      width: calc(50% - 5px);
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
  }
</style>