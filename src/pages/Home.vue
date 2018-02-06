<template lang="html">
  <div>Loading</div>
</template>
 
<script>
import { getUserProfile } from '../api/api'
/* eslint-disable no-used-vars */
import { setUser } from '../config'

export default {
  name: 'home',
  data () {
    return {
      user: null
    }
  },
  beforeRouteEnter (to, from, next) {
    getUserProfile(
     (response) => {
       next(vm => vm.setData(response))
       console.log(response)
     },
      (error) => {
        next()
        console.log(error)
      })
  },
  methods: {
    addField () {
      this.$router.push({name: 'field'})
    },
    setData (user) {
      this.user = user
      setUser(user)
      // if (user.fields.length > 0) {
      //     // to manager page
      // }
      if (user.fields.length > 0) {
          // to manager page
        this.$router.replace({name: 'events'})
        return
      }
      if (user.admin) {
        this.$router.replace({name: 'FieldsList'})
      }
    }
  }
}
</script>
 
<style lang="css">
.home {
    flex: 1;
    background-color: #fff;
    border-radius: 2px;
    padding: 10px;
    margin-bottom: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
}
</style>