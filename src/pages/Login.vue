<template lang="html">
    <div>
     <group title="短信登录">
      <x-input title="手机 " ref="phoneInput" keyboard="number" is-type="china-mobile" v-model="phone" placeholder="输入手机号码  "  :show-clear="true" :max="11">
        <x-button slot="right" type="primary" :disabled='sendDisable || showCountDown' @click.native="sendSms" mini >
          发送验证码
          <countdown v-show="showCountDown" :start="showCountDown" v-model="ctime" @on-finish="onCountDownfinish"></countdown>
        </x-button>
      </x-input>   
      <x-input title="验证码" keyboard="number" v-model="verifyCode" placeholder="输入验证码  "  :show-clear="true" :max="6">
      </x-input>  
    </group>
    
    <toast
      v-model="showErrorToast"
      type="text"
      width="auto"
      :time="1200">{{ toastMsg }}
    </toast>

      <box gap="50px 15px">
        <x-button type="primary" @click.native="verify" action-type="button">登录</x-button>
      </box>     
          
      <loading :show="showLoging" text="加载中"></loading>
    </div>
</template>
 
<script>
import { Countdown, Toast, Loading, XInput, Box, XButton, Cell, Group } from 'vux'
import { sendSmsCode, verifyCode } from '../api/api'
import { saveToken } from '../utils/token-storage'
import { saveUserInfo } from '../utils/user-storage'

export default {
  name: 'login',
  components: {
    Toast, Countdown, Loading, XInput, Box, XButton, Cell, Group
  },
  data () {
    return {
      showLoging: false,
      ctime: 30,
      showCountDown: false,
      verifyCode: '',
      phone: '',
      showErrorToast: false,
      toastMsg: '',
      sendDisable: false
    }
  },
  methods: {
    onCountDownfinish () {
      this.showCountDown = false
      this.ctime = 30
    },
    showToast: function (msg) {
      this.toastMsg = msg
      this.showErrorToast = true
    },
    sendSms () {
      if (!this.$refs.phoneInput.valid) {
        this.showToast('请输入正确手机号码')
        return
      }
      this.sendDisable = true

      sendSmsCode(this.phone, () => {
        this.sendDisable = false
        this.showCountDown = true
      }, () => {
        this.sendDisable = false
        this.showToast('发送验证码失败')
      })
    },
    verify () {
      if (!this.$refs.phoneInput.valid) {
        this.showToast('请输入正确手机号码')
        return
      }
      if (!new RegExp('^\\d{6,}$').test(this.verifyCode)) {
        this.showToast('验证码格式不对')
        return
      }

      if (!this.verifyCode || !this.phone) {
        return
      }
      this.showLoging = true
      verifyCode(this.phone, this.verifyCode,
        (user) => {
          this.showLoging = false
          saveToken(user.token)
          saveUserInfo(user.user)
          this.$router.replace({name: 'home'})
        },
        (error) => {
          this.showLoging = false
          console.log(error)
          this.showToast('验证码错误')
        })
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