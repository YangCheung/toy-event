<template lang="html">
  <div>Loading......</div>
</template>
 
<script>
/* eslint-disable no-used-vars */
import { getUser } from '../config'

export default {
  name: 'home',
  created () {
    let user = getUser()
    console.log('home!!!!')
    if (user.admin) {
      this.$router.replace({name: 'FieldsList'})
    } else {
      this.$router.replace({name: 'current-event'})
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