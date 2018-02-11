<template lang="html">
  <div>
    <group title="完善信息">
      <x-input title="QQ号码" labelWidth="100px" keyboard="number" v-model="qq" placeholder="请输入个人QQ号码" :show-clear="true"  :max="16"></x-input>
      <x-input title="QQ昵称" labelWidth="100px" v-model="nickName" placeholder="QQ昵称" :show-clear="true"  :max="10"></x-input>
      <x-input title="QQ群号码" labelWidth="100px" keyboard="number" v-model="qqGroup" placeholder="输入你所在群号码" :show-clear="true" :max="16"></x-input>
    </group>
  
    <toast
      v-model="showErrorToast"
      type="text"
      width="auto"
      :time="1200">{{ toastMsg }}
    </toast>

    <box gap="50px 15px">
      <x-button type="primary" @click.native="editUser" action-type="button">确定</x-button>
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

      showErrorToast: false,
      toastMsg: ''
    }
  },
  methods: {
    showToast: function (msg) {
      this.toastMsg = msg
      this.showErrorToast = true
    },

    editUser () {
      if (!this.qq && !this.qqGroup && !this.nickName) {
        this.showToast('请完成所有输入项')
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
          this.$router.replace({name: 'current-event'})
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