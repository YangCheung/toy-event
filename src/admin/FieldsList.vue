<template lang="html">
    <div>
      <group :title="'领域列表'">
        <cell v-for="(field, index) in fields" :link="{path:'/field/'+ field.id}" :title="field.desc_text" is-link v-bind:key="index"></cell>
      </group>

      <box gap="15px 15px">
        <x-button type="primary" @click.native="addField" action-type="button">新增领域</x-button>
      </box>
    </div>
</template>
 
<script>
import { Box, XButton, Cell, Group } from 'vux'
import { adminFieldList } from '../api/adminApi'

export default {
  name: 'home',
  components: {
    Box, XButton, Cell, Group
  },
  data () {
    return {
      fields: []
    }
  },
  beforeRouteEnter (to, from, next) {
    adminFieldList('',
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
    setData (value) {
      this.fields = value
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