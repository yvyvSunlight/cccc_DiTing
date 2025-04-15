import instance from "./instance";

export const uploadAudio = (audio) => {
    console.log('-----------------------------------')
    console.log('audio', audio)
    const headers = {
        'Content-Type': 'multipart/form-data',
    }
    return instance('predict', 'POST', audio, headers)
}