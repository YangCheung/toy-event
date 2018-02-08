<template lang="html">
    <div>
     <group title="添加领域">
      <x-input title="领域名称" v-model="fieldText" placeholder="输入领域名称" novalidate :show-clear="true" placeholder-align="right" :max="30"></x-input>
    </group>

     <group v-if="admins.length < 3" title="添加管理员">
      <x-input title="管理员1" keyboard="number" v-model="inputAdminPhone" placeholder="管理员手机号码  "  :show-clear="true" placeholder-align="right" :max="30">
        <x-button slot="right" type="primary" @click.native="verify" mini>添加</x-button>
      </x-input>   
    </group>
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

    <toast
      v-model="showErrorToast"
      type="text"
      width="auto"
      :time="1200">{{ toastMsg }}
    </toast>

      <box gap="50px 15px">
        <x-button type="primary" @click.native="addField" action-type="button">确定</x-button>
      </box>
      <box v-if="field.id" gap="-30px 15px">
        <x-button type="warn" @click.native="deleteField" action-type="button">删除</x-button>
      </box>

      <actionsheet v-model="showPop" 
        :menus='menus3' @on-click-menu-delete="onDelete" show-cancel>
      </actionsheet>

    </div>

   
</template>
 
<script>
import { Actionsheet, Toast, Swipeout, SwipeoutItem, SwipeoutButton, XInput, Box, XButton, Cell, Group } from 'vux'
import { adminDeleteField, adminFieldList, adminAddField, adminGetUser } from '../api/adminApi'

export default {
  name: 'home',
  components: {
    Actionsheet, Toast, Swipeout, SwipeoutItem, SwipeoutButton, XInput, Box, XButton, Cell, Group
  },
  data () {
    return {
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
    let id = this.$route.params.id
    console.log('id = ' + id)
    if (!id || id === 'new') {
      return
    }
    let that = this
    adminFieldList(id,
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
      this.admins.splice(index, 1)
      console.log(index)
    },
    verify () {
      if (!this.inputAdminPhone) {
        return
      }
      adminGetUser('', this.inputAdminPhone,
        (user) => {
          this.admins.push(user)
          this.inputAdminPhone = ''
        },
        () => {
          console.log('error')
          this.showToast('找不到该用户')
        })
    },
    addField () {
      if (!this.fieldText) {
        this.showToast('请输入领域名称')
        return
      }
      this.field.desc_text = this.fieldText
      this.field.admins = this.admins
      console.log(JSON.stringify(this.field))
      adminAddField(this.field,
        (user) => {
          this.showToast('添加成功')
          this.$router.replace({name: 'FieldsList'})
        },
        () => {
          console.log('error')
          this.showToast('添加失败')
        })
    },
    onDelete () {
      adminDeleteField(this.field,
        (user) => {
          this.showToast('删除成功')
          this.$router.replace({name: 'FieldsList'})
        },
        () => {
          console.log('error')
          this.showToast('删除失败')
        })
    },
    deleteField () {
      this.showPop = true
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
.home {
    flex: 1;
    background-color: #fff;
    border-radius: 2px;
    padding: 10px;
    margin-bottom: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
}
.demo-content {
  padding: 10px 10px;
}
</style>