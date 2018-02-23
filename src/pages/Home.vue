<template lang="html">
  <div>
    <router-view></router-view>
    <user-button></user-button>
    
    <div v-transfer-dom>
      <loading :show="showLoging" text="加载中"></loading>
    </div>
  </div>
</template>
 
<script>
/* eslint-disable */
import { getUser } from '../utils/user-storage'
import UserButton from '../components/UserButton'
import { getUserProfile } from '../api/api'
import { getToken } from '../utils/token-storage'
import { Loading, TransferDom } from 'vux'

export default {
  name: 'home',
  directives: {
    TransferDom
  },
  components: { UserButton, Loading },
  data () {
    return {
      showLoging: false,
      talion: '',
      user: null
    }
  },
  created () {
    console.log('home created')
    this.showLoging = true
    getUserProfile((user) => {
        this.showLoging = false
        this.user = user
        this.checkCurrentUser(user)
      }, 
      (error)=> {this.$router.replace({name: 'login'})})
  },
  beforeRouteUpdate (to, from, next) {
    if(to.path === '/') {
      console.log('beforeRouteUpdate')
      console.log(to)
      console.log(from)
    }
    if(this.user !== null && to.path === '/') {
      this.checkCurrentUser(this.user)
    } else {
      next()
    }
  },
  methods: {
    checkCurrentUser (user) {
      if (user.admin) {
        this.$router.replace({name: 'FieldsList'})
      } else if (user.fields && user.fields.length > 0){
        this.$router.replace({path: '/fields/'+ user.fields[0] + '/events'})
      } else if (!user.qq || !user.qq_group){
        this.$router.replace({name: 'edituser'})
      } else {
        // this.$router.replace({name: 'current-event'})
        this.$router.replace({name: 'user-eventlist'})
      }
    }
  }
}
</script>
 
<style lang="css">
</style>