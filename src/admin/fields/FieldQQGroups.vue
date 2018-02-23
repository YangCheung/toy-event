<template lang="html">
  <div>
   <group title="添加QQ群">
      <x-input keyboard="number" v-model="input_qq" placeholder="输入QQ群号码  "  :show-clear="true" placeholder-align="left" :max="30">
        <x-button slot="right" type="primary" @click.native="verify" mini>添加</x-button>
      </x-input>   
    </group>
    <group v-if="qq_groups.length > 0" title="滑动删除"></group>
    <swipeout>
      <swipeout-item v-for="(qq, index) in qq_groups" v-bind:key="index" :threshold=".5" underlay-color="#ccc">
        <div slot="right-menu">
          <swipeout-button @click.native="deleteAdmin(index)" background-color="#D23934">删除</swipeout-button>
        </div>
        <div slot="content" class="demo-content vux-1px-tb">
          {{qq.qq_group}}
        </div>
      </swipeout-item>
    </swipeout> 
          
    <box gap="45px 15px">
        <x-button type="primary" @click.native="returnList" action-type="button">返回列表</x-button>
    </box>
    <loading :show="showLoging" text="加载中"></loading>

  </div>  
</template>
 
<script>
import { Loading, Actionsheet, Toast, Swipeout, SwipeoutItem, SwipeoutButton, XInput, Box, XButton, Cell, Group } from 'vux'
import { addFieldQQGroup, deleteFieldQQGroup, adminFieldList } from '../../api/adminApi'

export default {
  name: 'field-qq-groups',
  components: {
    Loading, Actionsheet, Toast, Swipeout, SwipeoutItem, SwipeoutButton, XInput, Box, XButton, Cell, Group
  },
  data () {
    return {
      showLoging: false,
      id: '',
      input_qq: '',
      field: {},
      qq_groups: [],
      showErrorToast: false,
      toastMsg: ''
    }
  },
  created () {
    this.id = this.$route.params.id
    console.log('id = ' + this.id)
    if (!this.id) {
      return
    }
    let that = this
    adminFieldList(this.id,
      (response) => {
        if (response && response.length > 0) {
          that.setData(response[0])
        }
      },
      (error) => {
        console.log(error)
      })
  },
  methods: {
    showToast: function (msg) {
      this.toastMsg = msg
      this.showErrorToast = true
    },
    deleteAdmin (index) {
      this.showLoging = true

      let qq = this.qq_groups[index]
      deleteFieldQQGroup(this.id, qq.qq_group,
        () => {
          this.qq_groups.splice(index, 1)
          this.showLoging = false
        }, () => {
          this.showLoging = false
          this.showToast('发生错误')
        })
    },
    verify () {
      if (!this.input_qq) {
        return
      }
      this.showLoging = true

      addFieldQQGroup(this.id, this.input_qq,
        (qq) => {
          this.qq_groups.push(qq)
          this.input_qq = ''
          this.showLoging = false
        }, () => {
          this.showLoging = false
          this.showToast('添加失败')
        })
    },
    returnList () {
      this.$router.replace({name: 'FieldsList'})
    },
    setData (value) {
      this.field = value
      this.qq_groups = value.qq_groups
    }
  }
}
</script>
 
<style lang="css">
.demo-content {
  padding: 10px 10px;
}
</style>