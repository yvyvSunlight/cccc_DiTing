<script setup>
	import { onMounted, ref } from 'vue';
	import TimeCounterVue from '../../components/TimeCounter.vue';
	const promptDisplay = ref(false);
	const recorderManager = uni.getRecorderManager()
	const innerAudioContext = uni.createInnerAudioContext()
	const startRecord = () => {
		recorderManager.start()
	}
	const endRecord = () => {
		recorderManager.stop()
		promptDisplay.value = true
	}
	onMounted(() => {
		startRecord()
	})
	
	const gotoLoadPage = () => {
		uni.navigateTo({
			url: '/pages/load/load',
			animationType: 'slide-in-right', // 设置动画类型为从底部滑入
			animationDuration: 300           // 设置动画时长为300ms
		})
	}

</script>

<template>
	<view class="bg">
		<view class="prompt" v-show="promptDisplay">
			<view class="title">录音成功!</view>
			<a class='link' @click="gotoLoadPage">点击查看详情</a>
		</view>
		<TimeCounterVue class="timeCounter"></TimeCounterVue>
		<view class="outborder">
			<view class="inborder">
				<image src="/static/voiceTube.svg" mode="" class="voiceTube"></image>
			</view>
		</view>
		<image src="/static/bingo.svg" mode="" class="bingo" @tap="endRecord"></image>
		<view class="wave-container">
            <!-- <image src="/static/tempWave.svg" mode="" class="tempWave"></image> -->
             <view id="wave1"></view>
             <view id="wave2"></view>
             <view id="wave3"></view>
        </view>
	</view>
</template>


<style scoped lang="less">
* {
	padding: 0;
	margin: 0;
}

.bg {
    background-color: #E8E4FF;
    display: flex;
    height: 100vh;
    width: 100%;
    justify-content: center;
    align-items: center;
	flex-wrap: wrap;
	.prompt {
		position: absolute;
		width: 520rpx;
		height: 340rpx;
		background: linear-gradient(179.8deg, rgba(181, 136, 240, 0.1) 0.18%, rgba(225, 208, 247, 0.1) 22.57%, rgba(255, 255, 255, 0.1) 47.43%);
		box-shadow: inset 0px 0px 4rpx rgba(181, 136, 240, 0.7), inset 0px 2rpx 2rpx rgba(181, 136, 240, 0.5), inset 0px 0px 30rpx rgba(181, 136, 240, 0.2), inset 0px 30rpx 60rpx rgba(181, 136, 240, 0.2);
		backdrop-filter: blur(30rpx);
		border-radius: 60rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		.title {
			font-size: 52rpx;
		}
	}
	.timeCounter {
		margin-top: 100rpx;
	}
    .outborder {
        height: 275rpx;
        width: 275rpx;
        border-radius: 50%;
        border: 25rpx solid rgba(41, 37, 65, 0.1); /* 设置边框宽度和颜色 */
        background-color: transparent; /* 设置背景为透明 */
        display: flex;
        justify-content: center;
        align-items: center;
        .inborder {
            height: 273rpx; /* 贴合 outborder 的内边界 */
            width: 273rpx;
            border-radius: 50%;
            border: 1rpx solid #9747FF; /* 紫色边框 */
            background-color: transparent; /* 设置背景为透明 */
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: inset 0 0 20rpx #9747FF, inset 0 0 40rpx #A763FF, inset 0 0 60rpx #B47AFF; /* 向内的紫色荧光效果 */
            animation: glow 2s infinite; /* 动态荧光效果 */
            .voiceTube {
                height: 100rpx;
            }
        }
    }
	.bingo {
		width: 106rpx;
		height: 106rpx;
		margin-left: 520rpx;
	}
}


