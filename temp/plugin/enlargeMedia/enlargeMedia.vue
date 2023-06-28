/** * 作者：Air.叶 * 时间：2020-03-05 * 描述：媒体放大 */
<style lang="scss" scoped>
.media-panel {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 9999;
	overflow: auto;
	outline: 0;
	.media-mask {
		position: absolute;
		-ms-touch-action: none;
		touch-action: none;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		transform: translateZ(0);
		backface-visibility: hidden;
		will-change: opacity;
	}
	.media-modal {
		width: 520px;
		height: 200px;
		top: 30%;
		left: 50%;
		position: absolute;
		background-color: #fff;
		background-clip: padding-box;
		border: 0;
		border-radius: 2px;
		box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
			0 9px 28px 8px rgba(0, 0, 0, 0.05);
		pointer-events: auto;
		transform: translate(-50%, -50%);
		.media-modal__header {
		}
		.media-modal__body {
		}
	}
	.el-zoom-enter {
		opacity: 0;
		animation-duration: 0.3s;
		animation-fill-mode: both;
		animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
		animation-play-state: paused;
	}
	.el-zoom-leave {
		animation-duration: 0.3s;
		animation-fill-mode: both;
		animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);
		animation-play-state: paused;
	}

	.el-zoom-enter.el-zoom-enter-active {
		animation-name: rcDialogZoomIn;
		animation-play-state: running;
	}

	.el-zoom-leave.el-zoom-leave-active {
		animation-name: rcDialogZoomOut;
		animation-play-state: running;
	}

	@keyframes rcDialogZoomIn {
		0% {
			opacity: 0;
			transform: scale(0, 0);
		}
		100% {
			opacity: 1;
			transform: scale(1, 1);
		}
	}
	@keyframes rcDialogZoomOut {
		0% {
			transform: scale(1, 1);
		}
		100% {
			opacity: 0;
			transform: scale(0, 0);
		}
	}
}
</style>
<template>
	<transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
		<div tabindex="-1" v-show="isOpen" class="media-panel" role="dialog">
			<div class="media-mask" @click="close"></div>
			<div role="document" class="media-modal">
				<div class="media-modal__header">
					<button title="Close (Esc)" @click="close" class="media__button media__button--close">
						<i class="el-icon-circle-close"></i>
					</button>
				</div>
				<div class="media-modal__body">
					32132
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
// 设置中心点
function setTransformOrigin (node, value) {
	const style = node.style;
	['Webkit', 'Moz', 'Ms', 'ms'].forEach(prefix => {
		style[`${prefix}TransformOrigin`] = value;
	});
	style['transformOrigin'] = value;
}
console.log(setTransformOrigin);

export default {
	data () {
		return {
			isOpen: false
		};
	},
	methods: {
		open (el, ret, params) {
			let clientRect = el.getBoundingClientRect();
			let pageXScroll = window.pageXOffset || document.documentElement.scrollLeft;
			let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
			this.rect = {
				x: clientRect.left + pageXScroll,
				y: clientRect.top + pageYScroll,
				w: clientRect.width
			};
			this.isOpen = true;
		},
		beforeEnter (el) {
			el.style.opacity = 0;
			el.style.transformOrigin = 'left';
			el.style.width = this.rect.width + 'px';
		},
		enter (el, done) {
			const rect = el.getBoundingClientRect();
			el.style.opacity = 1;
			el.style.transition = 'all 0.3s';
			el.style.width = rect.width + 'px';
			// el.style.transformOrigin = this.rect.x + rect.width / 2 + ' ' + this.rect.y + rect.height / 2;
			done();
		},
		leave (el, done) {
			done();
		},
		isVisible () {
			return this.isOpen;
		},
		close () {
			this.isOpen = false;
		}
	},
	beforeDestroy () {
		this.isOpen = false;
	}
};
</script>
