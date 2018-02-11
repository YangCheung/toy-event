<template lang="html">
  <div>
   <group v-if="admins.length < 3" title="添加管理员">
      <x-input keyboard="number" v-model="inputAdminPhone" placeholder="输入管理员手机号码  "  :show-clear="true" placeholder-align="left" :max="30">
        <x-button slot="right" type="primary" @click.native="verify" mini>添加</x-button>
      </x-input>   
    </group>
    <group v-if="admins.length > 0" title="滑动删除"></group>
    <swipeout>
      <swipeout-item v-for="(user, index) in admins" v-bind:key="index" :threshold=".5" underlay-color="#ccc">
        <div slot="right-menu">
          <swipeout-button @click.native="deleteAdmin(index)" background-color="#D23934">删除</swipeout-button>
        </div>
        <div slot="content" class="demo-content vux-1px-tb">
          {{'QQ:' + user.qq + " 手机:" + user.phone}}
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
import { addFieldAdmin, deleteFieldAdmin, adminFieldList, adminGetUser } from '../../api/adminApi'

export default {
  name: 'field-admins',
  components: {
    Loading, Actionsheet, Toast, Swipeout, SwipeoutItem, SwipeoutButton, XInput, Box, XButton, Cell, Group
  },
  data () {
    return {
      showLoging: false,
      id: '',
      field: {},
      admins: [],
      fieldText: '',
      inputAdminPhone: '',
      showErrorToast: false,
      toastMsg: '',
      showPop: false,
      menus3: {
        'title.noop': '确定咩?<br/><span style="color:#666;font-size:12px;">删除后就无法撤消了哦</span>',
        delete: '<span style="color:red">删除</span>'
      }
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

      let admin = this.admins[index]
      deleteFieldAdmin(this.id, admin.id,
        () => {
          this.admins.splice(index, 1)
          this.showLoging = false
        }, () => {
          this.showLoging = false
          this.showToast('发生错误')
        })
    },
    verify () {
      if (!this.inputAdminPhone) {
        return
      }
      this.showLoging = true

      adminGetUser('', this.inputAdminPhone,
        (user) => {
          addFieldAdmin(this.id, user.id,
            () => {
              this.admins.push(user)
              this.inputAdminPhone = ''
              this.showLoging = false
            }, () => {
              this.showLoging = false
              this.showToast('添加失败')
            })
        },
        () => {
          console.log('error')
          this.showLoging = false
          this.showToast('找不到该用户')
        })
    },
    returnList () {
      this.$router.replace({name: 'FieldsList'})
    },
    setData (value) {
      this.field = value
      this.fieldText = value.desc_text
      this.admins = value.admins
    }
  }
}
</script>
 
<style lang="css">
.demo-content {
  padding: 10px 10px;
}
</style>