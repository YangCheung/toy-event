<template lang="html">
  <div>
    <masker style="border-radius: 2px;">
      <div class="m-img" ></div>
      <div slot="content" class="m-main">
        <div>
          <div class="m-title">{{getTitle}}</div>
          <div >{{event ? event.desc_text : ''}}</div>  
          <div v-if="event" class="m-sub-title"> {{event.only_video ? '仅限视频' : '仅限图片' }}</div>  
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
      <box v-if="event.activity == 1" gap="10px 15px">
        <x-button :disabled="join == 1" @click.native="joinEvent" action-type="button">{{join == 1 ? '已参加' : '参加活动'}}</x-button>
      </box>     
    </div>

     <group style="margin-bottom:20px" v-if="event != null && admin && statistics != null" title="统计信息" label-width="8.5em" label-margin-right="2em" label-align="justify">
        <cell title="作品总数" :value="statistics.feed_count" value-align="left"></cell>
        <cell title="参与人数/总人数" :value="statistics.attend_user_count + '/' + statistics.user_count" value-align="left"></cell>
        <cell title="选票是否发送" :value="event.has_vote?'已发送':'未发送'" value-align="left"></cell>
        <cell title="有效投票" :value="statistics.attend_vote_count + '/' + statistics.vote_count" value-align="left"></cell>
        <cell title="参与QQ群" is-link :arrow-direction="showQQlist ? 'up' : 'down'" @click.native="showQQlist = !showQQlist" :value="statistics.attend_user_qq_group" value-align="left"></cell>
        <template v-if="showQQlist">
            <cell v-for="(item,index) in statistics.attend_user_qq_groups" v-bind:key="index" value-align="left"
             :value="(item.group_name != null ? (item.group_name + ' - ') :'')+ item.group_number +'  ('+ item.user_count +'个用户)'"></cell>
        </template> 
        
    </group>

    <div v-if="event && event.post">
      <post-card :posts="event.post"></post-card>
    </div>
   
    <div v-transfer-dom>
      <loading :show="showLoging" text="加载中"></loading>
    </div>
  </div>
</template>
 
<script>
import { TransferDom, CellFormPreview, Divider, Toast, Loading, Masker, Box, XButton, Cell, Group } from 'vux'
import { getCurrentEvent, getUserProfile, getEventStatistics } from '../api/api'
import { getDate } from '../utils/date-utils'
import { isiOS } from '../utils/util'
import PostCard from '@/components/PostCards'

export default {
  name: 'current_event',
  directives: {
    TransferDom
  },
  components: {
    PostCard, CellFormPreview, TransferDom, Toast, Divider, Loading, Masker, Box, XButton, Cell, Group
  },
  data () {
    return {
      showQQlist: false,
      statistics: null,
      imageList: [{}],
      noPost: false,
      join: 0,
      event: null,
      date: '',
      showLoging: false,
      ctime: 30,
      showCountDown: false,
      showErrorToast: false,
      toastMsg: '',
      iOS: isiOS()
    }
  },
  computed: {
    getTitle () {
      if (this.event) {
        if (this.event.activity === 1) {
          return '当前活动'
        } else if (this.event.activity === -1 && this.event.has_vote) {
          return '当前活动(投票中)'
        }
        return '活动存档'
      } else {
        return '无活动'
      }
    }
  },
  created () {
    this.showLoging = true
    let self = this
    let eventId = this.$route.query.eventId
    getEventStatistics(eventId, result => {
      console.log(result)
      this.statistics = result.statistics
    }, () => {

    })
    getCurrentEvent(eventId, result => {
      self.event = result.event
      self.join = result.join
      this.date = getDate(self.event.start_time)
      console.log(result)
      self.event.post = result.event.posts
      self.showLoging = false
    }, () => {
      self.showLoging = false
      self.event = null
    })
  },
  methods: {
    admin () {
      let user = getUserProfile()
      return user.admin
    },
    showToast: function (msg) {
      this.toastMsg = msg
      this.showErrorToast = true
    },
    joinEvent () {
      if (this.join) {
        this.showToast('不能重复参加')
      } else {
        this.$router.push({name: 'Uploader', query: { event_id: this.event.id, only_video: this.event.only_video }})
      }
    }
  }
}
</script>
 
<style lang="less" scoped>
.no-scroll {
  overflow: hidden
}
.no-event{
  fon-size: 25px;
  position: fixed;
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