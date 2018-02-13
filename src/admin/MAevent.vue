<template lang="html">
    <div>
     <group title="添加活动">
      <x-input title="活动内容" :disabled="event && Math.abs(event.activity) == 1" v-model="fieldText" placeholder="请输入" novalidate :show-clear="true" placeholder-align="right" :max="30"></x-input>
    </group>
     <group title="作品类型">
      <radio :disabled="event && Math.abs(event.activity) == 1" :options="[ '图片', '视频' ]" :value="only_video?'视频':'图片'" @on-change="change"></radio>
    </group>  
    <toast
      v-model="showErrorToast"
      type="text"
      width="auto"
      :time="1200">{{ toastMsg }}
    </toast>

      <box gap="20px 15px">
        <router-link :to="{name:'current-event', query: { eventId: event.id }}" v-show="event && Math.abs(event.activity) == 1">
          <x-button >查看活动详情</x-button>
        </router-link>

        <x-button v-show="!(event && Math.abs(event.activity) == 1)" type="primary" @click.native="addEvent" action-type="button">确定</x-button>
        <x-button type="warn" v-show="event && event.activity === 1" @click.native="activate(-1)" action-type="button">结束活动</x-button>
      </box>
      <box gap="10px 15px">
        <x-button v-show ="event && event.activity === 0"  @click.native="activate(1)" action-type="button">激活</x-button>
        <x-button v-show ="event && event.activity === 0"  @click.native="deleteField" action-type="button">删除</x-button>        
      </box>
      <box gap="10px 15px">
        <router-link :to="{name:'eventslist'}" replace>
          <x-button  action-type="button">返回</x-button>
        </router-link>       
      </box>
       
      <actionsheet v-model="showPop" 
          :menus='menus3'  @on-click-menu-delete="onDelete" show-cancel>
      </actionsheet>
      <!-- <div v-transfer-dom> -->
        <loading :show="showLoging" text="加载中"></loading>
      <!-- </div> -->
    </div>
</template>
 
<script>
import { Loading, Actionsheet, Toast, Radio, SwipeoutButton, XInput, Box, XButton, Cell, Group } from 'vux'
import { activateEvent, deleteEvent, putEvent, eventList } from '../api/ManagerApi'

export default {
  name: 'MAevent',
  components: {
    Loading, Actionsheet, Toast, Radio, SwipeoutButton, XInput, Box, XButton, Cell, Group
  },
  data () {
    return {
      showLoging: false,
      id: '',
      field_id: '',
      only_video: false,
      event: {},
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
    this.field_id = this.$route.params.fieldid
    if (!this.id || this.id === 'new') {
      return
    }
    this.showLoging = true
    let that = this
    eventList(this.id, this.field_id,
     (response) => {
       that.setData(response[0])
       this.showLoging = false
     },
    () => {
      this.showLoging = false
    })
  },
  methods: {
    change (value, label) {
      this.only_video = value === '视频'
      console.log('only_video = ', this.only_video, value, label)
    },
    showToast: function (msg) {
      this.toastMsg = msg
      this.showErrorToast = true
    },

    addEvent () {
      if (!this.fieldText) {
        this.showToast('请输入活动描述')
        return
      }
      this.showLoging = true
      this.event.desc_text = this.fieldText
      this.event.only_video = this.only_video
      putEvent(this.event, this.field_id,
        (user) => {
          this.showLoging = false
          this.showToast('添加成功')
          this.$router.replace({name: 'eventslist'})
        },
        () => {
          this.showLoging = false
          this.showToast('添加失败')
        })
    },
    onDelete () {
      this.showLoging = true
      deleteEvent(this.event,
        (user) => {
          this.showLoging = false
          this.$router.replace({name: 'eventslist'})
        },
        () => {
          this.showLoging = false
          console.log('error')
          this.showToast('删除失败')
        })
    },
    deleteField () {
      this.showPop = true
    },
    setData (value) {
      this.event = value
      this.fieldText = value.desc_text
      this.only_video = value.only_video
    },
    activate (status) {
      if (!status) {
        return
      }
      this.showLoging = true
      activateEvent(
        {
          field_id: this.event.field_id,
          activate: status,
          id: this.event.id
        },
        (user) => {
          this.showLoging = false
          this.$router.replace({name: 'eventslist'})
        },
        (error) => {
          this.showLoging = false
          if (error && error.message) {
            this.showToast(error.message)
          } else {
            this.showToast('激活失败')
          }
        })
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