import { defineStore } from 'pinia';

export const useAudioStore = defineStore('audio', {
    state: () => ({
        audio:null,
        mfcc: null,
        result: '',
        score: 0,
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