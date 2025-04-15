<template>
    <view class="timer">
      <view class="time">{{ formatTime(elapsedTime) }}</view>
    </view>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const isRunning = ref(false); // 是否正在计时
  const elapsedTime = ref(0); // 已耗时（以毫秒为单位）
  let intervalId = null; // setInterval的ID
  


  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  
  // 启动计时器
  const startTimer = () => {
    if (isRunning.value) return; // 如果已经在计时，直接返回
    isRunning.value = true; // 更新状态为“正在计时”
    intervalId = setInterval(() => {
      elapsedTime.value += 1000; // 每秒累加1000毫秒
    }, 1000);
  };
  
  // 暂停计时器
  const pauseTimer = () => {
    isRunning.value = false; // 更新状态为“暂停”
    clearInterval(intervalId); // 清除计时器
  };
  
  // 重置计时器
  const resetTimer = () => {
    isRunning.value = false; // 更新状态为“已重置”
    clearInterval(intervalId); // 清除计时器
    elapsedTime.value = 0; // 将已耗时设置为0
  };

  onMounted(() => {
    startTimer(); // 组件挂载时自动启动计时器
  })

  onUnmounted(() => {
    // 组件卸载时清除计时器
    return () => {
      clearInterval(intervalId);
    };
  });

  </script>
  
  <style scoped>
  .timer {
    text-align: center;
    padding: 40rpx;
    width: 100%;
  }
  
  .time {
    font-size: 120rpx;
    margin: 40rpx 0;
  }
  
  .controls button {
    margin: 0 5px;
    padding: 10px 15px;
    font-size: 1em;
  }
  </style>