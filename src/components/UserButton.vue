<template lang="html">
  <div>
    <div @click="showMore" class="user-btn">
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAAXNSR0IArs4c6QAAAH5JREFUaAXt17ERgDAIAEDiKs5i4zlERnOJVO7iKvFsc0fvmacDGvikIUIQIECAAIFUoGSdtV6t99iz/ufqJdp9bsc41zIW5AQIECBAgAABAgQIECDwCrgH/QMCBAgQIECAAAECBAjMKeAenPPdbU2AAAECBAgQIECAAIHfCzxT3RUKkM/E+AAAAABJRU5ErkJggg==">   
      <div>更多</div>
    </div>

    <actionsheet v-model="showPop" 
      :menus='moreMenu'  @on-click-menu="clickMore" show-cancel>
    </actionsheet>
  </div>
</template>
 
<script>
import { Actionsheet } from 'vux'
import { clearUserInfo } from '../utils/user-storage'
import { clearToken } from '../utils/token-storage'

export default {
  name: 'user-button',
  components: {
    Actionsheet
  },
  data () {
    return {
      showPop: false,
      moreMenu: {
        home: '首页',
        logout: '<span style="color:red">退出</span>'
      }
    }
  },
  methods: {
    showMore () {
      this.showPop = true
    },
    goHome () {
      this.$router.replace({name: 'home'})
    },
    clickMore (key) {
      if (key === 'home') {
        this.goHome()
      } else if (key === 'logout') {
        clearUserInfo()
        clearToken()
        this.$router.replace({name: 'login'})
      }
    }
  }
}
</script>
 
<style lang="less">
.user-btn {
    height: 30px;
    width: 30px;
    margin-right: 10px;
    box-sizing: border-box;
    background: #eeeeee;
    border: 2px;
    right: 0px;
    position: fixed;
    bottom: 60px;
    font-size: 10px;

    img {
      width: 100%;
      height: 100%;
    }  
}
</style>