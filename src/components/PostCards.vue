<template lang="html">  
  <div>    
    <div class="content-tip no-text-select" v-if="posts.length == 0">
      <span>{{emptyTip}}</span>
    </div>  
    <div class="card" v-for="(item,index) in posts" v-else>
      <div class="card-main">
         <header class="card-header">           
            <div class="user-info">
              <span v-if="item.user_qq_group" class="user-name txt-l txt-cut">{{item.user_name}}</span>
              <div v-if="item.user_qq_group" class="publish-data">
                <span>{{'QQ ' + item.user_qq}}</span>
                <span class="publish-source">{{'来自群: ' + item.user_qq_group}}</span>
              </div>
              <div v-if="item.user_qq_group && item.score != undefined" class="score">
                <span >{{'得分: ' + item.score}}</span>
              </div>

              <div v-else class="publish-data txt-xs">
                <span class="publish-created-at">{{formatDate(item.post_on)}}</span>
              </div>
            </div>            
          </header>
        <section class="card-body">
          <p class="default-content" v-html="item.text"></p>
          <div v-if="item.assets.length === 1" :class="{singlePic:!isVideo(item), singleVideo: isVideo(item)}" v-lazy-container="{selector:'img'}">
            <img v-if="!isVideo(item)" @click="show(item.assets, 0)" :data-src="getImageUrl(item.assets[0], true)">
            <video v-else  :poster="getVideoThumb(item.assets[0])" :src="item.assets[0].url" controls="true"/>
          </div>
          <ul v-if="item.assets.length >= 2" class="pic-list">
            <li v-for="(asset,a_index) in item.assets" @click="show(item.assets, a_index)">
              <div><img :src="getImageUrl(asset)"></div>
            </li>
          </ul>            
        </section>
        <footer v-if="showStar" class="card-footer">   
          <span>选择评分</span>
          <div class="stars">
            <rater v-model="stars[index]" :font-size="35" ></rater>
          </div>                  
        </footer>
      </div>        
    </div>
    <div v-transfer-dom>
      <previewer :list="imageList" ref="previewer"></previewer>
    </div>       
  </div>
</template>
 
<script>
import { Rater, Previewer, TransferDom } from 'vux'
import { requestFullScreen } from '../utils/util'
import { format } from '../utils/date-utils'

export default {
  name: 'post_cards',
  props: {
    showStar: {
      type: Boolean,
      default: false
    },
    emptyTip: {
      type: String,
      default: '这会儿还没有新动态，等会再来刷刷看吧(｡･ω･｡)！'
    },
    posts: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      imageList: [{}],
      stars: []
    }
  },
  directives: {
    TransferDom
  },
  components: {
    Rater, Previewer, TransferDom
  },
  watch: {
    stars () {
      this.$emit('on-start', this.stars)
    }
  },
  methods: {
    formatDate (date) {
      return format(date)
    },
    videoExitFullScreen () {
      // if (!document.webkitIsFullScreen) {
      //   this.closeVideo()
      // };
    },
    videoEnterFullScreen () {
      requestFullScreen()
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
      return asset.url + '?vframe/jpg/offset/1'
    },
    show (list, index) {
      this.imageList = list.map((item) => {
        item.src = item.url + '?imageView2/4/w/' + 1920 + '/h/' + 1080 + '/interlace/1'
        return item
      })
      this.$nextTick(() => { this.$refs.previewer.show(index) })
    },
    isVideo (item) {
      return item.assets[0].asset_type.startsWith('video')
    }
  }
}
</script>
 
<style lang="less" scoped>
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
  padding: 5px;
  border: 1px solid #f0f0f0; 
  position: relative;
  text-align: center;
  font-size: 18px;
  color: gray;
  .stars{
    margin-top: 2px
  }
}
  
.user-info{
  max-width: 16rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  padding: .6875rem .6875rem 0;
  line-height: 1rem;
  .score {
    position: absolute;
    right: 8px;
    top: 8px;
    color:gray;
    font-size: 25px;
  }
  .user-name {
    color: #333;
    margin-bottom: 3px;
  }    
  .publish-data {
    color: #929292;
    font-size: 10px;
    .publish-source {
      padding-left: 10px;
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

</style>