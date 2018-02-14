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
    <post-card></post-card>
    <toast
      v-model="showErrorToast"
      type="text"
      width="auto"
      :time="1200">{{ toastMsg }}
    </toast>    
    <loading :show="showLoging" text="加载中"></loading>
  </div>
</template>
 
<script>
import { TransferDom, Divider, Toast, Loading, Masker, Box, XButton, Cell, Group } from 'vux'
import { getCurrentEvent, getPostByEvent } from '../api/api'
import { getDate, format } from '../utils/date-utils'
import { requestFullScreen } from '../utils/util'
import PostCard from '@/components/PostCards'

export default {
  name: 'pk-event',
  directives: {
    TransferDom
  },
  components: {
    PostCard, TransferDom, Toast, Divider, Loading, Masker, Box, XButton, Cell, Group
  },
  data () {
    return {
      imageList: [{}],
      event: null,
      date: '',
      showLoging: false,
      showErrorToast: false,
      toastMsg: ''
    }
  },
  created () {
    this.date = getDate()
    this.showLoging = true
    let self = this
    let eventId = this.$route.query.eventId
    getCurrentEvent(eventId, result => {
      self.event = result.event
      self.join = result.join

      getPostByEvent(self.event.id, result => {
        console.log(result)
        self.event.post = result
        self.showLoging = false
      }, () => {
        self.showLoging = false
      })
    }, () => {
      self.showLoging = false
      self.event = null
    })
  },
  methods: {
    closeVideo () {
      // let videoEle = this.$refs.fullScreenVideo
      // videoEle.pause()
      // this.showVideo = false
      // document.body.className = ''
    },
    videoExitFullScreen () {
      // if (!document.webkitIsFullScreen) {
      //   this.closeVideo()
      // };
    },
    videoEnterFullScreen () {
      requestFullScreen()
    },
    playVideo (video) {
      if (video) {
        if (this.iOS) {
          window.location.href = video.url
          return
        }
        console.log({src: video.url, type: video.asset_type})
        var myPlayer = window.videojs('#superVideo')
        myPlayer.src({src: video.url, type: 'video/mp4'})
        this.showVideo = true
        // let videoEle = this.$refs.fullScreenVideo
        // videoEle.innerHTML = ''
        // if (!this.videoSource) {
        //   this.videoSource = document.createElement('source')
        //   this.videoSource.setAttribute('src', video.url)
        //   videoEle.appendChild(this.videoSource)
        // } else {
        //   this.videoSource.setAttribute('src', video.url)
        //   videoEle.load()
        // }

        // videoEle.play()

        // document.body.className = 'no-scroll'
        // requestFullScreen(videoEle)
      }
    },
    getImageUrl (asset, single) {
      let aw = asset.w
      let ah = asset.h
      let wh = aw / ah

      let w = single ? 220 : 100
      let h = single ? 250 : 100

      if (wh > 1) {
        w = Math.round(w * aw / ah)
      } else {
        h = Math.round(h * ah / aw)
      }
      return asset.url + '?imageView2/2/w/' + w + '/h/' + h + '/interlace/1'
    },
    getVideoThumb (asset) {
      // let aw = asset.w
      // let ah = asset.h
      // let wh = aw / ah

      // let w = this.fullWidth
      // let h = 200

      // if (wh > 1) {
      //   w = Math.round(w * aw / ah)
      // } else {
      //   h = Math.round(h * ah / aw)
      // }
      return asset.url + '?vframe/jpg/offset/1'
      // /w/' + w + '/h/' + h
    },
    show (list, index) {
      this.imageList = list.map((item) => {
        item.src = item.url + '?imageView2/4/w/' + 1920 + '/h/' + 1080 + '/interlace/1'
        return item
      })
      this.$nextTick(() => { this.$refs.previewer.show(index) })
    },
    formatDate (date) {
      return format(date)
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
    },
    isVideo (item) {
      return item.assets[0].asset_type.startsWith('video')
    }
  }
}
</script>
 
