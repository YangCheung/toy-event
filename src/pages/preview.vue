<template lang="html">
    <div class="home" id="home">
        <FeedContent v-if="contentValue !== null"  :x="contentValue"></FeedContent>
    </div>
</template>
 
<script>
import FeedContent from '@/components/FeedContent'
import axios from 'axios'
import { API } from '../config'

export default {
  name: 'home',
  components: {
    FeedContent
  },
  data () {
    return {
      contentValue: null
    }
  },
  beforeRouteEnter (to, from, next) {
    axios.get(API.post + 28)
    .then(function (response) {
      next(vm => vm.setData(response.data.result))
      console.log(response)
    })
    .catch(function (error) {
      next()
      console.log(error)
    })
  },
  methods: {
    setData (value) {
      this.contentValue = value
      this.contentValue.assets = JSON.parse(this.contentValue.assets)
      console.log(value)
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