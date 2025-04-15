<script setup>
	import { uploadAudio } from '@/request/api.js'
	import { useAudioStore } from '@/store/audio.js'
	import { ref, onMounted, onActivated } from 'vue';

	// 引入原生插件
	const KJDocument = uni.requireNativePlugin('KJ-Document');

	// 定义响应式数据
	const json = ref('');
	const path = ref('');

	// 打开文件监听
	const open = () => {
		/**
		 * ios：注意 “用其他应用打开” 在app完全关闭的情况下，从“文件”app里分享的文件，打开app，获取的文件地址没有访问权限，
		 * app在后台的话，就没有问题，可以提示用户再选择一次。在微信，QQ等，打开就没有问题
		 * ios分享没有问题
		 *
		 * android：配置了 一个文件 和 多个文件 分享
		 */
		KJDocument.openURL((res) => {
				// ios：res返回[{"path":""}], 因为系统api原因，“用其他应用打开”只返回一个文件，分享可以返回多个文件
				// android: res返回[{"path":""}] 可以返回多个文件
				console.log('openURL: ' + JSON.stringify(res));
				json.value = JSON.stringify(res);

				uni.showModal({
					title: '监听到分享的数据',
					content: json.value,
			});

		if (uni.getSystemInfoSync().platform === 'ios') {
			/**
			 * 返回的json说明：[{"path":"/var/mobile/Containers/Data/Application/B12C17BB-0A20-4205-BAE1-4CC6110381C0/Documents/Pandora/apps/__UNI__89F76C9/doc/KJ-DocumentV2/IMG_3202.PNG",
			 * "type":"file","textViewContent":""}]
			 * type - file-文件 url-网址 text-文本 other-其它(这个属于不支持该类型，只会返回一个字符串) error-错误
			 * path - type==file则是文件的绝对路径，其它则是文本
			 * textViewContent - 分享扩展的发布UI填写的文本
			 */
			for (let i = 0; i < res.length; i++) {
				const dic = res[i];
				if (dic.type === 'file') {
					path.value = dic.path;
				}
			}
		} else {
			/**
			 * 返回的json说明： [{"uri":"content://com.miui.gallery.open/raw//storage/emulated/0/Android/data/com.miui.gallery/cache/SecurityShare/1688092107366.jpeg",
			 * "type":"image/*","path":"/storage/emulated/0/Android/data/uni.UNI89F76C9/cache/1688092107610/1688092107366.jpeg"}]
			 * type - 文件的MIME Type，资源的媒体类型，type如果为空，则是文本
			 * path - type如果为空，则是文本，否则是文件的绝对路径
			 */
			for (let i = 0; i < res.length; i++) {
				const dic = res[i];
				path.value = dic.path; // 注意：“用其他应用打开”，有时候文件名不是分享过来的文件名，比如微信，有时候分享过来的不是文件名，而是一段中文加数字的文字
			}
		}
		uni.getFileInfo({
				filePath: path.value,
				success: (res) => {
					console.log('getFileInfo: ' + JSON.stringify(res));
				},
				fail: (res) => {
					console.log('fail: ' + JSON.stringify(res));
				},
			});
		});
	};

	// 设置 iOS 分享扩展的发布 UI
	const settingIos = (isShowUI) => {
		const dic = {
			isShowUI, // 默认是 true
		};
		console.log(JSON.stringify(dic));
		KJDocument.setting_ios(dic, (res) => {
			console.log('setting_ios: ' + JSON.stringify(res));
		});
	};

	// 生命周期钩子
	onMounted(() => {
		open();
	});

	onActivated(() => {
		open();
	});
        

	const audioStore = useAudioStore()

	const gotoListenPage = () => {
		console.log('click: goto listen page');
		uni.navigateTo({
		  url: '/pages/listen/listen',
		  animationType: 'slide-in-right', // 设置动画类型为从底部滑入
		  animationDuration: 300 // 设置动画时长为300ms
		});
	}
	const handleAudio = async (file) => {
		try {
			console.log("开始上传：", file);
			const response = await uploadAudio(file);
			console.log("上传成功：", response);
			uni.showToast({
				title: '上传成功',
				icon: 'success',
				duration: 2000
			});
			uni.navigateTo({
					url: '/pages/load/load',
					animationType: 'slide-in-right', // 设置动画类型为从底部滑入
					animationDuration: 300 // 设置动画时长为300ms
				});
		} catch (error) {
			console.error("上传失败：", error);
			uni.showToast({
				title: '上传失败',
				icon: 'none',
				duration: 2000
			});
		}
	}


	const saveFileWithDynamicExtension = (tempFilePath) => {
	const fileSystemManager = uni.getFileSystemManager();

	// 提取扩展名
	const getFileExtension = (filePath) => {
		const parts = filePath.split('.');
		return parts.length > 1 ? parts[parts.length - 1] : 'unknown'; // 如果没有扩展名，使用 'unknown'
	};

	const extension = getFileExtension(tempFilePath);
	const savedFilePath = `${uni.env.USER_DATA_PATH}/file_${Date.now()}.${extension}`;

	fileSystemManager.saveFile({
		tempFilePath: tempFilePath,
		filePath: savedFilePath,
		success: (res) => {
		console.log('文件已保存到本地:', savedFilePath);
		},
		fail: (err) => {
		console.error('文件保存失败：', err);
		},
	});
	};


	const gotoLoadPage = () => {
		// uni.chooseMedia({
		// 	mediaType: ['audio'], // 选择音频文件
		// 	success: (chooseFiles) => {
		// 		console.log("chooseFiles", chooseFiles);
		// 			const tempFilePaths = chooseFiles.tempFilePaths;
		// 			console.log("temFilePaths", tempFilePaths);
		// 			console.log("temFilePaths[0]", tempFilePaths[0]);
		// 			// audioStore.setAudioFile(tempFilePaths[0]);
		// 			uni.uploadFile({
		// 				url: 'http://10.135.31.242:5000/predict', // 替换为你的上传接口地址
		// 				filePath: tempFilePaths[0],
		// 				name: 'audio',
		// 				success: (res) => {
		// 					console.log("上传成功", res);
		// 					console.log(typeof(res))
		// 					// console.log(JSON.parse(res.data))
		// 					const responseData = JSON.parse(res.data);
		// 					console.log("responseData", responseData);
		// 					console.log(typeof(responseData))
		// 					console.log(responseData.mfcc)
		// 					console.log(typeof(responseData.mfcc))
		// 					console.log(responseData.result)
		// 					console.log(responseData.score)
		// 					console.log(responseData.waveform)
		// 					console.log("------------------------------------------");
							
		// 					console.log(typeof(res.data))
		// 					console.log(res.data.mfcc)
		// 					console.log(res.data.result)
							
		// 					saveFileWithDynamicExtension(tempFilePaths[0]);
		// 					// console.log(res.json())
		// 					// console.log(res.data.json().mfcc)
		// 					// console.log(res.data.json().data)
							
		// 					// handleAudio(tempFilePaths[0]);
		// 				},
		// 				fail: (err) => {
		// 					console.error("上传失败：", err);
		// 				}
		// 			});
		// 			// uni.getFileSystemManager().readFile({
		// 			// 	filePath: tempFilePaths[0],
		// 			// 	encoding: 'base64',
		// 			// 	success: (res) => {
		// 			// 		console.log("res", res);
		// 			// 		const base64Data = res.data;
		// 			// 		console.log("base64Data", base64Data);
		// 			// 		// 这里可以将 base64Data 发送到服务器或进行其他处理
		// 			// 		handleAudio(base64Data);
		// 			// 	},
		// 			// 	fail: (err) => {
		// 			// 		console.error("读取文件失败：", err);
		// 			// 	}
		// 			// });
		// 			// handleAudio(tempFilePaths[0]);
		// 		}
		// })
		uni.navigateTo({
			url: '/pages/load/load',
			animationType: 'slide-in-right', // 设置动画类型为从底部滑入
			animationDuration: 300 // 设置动画时长为300ms
		});
		
	}
	const gotoHistoryPage = () => {
		uni.navigateTo({
		  url: '/pages/history/history',
		  animationType: 'slide-in-right', // 设置动画类型为从底部滑入
		  animationDuration: 300           // 设置动画时长为300ms
		});
	}
