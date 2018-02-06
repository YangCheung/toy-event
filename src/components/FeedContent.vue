<template lang="html">
    <div class="content">
        <div class="list-header">
            <img class="avatar" v-if="x.user" :src="x.user.avatar_large">
            <span class="user-time" >{{formatTime(new Date())}}</span>
        </div>
        <div class="list-content">
            <span class="content-text" v-html="x.text"></span>
            <div  class="content-img">
                <ul  class="content-img-ul clear-fix">
                    <li v-for="y in x.assets" class="img-li-default" :class= "imgClass(x.assets.length)"  >
                        <div class="img-div" :style="{backgroundImage:'url(' + formatThumbImg(y.key) + ')'}"></div>
                    </li>
                </ul>
            </div>            
        </div>
        <!-- <div class="list-footer">
            <div class="footer-tag">
                <svg viewBox="0 0 62 72" style="display: inline-block; fill: currentcolor; height: 1.25rem; max-width: 100%; position: relative; user-select: none; vertical-align: text-bottom;"><g><path d="M41 31h-9V19a2.999 2.999 0 0 0-4.817-2.386l-21 16a3 3 0 0 0-.001 4.773l21 16a3.006 3.006 0 0 0 3.15.301A2.997 2.997 0 0 0 32 51V39h9c5.514 0 10 4.486 10 10a4 4 0 0 0 8 0c0-9.925-8.075-18-18-18z"></path></g></svg>
                <span class="tag-style">{{formatNum(x.reposts_count)}}</span>
            </div>  
            <div class="footer-tag">
                <svg class="" viewBox="0 0 74 72" style="display: inline-block; fill: currentcolor; height: 1.25rem; max-width: 100%; position: relative; user-select: none; vertical-align: text-bottom;"><g><path d="M70.676 36.644A3 3 0 0 0 68 35h-7V19a4 4 0 0 0-4-4H34a4 4 0 0 0 0 8h18a1 1 0 0 1 1 .998V35h-7a3.001 3.001 0 0 0-2.419 4.775l11 15a3.003 3.003 0 0 0 4.839-.001l11-15a3.001 3.001 0 0 0 .256-3.13zM40.001 48H22a.995.995 0 0 1-.992-.96L21.001 36h7a3.001 3.001 0 0 0 2.419-4.775l-11-15a3.003 3.003 0 0 0-4.839.001l-11 15A3 3 0 0 0 6.001 36h7l.011 16.003a4 4 0 0 0 4 3.997h22.989a4 4 0 0 0 0-8z"></path></g></svg>
                <span class="tag-style">{{formatNum(x.comments_count)}}</span>
            </div>  
            <div class="footer-tag">
                <svg class="" viewBox="0 0 54 72" style="display: inline-block; fill: currentcolor; height: 1.25rem; max-width: 100%; position: relative; user-select: none; vertical-align: text-bottom;"><g><path d="M38.723 12c-7.187 0-11.16 7.306-11.723 8.131C26.437 19.306 22.504 12 15.277 12 8.791 12 3.533 18.163 3.533 24.647 3.533 39.964 21.891 55.907 27 56c5.109-.093 23.467-16.036 23.467-31.353C50.467 18.163 45.209 12 38.723 12z"></path></g></svg>
                <span class="tag-style">{{formatNum(x.attitudes_count)}}</span>
            </div>      
        </div> -->
    </div>
</template>
 
<script>
import * as DateUtils from '../utils/date-utils'
import * as StringUtils from '../utils/string-utils'
export default {
  props: [
    'x'
  ],
  data () {
    return {
    }
  },
  methods: {
    // goDetailContent () {
    //   this.setDetailContent(this.x)
    //   this.$router.push({name: 'detail-content'})
    // },
    formatTime (time) {
      return DateUtils.format(time)
    },
    formatContent (content) {
      return StringUtils.formatContent(content)
    },
    compareImgSize (size) {
      let count = size / 3
      if (count >= 1) {
        return true
      } else {
        return false
      }
    },
    formatThumbImg (img) {
      return 'http://oxlh0cvgo.bkt.clouddn.com/' + img
    },
    formatMidImg (img) {
      return StringUtils.formatImgMiddle(img)
    },
    formatNum (num) {
      return StringUtils.formatNum(num)
    },
    imageZoom (url) {
      this.setImageZoom(this.formatMidImg(url))
      this.$router.push({ name: 'imageZoom' })
    },
    imgClass (size) {
      let clazz = ''
      switch (size) {
        case 1:
          clazz = 'img-li-one'
          break
        case 2:
        case 4:
          clazz = 'img-li-two'
          break
        default:
          clazz = 'img-li-other'
          break
      }
      return clazz
    }
  }
}
</script>
 
<style lang="css">
a {
    color: #007AFF;
}
.content .list-header {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row;
}

.content .list-footer {
    width: 68%;
    margin-top: 7px;
    color: #cdcdcd;
    display: flex;
    flex-flow: row;
}

.content .list-footer .footer-tag {
    width: 100%;
    height: 13px;
    color: inherit;
}

.content .list-footer .footer-tag .tag-style {
    font-size: 12px;
}

.content .avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, .05);
}

.content .user-info {
    margin-left: 10px;
    display: flex;
    flex-flow: column;
    flex: 1;
}

.content .user-time {
    font-size: 10px;
    color: #A4A8AC;
    height: 100%;
    display: table-cell
}

.content .user-info .user-name {
    margin: 0;
    flex: 1;
    font-size: 15px;
}

.content .user-info .user-source {
    margin: 0;
    flex: 1;
    font-size: 10px;
    color: #A4A8AC
}

.content .user-info .user-source a {
    color: #A4A8AC;
}

.content .list-content {
    margin-top: 7px;
}

.content .list-content .content-text {
    font-size: 16px;
    line-height: 10px;
}

.content .list-content .content-at {
    color: #007AFF;
}

.clear-fix::after {
    content: '';
    display: block;
    clear: both;
}

.content .list-content .content-img .content-img-ul {
    margin: 0;
    padding: 0;
    list-style: none;
}

.content-img .content-img-ul .img-li-default {
    float: left;
    height: 0;
    margin-top: 4px;
    margin-right: 4px
}

.content-img .content-img-ul .img-li-one {
    width: 52%;
    padding-bottom: 52%;
}

.content-img .content-img-ul .img-li-two {
    width: 43%;
    padding-bottom: 43%;
}

.content-img .content-img-ul .img-li-other {
    width: 28%;
    padding-bottom: 28%;
}

.content-img .content-img-ul .img-div {
    width: 100%;
    padding-bottom: 100%;
    background-position: center;
    background-repeat: no-repeat;
}

.content .list-content .content-re-content {
    width: 100%;
    margin-top: 7px;
    border: 1px solid rgba(0, 0, 0, .05);
    border-radius: 3px;
    background-color: #f5f5f5;
    padding: .5rem;
}

.content .list-content .content-re-content .re-content-text {
    font-size: 13px;
    line-height: 10px;
}
</style>