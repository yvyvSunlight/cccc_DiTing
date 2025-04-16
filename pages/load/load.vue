<script setup>
import {ref, onMounted} from 'vue'
const title = ref('Title')
const description = ref('description')
const lemonjkFileSelect = uni.requireNativePlugin('lemonjk-FileSelect');

let score = 37.3

// 定义响应式变量
const chartData = ref({});
const opts = ref({
  rotate: false,
  rotateLock: false,
  color: ["#5856D6","#007AFF30","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
  padding: [5,5,5,5],
  dataLabel: false,
  enableScroll: false,
  legend: {
    show: false,
    position: "right",
    lineHeight: 25
  },
  title: {
    name: `${score}`,
    fontSize: 25,
	// fontWeight:700,
    color: "#261E58"
  },
  subtitle: {
    name: "",
    fontSize: 25,
    color: "#7cb5ec"
  },
  extra: {
    ring: {
      ringWidth: 24,
      activeOpacity: 0.5,
      activeRadius: 10,
      offsetAngle: 0,
      labelWidth: 15,
      border: false,
      borderWidth: 1,
      borderColor: "#FFFFFF"
    }
  }
});

const gotoLoadPage = () => {
			//4.0.0+ 安卓自定义文件选择器使用及高级筛选器配置示例
		lemonjkFileSelect.showNativePicker({
			mimeType: "*/*",
			// utisType:["public.data"],
			pathScope: "/Download",
			navTitle:"文件选择",
			navTextColor:'#55ff00',
			navBarBgColor:'#00aaff',  
			theme:'light',  //auto 跟随系统  light 亮色  dark 暗色 
			showHideFile:"yes",   //是否显示隐藏的文件和文件夹      
			filterConfig:{  //对象里配置的属性要同时满足   
				// fileName:['base.apk','config.txt','配置文件.yaml'],  //属性数组满足其中一项
				fileSize:String(1*1024*1024),  // 单位：byte(字节)  //属性数组满足其中一项
				fileExtension:['apk','txt','jpg','mp3','yaml'],  //属性数组满足其中一项 
			}
		}, result => {
			console.log(result);
			if (!result.code) {
				uni.showToast({
					title:result.detail,
					icon:'success',
					duration:900
				})
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/load/load',
						animationType: 'slide-in-right', // 设置动画类型为从右部滑入
						animationDuration: 300 // 设置动画时长为300ms
					});
				}, 1000);
			} else {
				uni.showToast({
					title:result.detail,
					icon:'error',
					duration:900
				})
			}
			
		})
		
	}


// 模拟从服务器获取数据
const getServerData = () => {
  // 模拟从服务器获取数据时的延时
  setTimeout(() => {
    // 模拟服务器返回数据
    const res = {
      series: [
        {
          data: [
            { name: "一班", value: score, labelShow: false },
            { name: "二班", value: 100 - score, labelShow: false },
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
					经分析，该音频为
					<text class="resultBrief">
					伪造音频
					</text>
						
				</view>
				<a href="" class="resultDetail">
					点击查看鉴别依据
				</a>
			</view>
			<view class="todo">
				<view class="title">音频波形图</view>
				<image src="/static/mfcc.png" mode="" class="mfcc"></image>
				<view class="title">MFCC特征图</view>
				<image src="/static/freq.png" mode="" class="freq"></image>
				
			</view>
			<button class="uploadBtn" @tap="gotoLoadPage">
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
					.resultBrief {
						color:red;
					}
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
				height: 540rpx;
				margin: 0 auto;
				margin-bottom: 10rpx;
				background-color: white;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.mfcc{
					height: 200rpx;
				}
				.freq{
					height: 200rpx;
				}
				.resultImg {
					// height: 100%;
					// width: 100%;
				}
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
