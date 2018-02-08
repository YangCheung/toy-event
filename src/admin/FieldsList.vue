<template lang="html">
    <div>
      <group :title="'领域列表'">
        <!-- <cell v-for="(field, index) in fields" :link="{path:'/field/'+ field.id}" :title="field.desc_text" is-link v-bind:key="index"></cell> -->
      </group>

      <group v-for="(field, index) in fields" v-bind:key="index" :title="'第'+index+1+'个'" label-width="5.5em" label-margin-right="2em" label-align="justify">
        <cell title="名称" :value="field.desc_text" :link="{path:'/fields/'+ field.id}" value-align="left" is-link></cell>
        <cell title="管理员" :value="field.admins.length" :link="{path:'/fields/'+ field.id + '/admins'}" is-link value-align="left"></cell>
        <cell title="QQ群" :value="field.qq_groups.length" :link="{path:'/fields/'+ field.id + '/qq-groups'}" is-link value-align="left"></cell>
        <cell title="活动列表" :link="{path:'/fields/'+ field.id + '/events'}" is-link value-align="left"></cell>
      </group>

      <box gap="45px 15px">
        <x-button type="primary" @click.native="addField" action-type="button">新增领域</x-button>
      </box>
      <loading :show="showLoging" text="加载中"></loading>

    </div>
</template>
 
<script>
import { Loading, Box, XButton, Cell, Group } from 'vux'
import { adminFieldList } from '../api/adminApi'

export default {
  name: 'home',
  components: {
    Loading, Box, XButton, Cell, Group
  },
  data () {
    return {
      showLoging: true,
      fields: []
    }
  },
  created () {
    adminFieldList('',
     (response) => {
       this.setData(response)
       this.showLoging = false
     },
      (error) => {
        this.showLoging = false
        console.log(error)
      })
  },
  methods: {
    addField () {
      this.$router.push({path: '/fields/new'})
    },
    setData (value) {
      this.fields = value
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