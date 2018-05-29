<template>
  <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
          <slot></slot>
      </div>
      <div class="dots">
          <span class="dot" v-for="(item, index) in dots" :class="{active: currentPageIndex === index}" :key="index"></span>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {addClass} from 'common/js/dom.js'
import BScroll from 'better-scroll'
export default {
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 2000
    },
    showDot: {
      type: Boolean,
      default: true
    },
    click: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 0.3
    },
    speed: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted() {
    this.update()

    window.addEventListener('resize', () => {
      if (!this.slider || !this.slider.enabled) {
        return false
      }
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        if (this.slider.isInTransition) {
          this._onScrollEnd()
        } else {
          if (this.autoPlay) {
            this._play()
          }
        }
        this.refresh()
      }, 60)
    })
  },
  /**
   * keep-alive 组件激活时调用 此声明周期钩子
   */
  activated() {
    if (!this.slider) {
      return false
    }
    this.slider.enabled()
    let pageIndex = this.slider.getCurrentPage().pageX
    this.slider.goToPage(pageIndex, 0, 0)
    this.currentPageIndex = pageIndex
    if (this.autoPlay) {
      this._play()
    }
  },
  /**
   * keep-alive 组件停用时调用 此声明周期钩子
   */
  deactivated() {
    this.slider.disabled()
    clearTimeout(this.timer)
  },
  /**
   * 声明周期钩子 beforeDestory
   */
  beforeDestroy() {
    this.slide.disable()
    clearTimeout(this.timer)
  },
  methods: {
    /**
     * 当 slider 方式修改，变化时
     */
    update() {
      if (this.slider) {
        this.slider.destroy()
      }
      this.$nextTick(() => {
        this.init()
      })
    },
    /**
     * slider 初始化 方法
     */
    init() {
      clearTimeout(this.timer)
      this.currentPageIndex = 0
      this._setSliderWidth()
      if (this.showDot) {
        this._initDots()
      }
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    },
    refresh() {
      this._setSliderWidth(true)
      this.slider.refresh()
    },
    prev() {
      this.slider.prev()
    },
    next() {
      this.slider.next()
    },
    /**
     * 设置 slider的 width, 和 sliderGroup的 width
     */
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children

      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')

        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }

      if (this.loop && !isResize) {
        width += sliderWidth * 2
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    /**
     * 初始化 轮播图的 dots
     */
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    /**
     * 初始化 slider的 配置
     */
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: this.threshold,
          speed: this.speed
        },
        bounce: false,
        stopPropagation: true,
        click: this.click
      })

      this.slider.on('scrollEnd', this._onScrollEnd)

      this.slider.on('touchEnd', () => (
        this.autoPlay ? this._play() : ''
      ))

      this.slider.on('beforeScrollStart', () => (
        this.autoPlay ? clearTimeout(this.timer) : ''
      ))
    },
    /**
     * 播放功能
     */
    _play() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    },
    /**
     * 自定义事件 scrollEnd事件后，触发 _onScrollEnd事件
     */
    _onScrollEnd() {
      let pageIndex = this.slider.getCurrentPage().pageX
      this.currentPageIndex = pageIndex
      if (this.autoPlay) {
        this._play()
      }
    }
  },
  /**
   * watch
   */
  watch: {
    loop() {
      this.update()
    },
    autoPlay() {
      this.update()
    },
    speed() {
      this.update()
    },
    threshold() {
      this.update()
    }
  }

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>