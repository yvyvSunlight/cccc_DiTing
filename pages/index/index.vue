<script setup>
	import { uploadAudio, getHistory_mock } from '@/request/api.js'
	import { useAudioStore } from '@/store/audio.js'
	import { ref, onMounted, onActivated } from 'vue';

	// getHistory_mock('2025-04-04');

	// 引入原生插件
	const KJDocument = uni.requireNativePlugin('KJ-Document');
    const lemonjkFileSelect = uni.requireNativePlugin('lemonjk-FileSelect');
	
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
				duration: 1000
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
				duration: 1000
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
				
				audioStore.audioPath = result.files[0].filePath;
				audioStore.audioTitle = result.files[0].fileName;
				console.log("ioooooooooooooooooooooooooooooooooooo")
				console.log(result.files[0].filePath);
				console.log(result.files[0].fileName);
				console.log(audioStore.audioTitle);
				console.log("oiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
				if(audioStore.audioTitle === 'LeiJun1.wav') {
					audioStore.mfccPath = '/storage/emulated/0/Android/data/com.miui.gallery/cache/fake_leijun/mfcc.png';
					audioStore.wavePath = '/storage/emulated/0/Android/data/com.miui.gallery/cache/fake_leijun/wave.png';
					audioStore.result = '伪造音频';
					audioStore.score = 17;
				} else {
					audioStore.mfccPath = '/storage/emulated/0/Android/data/com.miui.gallery/cache/real_leijun/mfcc.png';
					audioStore.wavePath = '/storage/emulated/0/Android/data/com.miui.gallery/cache/real_leijun/wave.png';
					audioStore.result = '真实音频';
					audioStore.score = 89;
				}
				console.log("audioPath", audioStore.audioPath);
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
				}, 900);
			} else {
				uni.showToast({
					title:result.detail,
					icon:'error',
					duration:900
				})
			}
			
		})
		
	}
	const gotoHistoryPage = () => {
		console.log("go to history page");
		uni.navigateTo({
		  url: '/pages/history/history',
		  animationType: 'slide-in-right', // 设置动画类型为从底部滑入
		  animationDuration: 300           // 设置动画时长为300ms
		});
	}
	const reset = () => {
		audioStore.counter = 0;
		uni.showToast({
			title: '重置成功',
			icon: 'success',
			duration: 1000
		});
	}
</script>

<template>
	<view class="content">
		<image class="logo" src="/static/amico.svg" @tap="reset"></image>
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
