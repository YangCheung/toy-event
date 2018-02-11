<template lang="html">
    <div>
      <group v-if="event_activity.length > 0" :title="'正在进行中'">
        <cell v-for="(event, index) in event_activity" :link="{path:'./events/'+ event.id}" :title="event.desc_text" is-link v-bind:key="index"></cell>
      </group>
      <group :title="'待选活动列表'">
        <cell v-for="(event, index) in event_backup" :link="{path:'./events/'+ event.id}" :title="event.desc_text" is-link v-bind:key="index"></cell>
      </group>
      <box gap="55px 15px">
        <x-button type="primary" @click.native="addEvent" action-type="button">添加活动</x-button>    
        <x-button  @click.native="returnList" action-type="button">返回领域列表</x-button>
      </box>
      
      <group v-if="event_history.length > 0" :title="'往期活动'">
        <cell v-for="(event, index) in event_history" :link="{path:'./events/'+ event.id}" :title="event.desc_text" is-link v-bind:key="index"></cell>
      </group>      
    </div>
</template>
 
<script>
import { Box, XButton, Cell, Group } from 'vux'
import { eventList } from '../api/ManagerApi'

export default {
  name: 'events',
  components: {
    Box, XButton, Cell, Group
  },
  data () {
    return {
      event_backup: [],
      event_activity: [],
      events: [],
      event_history: [],
      field_id: ''
    }
  },
  created () {
    this.field_id = this.$route.params.fieldid

    eventList('', this.field_id,
     (response) => {
       this.setData(response)
     },
    (error) => {
      console.log(error)
    })
  },
  methods: {
    addEvent () {
      this.$router.push({path: '/fields/' + this.field_id + '/events/new'})
    },
    setData (value) {
      this.events = value
      this.event_activity = this.events.filter(function (item) {
        return item.activity === 1
      })
      this.event_history = this.events.filter(function (item) {
        return item.activity < 0
      })
      this.event_backup = this.events.filter(function (item) {
        return item.activity === 0
      })
    },
    returnList () {
      this.$router.replace({name: 'FieldsList'})
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