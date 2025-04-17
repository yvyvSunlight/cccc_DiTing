import instance from "./instance";
import instance_mock from "./instance_mock";
export const uploadAudio = (audio) => {
    console.log('-----------------------------------')
    console.log('audio', audio)
    const headers = {
        'Content-Type': 'multipart/form-data',
    }
    return instance('predict', 'POST', audio, headers)
}

// export const uploadAudio_mock = (index) => {
	
// }

export const getHistory_mock = (date) => {
	return uni.request({
		url:`file://mock/history/${date}.json`,
		method: 'GET',
		success: (res) => {
			console.log(res);
		},
		fail: (err) => {	
			console.log(err);
		}
	})
}