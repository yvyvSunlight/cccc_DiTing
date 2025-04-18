<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'
import { useAudioStore } from '../../store/audio';
import LeAudio from '../../uni_modules/le-audio/components/le-audio/le-audio.vue';
const title = ref('Title')
const description = ref('description')
const lemonjkFileSelect = uni.requireNativePlugin('lemonjk-FileSelect');
const isReal = ref(true)
const resultContent = ref('伪造音频')
const audioStore = useAudioStore()
const score = ref(37)
const isShowDetail = ref(false)
const showCursor = ref(true)
const mfccUrl = ref('/static/mfcc.png')
const waveUrl = ref('/static/freq.png')
score.value = 37;



const text = ref('Hello, 这是 Vue3 实现的打字机效果！');
const displayText = ref('');
const index = ref(0);
const interval = ref(50); // 字符间隔时间（毫秒）
let timer = null;

mfccUrl.value = audioStore.waveImgPath;
waveUrl.value = audioStore.mfccImgPath;
score.value = audioStore.score;
resultContent.value = audioStore.result;


console.log("qqqqqqqqqqqqqqqqqqqqqq")
console.log("mfccUrl", mfccUrl.value)
console.log("qqqqqqqqqqqqqqqqqqqqqq")

// 启动打字机
const startTypewriter = () => {
  timer = setInterval(() => {
    if (index.value < text.value.length) {
      displayText.value += text.value.charAt(index.value);
      index.value++;
    } else {
      clearInterval(timer);
	  showCursor.value = false; // 隐藏光标
    }
  }, interval.value);
};


const audioActiveIndex = ref(0);
const audioList = ref([
	{
		title: '音频1',
		fileUrl: '/testSet/audio.wav',
	}
]);

audioList.value = [
	{
		title: audioStore.audioTitle,
		fileUrl: audioStore.audioPath,
	}
]
console.log("**************************")
console.log(audioList.value[0].fileUrl)
console.log("**************************")

const onOpenAudioList = () => {
	console.log('打开音频列表');
};

const onAudioChange = (index) => {
	audioActiveIndex.value = index;
	console.log('音频切换', index);
};

const onAudioEnd = () => {
	console.log('音频播放结束');
};

const onPlayProgress = (progress) => {
	console.log('音频播放进度', progress);
};


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
    name: `${score.value}`,
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
            { name: "真实", value: score.value, labelShow: false },
            { name: "伪造", value: 100 - score.value, labelShow: false },
          ]
        }
      ]
    };
    chartData.value = JSON.parse(JSON.stringify(res));
  }, 500);
};

const showDetail = () => {
	isShowDetail.value = true;
	startTypewriter();
}
const goBack = () => {
	isShowDetail.value = false;
}

