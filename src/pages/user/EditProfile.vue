<template lang="html">
  <div>
    <group title="完善信息">
      <x-input title="个人QQ" v-model="qq" placeholder="请输入qq" :show-clear="true" placeholder-align="right" :max="20"></x-input>
      <x-input title="QQ昵称" v-model="nickName" placeholder="" :show-clear="true" placeholder-align="right" :max="20"></x-input>
      <x-input title="所在群QQ号" v-model="qqGroup" placeholder="" :show-clear="true" placeholder-align="right" :max="20"></x-input>
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
import { Toast, XInput, Box, XButton, Group } from 'vux'
import { editUserProfile } from '../../api/api'

import { getUser, setUser } from '../../config'

export default {
  name: 'editprofile',
  components: {
    Toast, XInput, Box, XButton, Group
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
          setUser(user)
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