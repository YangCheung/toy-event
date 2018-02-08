<template lang="html">
    <div>
      <masker style="border-radius: 2px;">
        <div class="m-img" ></div>
        <div slot="content" class="m-main">
          <div>
            <div class="m-title" >今日活动</div>
            <div >{{event ? + event.desc_text : ''}}</div>  
            <div class="m-sub-title"> {{event.video_only? '仅限图片' : '仅限视频' }}</div>  
          </div>        
          <span class="m-time">{{date}}</span>
        </div>
      </masker> 
      <div v-if="!event" class="no-event">
        暂无活动
      </div>
      <div v-if="event">        
        <toast
          v-model="showErrorToast"
          type="text"
          width="auto"
          :time="1200">{{ toastMsg }}
        </toast>

        <box gap="50px 15px">
          <x-button type="primary" @click.native="joinEvent" action-type="button">参加活动</x-button>
        </box>     
      </div>
      
          
      <loading :show="showLoging" text="加载中"></loading>
    </div>
</template>
 
<script>
import { Divider, Toast, Loading, Masker, Box, XButton, Cell, Group } from 'vux'
import { getCurrentEvent } from '../api/api'
import { getDate } from '../utils/date-utils'

export default {
  name: 'current_event',
  components: {
    Toast, Divider, Loading, Masker, Box, XButton, Cell, Group
  },
  data () {
    return {
      join: 0,
      event: '',
      date: '',
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
  created () {
    this.date = getDate()
    this.showLoging = true
    getCurrentEvent((result) => {
      this.showLoging = false
      this.event = result.event
      this.join = result.join
    }, () => {
      this.showLoging = false
      this.event = null
    })
  },
  methods: {
    showToast: function (msg) {
      this.toastMsg = msg
      this.showErrorToast = true
    },
    joinEvent () {
      if (this.join) {
        this.showToast('不能重复参加')
      } else {
        this.$router.push({name: 'Uploader'})
      }
    }
  }
}
</script>
 
<style lang="css">
.no-event{
  font-size: 25px;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
}
.m-img {
  padding-bottom: 50%;
  display: block;
  position: relative;
  max-width: 100%;
  background-size: cover;
  background-color: #bcbbec;
  background-position: center center;
  cursor: pointer;
  border-radius: 2px;
}
.m-content {
  font-size: 16px;
  color:#666;
  line-height: 30px;
  margin: 30px 20px 10px 20px
}
.m-title {
  font-size: 18px;
  font-weight: 400;
}
.m-sub-title {
  font-size: 16px;
  font-weight: 300;
}
.m-main {
  color: #fff;
  text-align: center;
  text-shadow: 0 0 2px rgba(0, 0, 0, .5);
  font-weight: 500;
  font-size: 25px;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
}

.m-time {
  font-size: 16px;
  margin-top: 10px;
  padding-top: 4px;
  border-top: 1px solid #f0f0f0;
  padding-left: 20px;
  padding-right: 20px;
  display: inline-block;
}
</style>