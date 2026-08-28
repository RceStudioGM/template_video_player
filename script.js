/* =========================================================
   MEDIA DATABASE
========================================================= */


/*
    ========================================================
    TAMBAHKAN / GANTI MEDIA DI SINI
    ========================================================

    type hanya:
    "audio"
    atau
    "video"

    src:
    - File lokal:
      "assets/media/song-01.mp3"

    - Streaming/direct media URL:
      "https://example.com/song.mp3"

    cover:
    - Bisa menggunakan file lokal
    - Bisa menggunakan URL gambar

    duration bersifat opsional.
    Durasi asli akan diambil dari media
    setelah file dimuat.
*/

const mediaList = [

    {
        id: 1,

        title:
            "Cyber Night",

        artist:
            "NEONFLUX",

        type:
            "audio",

        src:
            "assets/media/song-01.mp3",

        cover:
            "assets/covers/cyber-night.jpg"

    },


    {
        id: 2,

        title:
            "Neon City",

        artist:
            "Future Echo",

        type:
            "audio",

        src:
            "assets/media/song-02.mp3",

        cover:
            "assets/covers/neon-city.jpg"

    },


    {
        id: 3,

        title:
            "Future World",

        artist:
            "Digital Motion",

        type:
            "video",

        src:
            "assets/media/video-01.mp4",

        cover:
            "assets/covers/future-world.jpg"

    },


    {
        id: 4,

        title:
            "Synthetic Dreams",

        artist:
            "Aether",

        type:
            "audio",

        src:
            "assets/media/song-03.mp3",

        cover:
            "assets/covers/synthetic-dreams.jpg"

    },


    {
        id: 5,

        title:
            "Night Drive",

        artist:
            "Velocity",

        type:
            "video",

        src:
            "assets/media/video-02.mp4",

        cover:
            "assets/covers/night-drive.jpg"

    }

];



/* =========================================================
   APPLICATION STATE
========================================================= */

let currentIndex = 0;

let currentFilter = "all";

let isShuffle = false;

let repeatMode = 0;
/*
    0 = off
    1 = repeat current
    2 = repeat all
*/

let isPlaying = false;



/* =========================================================
   DOM REFERENCES
========================================================= */

const videoPlayer =
    document.getElementById(
        "videoPlayer"
    );

const audioVisual =
    document.getElementById(
        "audioVisual"
    );

const visualizer =
    document.getElementById(
        "visualizer"
    );

const mainCover =
    document.getElementById(
        "mainCover"
    );

const miniCover =
    document.getElementById(
        "miniCover"
    );

const mainTitle =
    document.getElementById(
        "mainTitle"
    );

const mainArtist =
    document.getElementById(
        "mainArtist"
    );

const miniTitle =
    document.getElementById(
        "miniTitle"
    );

const miniArtist =
    document.getElementById(
        "miniArtist"
    );

const mediaTypeLabel =
    document.getElementById(
        "mediaTypeLabel"
    );

