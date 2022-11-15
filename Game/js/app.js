function showModal(modalName) {
	const el = document.querySelector(`[data-modal=${modalName}]`)
	const isShowed = el.classList.contains("show")

	if(!isShowed) {
		el.classList.toggle("close")
		el.classList.toggle("show")
	}
}

function closeModal(modalName) {
	const el = document.querySelector(`[data-modal=${modalName}]`)
	const isShowed = el.classList.contains("show")

	if(isShowed) {
		el.classList.toggle("close")
		el.classList.toggle("show")
	}
}

function update_skor() {
	const el_ronde  = document.querySelector("#ronde")
	const el_skor 	= document.querySelector("#skor")
	const el_menang = document.querySelector("#menang")
	const el_seri   = document.querySelector("#seri")
	const el_kalah  = document.querySelector("#kalah")

	el_ronde.innerText  = data_game.ronde
	el_menang.innerText = data_game.menang
	el_seri.innerText   = data_game.seri
	el_kalah.innerText  = data_game.kalah

	el_skor.innerText = data_game.menang - data_game.kalah
}

/* sounds code */
const el_btn_bgm = document.querySelector("#btn_bgm")

const sounds_dir = location.pathname.substring(0, location.pathname.lastIndexOf("/"))
const sounds = {
	win: new Audio(`${sounds_dir}/sound/win.wav`),
	lose: new Audio(`${sounds_dir}/sound/lose.wav`),
	drawing: new Audio(`${sounds_dir}/sound/draw_choice.wav`),
	bgm: new Audio(`${sounds_dir}/sound/days-like-this-121107.mp3`),
}

sounds.bgm.volume = .3

sounds.bgm.onended = function () {
	sounds.bgm.currentTime = 0
	play_bgm()
}

function play_bgm() {
	if (!data_setting.toggle_bgm) return

	if(sounds.bgm.currentTime < 15)
		sounds.bgm.currentTime = 15 // pos start
	sounds.bgm.play()
}

function autosave_bgm() {
	data_setting.bgm_currentTime = sounds.bgm.currentTime
	save_db("data_setting", data_setting)
}

function toggle_bgm() {
	data_setting.toggle_bgm = !data_setting.toggle_bgm

	if (data_setting.toggle_bgm) {
		sounds.bgm.currentTime = 0
		data_setting.bgm_currentTime = 0
		play_bgm()
		el_btn_bgm.classList.replace("mdi-music-off", "mdi-music")
	} else {
		sounds.bgm.pause()
		el_btn_bgm.classList.replace("mdi-music", "mdi-music-off")
	}
	save_db("data_setting", data_setting)
}

/* sounds code */

/* game mechanic code */
let player_draw = ""
let bot_draw = ""

const el_player_drawer = document.querySelector("#player-drawer")
const el_player_draw = document.querySelector("#player-draw")
const el_bot_drawer = document.querySelector("#bot-drawer")
const el_bot_draw = document.querySelector("#bot-draw")
const el_play_result = document.querySelector(".play-result")

function reset_skor() {
	data_game.ronde = 1
	data_game.menang = 0
	data_game.seri = 0
	data_game.kalah = 0

	save_db("data_game", data_game)
	update_skor()
	closeModal("reset-skor")
}

function draw(item) {
	const isPicked = el_player_drawer.hasAttribute("readonly")
	if(isPicked) return

	item.classList.add("draw-select")
	player_draw = item.getAttribute("data-draw")

	el_player_drawer.setAttribute("readonly", "")
	el_player_draw.setAttribute("class", player_draw)
	bot_drawing()
}

let interval_bot_drawing
function bot_drawing() {
	clearInterval(interval_bot_drawing)

	const items = el_bot_drawer.children
	let idx_last = null
	interval_bot_drawing = setInterval(function() {
		if (idx_last !== null)
			items[idx_last].classList.remove("draw-select")

		const idx = Math.floor(Math.random() * 100) % 3
		idx_last = idx
		items[idx_last].classList.add("draw-select")
	}, 100)

	sounds.drawing.currentTime = 0
	sounds.drawing.play()
	setTimeout(function(){
		clearInterval(interval_bot_drawing)
		bot_draw = items[idx_last].getAttribute("data-draw")
		el_bot_draw.setAttribute("class", bot_draw)
		result_game()
	}, 2000)
}

function result_game() {
	data_game.ronde++
	if (player_draw == bot_draw) {
		// seri
		el_play_result.innerText = "seri"
		data_game.seri++
	}
	else if (
		(player_draw == 'batu' && bot_draw == 'gunting') ||
		(player_draw == 'gunting' && bot_draw == 'kertas') ||
		(player_draw == 'kertas' && bot_draw == 'batu')
	) {
		// menang
		data_game.menang++
		el_play_result.innerText = "menang!!"
		sounds.win.play()
	} else {
		// kalah
		data_game.kalah++
		el_play_result.innerText = "kalah"
		sounds.lose.play()
	}
	save_db("data_game", data_game)


	el_play_result.style.visibility = "visible"
	el_play_result.style.opacity = 1
	setTimeout(function() {
		el_play_result.style.visibility = "hidden"
		el_play_result.style.opacity = 0

		
		el_player_drawer.removeAttribute("readonly")
		el_player_draw.setAttribute("class", "draw-none")
		el_bot_draw.setAttribute("class", "draw-none")

		el_player_drawer.querySelector(`.${player_draw}`).classList.remove("draw-select")
		el_bot_drawer.querySelector(`.${bot_draw}`).classList.remove("draw-select")
		player_draw = ''
		bot_draw = ''
		update_skor()
	}, 2000)
}
/* */

window.addEventListener("DOMContentLoaded", function(){
	sounds.bgm.currentTime = data_setting.bgm_currentTime
	if (data_setting.toggle_bgm) {
		el_btn_bgm.classList.replace("mdi-music-off", "mdi-music")
		play_bgm()

		if (sounds.bgm.paused) toggle_bgm()
	} else {
		el_btn_bgm.classList.replace("mdi-music", "mdi-music-off")
	}
})

window.addEventListener("unload", function(){
	autosave_bgm()
})