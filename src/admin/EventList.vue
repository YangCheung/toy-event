<template lang="html">
    <div>
      <group :title="'正在进行中'">
        <cell v-for="(event, index) in events" :link="{path:'/event/'+ event.id}" :title="event.desc_text" is-link v-bind:key="index"></cell>
      </group>
      <group :title="'待选活动列表'">
        <cell v-for="(event, index) in events" :link="{path:'/event/'+ event.id}" :title="event.desc_text" is-link v-bind:key="index"></cell>
      </group>
       <group :title="'往期活动'">
        <cell v-for="(event, index) in events" :link="{path:'/event/'+ event.id}" :title="event.desc_text" is-link v-bind:key="index"></cell>
      </group>

      <box gap="15px 15px">
        <x-button type="primary" @click.native="addEvent" action-type="button">添加活动</x-button>
      </box>
    </div>
</template>
 
<script>
import { Box, XButton, Cell, Group } from 'vux'
import { eventList } from '../api/ManagerApi'
import { getUser } from '../config'

export default {
  name: 'events',
  components: {
    Box, XButton, Cell, Group
  },
  data () {
    return {
      events: []
    }
  },
  created () {
    eventList('', getUser().fields[0],
     (response) => {
       this.setData(response)
     },
    (error) => {
      console.log(error)
    })
  },
  methods: {
    addEvent () {
      this.$router.push({path: '/event/'})
    },
    setData (value) {
      this.events = value
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