const mediaGrid =
    document.getElementById(
        "mediaGrid"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const playButton =
    document.getElementById(
        "playButton"
    );

const previousButton =
    document.getElementById(
        "previousButton"
    );

const nextButton =
    document.getElementById(
        "nextButton"
    );

const shuffleButton =
    document.getElementById(
        "shuffleButton"
    );

const repeatButton =
    document.getElementById(
        "repeatButton"
    );

const muteButton =
    document.getElementById(
        "muteButton"
    );

const volumeSlider =
    document.getElementById(
        "volumeSlider"
    );

const seekBar =
    document.getElementById(
        "seekBar"
    );

const currentTimeElement =
    document.getElementById(
        "currentTime"
    );

const durationElement =
    document.getElementById(
        "duration"
    );

const progressFill =
    document.getElementById(
        "progressFill"
    );

const progressContainer =
    document.getElementById(
        "progressContainer"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const favoriteButton =
    document.getElementById(
        "favoriteButton"
    );

const videoFullscreen =
    document.getElementById(
        "videoFullscreen"
    );



/* =========================================================
   HELPER
========================================================= */

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        Math.floor(
            seconds % 60
        )
            .toString()
            .padStart(
                2,
                "0"
            );


    return `${minutes}:${remainingSeconds}`;

}



/* =========================================================
   RENDER MEDIA
========================================================= */

function renderMedia() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    let filtered =
        mediaList.filter(
            item => {

                const matchesFilter =
                    currentFilter === "all" ||
                    currentFilter === "playlist" ||
                    item.type === currentFilter;


                const matchesSearch =
                    item.title
                        .toLowerCase()
                        .includes(
                            searchTerm
                        ) ||
                    item.artist
                        .toLowerCase()
                        .includes(
                            searchTerm
                        );


                return (
                    matchesFilter &&
                    matchesSearch
                );

            }
        );


    mediaGrid.innerHTML = "";


    emptyState.classList.toggle(
        "visible",
        filtered.length === 0
    );


    filtered.forEach(
        item => {

            const originalIndex =
                mediaList.findIndex(
                    media =>
                        media.id === item.id
                );


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "media-card";


            if (
                originalIndex ===
                currentIndex
            ) {

                card.classList.add(
                    "active"
                );

            }


            card.dataset.index =
                originalIndex;


            card.innerHTML = `

                <div class="card-cover">

                    <img
                        src="${escapeHTML(item.cover)}"
                        alt="${escapeHTML(item.title)}"
                        loading="lazy"
                    >

                    <span class="card-type">
                        ${item.type.toUpperCase()}
                    </span>

                    <button
                        class="card-play"
                        aria-label="Play ${escapeHTML(item.title)}"
                    >
                        ▶
                    </button>

                </div>


                <div class="card-info">

                    <h3 class="card-title">
                        ${escapeHTML(item.title)}
                    </h3>

                    <p class="card-artist">
                        ${escapeHTML(item.artist)}
                    </p>

                    <span class="card-duration">
                        ${item.type === "video" ? "VIDEO" : "AUDIO"}
                    </span>

                </div>

            `;


            card.addEventListener(
                "click",
                event => {

                    /*
                        Jangan biarkan tombol play
                        menjalankan aksi kedua kali.
                    */

                    if (
                        event.target
                            .closest(
                                ".card-play"
                            )
                    ) {
                        event.stopPropagation();
                    }


                    loadMedia(
                        originalIndex,
                        true
                    );

                }
            );


            mediaGrid.appendChild(
                card
            );

        }
    );

}



/* =========================================================
   ESCAPE HTML
   Agar data dari mediaList aman
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}



/* =========================================================
   LOAD MEDIA
========================================================= */

function loadMedia(
    index,
    autoplay = false
) {

    if (
        index < 0 ||
        index >= mediaList.length
    ) {
        return;
    }


    currentIndex =
        index;


    const media =
        mediaList[currentIndex];


    /*
        Tampilkan loading state
    */

    document
        .getElementById(
            "playerLoading"
        )
        .classList.add(
            "active"
        );


    /*
        Stop media sebelumnya
    */

    videoPlayer.pause();


    /*
        Reset source
    */

    videoPlayer.removeAttribute(
        "src"
    );

    videoPlayer.load();


    /*
        Update informasi
    */

    mainTitle.textContent =
        media.title;

    mainArtist.textContent =
        media.artist;

    miniTitle.textContent =
        media.title;

    miniArtist.textContent =
        media.artist;

    mainCover.src =
        media.cover;

    miniCover.src =
        media.cover;

    mediaTypeLabel.textContent =
        media.type.toUpperCase();


    /*
        VIDEO
    */

    if (
        media.type ===
        "video"
    ) {

        videoPlayer.style.display =
            "block";

        audioVisual.style.display =
            "none";

        videoFullscreen.style.display =
            "grid";

        videoPlayer.src =
            media.src;

        videoPlayer.controls =
            false;

    }


    /*
        AUDIO
    */

    else {

        videoPlayer.style.display =
            "none";

        audioVisual.style.display =
            "grid";

        videoFullscreen.style.display =
            "none";

        /*
            Menggunakan elemen video
            sebagai media engine.

            Browser tetap dapat memutar
            file audio melalui <video>.
        */

        videoPlayer.src =
            media.src;

    }


    videoPlayer.load();


    /*
        Favorite state
    */

    favoriteButton.classList.remove(
        "active"
    );

    favoriteButton.textContent =
        "♡";


    updateActiveCard();


    /*
        Autoplay setelah user
        benar-benar memilih media.
    */

    if (autoplay) {

        const playPromise =
            videoPlayer.play();


        if (
            playPromise !== undefined
        ) {

            playPromise
                .then(() => {

                    isPlaying =
                        true;

                    updatePlayButton();

                })
                .catch(() => {

                    isPlaying =
                        false;

                    updatePlayButton();

                });

        }

    }

}



