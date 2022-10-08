<template>
  <div
    class="sniff-crx-bubble"
    :class="{ ofhd: !!user }"
    :style="collapse ? mini : expand"
    v-drag="{ can: () => collapse && user, onDrag }"
  >
    <template v-if="user">
      <transition
        enter-active-class="animated fastest fadeIn"
        leave-active-class="animated fastest fadeOut"
      >
        <div
          class="collapse flex-center"
          v-if="collapse"
          key="collapse"
          @click="drag || (collapse = false)"
        >
          <img
            style="height: 40px; pointer-events: none; user-select: none"
            :src="dfhead"
            alt=""
          />
        </div>
        <div class="expand" v-else key="expand">
          <div class="flex-bwn">
            <img class="bar1" src="@/assets/bar1.png" alt="" />
            <div class="flex-center user-icon-yt">
              <!-- <el-tooltip :content="user.loginName" placement="left" :open-delay="500">
                <img class="head" :src="dfhead" alt="" />
              </el-tooltip> -->
              <img
                @click="collapse = true"
                class="collapse-arrow"
                src="@/assets/expand.png"
                alt=""
              />
              <!-- <el-button size="mini" @click="collapse = true">
            </el-button> -->
              <!-- <span>{{ user.loginName }}</span> -->
            </div>
          </div>
          <div class="flex-center search-box">
            <input
              v-model="word"
              @keyup.enter="handleEnter"
              :placeholder="$t('搜索商品名或店舗名')"
            />
            <img @click="link" class="icon" src="@/assets/search.png" />
          </div>
        </div>
      </transition>
    </template>
    <template v-else>
      <a
        :href="host"
        target="sniff"
        class="collapse flex-center"
        @mouseenter="tipshow = true"
        @mouseleave="tipshow = false"
      >
        <img
          style="
            height: 40px;
            pointer-events: none;
            user-select: none;
            filter: sepia(1);
          "
          :src="dfhead"
          alt=""
        />
      </a>
      <div
        v-show="tipshow"
        class="tip-text"
        v-html="$t('请先登录系统').split('\n').join('<br/>')"
      ></div>
    </template>
  </div>
</template>

<script>
import gbk from '@/plugins/gbk.min.js'
import dragDrective from '@/directives/drag'

let isEnter = false
export default {
  directives: {
    drag: dragDrective
  },
  data () {
    return {
      platType: this._platType,
      host: process.env.VUE_APP_HOST,
      word: '',
      dfhead: require('@/assets/logo-m.png'),
      collapse: true,
      drag: false,
      expand: {
        height: '88px',
        width: '360px',
        borderRadius: '4px',
        transition: 'all .2s ease-in .05s , border-radius .15s ease-in'
      },
      mini: {
        height: '50px',
        width: '50px',
        borderRadius: '50%',
        transition: 'all .2s ease-in , border-radius .15s ease-in .1s',
        animation: 'bounce_a_bit 10s ease-in-out 10s infinite alternate'
      },
      searchUrl: {
        TB: 'https://s.taobao.com/search?q=',
        AM: 'https://s.1688.com/selloffer/offer_search.htm?keywords=',
        TM: 'https://list.tmall.com/search_product.htm?q='
      },
      tipshow: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  watch: {
    user (v) {
      if (!v) {
        this.collapse = true
      }
    }
  },
  methods: {
    onDrag (val) {
      this.drag = val
    },
    handleEnter () {
      isEnter = !isEnter
      if (isEnter) {
        setTimeout(() => {
          isEnter && this.link()
          isEnter = false
        }, 400)
      }
    },
    link () {
      const w = this.word.replace(/\s/g, '+')
      chrome.runtime.sendMessage(
        {
          cmd: 'translate',
          data: {
            customerId: this.user?.customerId,
            keyword: w,
            platformType: this._platType
          }
        },
        (res) => {
          console.log(res)
          if (res.code === '0') {
            window.open(
              this.searchUrl[this.plat] + gbk.URI.encodeURI(res.data)
            )
          } else {
            window.open(this.searchUrl[this.plat] + gbk.URI.encodeURI(w))
          }
        }
      )
    }
  }
}
</script>
<style lang="scss">
@keyframes bounce_a_bit {
  0% {
    transform: translateY(-3px);
  }

  2% {
    transform: translateY(0px);
  }

  4% {
    transform: translateY(-3px);
  }

  6% {
    transform: translateY(0px);
  }
}
</style>
<style scoped lang="scss">

.tip-text {
  position: absolute;
  right: 56px;
  width: 255px;
  background: #fff;
  box-shadow: 0 0 2px 1px rgb(0 0 0 / 15%);
  padding: 6px 12px;
  line-height: 22px;
  border-radius: 5px;
  top: -1px;
}

.sniff-crx-bubble {
  position: fixed;
  z-index: 200000000;
  right: 5%;
  top: 20px;
  background: #ffbb00;
  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.2);
  padding: 10px 15px 10px 15px;

  &.ofhd {
    overflow: hidden;
  }

  > div {
    position: absolute;
  }

  .expand {
    width: calc(100% - 30px);
  }
}

.collapse {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  user-select: none;
}

.user-icon-yt {
  color: #333;
  font-weight: 600;
  font-size: 10px;

  .head {
    height: 22px;
    width: 22px;
    border-radius: 50%;
    margin-right: 15px;

    & + span {
      position: relative;
      top: 2px;
    }
  }
}

.bar1 {
  height: 20px;
}

.search-box {
  margin-top: 9px;
  background: transparent;
  position: relative;

  input {
    font-size: 11px;
    box-shadow: 0 0 4px 1px rgb(0 0 0 / 5%), 0 1px 2px rgb(0 0 0 / 10%);
    border: 1px solid #ffbb00;
    border-radius: 40px;
    height: 32px;
    width: 100%;
    padding: 0 14px;
    padding-bottom: 1px;
    outline: none;
  }

  .icon {
    position: absolute;
    width: 13px;
    height: 13px;
    top: 9px;
    right: 15px;
    cursor: pointer;
  }
}

.collapse-arrow {
  height: 14px;
  position: absolute;
  right: -12px;
  top: -7px;
  cursor: pointer;
}

</style>
