<script setup>
</script>

<template>
	<view class="bg">
		<view class="dateArea">
			<view class="currentDate">
				<view class="day">05</view>
				<view class="more">
					<view class="inweek">Thu</view>
					<view class="moremore">
						<view class="month">Mar</view>
						<view class="year">2025</view>
					</view>
				</view>		
			</view>
			<view class="label">
				today
			</view>
		</view>
		<view class="main">
			<view class="dateBar">
				<view class="oneDate">
					<view class="up">S</view>
					<view class="down">02</view>
				</view>
				<view class="oneDate">
					<view class="up">M</view>
					<view class="down">03</view>
				</view>
				<view class="oneDate">
					<view class="up">T</view>
					<view class="down">04</view>
				</view>
				<view class="oneDate">
					<view class="up">W</view>
					<view class="down">05</view>
				</view>
				<view class="oneDate">
					<view class="up">T</view>
					<view class="down">06</view>
				</view>
				<view class="oneDate">
					<view class="up">F</view>
					<view class="down">07</view>
				</view>
				<view class="oneDate">
					<view class="up">S</view>
					<view class="down">08</view>
				</view>
			</view>
			<view class="promptArea">
				<view class="prompt1">时间</view>
				<view class="prompt2">监测记录</view>
			</view>
			<view class="content">
				<view class="verticalLine"></view>
				<view class="info">
					<view class="infoTime">
						21:34
					</view>
					<view class="card" style="background-color: #B0A4FD;">
						<view class="judge">真实音频</view>
						<view class="detail">查看详情></view>
					</view>
				</view>
				<view class="info">
					<view class="infoTime">
						21:34
					</view>
					<view class="card">
						<view class="judge">真实音频</view>
						<view class="detail">查看详情></view>
					</view>
				</view>
				<view class="info">
					<view class="infoTime">
						21:34
					</view>
					<view class="card">
						<view class="judge">真实音频</view>
						<view class="detail">查看详情></view>
					</view>
				</view>
				<view class="info">
					<view class="infoTime">
						21:34
					</view>
					<view class="card">
						<view class="judge">真实音频</view>
						<view class="detail">查看详情></view>
					</view>
				</view>
				<view class="info">
					<view class="infoTime">
						21:34
					</view>
					<view class="card">
						<view class="judge">真实音频</view>
						<view class="detail">查看详情></view>
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
	flex-wrap: wrap;
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
		height: 1300rpx;
		background-color: white;
		border-radius: 80rpx 80rpx 0 0;
		.dateBar{
			width: 100vw;
			display: flex;
			.oneDate{
				width: 102rpx;
				height: 130rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-radius: 24rpx;
				.up {
					color: #D9D9D9;
				}
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
			.verticalLine{
				position: absolute;
				width: 0rpx;
				height: 1060rpx;
				left: 163rpx;
				top: 20rpx;
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
				.card:first-of-type{
					background-color: #B0A4FD;
				}
			}
		}
	}
}

</style>