// 在组件挂载后调用
onMounted(() => {
  isShowDetail.value = false;
  if (audioStore.result === '伪造音频') {
		isReal.value = false;
	} else {
		isReal.value = true;
	} 
  getServerData();
  score.value = audioStore.score;
  if ( isReal.value ) {
		text.value = `系统判定该音频为真实语音样本，得分为${score.value}，置信度较高，表明其在多个声学维度上均展现出天然语音的特征稳定性与感知一致性。\n
以下为主要支持理由：\n
✅ 1. MFCC 特征分布平滑且结构合理：从主倒谱系数到高阶导数（Δ 与 ΔΔ）维度，能量沿时间轴呈现自然过渡，共振峰位置随语义节奏轻微抖动，未出现频带断裂、结构跳变等伪造常见异常，表明声道建模自然可信。\n
🔉 2. 频谱纹理丰富，细节连续：在梅尔频谱图中可见较完整的低频至中高频能量扩散区，未观察到典型伪音中的频谱平直化或伪调型特征，表明该样本为真实声源直接采集。\n
🧠 3. 语速、韵律与说话人特征一致：帧级动态特征（MFCC-Δ）显示语速分布自然、节奏略带语义驱动的抖动波动，推测为成年女性自然语流，且未观测到因合成模型引入的音节粘连或节拍机械重复。\n
🎯 未检测到可疑合成模型特征模式：系统未匹配到训练集中与该样本特征相似的已知伪造模型（如 WORLD、MelGAN、WaveNet）输出模式，未触发伪音归因机制，说明其来源不具合成器指纹。
`
  } else {
	if(audioStore.counter === 1) {
		text.value = `该音频经系统识别模型判定为伪造语音样本，得分为${score.value}，处于伪音高可信区间，表明该音频在多个声学维度存在显著异常结构，具备典型的合成音频特征。\n
以下为核心分析要点：\n
🔍 1. MFCC频谱能量异常堆积\n
在MFCC特征图中，尤其是第2–7倒谱系数区域，可观察到低频能量分布异常集中（蓝色区块明显加深），且整体频谱在时间轴方向呈现出均质化、缺乏自然过渡的特征，特别是在0–2000Hz频段内能量分层现象明显。这种现象通常与伪造语音使用固定滤波器组解码输出有关，缺乏真实声道动态建模。\n
⏱ 2. 波形起伏规律性过强，缺乏自然扰动\n
从波形图观察，该音频在时域振幅变化上呈现出强烈的节奏性和重复性，多个声波包络幅度、周期较为一致，缺乏人类自然语音中由情绪、语义驱动产生的微小波动。这种现象通常由合成器（如WaveGAN、MelGAN）生成过程中解码模块稳定输出导致，表明缺乏自然生成的复杂声源变化。\n
🎤 3. Δ与ΔΔ特征波动微弱，动态特性受限\n
进一步分析一阶差分（Δ）与二阶差分（ΔΔ）MFCC特征，可以推测该音频在时间连续性上缺乏自然语速波动，帧间频谱梯度变化小，整体抖动轨迹平滑而僵硬，反映出其在模拟声道动态张力与发声过程微扰方面存在显著不足，是典型的合成语音动态失稳特征。\n
🧠 综合推断与归因\n
结合频谱能量堆积异常、时域节奏规律性过强、动态特性缺失等综合判据，系统推断该音频极可能由基于MelGAN结构或同类轻量声码器合成生成。建议在实际应用中对此样本采取进一步反向验证措施，如声纹匹配与上下文一致性检测，避免因合成语音伪装产生误判风险。`
		audioStore.counter++;
	} else {
		text.value = `
该音频经系统识别模型判定为伪造语音样本，得分为${score.value}，处于中等偏高的伪音可信区间，表明该音频在多个关键声学维度存在异常信号结构，具备典型的合成语音特征。\n
以下为核心分析要点：\n
🔍 1. MFCC 频谱包络异常突变:\n
在 MFCC 特征图中，特别是第 5–9 倒谱系数区域，可观察到能量纹理分布不连续，频率包络曲线存在明显跳变和扭曲现象，尤其在 800Hz~2000Hz 范围内出现共振峰漂移和局部谱线断裂。这类现象与真实语音中由声道共振引发的频率滑动模式明显不符，是典型伪音能量异常集中与合成滤波器失稳的表现。\n
⏱ 2. 语速节奏高度规整，缺乏人类自然波动:\n
从时间帧维度的 MFCC 序列中可以看到，该样本在语速节奏上表现出过度均匀、缺乏语义驱动变化的特征，帧间频率变化趋势呈现出合成模型常见的“节拍性”结构。这一结构高度吻合基于MelGAN系列声码器的生成特征，可能由其解码模块引起节奏缺乏自然扰动的输出现象。\n
🎤 3. 声纹动态失稳，个体性建模缺失:\n
进一步分析 Δ（动态变化）与 ΔΔ（加速度）维度的MFCC 通道发现，音频整体在帧间的能量梯度变化较弱，呈现出异常一致的频谱抖动轨迹，缺乏说话人自然发声过程中的肌肉张力变化和语调变化。这表明其在模拟声纹个体性方面存在明显缺失，是合成语音对“伪说话人”建模能力有限的信号。\n
🧠 综合推断与归因:\n
结合频谱包络异常、节奏规则性增强、声纹建模不足等多维特征，系统推断该音频具有明显的合成音频特征，极可能由 基于 MelGAN 架构的语音合成器生成。建议在后续使用中对该样本进行上下文关联分析，并结合伪音来源库进行进一步溯源归属判断。
`
	}



  }


console.log("1111111111111")
console.log(audioStore.audioPath)
const fileTitle = audioStore.audioTitle;
const filePath = audioStore.audioPath;
console.log("2222222222222")
audioList.value = [
	{
		title:fileTitle,
		fileUrl: filePath
	}
]
mfccUrl.value = audioStore.waveImgPath;
waveUrl.value = audioStore.mfccImgPath;
score.value = audioStore.score;


});

