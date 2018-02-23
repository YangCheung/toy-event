<template>
  <div>
    <group :title="'参加今日活动 仅限'+(this.mode === 'video' ? '视频' : '图片')">
        <x-textarea :max="140" v-model="text" placeholder="随便说点什么"></x-textarea>
      </group>
    <div class="weui-uploader" style="padding:15px;">
      
    <div class="weui-uploader__bd">
      <ul class="weui-uploader__files" id="uploaderFiles">
        <li v-for="(file, index) in dFiles" v-bind:class="{'weui-uploader__file': true, 'weui-uploader__file_status': file.percent < 100}"  v-bind:key="file.src" >
          <video v-if="file.type ==='video'" class="file-image" :src='file.src'/>
          <img v-else class="file-image" :src='file.src'>
          
          <div class="weui-uploader__file-content">{{file.percent}} %</div>
          <i @click="deleteFile(index)" class="weui-icon-cancel"></i>
        </li>
      </ul>
      <div class="weui-uploader__input-box" v-show="dFiles.length < sizeLimit">
        <input id="uploaderInput" v-on:change="fileSelected" class="weui-uploader__input" type="file" multiple="multiple" :accept="mediaType" />
      </div>
    </div>
    </div>
      <div class="weui-uploader__hd">
        <div class="weui-uploader__info">{{dFiles.length}}/{{sizeLimit}}</div>
      </div>
    <toast :position="'middle'" v-model="showTst" :time="2000" width="20em" type="text">{{toastMsg}}</toast>
    <box gap="15px 15px">
      <x-button type="primary" @click.native="submit" action-type="button">提交</x-button>
    </box>
  </div>
</template>

<script>
import Vue from 'vue'
import { Box, XButton, XInput, XTextarea, Group, Toast, Divider, cookie } from 'vux'
import axios from 'axios'
import { getMimeType, getFileKey } from '../utils/qiniu'
import { API } from '../config'
import { sendPost } from '../api/api'

export default {
  components: {
    Box,
    XButton,
    XInput,
    XTextarea,
    Group,
    Divider,
    Toast
  },
  data () {
    return {
      videoType: false,
      text: '',
      sizeLimit: 9,
      mode: 'image',
      dFiles: [],
      qiniu_token: '',
      results: [],
      toastMsg: '',
      showTst: false
    }
  },
  watch: {
    dFiles: function () {
      if (this.dFiles.length === 0) {
        this.mode = ''
        console.log('mode reset')
        this.sizeLimit = 9
      }
    }
  },
  computed: {
    mediaType () {
      return this.mode === 'image' ? 'image/*' : 'video/*'
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log(from)
    if (from.path === '/' || !to.query.event_id) {
      next({name: 'home'})
    } else {
      next()
    }
  },
  created: function () {
    let that = this
    const videoType = this.$route.query.only_video
    if (videoType) {
      this.sizeLimit = 1
      this.mode = 'video'
    }
    axios(API.qiniu_token)
      .then(function (response) {
        that.qiniu_token = response.data.qiniu_token
        if (that.qiniu_token) {
          cookie.set('qiniu_token', that.qiniu_token, {
            expires: 1
          })
        }
      })
  },
  methods: {
    submit: function () {
      let assets = []
      for (var i = 0; i < this.dFiles.length; i++) {
        let file = this.dFiles[i]
        if (file.result) {
          assets.push(file.result)
        }
      }
      if (assets.length === 0) {
        this.showToast('图片上传不完整')
        return
      }

      let feed = {
        event_id: this.$route.query.event_id,
        text: this.text,
        assets: assets
      }
      sendPost(feed, (response) => {
        this.showToast('发布成功')
        this.$router.back()
      }, (error) => {
        console.log(error)
        this.showToast('发布失败')
      })
    },
    showToast: function (msg) {
      this.toastMsg = msg
      this.showTst = true
    },
    deleteFile: function (index) {
      this.dFiles.splice(index, 1)
    },
    upload: function (file) {
      let param = new FormData()
      let realFile = file.realFile
      console.log('file = ' + realFile.name)
      param.append('file', realFile, realFile.name)
      param.append('key', getFileKey(realFile.name))
      param.append('token', this.qiniu_token)
      let config = {
        headers: {'Content-Type': 'multipart/form-data'},
        onUploadProgress: function (progressEvent) {
          var percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          if (percent === 100) {
            percent = 99
          }
          Vue.set(file, 'percent', percent)
        }
      }
      axios.post('http://upload.qiniu.com/', param, config)
        .then(response => {
          file.result = response.data
          console.log(response.data)
          Vue.set(file, 'percent', 100)
        })
    },
    fileSelected (e) {
      var url = window.URL || window.webkitURL || window.mozURL
      var files = e.target.files

      for (var i = 0, len = files.length; i < len; ++i) {
        let wFile = {percent: 0}
        let file = files[i]
        let type = getMimeType(file.type)
        if (type && (type === 'image' || type === 'video')) {
          wFile.type = type
          if (type !== this.mode) {
            this.showToast('该活动只能发' + (this.mode === 'video' ? '视频' : '图片'))
            return
          }
        } else {
          this.showToast('不支持该文件类型')
          console.warn('不支持的 type = ' + file.type)
          return
        }

        wFile.realFile = file
        this.upload(wFile)
        console.log(file.type)
        wFile.src = url.createObjectURL(file)
        this.dFiles.push(wFile)
        console.log(wFile.src)

        if (this.dFiles.length >= this.sizeLimit) {
          return
        }
      }
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/weui/widget/weui-uploader/index.less';
@import '~vux/src/styles/weui/icon/weui_icon_font.less';
@weuiUploaderSize: 100px;

.daily-event-title {
  position: relative;
  height: 100px;
  padding: 20px;
  background-color: #eee;
  .title {
    text-align:center;
    position: relative;
    padding-top: 10px;
    font-size: 22px;
    font: bold;
  };
  .desc {
    position: relative;
    padding-top: 10px;
    font-size: 16px;
    
  }
}
.weui-uploader__file {
  position: relative;
  image-orientation: 0deg;
  border:1px solid black;
  background-color: #000;
  .file-image {
    width: 100%;
    height: 100%;
  };
  .weui-icon-cancel {
    color: #F43530;
    font-size: 22px;
    font: bold;
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .5);
    background: rgba(0, 0, 0, .5) no-repeat center center;
  }
  .weui-icon-cancel:before { content: "X" } /* '' */
}
</style>