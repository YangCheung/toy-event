<template lang="html">
    <div>
     <group title="添加活动">
      <x-input title="活动内容" v-model="fieldText" placeholder="请输入" novalidate :show-clear="true" placeholder-align="right" :max="30"></x-input>
    </group>

     <group title="作品类型">
      <radio :options="[ '图片', '视频' ]" :value="only_video?'视频':'图片'" @on-change="change"></radio>
    </group>
  
    <toast
      v-model="showErrorToast"
      type="text"
      width="auto"
      :time="1200">{{ toastMsg }}
    </toast>

      <box gap="50px 15px">
        <x-button type="primary" @click.native="addEvent" action-type="button">确定</x-button>
      </box>
      <box v-if="field.id" gap="-30px 15px">
        <x-button type="warn" @click.native="deleteField" action-type="button">删除</x-button>
      </box>

      <actionsheet v-model="showPop" 
          :menus='menus3'  @on-click-menu-delete="onDelete" show-cancel>
      </actionsheet>

    </div>

   
</template>
 
<script>
import { Actionsheet, Toast, Radio, SwipeoutButton, XInput, Box, XButton, Cell, Group } from 'vux'
import { deleteEvent, putEvent, eventList } from '../api/ManagerApi'
import { getUser } from '../config'

export default {
  name: 'event',
  components: {
    Actionsheet, Toast, Radio, SwipeoutButton, XInput, Box, XButton, Cell, Group
  },
  data () {
    return {
      only_video: false,
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
    eventList(id, getUser().fields[0],
     (response) => {
       that.setData(response[0])
       console.log(response)
     },
    (error) => {
      console.log(error)
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
      this.field.field_id = getUser().fields[0]
      this.field.desc_text = this.fieldText
      this.field.only_video = this.only_video
      putEvent(this.field,
        (user) => {
          this.showToast('添加成功')
          this.$router.replace({name: 'events'})
        },
        () => {
          console.log('error')
          this.showToast('添加失败')
        })
    },
    onDelete () {
      deleteEvent(this.field,
        (user) => {
          this.showToast('添加成功')
          this.$router.replace({name: 'events'})
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
      this.only_video = value.only_video
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