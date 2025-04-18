import { defineStore } from 'pinia';

export const useAudioStore = defineStore('audio', {
    state: () => ({
        audioPath:'/storage/emulated/0/Android/data/uni.UNI84A00C0/cache/1744898173374_audio.wav',
        audioTitle:'',
        result: '伪造音频',
        mfccImgPath: '/static/freq.png',
        waveImgPath: '/static/mfcc.png',
        score: 37,
        counter:0,
        audio:null,
        mfcc: null,
        waveform:null,
    }),
    actions: {
        setAudioData(audio) {
            this.audio = audio;
        },
        setPredictRes(res) {
            this.mfcc = res.mfcc;
            this.result = res.result;
            this.score = res.score;
            this.waveform = res.waveform;
        }
    }
});