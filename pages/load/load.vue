<script setup>
import {ref, onMounted} from 'vue'
const title = ref('Title')
const description = ref('description')

// 定义响应式变量
const chartData = ref({});
const opts = ref({
  rotate: false,
  rotateLock: false,
  color: ["#007AFF","#5856D6","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
  padding: [5,5,5,5],
  dataLabel: false,
  enableScroll: false,
  legend: {
    show: false,
    position: "right",
    lineHeight: 25
  },
  title: {
    name: "98",
    fontSize: 25,
    color: "#666666"
  },
  subtitle: {
    name: "",
    fontSize: 25,
    color: "#7cb5ec"
  },
  extra: {
    ring: {
      ringWidth: 20,
      activeOpacity: 0.5,
      activeRadius: 10,
      offsetAngle: 0,
      labelWidth: 15,
      border: true,
      borderWidth: 3,
      borderColor: "#FFFFFF"
    }
  }
});

// 模拟从服务器获取数据
const getServerData = () => {
  // 模拟从服务器获取数据时的延时
  setTimeout(() => {
    // 模拟服务器返回数据
    const res = {
      series: [
        {
          data: [
            { name: "一班", value: 98, labelShow: false },
            { name: "二班", value: 2, labelShow: false },
          ]
        }
      ]
    };
    chartData.value = JSON.parse(JSON.stringify(res));
  }, 500);
};

// 在组件挂载后调用
onMounted(() => {
  getServerData();
});

</script>

<template>
	<view class="bg">
		<view class="up">
			<view class="card">
				<view class="textArea">
					<view class="title">{{title}}</view>
					<view class="description">{{description}}</view>
				</view>
				<le-audio
				    :activeIndex="audioActiveIndex" 
				    :audioData="audioList" 
				    :autoplay="true"
				    :loopPlay="true"
				    :showAudioListIcon="false" 
				    :showAudioSpeedIcon="true"
				    @onOpenAudioList="onOpenAudioList"
				    @onAudioChange="onAudioChange"
				    @onAudioEnd="onAudioEnd"
				    @onPlayProgress="onPlayProgress"
				></le-audio>
			</view>
		</view>
		<view class="main">
			<view class="chartBox">
				<qiun-data-charts 
					  type="ring"
					  :opts="opts"
					  :chartData="chartData"
					/>				
			</view>
			<view class="result">
				<view class="resultText">
					经分析，该音频为虚假音频
				</view>
				<a href="" class="resultDetail">
					点击查看鉴别依据
				</a>
			</view>
			<view class="todo"></view>
			<button class="uploadBtn">
				<image src="/static/addBtn.svg" mode="" class="addImg"></image>
			</button>
		</view>
	</view>
</template>


<style scoped lang="less">
	* {
		margin: 0;
		padding: 0;
	}
	.bg{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		.up {
			background-color: #BDA4FD;
			width: 100%;
			height: 540rpx;			
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 450rpx;
			border-radius: 0px 0px 40px 40px;
			.card {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				padding: 15px;
				width: 600rpx;
				height: 260rpx;
				background: rgba(249, 249, 249, 0.78);
				border-radius: 24px;
				.textArea{
					width: 90%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					height: 44rpx;
					margin: 10rpx  auto;
					.title {
						width: 100%;
						height: 22rpx;
						font-family: 'SF Pro Text';
						font-style: normal;
						font-weight: 600;
						font-size: 30rpx;
						line-height: 22rpx;
						text-align: center;
						letter-spacing: -0.408rpx;
						color: rgba(0, 0, 0, 0.96);
						flex: none;
						order: 0;
						align-self: stretch;
						flex-grow: 0;
						margin: -1rpx 0rpx;
					}
					.description{
						width: 100%;
						height: 22rpx;
						font-family: 'SF Pro Text';
						font-style: normal;
						font-weight: 400;
						font-size: 17rpx;
						line-height: 22rpx;
						text-align: center;
						letter-spacing: -0.408rpx;
						font-feature-settings: 'case' on;
						color: rgba(0, 0, 0, 0.3);
						flex: none;
						order: 1;
						align-self: stretch;
						flex-grow: 0;
					}
				}
			}
		}
		.main {
			position: relative;
			width: 90%;
			margin: 0 auto;
			margin-top: 50rpx;
			height: 920rpx;
			background: #EBE4FF;
			border-radius: 24px;
			display: flex;
			flex-wrap: wrap;
			.chartBox{
				width: 250rpx;
				height: 250rpx;
				
			}
			.result {
				height: 250rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.resultText {
					width: 360rpx;
					height: auto;
					font-family: 'Microsoft Himalaya';
					font-style: normal;
					font-weight: 400;
					font-size: 36rpx;
					// line-height: 40rpx;
					color: #261E58;
				}
				.resultDetail{
					width: 96px;
					height: 15px;
					font-family: 'Source Serif Pro';
					font-style: normal;
					font-weight: 400;
					font-size: 12px;
					line-height: 15px;
					display: flex;
					align-items: center;
					text-align: center;
					color: #000000;
				}
			}
			.todo {
				width: 640rpx;
				height: 480rpx;
				margin: 0 auto;
				background-color: aliceblue;
			}
			.uploadBtn{
				width: 105rpx;
				height: 105rpx;
				border-radius: 60rpx;
				background-color: #6D57FC00;
				position: absolute;
				bottom: -52.5rpx;
				left: 50%;
				transform: translateX(-50%);
				.addImg {
					width: 100%;
					height: 100%;
				}
			}
		}
		
	}
</style>
