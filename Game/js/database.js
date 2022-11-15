const data_game = {
	ronde: 1,
	menang: 0,
	seri: 0,
	kalah: 0,
}

const data_setting = {
	toggle_bgm: false,
	bgm_currentTime: 0,
}

let session_firstOpen = null

function init_db() {
	let read_data_game = JSON.parse(localStorage.getItem("data_game"))
	let read_data_setting = JSON.parse(localStorage.getItem("data_setting"))
	let read_session_firstOpen = JSON.parse(sessionStorage.getItem("firstOpen"))

	if(read_data_game == null) {
		read_data_game = data_game
		localStorage.setItem("data_game", JSON.stringify(data_game))
	}
	if(read_data_setting == null) {
		read_data_setting = data_setting
		localStorage.setItem("data_setting", JSON.stringify(data_setting))
	}
	if(read_session_firstOpen == null) {
		read_session_firstOpen = true
		session_firstOpen = true
		sessionStorage.setItem("firstOpen", JSON.stringify(session_firstOpen))

		read_data_setting.bgm_currentTime = 0
	}

	for(key in read_data_game) {
		data_game[key] = read_data_game[key]
	}
	for(key in read_data_setting) {
		data_setting[key] = read_data_setting[key]
	}
}

function save_db(name, data) {
	localStorage.setItem(name, JSON.stringify(data))
}

init_db()