/* =========================================================
   UPDATE ACTIVE CARD
========================================================= */

function updateActiveCard() {

    document
        .querySelectorAll(
            ".media-card"
        )
        .forEach(
            card => {

                card.classList.toggle(
                    "active",
                    Number(
                        card.dataset.index
                    ) ===
                    currentIndex
                );

            }
        );

}



/* =========================================================
   PLAY / PAUSE
========================================================= */

function togglePlay() {

    if (
        !videoPlayer.src
    ) {

        loadMedia(
            0,
            true
        );

        return;

    }


    if (
        videoPlayer.paused
    ) {

        const promise =
            videoPlayer.play();


        if (
            promise !== undefined
        ) {

            promise.catch(
                () => {}
            );

        }

    }

    else {

        videoPlayer.pause();

    }

}



/* =========================================================
   PLAY BUTTON UI
========================================================= */

function updatePlayButton() {

    playButton.textContent =
        isPlaying
            ? "❚❚"
            : "▶";


    if (isPlaying) {

        visualizer.classList.add(
            "active"
        );

        audioVisual.classList.add(
            "playing"
        );

    }

    else {

        visualizer.classList.remove(
            "active"
        );

        audioVisual.classList.remove(
            "playing"
        );

    }

}



/* =========================================================
   NEXT
========================================================= */

function playNext() {

    let nextIndex;


    if (isShuffle) {

        if (
            mediaList.length <= 1
        ) {

            nextIndex =
                currentIndex;

        }

        else {

            do {

                nextIndex =
                    Math.floor(
                        Math.random() *
                        mediaList.length
                    );

            }
            while (
                nextIndex ===
                currentIndex
            );

        }

    }

    else {

        nextIndex =
            currentIndex + 1;


        if (
            nextIndex >=
            mediaList.length
        ) {

            nextIndex = 0;

        }

    }


    loadMedia(
        nextIndex,
        true
    );

}



/* =========================================================
   PREVIOUS
========================================================= */

function playPrevious() {

    let previousIndex =
        currentIndex - 1;


    if (
        previousIndex < 0
    ) {

        previousIndex =
            mediaList.length - 1;

    }


    loadMedia(
        previousIndex,
        true
    );

}



/* =========================================================
   MEDIA EVENTS
========================================================= */

videoPlayer.addEventListener(
    "play",
    () => {

        isPlaying =
            true;

        updatePlayButton();

    }
);


videoPlayer.addEventListener(
    "pause",
    () => {

        isPlaying =
            false;

        updatePlayButton();

    }
);


videoPlayer.addEventListener(
    "ended",
    () => {

        isPlaying =
            false;

        updatePlayButton();


        /*
            REPEAT CURRENT
        */

        if (
            repeatMode === 1
        ) {

            videoPlayer.currentTime =
                0;

            videoPlayer.play();

            return;

        }


        /*
            REPEAT ALL atau NORMAL
        */

        playNext();

    }
);


