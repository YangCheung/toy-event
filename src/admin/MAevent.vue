<template lang="html">
    <div>
      <group title="添加活动">
        <x-input title="活动内容" :disabled="event && event.activity !== undefined && Math.abs(event.activity) != 0" v-model="fieldText" placeholder="请输入" novalidate :show-clear="true" placeholder-align="right" :max="30"></x-input>
      </group>
      <group title="作品类型">
        <radio :disabled="event && event.activity !== undefined && Math.abs(event.activity) != 0" :options="[ '图片', '视频' ]" :value="only_video?'视频':'图片'" @on-change="change"></radio>
      </group>  
      <toast
        v-model="showErrorToast"
        type="text"
        width="auto"
        :time="1200">{{ toastMsg }}
      </toast>

      <box gap="20px 15px">
        <router-link v-if="event && event.activity !== undefined && Math.abs(event.activity) != 0" :to="{name:'current-event', query: { eventId: event.id }}">
          <x-button >查看活动详情</x-button>
        </router-link>

        <x-button v-show="!(event && event.activity !== undefined && Math.abs(event.activity) != 0)" type="primary" @click.native="addEvent" action-type="button">确定</x-button>
        <x-button type="warn" v-show="event && event.activity !== undefined && event.activity === 1" @click.native="showFinish()" action-type="button">结束活动</x-button>
        
      </box>
      <box gap="10px 15px">
        <x-button v-show ="event && event.activity !== undefined && event.activity === 0"  @click.native="activate()" action-type="button">激活</x-button>
        <x-button v-show ="event && event.activity !== undefined && event.activity === 0"  @click.native="deleteField" action-type="button">删除</x-button>        
      </box>
      <box gap="10px 15px">
        <router-link :to="{name:'eventslist'}" replace>
          <x-button  action-type="button">返回</x-button>
        </router-link>       
      </box>
       
      <div v-transfer-dom>
        <popup v-model="show_finish" height="270px" is-transparent>
          <div style="width: 95%;background-color:#fff;height:250px;margin:0 auto;border-radius:5px;padding-top:10px;">         
            <cell title="设置投票期限" :inline-desc="event_deadline + '个小时后结束'" primary="content">
              <range v-if="show_finish" v-model="event_deadline" :min=1 :max=24 decimal></range>
            </cell>

            <div style="padding:20px 15px;">
              <x-button type="warn"@click.native="deactivate()">确认结束</x-button>
              <x-button @click.native="show_finish = false">取消</x-button>
            </div>
          </div>
        </popup>
      </div>

      <actionsheet v-model="showPop" 
          :menus='menus3'  @on-click-menu-delete="onDelete" show-cancel>
      </actionsheet>
      <!-- <div v-transfer-dom> -->
        <loading :show="showLoging" text="加载中"></loading>
      <!-- </div> -->
    </div>
</template>
 
<script>
import { TransferDom, Range, Popup, Loading, Actionsheet, Toast, Radio, SwipeoutButton, XInput, Box, XButton, Cell, Group } from 'vux'
import { activateEvent, deactivateEvent, deleteEvent, putEvent, eventList } from '../api/ManagerApi'

export default {
  name: 'MAevent',
  directives: {
    TransferDom
  },
  components: {
    Range, Popup, Loading, Actionsheet, Toast, Radio, SwipeoutButton, XInput, Box, XButton, Cell, Group
  },
  data () {
    return {
      event_deadline: 3,
      show_finish: false,
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
    showFinish () {
      this.show_finish = true
    },
    deactivate () {
      this.showLoging = true
      deactivateEvent(
        {
          field_id: this.event.field_id,
          event_deadline: this.event_deadline,
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
            this.showToast('发生错误')
          }
        })
    },
    activate () {
      this.showLoging = true
      activateEvent(
        {
          field_id: this.event.field_id,
          activate: 1,
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