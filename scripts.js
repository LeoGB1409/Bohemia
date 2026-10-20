document.addEventListener('DOMContentLoaded', () => {

    // ---------- Saudação ----------
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Bom Dia' : hour < 18 ? 'Boa Tarde' : 'Boa Noite'
    document.getElementById('greeting').textContent = greeting

    // ---------- Dados ----------
    const artistsData = [
        { name: 'Arctic Monkeys',    img: './img/Arctic Monkeys.jpg',     audio: './audio/Arctic Monkeys - 505 (lyrics).mp3', track: '505' },
        { name: 'Billie Eilish',     img: './img/billie-eilish.jpg',      audio: './audio/Billie Eilish - WILDFLOWER (Official Lyric Video).mp3', track: 'WILDFLOWER' },
        { name: 'The Neighbourhood', img: './img/the-neighbourhood.jpg',  audio: './audio/The Neighbourhood - Sweater Weather (Official Video).mp3', track: 'Sweater Weather' },
        { name: 'Lana Del Rey',      img: './img/lana-del-rey.jpg',       audio: './audio/Lana Del Rey - Born To Die.mp3', track: 'Born To Die' },
        { name: 'Eminem',            img: './img/Eminem.jpg',             audio: './audio/Eminem - The Real Slim Shady (Official Video - Clean Version).mp3', track: 'The Real Slim Shady' },
        { name: 'Tame Impala',       img: './img/Tame impala poster.jpg', audio: './audio/Tame Impala - Let It Happen (Official Video).mp3', track: 'Let It Happen' },
        { name: 'Sombr',             img: './img/Sombr.jpg',                audio: './audio/sombr - undressed (official lyric video).mp3', track: 'undressed' },
        { name: 'Chase Atlantic',    img: './img/Chase Atlantic.jpg',     audio: './audio/Chase Atlantic - Consume feat. Goon Des Garcons (Official Audio) (1).mp3', track: 'Consume' }
    ]

    const albumsData = [
        { title: 'AM',                        artist: 'Arctic Monkeys',    img: './img/Arctic Monkeys.jpg',            audio: './audio/Arctic Monkeys - 505 (lyrics).mp3', track: '505' },
        { title: 'Favourite Worst Nightmare', artist: 'Arctic Monkeys',    img: './img/favourite-worst-nightmare.jpg', audio: './audio/Old Yellow Bricks.mp3', track: 'Old Yellow Bricks' },
        { title: 'Happier Than Ever',         artist: 'Billie Eilish',     img: './img/happier-than-ever.jpg',         audio: './audio/Billie Eilish - WILDFLOWER (Official Lyric Video).mp3', track: 'WILDFLOWER' },
        { title: 'The Neighbourhood',         artist: 'The Neighbourhood', img: './img/the-neighbourhood-album.jpg',   audio: './audio/The Neighbourhood - Sweater Weather (Official Video).mp3', track: 'Sweater Weather' },
        { title: 'Born to Die',               artist: 'Lana Del Rey',      img: './img/lana-del-rey.jpg',              audio: './audio/Lana Del Rey - Born To Die.mp3', track: 'Born To Die' },
        { title: 'The Eminem Show',           artist: 'Eminem',            img: './img/eminem cover.jpg',              audio: './audio/Eminem - The Real Slim Shady (Official Video - Clean Version).mp3', track: 'The Real Slim Shady' },
        { title: 'Currents',                  artist: 'Tame Impala',       img: './img/Tame Impala.jpg',               audio: './audio/Tame Impala - Let It Happen (Official Video).mp3', track: 'Let It Happen' },
        { title: 'Chase Atlantic',            artist: 'Chase Atlantic',    img: './img/Chase Atlantic Album.jpg',      audio: './audio/Chase Atlantic - Consume feat. Goon Des Garcons (Official Audio) (1).mp3', track: 'Consume' }
    ]

    // ---------- Cards ----------
    const artistsGrid = document.querySelector('.artists-grid')
    const albumsGrid = document.querySelector('.albums-grid')

    // minúsculas e sem acentos, para a busca ignorar "é" x "e"
    function normalize(text) {
        return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }

    function createCard(item, index, type) {
        const title = item.name || item.title

        const card = document.createElement('div')
        card.classList.add(`${type}-card`)
        card.dataset.index = index
        card.dataset.audio = item.audio || ''
        card.dataset.search = normalize(`${title} ${item.artist || ''} ${item.track || ''}`)

        card.innerHTML = `
            <img src="${item.img}" alt="${title}">
            <h3>${title}</h3>
            <p>${type === 'artist' ? 'artista' : item.artist}</p>
        `
        return card
    }

    artistsData.forEach((artist, i) => artistsGrid.appendChild(createCard(artist, i, 'artist')))
    albumsData.forEach((album, i) => albumsGrid.appendChild(createCard(album, i, 'album')))

    // ---------- Player: elementos e estado ----------
    const player = new Audio()
    let currentCard = null
    let currentAudio = null

    const playerBar = document.getElementById('player-bar')
    const playerImg = document.getElementById('player-img')
    const playerTitle = document.getElementById('player-title')
    const playerArtist = document.getElementById('player-artist')
    const toggleBtn = document.getElementById('player-toggle')
    const prevBtn = document.getElementById('player-prev')
    const nextBtn = document.getElementById('player-next')
    const likeBtn = document.getElementById('player-like')
    const progress = document.getElementById('progress')
    const timeCurrent = document.getElementById('time-current')
    const timeTotal = document.getElementById('time-total')
    const volume = document.getElementById('volume')
    const volumeIcon = document.querySelector('.player-volume i')

    const homeView = document.getElementById('home-view')
    const likedView = document.getElementById('liked-view')
    const likedGrid = document.querySelector('.liked-grid')
    const likedEmpty = document.getElementById('liked-empty')
    const likedCount = document.getElementById('liked-count')
    const navLiked = document.getElementById('nav-liked')
    const navLogo = document.querySelector('.nav-logo')

    const searchInput = document.querySelector('.search-bar input')
    const searchEmpty = document.getElementById('search-empty')
    const loopBtn = document.getElementById('player-loop')

    const playlistView = document.getElementById('playlist-view')
    const playlistGrid = document.querySelector('.playlist-grid')
    const playlistEmpty = document.getElementById('playlist-empty')
    const playlistTitle = document.getElementById('playlist-title')
    const playlistDelete = document.getElementById('playlist-delete')
    const userPlaylists = document.getElementById('user-playlists')
    const createPlaylistBtn = document.querySelector('.nav-playlist button')

    const playlistModal = document.getElementById('playlist-modal')
    const playlistName = document.getElementById('playlist-name')
    const playlistTracks = document.getElementById('playlist-tracks')
    const playlistError = document.getElementById('playlist-error')
    const playlistCancel = document.getElementById('playlist-cancel')
    const playlistSave = document.getElementById('playlist-save')

    const sidebar = document.querySelector('.sidebar')
    const sidebarOverlay = document.getElementById('sidebar-overlay')
    const menuBtn = document.getElementById('menu-btn')

    let likes = []
    try {
        likes = JSON.parse(localStorage.getItem('bohemia-likes')) || []
    } catch {
        likes = []
    }

    let playlists = []
    try {
        playlists = JSON.parse(localStorage.getItem('bohemia-playlists')) || []
    } catch {
        playlists = []
    }

    // ---------- Funções auxiliares ----------
    function paintRange(input) {
        const percent = (input.value - input.min) / (input.max - input.min) * 100
        input.style.setProperty('--fill', percent + '%')
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60)
        const s = Math.floor(seconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    function getItem(card) {
        const data = card.classList.contains('artist-card') ? artistsData : albumsData
        return data[card.dataset.index]
    }

    // O card é o que está tocando? Na aba de curtidos os cards são recriados,
    // então ali a comparação é feita pelo áudio.
    function isCurrent(card) {
        return card === currentCard ||
            (!!card.closest('.liked-grid, .playlist-grid') && card.dataset.audio === currentAudio)
    }

    function syncUI() {
        const isPlaying = !player.paused
        toggleBtn.innerHTML = isPlaying
            ? '<i class="fa-solid fa-pause"></i>'
            : '<i class="fa-solid fa-play"></i>'

        document.querySelectorAll('.artist-card, .album-card').forEach(card => {
            card.classList.toggle('playing', isPlaying && isCurrent(card))
        })
    }

    function updateLikeBtn() {
        const item = currentCard ? getItem(currentCard) : null
        const liked = !!item && likes.includes(item.audio)
        likeBtn.innerHTML = liked
            ? '<i class="fa-solid fa-heart"></i>'
            : '<i class="fa-regular fa-heart"></i>'
        likeBtn.classList.toggle('liked', liked)
    }

    function updateTotalTime() {
        if (Number.isFinite(player.duration)) {
            timeTotal.textContent = formatTime(player.duration)
        }
    }

    function updateTime() {
        if (!Number.isFinite(player.duration)) return
        progress.value = (player.currentTime / player.duration) * 100
        timeCurrent.textContent = formatTime(player.currentTime)
        updateTotalTime()
        paintRange(progress)
    }

    // ---------- Tocar, pular e voltar ----------
    function playCard(card) {
        const item = getItem(card)
        if (!item.audio) return

        if (currentCard) currentCard.classList.remove('playing')
        currentCard = card
        currentAudio = item.audio

        timeTotal.textContent = '0:00'
        timeCurrent.textContent = '0:00'
        progress.value = 0
        paintRange(progress)

        player.src = item.audio
        player.play().catch(err => console.error('Erro ao reproduzir a música:', err))

        playerImg.src = item.img
        playerImg.alt = item.name || item.title
        playerTitle.textContent = item.track || item.name || item.title
        playerArtist.textContent = item.artist || item.name
        playerBar.classList.add('active')

        document.title = `${playerTitle.textContent} • BOHEMIA`
        updateLikeBtn()
    }

    function handleCardClick(e) {
        const card = e.target.closest('.artist-card, .album-card')
        if (!card || !getItem(card).audio) return

        if (isCurrent(card)) {
            player.paused ? player.play() : player.pause()
            return
        }
        playCard(card)
    }

    function skip(direction) {
        const cards = [...document.querySelectorAll('.artist-card, .album-card')]
            .filter(card => card.offsetParent !== null && getItem(card).audio)
        if (!cards.length || !currentCard) return

        const i = cards.findIndex(isCurrent)
        if (i === -1) {
            // a música atual não está na tela: começa pela ponta da lista
            playCard(direction > 0 ? cards[0] : cards[cards.length - 1])
            return
        }
        playCard(cards[(i + direction + cards.length) % cards.length])
    }

    // ---------- Eventos ----------
    artistsGrid.addEventListener('click', handleCardClick)
    albumsGrid.addEventListener('click', handleCardClick)

    toggleBtn.addEventListener('click', () => {
        if (!player.src) return
        player.paused ? player.play() : player.pause()
    })

    nextBtn.addEventListener('click', () => skip(1))

    prevBtn.addEventListener('click', () => {
        if (!currentCard) return
        if (player.currentTime > 3) {
            player.currentTime = 0
        } else {
            skip(-1)
        }
    })

    likeBtn.addEventListener('click', () => {
        if (!currentCard) return
        const audio = getItem(currentCard).audio
        likes = likes.includes(audio)
            ? likes.filter(a => a !== audio)
            : [...likes, audio]
        localStorage.setItem('bohemia-likes', JSON.stringify(likes))
        updateLikeBtn()
        renderLiked()
    })

    player.addEventListener('play', syncUI)
    player.addEventListener('pause', syncUI)
    player.addEventListener('ended', () => {
        syncUI()
        skip(1)
    })

    player.addEventListener('loadedmetadata', updateTotalTime)
    player.addEventListener('durationchange', updateTotalTime)
    player.addEventListener('timeupdate', updateTime)

    progress.addEventListener('input', () => {
        if (!Number.isFinite(player.duration)) return
        player.currentTime = (progress.value / 100) * player.duration
        paintRange(progress)
    })

    volume.addEventListener('input', () => {
        player.volume = volume.value / 100
        paintRange(volume)
    })
    paintRange(volume)

    volumeIcon.addEventListener('click', () => {
        player.muted = !player.muted
        volumeIcon.className = player.muted
            ? 'fa-solid fa-volume-xmark'
            : 'fa-solid fa-volume-high'
    })

    document.addEventListener('keydown', (e) => {
        const tag = e.target.tagName
        if (e.code === 'Space' && tag !== 'INPUT' && tag !== 'BUTTON' && player.src) {
            e.preventDefault()
            player.paused ? player.play() : player.pause()
        }
    })

    // ---------- Aba de curtidos e playlists ----------
    let currentPlaylistId = null

    function renderTracks(grid, audios) {
        grid.innerHTML = ''
        const seen = new Set()

        const add = (data, type) => data.forEach((item, index) => {
            if (!audios.includes(item.audio) || seen.has(item.audio)) return
            seen.add(item.audio)
            grid.appendChild(createCard(item, index, type))
        })

        add(artistsData, 'artist')
        add(albumsData, 'album')
        return seen.size
    }

    function countLabel(n) {
        return `${n} ${n === 1 ? 'música' : 'músicas'}`
    }

    function renderLiked() {
        const count = renderTracks(likedGrid, likes)
        likedEmpty.classList.toggle('hidden', count > 0)
        likedCount.textContent = countLabel(count)
        syncUI()
        applySearch()
    }

    function renderPlaylistView() {
        const playlist = playlists.find(p => p.id === currentPlaylistId)
        if (!playlist) {
            showView('home')
            return
        }

        playlistTitle.textContent = playlist.name
        const count = renderTracks(playlistGrid, playlist.tracks)
        playlistEmpty.classList.toggle('hidden', count > 0)
        syncUI()
        applySearch()
    }

    function renderSidebarPlaylists() {
        userPlaylists.innerHTML = ''

        playlists.forEach(playlist => {
            const item = document.createElement('div')
            item.classList.add('nav-liked', 'playlist-item')
            item.classList.toggle('active', playlist.id === currentPlaylistId)

            const icon = document.createElement('i')
            icon.className = 'fa-solid fa-music'

            const box = document.createElement('div')
            const title = document.createElement('h5')
            title.textContent = playlist.name          // textContent: nome digitado nunca vira HTML
            const count = document.createElement('p')
            count.textContent = countLabel(playlist.tracks.length)

            box.append(title, count)
            item.append(icon, box)
            item.addEventListener('click', () => showView('playlist', playlist.id))
            userPlaylists.appendChild(item)
        })
    }

    function showView(view, playlistId = null) {
        currentPlaylistId = view === 'playlist' ? playlistId : null

        homeView.classList.toggle('hidden', view !== 'home')
        likedView.classList.toggle('hidden', view !== 'liked')
        playlistView.classList.toggle('hidden', view !== 'playlist')
        navLiked.classList.toggle('active', view === 'liked')

        renderSidebarPlaylists()
        if (view === 'liked') renderLiked()
        if (view === 'playlist') renderPlaylistView()

        document.querySelector('main').scrollTop = 0
        closeMenu()
    }

    // ---------- Busca ----------
    function applySearch() {
        const term = normalize(searchInput.value.trim())

        document.querySelectorAll('.artist-card, .album-card').forEach(card => {
            card.classList.toggle('hidden', !card.dataset.search.includes(term))
        })

        // na tela inicial, esconde o título das seções sem resultado
        const grids = [artistsGrid, albumsGrid]
        let anyVisible = false

        grids.forEach(grid => {
            const visible = grid.querySelectorAll('.artist-card:not(.hidden), .album-card:not(.hidden)').length
            const title = grid.previousElementSibling
            if (title) title.classList.toggle('hidden', visible === 0)
            if (visible > 0) anyVisible = true
        })

        searchEmpty.classList.toggle('hidden', anyVisible || term === '')
    }

    searchInput.addEventListener('input', applySearch)

    // ---------- Loop ----------
    loopBtn.addEventListener('click', () => {
        player.loop = !player.loop
        loopBtn.classList.toggle('active', player.loop)
    })

    // ---------- Criar playlist ----------
    function savePlaylists() {
        localStorage.setItem('bohemia-playlists', JSON.stringify(playlists))
    }

    function getAllTracks() {
        const seen = new Set()
        return artistsData.concat(albumsData).filter(item => {
            if (!item.audio || seen.has(item.audio)) return false
            seen.add(item.audio)
            return true
        })
    }

    function openPlaylistModal() {
        closeMenu()
        playlistName.value = ''
        playlistError.classList.add('hidden')
        playlistTracks.innerHTML = ''

        getAllTracks().forEach(item => {
            const label = document.createElement('label')
            label.classList.add('modal-track')

            const checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.value = item.audio

            const text = document.createElement('span')
            text.textContent = `${item.track || item.name || item.title} • ${item.artist || item.name}`

            label.append(checkbox, text)
            playlistTracks.appendChild(label)
        })

        playlistModal.classList.remove('hidden')
        playlistName.focus()
    }

    function closePlaylistModal() {
        playlistModal.classList.add('hidden')
    }

    function showPlaylistError(message) {
        playlistError.textContent = message
        playlistError.classList.remove('hidden')
    }

    function savePlaylist() {
        const name = playlistName.value.trim()
        const selected = [...playlistTracks.querySelectorAll('input:checked')].map(input => input.value)

        if (!name) return showPlaylistError('Dê um nome à playlist.')
        if (!selected.length) return showPlaylistError('Escolha pelo menos uma música.')

        const playlist = { id: Date.now().toString(), name, tracks: selected }
        playlists.push(playlist)
        savePlaylists()
        closePlaylistModal()
        showView('playlist', playlist.id)
    }

    playlistDelete.addEventListener('click', () => {
        const playlist = playlists.find(p => p.id === currentPlaylistId)
        if (!playlist) return
        if (!confirm(`Excluir a playlist "${playlist.name}"?`)) return

        playlists = playlists.filter(p => p.id !== playlist.id)
        savePlaylists()
        showView('home')
    })

    createPlaylistBtn.addEventListener('click', openPlaylistModal)
    playlistCancel.addEventListener('click', closePlaylistModal)
    playlistSave.addEventListener('click', savePlaylist)

    playlistName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') savePlaylist()
    })

    playlistModal.addEventListener('click', (e) => {
        if (e.target === playlistModal) closePlaylistModal()
    })

    // ---------- Menu no celular ----------
    function openMenu() {
        sidebar.classList.add('open')
        sidebarOverlay.classList.add('open')
    }

    function closeMenu() {
        sidebar.classList.remove('open')
        sidebarOverlay.classList.remove('open')
    }

    menuBtn.addEventListener('click', openMenu)
    sidebarOverlay.addEventListener('click', closeMenu)

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePlaylistModal()
            closeMenu()
        }
    })

    // ---------- Navegação e início ----------
    likedGrid.addEventListener('click', handleCardClick)
    playlistGrid.addEventListener('click', handleCardClick)
    navLiked.addEventListener('click', () => showView('liked'))
    navLogo.addEventListener('click', () => showView('home'))

    renderSidebarPlaylists()
    renderLiked()

})