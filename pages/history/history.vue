<script setup>
	import { ref, onMounted } from 'vue';
	import { audioHistory } from '@/mock/data.js'
	import { useAudioStore } from '@/store/audio.js'
	const curIndex = ref(27);
	const cardIndex = ref(0);
	const audioHistoryData = ref(audioHistory);

	const audioStore = useAudioStore()

	const curYear = ref('');
	const curMonth = ref('');
	const curDay = ref('');
	const curDayOfWeek = ref('');
	const dateBox = ref([])
	const activeIndex = ref(27);
	const toView = ref('')
	// 获取当前日期
	const currentDate = new Date();
	// 获取年份
	curYear.value = currentDate.getFullYear();
	// 获取日期
	curDay.value = currentDate.getDate();
	// 获取星期几
	const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const up = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
	const yearMons = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	curDayOfWeek.value = weekdays[currentDate.getDay()];
	curMonth.value = yearMons[currentDate.getMonth()];
	const generateBoxes = () => {
		for (let i = 0; i < 28; i++)
		{
			const date = new Date();
			date.setDate(date.getDate() - i);
			const tempYear = date.getFullYear();
			const tempDay = date.getDate().toString().padStart(2, '0');
			const tempDayOfWeek = weekdays[date.getDay()];
			const tempMonth = yearMons[date.getMonth()];
			const tempUp = up[date.getDay() % 7];
			dateBox.value.push({
				year: tempYear,
				month: tempMonth,
				day: tempDay,
				up: tempUp,
				dayOfWeek: tempDayOfWeek
			})
		}
		dateBox.value.reverse();
	}
	const selectBox = (box, index) => {
		activeIndex.value = index;
		console.log("index", index);
		console.log("activeIndex value", activeIndex.value)
		curDay.value = box.day;
		curDayOfWeek.value = box.dayOfWeek;
		curMonth.value = box.month;
		curYear.value = box.year;
		curIndex.value = index;
		cardIndex.value = 0;
		// toView.value = 'box' + index;
	}
	const chooseCard = (item, index) => {
		console.log("/////////////////////")
		console.log("item", item);
		console.log("/////////////////////")
		
		cardIndex.value = index;
		console.log("cardIndex", cardIndex.value)
		audioStore.mfccImgPath = item.mfccPath
		audioStore.waveImgPath = item.wavePath
		audioStore.result = item.result
		audioStore.score = item.score
		// console.log("audioStore", audioStore.mfccImgPath)
		
	}

	const gotoLoadPage = (item, index) => {
		audioStore.mfccImgPath = item.mfccPath
		audioStore.waveImgPath = item.wavePath
		audioStore.audioPath = item.audioPath
		audioStore.result = item.result
		audioStore.score = item.score
		uni.navigateTo({
			url: '/pages/load/load',
			animationType: 'slide-in-right', // 设置动画类型为从底部滑入
			animationDuration: 300           // 设置动画时长为300ms
		})
	}

	onMounted(() => {
		generateBoxes();
		activeIndex.value = 27; // 默认选中第28个元素
		curIndex.value = 27;
		toView.value = 'box27'
	})
		
</script>

