<template lang="html">
  <div>
    <group title="完善信息">
      <x-input title="QQ号码" ref='re_qq' :is-type='beNumber' required labelWidth="100px" keyboard="number" v-model="qq"  placeholder="请输入个人QQ号码" :show-clear="true"  :max="16"></x-input>
      <x-input title="QQ昵称" ref='ref_qq_nick' required labelWidth="100px" v-model="nickName" placeholder="QQ昵称" :show-clear="true"  :max="10"></x-input>
      <x-input title="QQ群号码" ref='ref_qq_group' :is-type='beNumber' required labelWidth="100px" keyboard="number" v-model="qqGroup"  :show-clear="true" :max="16"></x-input>
    </group>
  
    <toast
      v-model="showErrorToast"
      type="text"
      width="auto"
      :time="1200">{{ toastMsg }}
    </toast>

    <box gap="30px 15px">
      <x-button type="primary" @click.native="editUser" action-type="button">确定</x-button>    
    </box>
    <box gap="1px 15px">
      <router-link :to="{name:'home'}">
          <x-button>返回主页</x-button>
      </router-link>
    </box>
  </div> 
</template>
 
<script>
import { Toast, XInput, Box, XButton, Group, Cell } from 'vux'
import { editUserProfile } from '../../api/api'

import { getUser, saveUserInfo } from '../../utils/user-storage'

export default {
  name: 'editprofile',
  components: {
    Toast, XInput, Box, XButton, Group, Cell
  },
  data () {
    return {
      qq: '',
      qqGroup: '',
      nickName: '',
      user: {},
      showErrorToast: false,
      toastMsg: ''
    }
  },
  created: function () {
    let user = getUser()
    console.log(user)
    if (user != null) {
      this.qq = user.qq
      this.qqGroup = user.qq_group
      this.nickName = user.nick_name
    }
  },
  methods: {
    beNumber (value) {
      return {
        valid: /^\d+$/.test(value),
        msg: '只能输入数字'
      }
    },
    showToast: function (msg) {
      this.toastMsg = msg
      this.showErrorToast = true
    },
    editUser () {
      if (!this.qq && !this.qqGroup && !this.nickName) {
        this.showToast('请完成所有输入项')
        return
      }
      if (!this.$refs.re_qq.valid || !this.$refs.ref_qq_nick.valid || !this.$refs.ref_qq_group.valid) {
        this.showToast('请输入信息')
        return
      }

      let user = getUser()
      user.qq = this.qq
      user.qq_group = this.qqGroup
      user.nick_name = this.nickName
      editUserProfile(user,
        (user) => {
          saveUserInfo(user)
          this.showToast('成功')
          this.$router.replace({name: 'home'})
        },
        () => {
          console.log('error')
          this.showToast('失败')
        })
    }
  }
}
</script>
 
<style lang="css">

</style>