<script>
    export default {
        props: [
            'itemInfo'
        ]
    }
</script>

<template>
    <div class="item-tooltip">
        <span class="item-header">{{ itemInfo.name }}</span>
        <div class="item-info" v-html="itemInfo.description"> </div>
        
    </div>
</template>


<style lang="scss">

.item-tooltip {
    position: absolute;
    top: 0;
    left: 0;
    width: 300px;
    background: grey;
    border-radius: 5px;
    display: flex;
    color: white;
    font-size: 12px;
    transform: translate(-50%, 0);
    transition: all 0.2s ease-in-out;
    opacity: 0;
    pointer-events: none;
    flex-direction: column;
    text-align: left;
    padding: 10px;

    .item-info {
      width: 100%;
      background: none;

    }

  }

</style>