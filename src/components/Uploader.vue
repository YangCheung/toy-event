<template>
  <div>
    <div class="daily-event-title">
      <div class="title">今日活动</div>
      <div class="desc">用9张图片表达祖国山河美好，世界和平</div>
    </div>
    
    <!-- <div class="weui-uploader__hd">
          <p class="weui-uploader__title">~~发动态~~     (一个视频或最多9张图片)</p>
    </div> -->
    <group>
        <x-textarea :max="140" :placeholder="'随便说点什么'" v-on:on-change='textValue' @on-focus="onEvent('focus')"></x-textarea>
      </group>
    <div class="weui-uploader" style="padding:15px;">

      
    <div class="weui-uploader__bd">
      <ul class="weui-uploader__files" id="uploaderFiles">
        <!-- :style="{ 'background-image': `url(${file})`}" -->
        <li v-for="(file, index) in dFiles" v-bind:class="{'weui-uploader__file': true, 'weui-uploader__file_status': file.percent < 100}"  v-bind:key="file.src" >
          <video v-if="file.type ==='video'" class="file-image" :src='file.src'/>
          <img v-else class="file-image" :src='file.src'>
          
          <div class="weui-uploader__file-content">{{file.percent}} %</div>
          <i @click="deleteFile(index)" class="weui-icon-cancel"></i>
        </li>
      </ul>
      <div class="weui-uploader__input-box" v-show="dFiles.length < sizeLimit">
        <input id="uploaderInput" v-on:change="inputChange" class="weui-uploader__input" type="file" multiple="multiple" accept="video/* image/*" />
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
      text: '',
      sizeLimit: 9,
      mode: '',
      dFiles: [],
      token: '',
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
  created: function () {
    let that = this
    axios('http://172.2.0.225:8089/qiniu')
      .then(function (response) {
        that.token = response.data.qiniu_token
        console.log('token = ' + that.token)
        if (that.token) {
          cookie.set('qiniu_token', that.token, {
            expires: 1
          })
        }
      })
  },
  methods: {
    textValue: function (text) {
      this.text = text
      console.log('text = ' + text)
    },
    submit: function () {
      let json = {assets: [], text: ''}
      for (var i = 0; i < this.dFiles.length; i++) {
        let file = this.dFiles[i]
        if (file.result) {
          json.assets.push(file.result)
        }
      }
      if (json.assets.length === 0) {
        this.showToast('图片上传不完整')
        return
      }

      json.text = this.text
    },
    onEvent (event) {
      console.log('on', event)
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
      param.append('token', this.token)
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
    inputChange: function (e) {
      var url = window.URL || window.webkitURL || window.mozURL
      var src = null
      var files = e.target.files

      for (var i = 0, len = files.length; i < len; ++i) {
        let wFile = {percent: 0}
        let file = files[i]
        let type = getMimeType(file.type)
        if (type && (type === 'image' || type === 'video')) {
          if (!this.mode) {
            this.mode = type
            if (this.mode === 'video') {
              this.sizeLimit = 1
            }
          }
          wFile.type = type
          if (type !== this.mode) {
            console.warn('type 不相同！')
            this.showToast('不能同时选择图片和视频')
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
        if (url) {
          src = url.createObjectURL(file)
        } else {
          src = e.target.result
        }
        wFile.src = src
        this.dFiles.push(wFile)
        console.log(src)

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