<template lang="html">
  <div>
    <div>
      <group v-if="event_activity.length > 0" :title="'正在进行中'">
        <cell v-for="(event, index) in event_activity" :link="{name:'current-event', query: { eventId: event.id }}" :title="event.desc_text" is-link v-bind:key="index"></cell>
      </group>     
      
      <group v-if="event_history.length > 0" :title="'往期活动'">
        <cell v-for="(event, index) in event_history" :link="{name:'current-event', query: { eventId: event.id }}" :title="event.desc_text" is-link v-bind:key="index"></cell>
      </group>      
    </div>

    <div v-if="hasData && event_activity.length == 0 && event_history.length == 0 " class="no-event">
      <span>暂时没有活动</span>
    </div>
    <div v-transfer-dom>
      <loading :show="showLoging" text="加载中"></loading>
    </div>
  </div>
</template>
 
<script>
import { Box, XButton, Cell, Group, Loading, TransferDom } from 'vux'
import { getUserProfile, userEventList } from '../api/api'

export default {
  name: 'user-events',
  directives: {
    TransferDom
  },
  components: {
    Loading, Box, XButton, Cell, Group
  },

  data () {
    return {
      hasData: false,
      showLoging: false,
      empty: false,
      event_activity: [],
      events: [],
      event_history: [],
      field_id: ''
    }
  },
  created () {
    this.showLoging = true
    getUserProfile((user) => {
      console.log(user)
      this.field_id = user.field_id
      userEventList(user.field_id,
        (response) => {
          this.showLoging = false
          this.setData(response)
        },
        (error) => {
          this.showLoging = false
          console.log(error)
          this.empty = true
        })
    },
    () => {
      this.showLoging = false
      this.$router.replace({name: 'login'})
    })
  },
  methods: {
    setData (value) {
      this.hasData = true
      this.events = value
      this.event_activity = this.events.filter(function (item) {
        return Math.abs(item.activity) === 1
      })
      this.event_history = this.events.filter(function (item) {
        return item.activity === -2
      })
    }
  }
}
</script>
 
<style scoped lang="css">
.no-event {
  position: absolute;
  padding-top: 50%;
  width: 100%;
  height: 100%;
  text-align: center;
  background: cadetblue;
  font-size: 20px;
}
</style>