videoPlayer.addEventListener(
    "loadedmetadata",
    () => {

        durationElement.textContent =
            formatTime(
                videoPlayer.duration
            );


        document
            .getElementById(
                "playerLoading"
            )
            .classList.remove(
                "active"
            );

    }
);


videoPlayer.addEventListener(
    "waiting",
    () => {

        document
            .getElementById(
                "playerLoading"
            )
            .classList.add(
                "active"
            );

    }
);


videoPlayer.addEventListener(
    "canplay",
    () => {

        document
            .getElementById(
                "playerLoading"
            )
            .classList.remove(
                "active"
            );

    }
);


videoPlayer.addEventListener(
    "timeupdate",
    () => {

        if (
            !Number.isFinite(
                videoPlayer.duration
            )
        ) {
            return;
        }


        const progress =
            (
                videoPlayer.currentTime /
                videoPlayer.duration
            ) * 100;


        seekBar.value =
            progress;


        progressFill.style.width =
            `${progress}%`;


        currentTimeElement.textContent =
            formatTime(
                videoPlayer.currentTime
            );

    }
);



/* =========================================================
   SEEK BAR
========================================================= */

seekBar.addEventListener(
    "input",
    () => {

        if (
            !Number.isFinite(
                videoPlayer.duration
            )
        ) {
            return;
        }


        const percentage =
            Number(
                seekBar.value
            );


        videoPlayer.currentTime =
            (
                percentage / 100
            ) *
            videoPlayer.duration;

    }
);



/* =========================================================
   CLICK PROGRESS BAR
========================================================= */

progressContainer.addEventListener(
    "click",
    event => {

        if (
            !Number.isFinite(
                videoPlayer.duration
            )
        ) {
            return;
        }


        const rect =
            progressContainer
                .getBoundingClientRect();


        const position =
            (
                event.clientX -
                rect.left
            ) /
            rect.width;


        videoPlayer.currentTime =
            position *
            videoPlayer.duration;

    }
);



/* =========================================================
   VOLUME
========================================================= */

volumeSlider.addEventListener(
    "input",
    () => {

        videoPlayer.volume =
            Number(
                volumeSlider.value
            );


        videoPlayer.muted =
            videoPlayer.volume === 0;


        updateMuteIcon();

    }
);



/* =========================================================
   MUTE
========================================================= */

muteButton.addEventListener(
    "click",
    () => {

        videoPlayer.muted =
            !videoPlayer.muted;


        updateMuteIcon();

    }
);


function updateMuteIcon() {

    if (
        videoPlayer.muted ||
        videoPlayer.volume === 0
    ) {

        muteButton.textContent =
            "🔇";

    }

    else if (
        videoPlayer.volume < 0.5
    ) {

        muteButton.textContent =
            "🔉";

    }

    else {

        muteButton.textContent =
            "🔊";

    }

}



/* =========================================================
   SHUFFLE
========================================================= */

shuffleButton.addEventListener(
    "click",
    () => {

        isShuffle =
            !isShuffle;


        shuffleButton.classList.toggle(
            "active",
            isShuffle
        );

    }
);



/* =========================================================
   REPEAT
========================================================= */

repeatButton.addEventListener(
    "click",
    () => {

        repeatMode++;


        if (
            repeatMode > 2
        ) {

            repeatMode = 0;

        }


        repeatButton.classList.toggle(
            "active",
            repeatMode !== 0
        );


        /*
            Visual feedback:
            0 = ↻
            1 = ↻1
            2 = ↻∞
        */

        if (
            repeatMode === 1
        ) {

            repeatButton.textContent =
                "↻1";

        }

        else if (
            repeatMode === 2
        ) {

            repeatButton.textContent =
                "↻∞";

        }

        else {

            repeatButton.textContent =
                "↻";

        }

    }
);



