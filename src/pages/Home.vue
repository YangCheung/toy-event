<template lang="html">
  <div>
    <router-view></router-view>
    <user-button></user-button>

  </div>
</template>
 
<script>
/* eslint-disable */
import { getUser } from '../utils/user-storage'
import UserButton from '../components/UserButton'
import { getUserProfile } from '../api/api'
import { getToken } from '../utils/token-storage'

export default {
  name: 'home',
  components: { UserButton },
  data () {
    return {
      talion: '',
      user: null
    }
  },
  created () {
    console.log('home created')
    getUserProfile((user) => {
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
      } else if(user.fields && user.fields.length > 0){
        this.$router.replace({path: '/fields/'+ user.fields[0].event_field_id + '/events'})
      } else if(!user.qq || !user.qq_group){
        this.$router.replace({name: 'edituser'})
      } else {
        this.$router.replace({name: 'current-event'})
      }
    }
  }
}
</script>
 
<style lang="css">
</style>