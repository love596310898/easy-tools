/** * 作者：Air.叶 * 时间：2018-01-27 * 描述：图片放大功能 */
<style lang="scss">
@import '~photoswipe/dist/photoswipe.css';
@import '~photoswipe/dist/default-skin/default-skin.css';

.pswp {
	z-index: 9999;
}
</style>
<template>
	<!-- Root element of PhotoSwipe. Must have class pswp. -->
	<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
		<!-- Background of PhotoSwipe.
         It's a separate element as animating opacity is faster than rgba(). -->
		<div class="pswp__bg"></div>
		<!-- Slides wrapper with overflow:hidden. -->
		<div class="pswp__scroll-wrap">
			<!-- Container that holds slides.
            PhotoSwipe keeps only 3 of them in the DOM to save memory.
            Don't modify these 3 pswp__item elements, data is added later on. -->
			<div class="pswp__container">
				<div class="pswp__item"></div>
				<div class="pswp__item"></div>
				<div class="pswp__item"></div>
			</div>
			<!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
			<div class="pswp__ui pswp__ui--hidden">
				<div class="pswp__top-bar">
					<!--  Controls are self-explanatory. Order can be changed. -->
					<div class="pswp__counter"></div>
					<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
					<button class="pswp__button pswp__button--share" title="Share"></button>
					<button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
					<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
					<!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
					<!-- element will get class pswp__preloader--active when preloader is running -->
					<div class="pswp__preloader">
						<div class="pswp__preloader__icn">
							<div class="pswp__preloader__cut">
								<div class="pswp__preloader__donut"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
					<div class="pswp__share-tooltip"></div>
				</div>
				<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
				<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
				<div class="pswp__caption">
					<div class="pswp__caption__center"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import PhotoSwipe from 'photoswipe';
import UI from 'photoswipe/dist/photoswipe-ui-default';

const config = {
	captionEl: false,
	fullscreenEl: true,
	history: false,
	shareEl: false,
	tapToClose: false
};
const w = window.innerWidth;

export default {
	data () {
		return {
			isOpen: false
		};
	},
	methods: {
		open (el, ret, params) {
			let clientRect = el.getBoundingClientRect();
			let h = (clientRect.height / clientRect.width) * w;
			let index = 0;
			let list = [];
			for (let i in ret) {
				if (i !== undefined && ret.hasOwnProperty(i)) {
					list.push({
						src: ret[i],
						w,
						h
					});
				}
			}
			let options = Object.assign(
				{
					index: index,
					getThumbBoundsFn () {
						let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
						let rect = clientRect;
						return {
							x: rect.left,
							y: rect.top + pageYScroll,
							w: rect.width
						};
					}
				},
				config,
				params
			);
			this.photoswipe = new PhotoSwipe(this.$el, UI, list, options);
			this.photoswipe.init();
			this.isOpen = true;
		},
		isVisible () {
			return this.isOpen;
		},
		close () {
			this.isOpen = false;
			this.photoswipe && this.photoswipe.close();
		}
	},
	beforeDestroy () {
		this.isOpen = false;
		this.photoswipe.destroy();
		this.photoswipe = null;
	}
};
</script>