/* =========================================================
   FAVORITE
========================================================= */

favoriteButton.addEventListener(
    "click",
    () => {

        const active =
            favoriteButton.classList.toggle(
                "active"
            );


        favoriteButton.textContent =
            active
                ? "♥"
                : "♡";

    }
);



/* =========================================================
   FULLSCREEN
========================================================= */

videoFullscreen.addEventListener(
    "click",
    async () => {

        try {

            if (
                document.fullscreenElement
            ) {

                await document.exitFullscreen();

            }

            else {

                await videoPlayer.requestFullscreen();

            }

        }

        catch (error) {

            console.error(
                "Fullscreen failed:",
                error
            );

        }

    }
);



/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
    "input",
    () => {

        renderMedia();

    }
);



/* =========================================================
   FILTER
========================================================= */

function activateFilter(
    filter
) {

    currentFilter =
        filter;


    /*
        Update semua button filter
    */

    document
        .querySelectorAll(
            "[data-filter]"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.filter ===
                    filter
                );

            }
        );


    renderMedia();

}


document
    .querySelectorAll(
        "[data-filter]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    activateFilter(
                        button.dataset.filter
                    );

                }
            );

        }
    );



/* =========================================================
   GRID / LIST VIEW
========================================================= */

document
    .querySelectorAll(
        ".view-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".view-button"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    mediaGrid.classList.toggle(
                        "list-view",
                        button.dataset.view ===
                        "list"
                    );

                }
            );

        }
    );



/* =========================================================
   MOBILE SIDEBAR
========================================================= */

const sidebar =
    document.getElementById(
        "sidebar"
    );

const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );

const sidebarClose =
    document.getElementById(
        "sidebarClose"
    );

const sidebarOverlay =
    document.getElementById(
        "sidebarOverlay"
    );


function closeSidebar() {

    sidebar.classList.remove(
        "open"
    );

    sidebarOverlay.classList.remove(
        "active"
    );

}


mobileMenu.addEventListener(
    "click",
    () => {

        sidebar.classList.add(
            "open"
        );

        sidebarOverlay.classList.add(
            "active"
        );

    }
);


sidebarClose.addEventListener(
    "click",
    closeSidebar
);


sidebarOverlay.addEventListener(
    "click",
    closeSidebar
);



/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
            Jangan mengganggu ketika user
            sedang mengetik di search.
        */

        if (
            event.target.matches(
                "input"
            )
        ) {

            return;

        }


        switch (
            event.code
        ) {

            case "Space":

                event.preventDefault();

                togglePlay();

                break;


            case "ArrowRight":

                if (
                    videoPlayer.duration
                ) {

                    videoPlayer.currentTime +=
                        5;

                }

                break;


            case "ArrowLeft":

                if (
                    videoPlayer.duration
                ) {

                    videoPlayer.currentTime -=
                        5;

                }

                break;


            case "ArrowUp":

                videoPlayer.volume =
                    Math.min(
                        1,
                        videoPlayer.volume + .05
                    );

                volumeSlider.value =
                    videoPlayer.volume;

                updateMuteIcon();

                break;


            case "ArrowDown":

                videoPlayer.volume =
                    Math.max(
                        0,
                        videoPlayer.volume - .05
                    );

                volumeSlider.value =
                    videoPlayer.volume;

                updateMuteIcon();

                break;

        }

    }
);



/* =========================================================
   BUTTON EVENTS
========================================================= */

playButton.addEventListener(
    "click",
    togglePlay
);

nextButton.addEventListener(
    "click",
    playNext
);

previousButton.addEventListener(
    "click",
    playPrevious
);



/* =========================================================
   INITIALIZATION
========================================================= */

videoPlayer.volume =
    1;


volumeSlider.value =
    1;


if (
    mediaList.length > 0
) {

    loadMedia(
        0,
        false
    );

}


renderMedia();

updateMuteIcon();