<style lang="less">
.no-scroll {
  overflow: hidden
}
.no-event{
  font-size: 25px;
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

.card {
  width :100%;
  background-color: #fff;
  margin-bottom: 10px;
  position: relative;
  box-shadow: 0 1px 0.1875rem -0.125rem rgba(0,0,0,.2)
}
.card-header {
  display: flex;

  .header-bg {
    width: 100%;
    height: 60px;
    background-repeat: no-repeat;
    background-position: top right;
    background-size: 100% auto;
    position: absolute;
    top: -4px;
    left: 0;
    .avatar {
      margin: .75rem 0 .5rem .75rem;
      display: flex;
      position: relative;
      .avatar-img {
        width: 2.125rem;
        height: 2.125rem;
        border-radius: 50%;
        vertical-align: top;
        display: block;
      }        
    }
    
  }
   
}
.card-footer {
  width: 100%;
  display: flex;
  align-items: center;
  background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0%,#dadada),color-stop(50%,#dadada),color-stop(50%,rgba(0, 0, 0, 0)));
  background-image: -webkit-linear-gradient(top,#dadada 0,#dadada 50%,rgba(0, 0, 0, 0) 50%);
  background-image: linear-gradient(to bottom, #dadada 0, #dadada 50%, rgba(0, 0, 0, 0) 50%);
  -webkit-background-size: 100% 1px;
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: top;
  padding: 10px;
  & > a {
    color: #929292;
    flex:1;
    text-align: center;
    padding: 7.5px 0;
    display: inline-block;
    height: 30px;
    line-height: 30px;
  
    &:active{
      background-color :#ebebeb
    }
  }
}
.user-info{
  max-width: 16rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: .6875rem .6875rem 0;
  line-height: 1rem;
  .user-name {
    color: #333;
  }    
  .publish-data {
    color: #929292;
    font-size: 10px;
    .publish-source {
      padding-left: .5rem;
    }  
  }      
}      

.card-body{
  padding: .25rem .75rem .625rem;
  line-height: 1.35rem;
}
  
.pic-list {
  margin-top: 5px;
  width: 360px;
  overflow: hidden;

  & li {
    float: left;
    list-style-type:none;
    margin-top: 5px;  
  }    
  & div {
    position: relative;
    width: 100px;
    height: 100px;
    margin-right: 5px;   
    background-color:#ebebeb;
    overflow: hidden;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
  }
    
}

.singlePic {
  position: relative;
  margin-top: 6.25px;
  height: 250px;
  width: 220px;
  overflow: hidden;
  text-align: left;
  background-color:#ebebeb;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }  
  .asset-load-icon-item {
    position: absolute;
    width: 80px;
    height: 80px;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
}

.singleVideo {
  position: relative;
  margin-top: 6.25px;
  // height: 200px;
  max-height: 400px;
  width: 100%;
  overflow: hidden;
  video {
    width: 100%;
    max-height: 400px;
    max-width: 400px;
    background: #000
  }
  .video{
    // position: relative;
    // width: 100%;
    // height: 250px;

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
    }  
    .asset-load-icon-item {
      position: absolute;
      width: 80px;
      height: 80px;
      top: 50%;
      left: 50%;
      z-index: 100;
      transform: translate3d(-50%, -50%, 0);
    }
  } 
}

  
.content-tip {
  width: 100%;
  text-align: center;
  min-height: 50px;
  margin-bottom: .5625rem;
  &:active {
    background-color: #ebebeb
  }
  span {
    display: inline-block;
    font-size: .75rem;
    line-height: 19px;
    color: #7c7c7c;
    margin: 14px 0;
  }   
}
@media (min-width: 600px) {
  .card-header .header-bg {
    background-size: 50%
  }
}

.full-screen-video {
  width: 100%;
  height: 100%;
  background-color: #000;
  position: fixed;
  top:0;
  left: 0;
  overflow: hidden;
  z-index: 1500;
  video {
    position: absolute;
    width: 100%;
    height: 50%;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
}

.video-close {
  float: right;
  width: 44px;
  height: 44px;
  background-position-x: 0px;
  background-position-y: -44px;
  opacity: 0.75;
  background-color: #000;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjY0IiBoZWlnaHQ9Ijg4IiB2aWV3Qm94PSIwIDAgMjY0IDg4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0aXRsZT5kZWZhdWx0LXNraW4gMjwvdGl0bGU+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Zz48cGF0aCBkPSJNNjcuMDAyIDU5LjV2My43NjhjLTYuMzA3Ljg0LTkuMTg0IDUuNzUtMTAuMDAyIDkuNzMyIDIuMjItMi44MyA1LjU2NC01LjA5OCAxMC4wMDItNS4wOThWNzEuNUw3MyA2NS41ODUgNjcuMDAyIDU5LjV6IiBpZD0iU2hhcGUiIGZpbGw9IiNmZmYiLz48ZyBmaWxsPSIjZmZmIj48cGF0aCBkPSJNMTMgMjl2LTVoMnYzaDN2MmgtNXpNMTMgMTVoNXYyaC0zdjNoLTJ2LTV6TTMxIDE1djVoLTJ2LTNoLTN2LTJoNXpNMzEgMjloLTV2LTJoM3YtM2gydjV6IiBpZD0iU2hhcGUiLz48L2c+PGcgZmlsbD0iI2ZmZiI+PHBhdGggZD0iTTYyIDI0djVoLTJ2LTNoLTN2LTJoNXpNNjIgMjBoLTV2LTJoM3YtM2gydjV6TTcwIDIwdi01aDJ2M2gzdjJoLTV6TTcwIDI0aDV2MmgtM3YzaC0ydi01eiIvPjwvZz48cGF0aCBkPSJNMjAuNTg2IDY2bC01LjY1Ni01LjY1NiAxLjQxNC0xLjQxNEwyMiA2NC41ODZsNS42NTYtNS42NTYgMS40MTQgMS40MTRMMjMuNDE0IDY2bDUuNjU2IDUuNjU2LTEuNDE0IDEuNDE0TDIyIDY3LjQxNGwtNS42NTYgNS42NTYtMS40MTQtMS40MTRMMjAuNTg2IDY2eiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xMTEuNzg1IDY1LjAzTDExMCA2My41bDMtMy41aC0xMHYtMmgxMGwtMy0zLjUgMS43ODUtMS40NjhMMTE3IDU5bC01LjIxNSA2LjAzeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xNTIuMjE1IDY1LjAzTDE1NCA2My41bC0zLTMuNWgxMHYtMmgtMTBsMy0zLjUtMS43ODUtMS40NjhMMTQ3IDU5bDUuMjE1IDYuMDN6IiBmaWxsPSIjZmZmIi8+PGc+PHBhdGggaWQ9IlJlY3RhbmdsZS0xMSIgZmlsbD0iI2ZmZiIgZD0iTTE2MC45NTcgMjguNTQzbC0zLjI1LTMuMjUtMS40MTMgMS40MTQgMy4yNSAzLjI1eiIvPjxwYXRoIGQ9Ik0xNTIuNSAyN2MzLjAzOCAwIDUuNS0yLjQ2MiA1LjUtNS41cy0yLjQ2Mi01LjUtNS41LTUuNS01LjUgMi40NjItNS41IDUuNSAyLjQ2MiA1LjUgNS41IDUuNXoiIGlkPSJPdmFsLTEiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTUwIDIxaDV2MWgtNXoiLz48L2c+PGc+PHBhdGggZD0iTTExNi45NTcgMjguNTQzbC0xLjQxNCAxLjQxNC0zLjI1LTMuMjUgMS40MTQtMS40MTQgMy4yNSAzLjI1eiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xMDguNSAyN2MzLjAzOCAwIDUuNS0yLjQ2MiA1LjUtNS41cy0yLjQ2Mi01LjUtNS41LTUuNS01LjUgMi40NjItNS41IDUuNSAyLjQ2MiA1LjUgNS41IDUuNXoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTA2IDIxaDV2MWgtNXoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTA5LjA0MyAxOS4wMDhsLS4wODUgNS0xLS4wMTcuMDg1LTV6Ii8+PC9nPjwvZz48L2c+PC9zdmc+)
}
</style>