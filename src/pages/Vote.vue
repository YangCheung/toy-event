<template lang="html">
  <div v-if="!showLoging">
    <div>
      <div v-if="posts.length > 0">
      <div class="m-main">
        <div class="m-title">邀请投票</div>
      </div>
      <post-card :showStar="true" v-on:on-start="changeStar" :posts="posts"></post-card>
      <box v-if="showSubmit" gap="40px 15px">
          <x-button :disabled="!canSubmit" type="primary" @click.native="submit" action-type="button">提交评分</x-button>
      </box>   
    </div>  
    <div v-else>
      <div class="expired_main">
        <div class="m-title">投票已过期</div>
      </div>
      <box gap="40px 15px">
          <x-button type="default" @click.native="gohome" action-type="button">回到首页</x-button>
      </box>   
    </div>
    </div>
    
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
import { Toast, Loading, Box, XButton } from 'vux'
import { getVote, submitVote } from '../api/api'
import PostCard from '@/components/PostCards'
import { hasDuplicates } from '../utils/util'

export default {
  name: 'vote',
  components: {
    PostCard, Toast, Loading, Box, XButton
  },
  data () {
    return {
      imageList: [{}],
      vote: null,
      date: '',
      showLoging: false,
      showErrorToast: false,
      toastMsg: '',
      stars: [],
      canSubmit: false,
      showSubmit: true
    }
  },
  computed: {
    posts () {
      return this.vote == null ? [] : this.vote.posts
    }
  },
  created () {
    this.showLoging = true
    let self = this
    let eventId = this.$route.params.id
    console.log(this.$route)
    getVote(eventId, result => {
      self.vote = result
      this.showLoging = false
    },
    (error) => {
      self.showLoging = false
      this.showLoging = false

      if (error) {

      }
    })
  },
  methods: {
    checkStatus () {
      if (this.vote && this.vote.posts && this.stars.length === this.vote.posts.length) {
        for (let i = 0; i < this.stars.length; i++) {
          if (!this.stars[i] || this.stars[i] === 0) {
            return false
          }
        }
        return true
      }
      return false
    },
    changeStar (starsArray) {
      this.stars = starsArray
      this.canSubmit = this.checkStatus()
    },
    showToast: function (msg) {
      this.toastMsg = msg
      this.showErrorToast = true
    },
    gohome () {
      this.$router.replace({name: 'home'})
    },
    submit () {
      if (this.checkStatus) {
        if (hasDuplicates(this.stars)) {
          this.showToast('每个作品打分值不能相同')
          return
        }
        for (let i = 0; i < this.stars.length; i++) {
          (this.vote.posts[i])['score'] = this.stars[i]
        }
        submitVote(this.vote, result => {
          this.showToast('提交成功')
          this.showSubmit = false
        }, (error) => {
          this.showToast(error.message)
        })
      }
    }
  }
}
</script>
 
<style lang="less" scoped>
.no-scroll {
  overflow: hidden
}
.m-title {
  font-size: 25px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}
.m-main {
  margin-bottom: 10px;
  background-color: cadetblue;
  text-align: center;
  color: #fafafa;
  position: relative;
  width: 100%;
  text-align: center;
  height: 100px;
  .expired_main {
    background-color: gray;
  }
}

.expired_main {
  margin-bottom: 10px;
  background-color: cadetblue;
  text-align: center;
  color: #fafafa;
  position: relative;
  width: 100%;
  text-align: center;
  height: 300px;
  background-color: gray;
}

</style>