<template>
	<view class="bg">
		<view class="dateArea">
			<view class="currentDate">
				<view class="day">{{ curDay }}</view>
				<view class="more">
					<view class="inweek">{{ curDayOfWeek }}</view>
					<view class="moremore">
						<view class="month">{{curMonth}}</view>
						<view class="year">{{curYear}}</view>
					</view>
				</view>		
			</view>
			<view class="label" v-show="activeIndex === 27">
				today
			</view>
		</view>
		<view class="main">
			<scroll-view enable-flex scroll-x  class="dateBar" ref="scrollContainer" :scroll-into-view="toView">
				<view class="oneDateOuter" v-for="(box, index) in dateBox"
					:key="index"
					:id="'box'+index"
					@tap="selectBox(box, index)">

					<view class="oneDate"
					:class="{'active':index === activeIndex }"
					>
						<view class="up">{{ box.up }}</view>
						<view class="down">{{ box.day }}</view>
					</view>
				</view>				
				<view class="whiteSpace"></view>
			</scroll-view>
			<view class="promptArea">
				<view class="prompt1">时间</view>
				<view class="prompt2">监测记录</view>
			</view>
			<view class="content">
				<view class="verticalLine"></view>
				<view class="info" 
				v-for="(item, index) in audioHistoryData[curIndex]" 
				:key="index">
					<view class="infoTime">
						{{ item.time }}
					</view> 
				<view class="card" 
				:class="{'active':cardIndex === index}"
				@tap="chooseCard(item, index)">
						<view class="judge">{{ item.result }}</view>
						<view class="detail" @tap="gotoLoadPage(item,index)">查看详情></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="less">
* {
	margin: 0;
	padding: 0;
}
.bg {
	width: 100vw;
	height: 100vh;
	background-color: #E8E4FF;
	display: flex;
	flex-wrap: nowrap;
	flex-direction: column;
	justify-content: space-between;
	.dateArea {
		display: flex;
		width: 80%;
		margin: 0 auto;
		margin-top: 20rpx;
		justify-content: space-between;
		align-items: center;
		height: 300rpx;
		.currentDate{
			width: 320rpx;
			height: 84rpx;
			display: flex;
			align-items: center;
			.day{
				font-size: 100rpx;
			}
			.more{
				width: 185rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				font-size: 40rpx;
				.inweek{
					width: 185rpx;
				}
				.moremore {
					width: 185rpx;
					display: flex;
					view{
						margin: 0 4rpx;
					}
				}
			}
		}
		.label{
			width: 170rpx;
			height: 70rpx;
			background: #B0A4FD;
			border-radius: 24rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-family: 'Inter';
			font-style: normal;
			font-weight: 700;
			font-size: 40rpx;
			line-height: 40rpx;
			text-align: center;
			color: #6D57FC;
		}
	}
	.main {
		position: relative;
		width: 100%;
		height: 1280rpx;
		background-color: white;
		border-radius: 80rpx 80rpx 0 0;
		padding-top: 20rpx;
		overflow: hidden;
		.dateBar{
			width: 100vw;
			display: flex;
			white-space: nowrap;
			height: 140rpx;
			.oneDateOuter{
				display: inline-block;
				.oneDate{
					box-sizing: border-box;
					width: 102rpx;
					height: 110rpx;
					padding: 0 25rpx;
					margin: 0 10rpx;
					margin-right: 10rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					border-radius: 24rpx;
					.up {
						color: #D9D9D9;
					}
				}
				.oneDate.active {
					background-color: #B0A4FD;
					color: white;
					.up {
						color:white;
					}
				}
			}
			.whiteSpace {
					height: 120rpx;
					width: 30rpx;
				}
		}
		.promptArea{
			display: flex;
			height: 40rpx;
			align-items: center;
			color:#D9D9D9;
			font-size:30rpx;
			.prompt1 {
				width: 163rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.prompt2 {
				padding-left: 40rpx;
			} 
		}
		.content {
			position: relative;
			overflow-y: scroll;
			.verticalLine{
				position: fixed;
				width: 0rpx;
				height: 993rpx;
				left: 163rpx;
				top: 594rpx;
				border: 1px solid #D9D9D9;
			}
			.info {
				height: 160rpx;
				display: flex;
				align-items: center;
				margin: 20rpx 0;
				.infoTime{
					width: 162rpx;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.card {
					margin: 0 20rpx;
					width: 540rpx;
					height: 95%;
					background: #B5B5B5;
					border-radius: 50rpx;
					color: white;
					box-sizing: border-box;
					padding-left: 60rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					.judge{
						font-size: 40rpx;
					}
					.detail{
						font-size: 24rpx;
					}
				}

			}
			.card.active {
				background-color: #B0A4FD;
			}
		}
	}
}

</style>