.wave-container {
        position: relative;
        width: 100%;
        height: 600rpx; /* 容器高度适应细线 */
        // margin-top: 20rpx;
        overflow: hidden;
        // .tempWave {
        //     width: 100%;

        // }
        #wave1 {
            width: 200%;
            height: 100%;
            // outline: 2px dashed gray;
            --c: #A865FF52;
            --w1: radial-gradient(100% 58% at top ,#0000 100%,var(--c) 100.5%, #0000 140%) no-repeat;
            --w2: radial-gradient(100% 57% at bottom, #0000 60%, var(--c) 99.5%,#0000 100%) no-repeat;
            background: var(--w1),var(--w2),var(--w1),var(--w2);
            background-position-x: -200%, -100%, 0%, 100%;
            background-position-y: 100%;
            background-size: 50% 100%;
            animation: m 1.2s infinite linear;
        }
        #wave2 {
            position: absolute;
            top: 0;
            width: 160%; /* 调整宽度，波浪更紧凑 */
            height: 100%;
            --c: #9747FF30; /* 使用不同的颜色 */
            --w1: radial-gradient(80% 64% at top, #0000 100%,  var(--c) 100.5%, #0000 110%) no-repeat;
            --w2: radial-gradient(80% 64% at bottom, #0000 90%, var(--c) 99.5%, #0000 100%) no-repeat;
            background: var(--w1), var(--w2), var(--w1), var(--w2);
            background-position-x: -160%, -80%, 0%, 80%;
            background-position-y: 100%;
            background-size: 44.45% 100%; /* 调整背景大小，波浪更密集 */
            animation: m2 0.5s infinite linear; /* 调整动画速度 */
        }

        // #wave3 {
        //     position: absolute;
        //     top: 0;
        //     width: 160%; /* 超宽，波浪更密集 */
        //     height: 100%;
        //     --c: #D4B4FE30; /* 使用鲜艳的颜色（橙色，透明度 32%） */
        //     --w1: radial-gradient(100% 58% at top, #0000 100%, var(--c) 100.5%, #0000 120%) no-repeat;
        //     --w2: radial-gradient(100% 57% at bottom, #0000 80%, var(--c) 99.5%, #0000 100%) no-repeat;
        //     background: var(--w1), var(--w2), var(--w1), var(--w2), var(--w1), var(--w2), var(--w1), var(--w2);
        //     background-position-x: -60%, -40%, -20%, 0%, 20%, 40%, 60%, 80%;
        //     background-position-y: 100%;
        //     background-size: 16.7% 100%; /* 超密集背景 */
        //     animation: m3 0.5s infinite linear; /* 超快动画速度 */
        // }
        #wave3 {
            width: 200%;
            height: 100%;
            // outline: 2px dashed gray;
            position: absolute;
            top: 0;
            --c: #D4B4FEA0;
            --w1: radial-gradient(100% 58% at top ,#0000 100%,var(--c) 100.5%, #0000 130%) no-repeat;
            --w2: radial-gradient(100% 57% at bottom, #0000 70%, var(--c) 99.5%,#0000 100%) no-repeat;
            background: var(--w1),var(--w2),var(--w1),var(--w2);
            background-position-x: -150%, -50%, 50%, 150%;
            background-position-y: 100%;
            background-size: 50% 100%;
            animation: m3 0.9s infinite linear;
        }
    }



/* 动态荧光效果 */
@keyframes glow {
    0% {
        box-shadow: inset 0 0 20rpx #9747FF, inset 0 0 40rpx #A763FF, inset 0 0 60rpx #B47AFF;
    }
    50% {
        box-shadow: inset 0 0 30rpx #B47AFF, inset 0 0 50rpx #C490FF, inset 0 0 70rpx #C490FF88;
    }
    100% {
        box-shadow: inset 0 0 20rpx #9747FF, inset 0 0 40rpx #A763FF, inset 0 0 60rpx #B47AFF;
    }

}

@keyframes m {
  0%  {background-position-x:-200%, -100%, 0%, 100%}
  100%{background-position-x:  0%, 100%, 200%, 300%}
}

@keyframes m2 {
  0%  {background-position-x:-160%, -80%, 0%, 80%}
  100%{background-position-x:  0%, 80%, 160%, 240%}
}
// @keyframes m3 {
//   0%  {background-position-x: -60%, -40%, -20%, 0%, 20%, 40%, 60%, 80%;}
//   100%{background-position-x: -20%, 0%, 20%, 40%, 60%, 80%, 100%, 120%;}
// }

@keyframes m3 {
  0%  {background-position-x:-200%, -100%, 0%, 100%}
  100%{background-position-x:  0%, 100%, 200%, 300%}
}

</style>