</script>

<template>
	<view class="content">
		<image class="logo" src="/static/amico.svg"></image>
		<view class="title">
			<image
				src="/static/title.svg"
				mode="scaleToFill"
				class="titleImg"
			/>
		</view>
		<view class="card" @click="gotoListenPage">
			实时监听 
			<image class="img" src="/static/headphone.png"></image>
		</view>
		<view class="card" @click="gotoLoadPage">
			<image class="img" src="/static/select.png"></image>
			音频检测
		</view>
		<view class="card" @click="gotoHistoryPage">
			历史记录
			<image class="img" src="/static/document.png"></image>
		</view>
	</view>
</template>

<style scoped lang="less">
.content {
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;
	align-items: center;
	justify-content: center;
	background: #E8E4FF;
	.logo {
		height: 426rpx;
		width: 426rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 100rpx;
	}
	.title {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 360rpx;
		height: 64rpx;
		.titleImg {
			position: relative;
		}
	}
	.card {
		height: 200rpx;
		width: 700rpx;
		background-color: white;
		margin: 10rpx;
		border-radius: 70rpx;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		font-family: Inter;
		font-weight: 400;
		font-size: 56rpx;
		line-height: 64rpx;
		letter-spacing: 0px;
		text-align: center;
		.img {
			z-index: 1;
			height: 200rpx;
			width: 200rpx;
		}
	}
}

	



</style>