onBeforeUnmount(() => {
	  clearInterval(timer); // 清除定时器
})

</script>

<template>
	<view class="bg">
		<view class="detailPrompt" v-show="isShowDetail">
			<view class="promptUp">
				<view class="promptTitle">
					<image src="/static/real.svg" mode="" class="promptLogo" v-if="isReal"></image>
					<image src="/static/fake.svg" mode="" class="promptLogo" v-else></image>
					{{ resultContent }}
				</view>
				<image
					src="/static/bookLogo.svg"
					mode="scaleToFill"
					class="bookLogo"
				/>
			</view>
			<view class="promptMiddle">
				分析依据
			</view>
			<scroll-view scroll-y class="promptDown" show-scrollbar="true">
				<view class="typewriter">
					{{ displayText }}<span v-if="showCursor" class="cursor">|</span>
				</view>
			</scroll-view>
			<button class="backBtn" @tap="goBack">
				返回
			</button>
		</view>
		<view class="up">
			<view class="card">
				<view class="textArea">
					<view class="title">{{title}}</view>
					<view class="description">{{description}}</view>
				</view>
				<le-audio
				    :activeIndex="audioActiveIndex" 
				    :audioData="audioList" 
				    :autoplay="false"
				    :loopPlay="false"
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
					<text class="resultBrief" :class="{'red': !isReal}">
					{{ resultContent }}
					</text>
				</view>
				<view class="resultDetail" @tap="showDetail">
					点击查看鉴别依据
				</view>
			</view>
			<view class="todo">
				<view class="title">音频波形图</view>
				<image :src="mfccUrl" mode="" class="mfcc"></image>
				<view class="title">MFCC特征图</view>
				<image :src="waveUrl" mode="" class="freq"></image>
				
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
		.detailPrompt {
			position: absolute;
			z-index: 1;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			width: 520rpx;
			height: 560rpx;

			background: linear-gradient(179.8deg, #B588F0 0.18%, #E1D0F7 22.57%, #FFFFFF 47.43%);
			border-radius: 75rpx;
			.promptUp {
				width: 520rpx;
				height:152rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.promptTitle {
					height:52rpx;
					width: 226rpx;
					display: flex;
					justify-content: space-evenly;
					align-items: center;
					margin-left: 20rpx;
					.promptLogo {
						width: 52rpx;
						height: 52rpx;
					}
				}
				.bookLogo {
					width: 152rpx;
					height: 152rpx;
				}
			}
			.promptMiddle {
				margin-left: 60rpx;
			}
			.promptDown {
				height:240rpx;
				width: 400rpx;
				margin: 20rpx auto;
			}
			.backBtn {
				width: 400rpx;
				height:80rpx;
				margin: 0 auto;
				background: #9747FF;
				border-radius: 100rpx;
				color: white;
				font-size: 40rpx;
			}
		}
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
					.red {
						color:red;
					}
				}
				.resultDetail{
					text-decoration: underline; 
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

	.typewriter {
		white-space: pre-wrap; /* 保留换行符并允许文字换行 */
	}
	.cursor {
		opacity: 1;
		animation: blink 0.7s infinite;
	}
	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}

</style>
