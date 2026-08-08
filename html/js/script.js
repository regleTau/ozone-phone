$(function () {
    var phoneOpen = false;
    var callTimerInterval = null;
    var callSeconds = 0;
    var isFaceIDScanning = false;
    var isAirplaneMode = false;
    var phoneVolume = 0.8;
    var userSimNumber = "0722-149-802";
    var userPlayerId = 1;
    var userName = "Jucător FiveM";
    var installedApps = {
        youtube: true,
        spotify: true
    };
    var isMusicPlaying = false;
    var activeMusicSource = "spotify"; // "spotify" or "youtube"
    var currentSpotifyTrackIndex = 0;
    var activeTrackTitle = "piesa";
    var activeTrackArtist = "artist";

    // Animated Multilingual Apple Hello Text Switcher
    var helloWords = ["Hello", "Bună", "Bonjour", "Hola", "Ciao", "Salut"];
    var helloIndex = 0;
    setInterval(function () {
        if ($('#setup-step-1').hasClass('active-step')) {
            helloIndex = (helloIndex + 1) % helloWords.length;
            $('#hello-text-dynamic').css('opacity', '0');
            setTimeout(function () {
                $('#hello-text-dynamic').text(helloWords[helloIndex]).css('opacity', '1');
            }, 250);
        }
    }, 2200);

    // Show Authentic iOS 16 System Alert Overlay
    function showComingSoonModal(appName, appTitle, iconClass, desc) {
        $('#cs-app-title').text(appTitle || "Aplicație în Lucru");
        $('#cs-app-icon').removeClass('icon-yt icon-spotify icon-camera').addClass('icon-' + appName).html('<i class="bi ' + (iconClass || 'bi-tools') + '"></i>');
        if (desc) {
            $('#cs-app-desc').text(desc);
        } else {
            $('#cs-app-desc').text('Aplicația ' + (appTitle || '') + ' este în curs de dezvoltare activă pe OZONE OS.');
        }
        $('#coming-soon-modal').addClass('active-cs-modal');
    }

    function closeComingSoonModal() {
        $('#coming-soon-modal').removeClass('active-cs-modal');
    }

    $(document).on('click', '#btn-close-cs-modal', function () {
        closeComingSoonModal();
        $('.app-screen').removeClass('active-screen');
        $('#home-screen').addClass('active-screen');
    });

    // Curated High Quality Live Search Database for YouTube & Spotify
    var youtubeDatabase = {
        "default": [
            { id: "5qap5aO4i9A", title: "Lofi Hip Hop Radio - Beats to Relax", channel: "Lofi Girl", duration: "LIVE", views: "1.4M" },
            { id: "dQw4w9WgXcQ", title: "Rick Astley - Never Gonna Give You Up", channel: "Rick Astley", duration: "3:32", views: "1.4B" },
            { id: "1La4QyGeaaQ", title: "GTA V Official Gameplay Trailer", channel: "Rockstar Games", duration: "4:50", views: "45M" },
            { id: "fJ9rUzIMcZQ", title: "Queen - Bohemian Rhapsody (Official Video)", channel: "Queen Official", duration: "5:59", views: "1.6B" },
            { id: "hT_nvWreIhg", title: "OneRepublic - Counting Stars", channel: "OneRepublic", duration: "4:17", views: "3.8B" }
        ],
        "manele": [
            { id: "kJQP7kiw5Fk", title: "Dani Mocanu - Amavut Si Eu O Vreme", channel: "Dani Mocanu", duration: "4:10", views: "65M" },
            { id: "RgKAFK5djSk", title: "Florin Salam - Saint Tropez (Official Video)", channel: "Florin Salam", duration: "3:45", views: "85M" },
            { id: "L_jWHffIx5E", title: "Tzanca Uraganu - Havana (Official Video)", channel: "Tzanca Uraganu", duration: "3:20", views: "42M" }
        ],
        "trap": [
            { id: "3tmd-ClpJxA", title: "Travis Scott - SICKO MODE ft. Drake", channel: "Travis Scott", duration: "5:12", views: "1.1B" },
            { id: "09R8_2nJtjg", title: "Ian x Azteca - Bag un Spliff (Official)", channel: "OCB Music", duration: "3:15", views: "18M" },
            { id: "Y5qKNlc89e0", title: "NANE - Business Class ft. Amuly", channel: "NANE Official", duration: "3:40", views: "24M" }
        ],
        "fifty_cent": [
            { id: "5qm8PH4skOy", title: "50 Cent - In Da Club (Official Music Video)", channel: "50 Cent", duration: "3:48", views: "1.8B" },
            { id: "SRcnnId15LA", title: "50 Cent - Candy Shop ft. Olivia", channel: "50 Cent", duration: "3:26", views: "1.2B" },
            { id: "YvkX5N0z6dM", title: "50 Cent - Just A Lil Bit (Official)", channel: "50 Cent", duration: "3:58", views: "650M" }
        ],
        "gaming": [
            { id: "1La4QyGeaaQ", title: "GTA 5 Roleplay - Server Overview", channel: "OZONE RP", duration: "10:15", views: "120K" },
            { id: "qL7ZR_p36yE", title: "GTA VI Official Trailer 1", channel: "Rockstar Games", duration: "1:31", views: "190M" }
        ],
        "lofi": [
            { id: "5qap5aO4i9A", title: "Lofi Hip Hop Radio - Beats to Study / Relax", channel: "Lofi Girl", duration: "LIVE", views: "1.4M" },
            { id: "DWcJFNfaw9c", title: "Chillhop Radio - Jazzy & Lofi Hip Hop", channel: "Chillhop Music", duration: "LIVE", views: "800K" }
        ]
    };

    var spotifyDatabase = [
        { id: "5qm8PH4skOy", title: "In Da Club", artist: "50 Cent", album: "Get Rich or Die Tryin'", duration: "3:48" },
        { id: "RgKAFK5djSk", title: "Saint Tropez", artist: "Florin Salam", album: "Hit-uri Românești", duration: "3:45" },
        { id: "3tmd-ClpJxA", title: "SICKO MODE", artist: "Travis Scott", album: "ASTROWORLD", duration: "5:12" },
        { id: "dQw4w9WgXcQ", title: "Never Gonna Give You Up", artist: "Rick Astley", album: "Whenever You Need", duration: "3:32" },
        { id: "5qap5aO4i9A", title: "Lofi Chill Beats", artist: "Lofi Girl", album: "Study & Chill", duration: "LIVE" }
    ];

    var savedPhotos = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400"
    ];

    var audioCtx = null;
    var ringtoneInterval = null;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playDialBeep() {
        if (!audioCtx || phoneVolume <= 0) return;
        try {
            var osc = audioCtx.createOscillator();
            var gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(425, audioCtx.currentTime);
            gain.gain.setValueAtTime(phoneVolume * 0.15, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 1.2);
        } catch (e) {}
    }

    function playRingtoneNote(freq, time, duration) {
        if (!audioCtx || phoneVolume <= 0) return;
        try {
            var osc = audioCtx.createOscillator();
            var gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, time);
            gain.gain.setValueAtTime(phoneVolume * 0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(time);
            osc.stop(time + duration);
        } catch (e) {}
    }

    function startRingtone() {
        stopRingtone();
        initAudio();
        ringtoneInterval = setInterval(function () {
            if (!audioCtx) return;
            var now = audioCtx.currentTime;
            playRingtoneNote(523.25, now, 0.15);
            playRingtoneNote(659.25, now + 0.18, 0.15);
            playRingtoneNote(783.99, now + 0.36, 0.15);
            playRingtoneNote(1046.50, now + 0.54, 0.25);
        }, 2200);
    }

    function startOutgoingBeep() {
        stopRingtone();
        initAudio();
        playDialBeep();
        ringtoneInterval = setInterval(function () {
            playDialBeep();
        }, 3000);
    }

    function stopRingtone() {
        if (ringtoneInterval) {
            clearInterval(ringtoneInterval);
            ringtoneInterval = null;
        }
    }

    function renderPhotosGrid() {
        var html = "";
        savedPhotos.forEach(function (url, index) {
            html += '<div class="photo-thumb" data-url="' + url + '">';
            html += '  <img src="' + url + '" alt="Photo ' + (index + 1) + '">';
            html += '</div>';
        });
        $('#photos-grid').html(html);
        if (savedPhotos.length > 0) {
            $('#cam-thumb-preview').html('<img src="' + savedPhotos[savedPhotos.length - 1] + '">');
        }
    }

    // Render YouTube Search Feed Cards
    function renderYouTubeFeed(items) {
        var html = "";
        items.forEach(function (item) {
            var thumbUrl = "https://i.ytimg.com/vi/" + item.id + "/hqdefault.jpg";
            html += '<div class="yt-feed-card" data-ytid="' + item.id + '" data-title="' + item.title + '" data-channel="' + item.channel + '">';
            html += '  <div class="yt-card-thumb">';
            html += '    <img src="' + thumbUrl + '" alt="Thumbnail">';
            html += '    <span class="yt-duration-tag">' + (item.duration || "4:00") + '</span>';
            html += '  </div>';
            html += '  <div class="yt-card-details">';
            html += '    <div class="yt-user-avatar-mini"><i class="bi bi-play-circle-fill"></i></div>';
            html += '    <div class="yt-card-text">';
            html += '      <h4>' + item.title + '</h4>';
            html += '      <p>' + item.channel + ' • ' + (item.views || "1M") + ' vizionări</p>';
            html += '    </div>';
            html += '  </div>';
            html += '</div>';
        });
        $('#yt-video-feed-list').html(html);
    }

    // Render Spotify Track List
    function renderSpotifyList(tracks) {
        var html = "";
        tracks.forEach(function (t, index) {
            var thumbUrl = "https://i.ytimg.com/vi/" + t.id + "/hqdefault.jpg";
            html += '<div class="spotify-track-item" data-index="' + index + '" data-ytid="' + t.id + '" data-title="' + t.title + '" data-artist="' + t.artist + '">';
            html += '  <div class="spot-item-cover"><img src="' + thumbUrl + '" alt="Cover"></div>';
            html += '  <div class="spot-item-meta">';
            html += '    <h4>' + t.title + '</h4>';
            html += '    <p>' + t.artist + ' • ' + t.album + '</p>';
            html += '  </div>';
            html += '  <i class="bi bi-play-circle-fill spot-btn-play-item"></i>';
            html += '</div>';
        });
        $('#spotify-songs-grid').html(html);
    }

    // Trigger Realistic Face ID Scan Animation
    function triggerFaceIDScan(onSuccess) {
        if (isFaceIDScanning) return;
        isFaceIDScanning = true;

        var pill = $('.face-id-pill');
        pill.html('<i class="bi bi-arrow-repeat spin-icon"></i> Face ID: Scanați...').css({'color': '#ffca28', 'border-color': 'rgba(255, 202, 40, 0.5)'});
        $('#phone-wallpaper-bg').css('opacity', '0.15');

        setTimeout(function () {
            pill.html('<i class="bi bi-check-circle-fill"></i> Face ID Confirmat').css({'color': '#34c759', 'border-color': 'rgba(52, 199, 89, 0.5)'});
            $('#phone-wallpaper-bg').css('opacity', '1');

            setTimeout(function () {
                isFaceIDScanning = false;
                $('.app-screen').removeClass('active-screen');
                $('#home-screen').addClass('active-screen');
                pill.html('<i class="bi bi-shield-lock-fill"></i> OZONE ID').css('color', '#34c759');
                if (onSuccess) onSuccess();
            }, 400);
        }, 600);
    }

    function openCameraApp() {
        $('.app-screen').removeClass('active-screen');
        $('#app-camera').addClass('active-screen');
        $('body, html, #iphone-wrapper, .iphone-frame, .iphone-screen, .screen-body').addClass('is-camera-open camera-mode-on');
        $('.iphone-frame').addClass('camera-active-frame');
        $('#phone-wallpaper-bg, #brightness-filter').hide();
        $.post('https://phone/openCamera', JSON.stringify({}));
    }

    function closeCameraApp() {
        $('body, html, #iphone-wrapper, .iphone-frame, .iphone-screen, .screen-body').removeClass('is-camera-open camera-mode-on');
        $('.iphone-frame').removeClass('camera-active-frame');
        $('#phone-wallpaper-bg').show().css('opacity', '1');
        $.post('https://phone/closeCamera', JSON.stringify({}));
    }

    // Authentic Apple iPhone Boot Sequence Animation
    var isPhoneBooted = false;

    function triggerAppleBootSequence(callback) {
        $('#boot-screen').addClass('active-boot').css('opacity', '1');
        $('#boot-progress-bar').css('width', '0%');
        
        var progress = 0;
        var bootInterval = setInterval(function () {
            progress += Math.floor(Math.random() * 15) + 12;
            if (progress >= 100) {
                progress = 100;
                $('#boot-progress-bar').css('width', '100%');
                clearInterval(bootInterval);
                
                setTimeout(function () {
                    $('#boot-screen').css('opacity', '0');
                    setTimeout(function () {
                        $('#boot-screen').removeClass('active-boot');
                        isPhoneBooted = true;
                        if (callback) callback();
                    }, 400);
                }, 250);
            } else {
                $('#boot-progress-bar').css('width', progress + '%');
            }
        }, 110);
    }

    // Reset Phone UI to clean state
    function resetPhoneUI() {
        $('#control-center').removeClass('active-cc-screen');
        $('#photo-viewer-modal').removeClass('active-modal');
        $('#yt-account-drawer').removeClass('active-account-drawer').hide();
        closeComingSoonModal();
        closeCameraApp();
        
        var setupDone = localStorage.getItem("iphone_setup_done");
        if (!setupDone || setupDone !== "true") {
            $('.app-screen').removeClass('active-screen');
            $('#setup-wizard').addClass('active-screen');
            $('.setup-step').removeClass('active-step');
            $('#setup-step-1').addClass('active-step');
        } else {
            $('.app-screen').removeClass('active-screen');
            $('#home-screen').addClass('active-screen');
        }
    }

    // Set Wallpaper theme
    function setWallpaper(theme) {
        $('#phone-wallpaper-bg').removeClass('wp-purple wp-cyber wp-sunset').addClass('wp-' + theme);
        localStorage.setItem("iphone_wp_theme", theme);
    }

    var savedWp = localStorage.getItem("iphone_wp_theme") || "purple";
    setWallpaper(savedWp);
    renderPhotosGrid();
    renderYouTubeFeed(youtubeDatabase["default"]);
    renderSpotifyList(spotifyDatabase);

    function startCallTimer() {
        stopRingtone();
        clearInterval(callTimerInterval);
        callSeconds = 0;
        $('#call-timer-box').show().text("00:00");
        callTimerInterval = setInterval(function () {
            callSeconds++;
            var mins = mathPad(Math.floor(callSeconds / 60));
            var secs = mathPad(callSeconds % 60);
            var formatted = mins + ":" + secs;
            $('#call-timer-box').text(formatted);
            $('#island-text').text("Apel " + formatted);
        }, 1000);
    }

    function stopCallTimer() {
        stopRingtone();
        clearInterval(callTimerInterval);
        callTimerInterval = null;
        callSeconds = 0;
        $('#call-timer-box').hide();
    }

    function mathPad(val) {
        return val < 10 ? "0" + val : val;
    }

    // Listen for NUI messages from FiveM client
    window.addEventListener('message', function (event) {
        var data = event.data;

        if (data.action === "openPhone") {
            phoneOpen = true;
            $('#iphone-wrapper').addClass('open');
            if (!isPhoneBooted) {
                triggerAppleBootSequence(function () {
                    resetPhoneUI();
                });
            } else {
                resetPhoneUI();
            }
        } else if (data.action === "closePhone") {
            phoneOpen = false;
            stopRingtone();
            closeCameraApp();
            closeComingSoonModal();
            $('#iphone-wrapper').removeClass('open');
        } else if (data.action === "togglePhone") {
            phoneOpen = !phoneOpen;
            if (phoneOpen) {
                $('#iphone-wrapper').addClass('open');
                if (!isPhoneBooted) {
                    triggerAppleBootSequence(function () {
                        resetPhoneUI();
                    });
                } else {
                    resetPhoneUI();
                }
            } else {
                phoneOpen = false;
                stopRingtone();
                closeCameraApp();
                closeComingSoonModal();
                $('#iphone-wrapper').removeClass('open');
            }
        }

        // Clock Update
        if (data.action === "updateClock" || data.time !== undefined) {
            $('#phone-clock').text(data.time);
            $('#lock-time').text(data.time);
        }

        // SIM & User Data
        if (data.action === "updateData") {
            if (data.phoneNumber) {
                userSimNumber = data.phoneNumber;
                $('#lock-sim-num, #setup-sim-num, #my-phone-sim-num, #settings-sim-num, #yt-account-sim').text(userSimNumber);
            }
            if (data.userId) {
                userPlayerId = data.userId;
                $('#setup-user-id').text(userPlayerId);
                $('#yt-account-handle').text("@id_" + userPlayerId);
            }
            if (data.name) {
                userName = data.name;
                $('#settings-user-name, #yt-account-name').text(userName);
            }
            if (data.bank !== undefined) {
                var bVal = parseFloat(data.bank) || 0;
                $('#bank-app-balance').text("$" + bVal.toLocaleString('en-US'));
            }
            if (data.cash !== undefined) {
                var cVal = parseFloat(data.cash) || 0;
                $('#bank-app-cash').text("Cash: $" + cVal.toLocaleString('en-US'));
            }
        }

        // Vehicles List
        if (data.vehicles !== undefined && Array.isArray(data.vehicles)) {
            var html = "";
            if (data.vehicles.length === 0) {
                html = '<div style="text-align:center; padding:20px; color:rgba(255,255,255,0.6)">Nu deții niciun vehicul.</div>';
            } else {
                data.vehicles.forEach(function (v) {
                    html += '<div class="vehicle-card">';
                    html += '  <div class="veh-icon"><i class="bi bi-car-front-fill"></i></div>';
                    html += '  <div class="veh-info">';
                    html += '    <h4>' + (v.model || "Vehicul") + '</h4>';
                    html += '    <span>Număr: ' + (v.plate || "LS 000") + '</span>';
                    html += '  </div>';
                    html += '  <button class="btn-gps-veh" data-plate="' + (v.plate || "") + '">GPS</button>';
                    html += '</div>';
                });
            }
            $('#vehicle-list').html(html);
        }

        // Call System Events
        if (data.action === "incomingCall") {
            if (isAirplaneMode) {
                return;
            }
            startRingtone();
            $('#caller-name').text(data.callerName || ("ID: " + data.callerId));
            if (data.callerSIM) {
                $('#caller-sim-sub').text("Cartelă: " + data.callerSIM);
            }
            $('#call-status-label').text("Se primeste apel...");
            $('#btn-accept-call').show();
            $('#btn-reject-call').show();
            $('#btn-hangup-call').hide();
            $('#call-screen').addClass('active-call-screen');
            $('#dynamic-island-bar').addClass('island-expanded');
            $('#island-text').text("Apel Primit");
        } else if (data.action === "callOutgoing") {
            startOutgoingBeep();
            $('#caller-name').text("Suna: " + data.targetId);
            $('#call-status-label').text("Se apelează...");
            $('#btn-accept-call').hide();
            $('#btn-reject-call').hide();
            $('#btn-hangup-call').show();
            $('#call-screen').addClass('active-call-screen');
            $('#dynamic-island-bar').addClass('island-expanded');
            $('#island-text').text("Se apelează...");
        } else if (data.action === "callConnected") {
            stopRingtone();
            $('#call-status-label').text("În convorbire");
            $('#btn-accept-call').hide();
            $('#btn-reject-call').hide();
            $('#btn-hangup-call').show();
            startCallTimer();
        } else if (data.action === "callEnded") {
            stopCallTimer();
            $('#call-status-label').text(data.reason || "Apel Încheiat");
            setTimeout(function () {
                $('#call-screen').removeClass('active-call-screen');
                $('#dynamic-island-bar').removeClass('island-expanded');
            }, 1200);
        }
    });

    // ------------------------------------------------------------
    // DYNAMIC ISLAND & MEDIA CONTROLLER ENGINE (iOS 16)
    // ------------------------------------------------------------
    function updateLiveDynamicIslandPlayer(ytid, title, artist) {
        activeTrackTitle = title || "Muzică";
        activeTrackArtist = artist || "Player Live";
        isMusicPlaying = true;

        var thumbUrl = "https://i.ytimg.com/vi/" + ytid + "/hqdefault.jpg";
        
        // Update Top Status Bar Dynamic Island Pill
        $('#dynamic-island-bar').addClass('island-music-active');
        $('#island-music-disc, #island-eq-animation').show();
        $('#island-text').text(activeTrackTitle);

        // Update Dynamic Island Floating Mini Player Overlay
        $('#island-mini-cover').attr('src', thumbUrl);
        $('#island-mini-title').text(activeTrackTitle);
        $('#island-mini-artist').text(activeTrackArtist);
        $('#island-play-icon').removeClass('bi-play-fill').addClass('bi-pause-fill');

        // Update Control Center Media Card
        $('#cc-song-title').text(activeTrackTitle);
        $('#cc-song-sub').text(activeTrackArtist);
        $('#cc-play-pause-btn').removeClass('bi-play-fill').addClass('bi-pause-fill');
    }

    function toggleGlobalPlayPause() {
        isMusicPlaying = !isMusicPlaying;

        if (isMusicPlaying) {
            $('#island-play-icon, #spot-main-play-icon, #cc-play-pause-btn').removeClass('bi-play-fill').addClass('bi-pause-fill');
            $('.spot-spin').css('animation-play-state', 'running');
            $('#island-eq-animation').show();

            if (activeMusicSource === "spotify") {
                var track = spotifyDatabase[currentSpotifyTrackIndex];
                if (track) {
                    var streamUrl = "https://www.youtube-nocookie.com/embed/" + track.id + "?autoplay=1&enablejsapi=1";
                    $('#spotify-hidden-audio-iframe').attr('src', streamUrl);
                }
            }
        } else {
            $('#island-play-icon, #spot-main-play-icon, #cc-play-pause-btn').removeClass('bi-pause-fill').addClass('bi-play-fill');
            $('.spot-spin').css('animation-play-state', 'paused');
            $('#island-eq-animation').hide();

            $('#spotify-hidden-audio-iframe').attr('src', '');
            $('#yt-iframe-player').attr('src', '');
        }
    }

    // Dynamic Island Notch Click Handler -> Toggles Expanded Mini Player
    $(document).on('click', '#dynamic-island-bar', function (e) {
        e.stopPropagation();
        $('#island-mini-player-drawer').toggleClass('island-expanded-player');
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('#dynamic-island-bar, #island-mini-player-drawer').length) {
            $('#island-mini-player-drawer').removeClass('island-expanded-player');
        }
    });

    // Control Buttons across Dynamic Island, Control Center, & Apps
    $(document).on('click', '#island-btn-play-pause, #cc-play-pause-btn', function (e) {
        e.stopPropagation();
        toggleGlobalPlayPause();
    });

    $(document).on('click', '#island-btn-next, #cc-btn-next', function (e) {
        e.stopPropagation();
        currentSpotifyTrackIndex = (currentSpotifyTrackIndex + 1) % spotifyDatabase.length;
        var track = spotifyDatabase[currentSpotifyTrackIndex];
        playSpotifyTrack(track.id, track.title, track.artist, track.duration);
    });

    $(document).on('click', '#island-btn-prev, #cc-btn-prev', function (e) {
        e.stopPropagation();
        currentSpotifyTrackIndex = (currentSpotifyTrackIndex - 1 + spotifyDatabase.length) % spotifyDatabase.length;
        var track = spotifyDatabase[currentSpotifyTrackIndex];
        playSpotifyTrack(track.id, track.title, track.artist, track.duration);
    });

    // ------------------------------------------------------------
    // REAL YOUTUBE LIVE SEARCH ENGINE (NO-COOKIE EMBED ENGINE)
    // ------------------------------------------------------------
    function playYouTubeVideo(ytid, title, channel) {
        if (!ytid) return;
        activeMusicSource = "youtube";
        var embedUrl = "https://www.youtube-nocookie.com/embed/" + ytid + "?autoplay=1&enablejsapi=1";
        $('#yt-iframe-player').attr('src', embedUrl);
        $('#yt-now-title').text(title || 'Videoclip YouTube');
        $('#yt-now-channel').text(channel || 'Canal YouTube');
        
        updateLiveDynamicIslandPlayer(ytid, title, channel || "YouTube Video");
        $('#app-youtube .app-content').animate({ scrollTop: 0 }, 'fast');
    }

    // PURE SPOTIFY MUSIC PLAYER LOGIC (PURE ALBUM ART + HIDDEN BACKGROUND AUDIO)
    function playSpotifyTrack(ytid, title, artist, duration) {
        if (!ytid) return;
        activeMusicSource = "spotify";
        var thumbUrl = "https://i.ytimg.com/vi/" + ytid + "/hqdefault.jpg";
        $('#spotify-current-cover').attr('src', thumbUrl);
        $('#spotify-now-title').text(title || 'Melodie Spotify');
        $('#spotify-now-artist').text((artist || 'Spotify Artist') + ' • Single');
        $('#spot-total-time').text(duration || '3:45');
        $('#spot-main-play-icon').removeClass('bi-play-fill').addClass('bi-pause-fill');
        $('.spot-spin').css('animation-play-state', 'running');

        updateLiveDynamicIslandPlayer(ytid, title, artist || "Spotify Music");

        // Streams background audio invisibly via hidden iframe
        var streamUrl = "https://www.youtube-nocookie.com/embed/" + ytid + "?autoplay=1&enablejsapi=1";
        $('#spotify-hidden-audio-iframe').attr('src', streamUrl);
    }

    function searchYouTubeQuery(query) {
        if (!query) return;
        var qLower = query.toLowerCase().trim();

        if (query.includes('v=')) {
            var vid = query.split('v=')[1].split('&')[0];
            playYouTubeVideo(vid, 'Videoclip Căutat', 'YouTube');
            return;
        } else if (query.includes('youtu.be/')) {
            var vid = query.split('youtu.be/')[1].split('?')[0];
            playYouTubeVideo(vid, 'Videoclip Căutat', 'YouTube');
            return;
        } else if (query.length === 11 && !query.includes(' ')) {
            playYouTubeVideo(query, 'Videoclip Căutat', 'YouTube');
            return;
        }

        if (qLower.includes('dani') || qLower.includes('mocanu') || qLower.includes('manel') || qLower.includes('salam') || qLower.includes('tzanca')) {
            renderYouTubeFeed(youtubeDatabase["manele"]);
            var topVid = youtubeDatabase["manele"][0];
            if (qLower.includes('salam')) topVid = youtubeDatabase["manele"][1];
            if (qLower.includes('tzanca')) topVid = youtubeDatabase["manele"][2];
            playYouTubeVideo(topVid.id, topVid.title, topVid.channel);
        } else if (qLower.includes('50 cent') || qLower.includes('fifty_cent') || qLower.includes('in da club')) {
            renderYouTubeFeed(youtubeDatabase["fifty_cent"]);
            playYouTubeVideo(youtubeDatabase["fifty_cent"][0].id, youtubeDatabase["fifty_cent"][0].title, youtubeDatabase["fifty_cent"][0].channel);
        } else if (qLower.includes('trap') || qLower.includes('travis') || qLower.includes('ian') || qLower.includes('nane')) {
            renderYouTubeFeed(youtubeDatabase["trap"]);
            playYouTubeVideo(youtubeDatabase["trap"][0].id, youtubeDatabase["trap"][0].title, youtubeDatabase["trap"][0].channel);
        } else if (qLower.includes('gaming') || qLower.includes('gta')) {
            renderYouTubeFeed(youtubeDatabase["gaming"]);
            playYouTubeVideo(youtubeDatabase["gaming"][0].id, youtubeDatabase["gaming"][0].title, youtubeDatabase["gaming"][0].channel);
        } else if (qLower.includes('lofi') || qLower.includes('chill')) {
            renderYouTubeFeed(youtubeDatabase["lofi"]);
            playYouTubeVideo(youtubeDatabase["lofi"][0].id, youtubeDatabase["lofi"][0].title, youtubeDatabase["lofi"][0].channel);
        } else {
            fetch('https://pipedapi.kavin.rocks/search?q=' + encodeURIComponent(query) + '&filter=all')
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    if (data && data.items && data.items.length > 0) {
                        var searchResults = [];
                        data.items.slice(0, 6).forEach(function (item) {
                            if (item.url && item.url.includes('/watch?v=')) {
                                var vid = item.url.split('/watch?v=')[1];
                                searchResults.push({
                                    id: vid,
                                    title: item.title,
                                    channel: item.uploaderName || "YouTube",
                                    duration: item.duration ? Math.floor(item.duration / 60) + ":" + (item.duration % 60 < 10 ? "0" : "") + (item.duration % 60) : "3:30",
                                    views: item.views ? (item.views > 1000000 ? Math.floor(item.views/1000000) + "M" : Math.floor(item.views/1000) + "K") : "500K"
                                });
                            }
                        });
                        if (searchResults.length > 0) {
                            renderYouTubeFeed(searchResults);
                            playYouTubeVideo(searchResults[0].id, searchResults[0].title, searchResults[0].channel);
                            return;
                        }
                    }
                    playYouTubeVideo("5qap5aO4i9A", "Căutare: " + query, "YouTube Search");
                })
                .catch(function () {
                    playYouTubeVideo("5qap5aO4i9A", "Căutare: " + query, "YouTube");
                });
        }
    }

    // Input Search Box Listeners
    $('#yt-search-input').on('keyup input', function (e) {
        var val = $(this).val();
        if (val.length > 0) {
            $('#btn-yt-clear-search').show();
        } else {
            $('#btn-yt-clear-search').hide();
        }

        if (e.keyCode === 13) {
            searchYouTubeQuery(val);
        }
    });

    $(document).on('click', '#btn-yt-clear-search', function () {
        $('#yt-search-input').val('').focus();
        $(this).hide();
        renderYouTubeFeed(youtubeDatabase["default"]);
    });

    $(document).on('click', '#btn-yt-account', function () {
        $('#yt-account-drawer').show().addClass('active-account-drawer');
    });

    $(document).on('click', '#btn-close-yt-account', function () {
        $('#yt-account-drawer').removeClass('active-account-drawer').hide();
    });

    $(document).on('click', '.yt-pill', function () {
        $('.yt-pill').removeClass('active-pill');
        $(this).addClass('active-pill');
        var query = $(this).attr('data-query');
        if (query) {
            if (query === "default") {
                renderYouTubeFeed(youtubeDatabase["default"]);
                playYouTubeVideo(youtubeDatabase["default"][0].id, youtubeDatabase["default"][0].title, youtubeDatabase["default"][0].channel);
            } else if (youtubeDatabase[query]) {
                renderYouTubeFeed(youtubeDatabase[query]);
                playYouTubeVideo(youtubeDatabase[query][0].id, youtubeDatabase[query][0].title, youtubeDatabase[query][0].channel);
            } else {
                searchYouTubeQuery(query);
            }
        }
    });

    $(document).on('click', '.yt-feed-card', function () {
        var ytid = $(this).attr('data-ytid');
        var title = $(this).attr('data-title');
        var channel = $(this).attr('data-channel');
        playYouTubeVideo(ytid, title, channel);
    });

    // SPOTIFY HANDLERS
    $(document).on('click', '.spotify-track-item', function () {
        var idx = parseInt($(this).attr('data-index')) || 0;
        currentSpotifyTrackIndex = idx;
        var track = spotifyDatabase[idx];
        if (track) {
            playSpotifyTrack(track.id, track.title, track.artist, track.duration);
        }
    });

    $(document).on('click', '#spot-btn-main-play', function () {
        toggleGlobalPlayPause();
    });

    $(document).on('click', '#spot-btn-next', function () {
        currentSpotifyTrackIndex = (currentSpotifyTrackIndex + 1) % spotifyDatabase.length;
        var track = spotifyDatabase[currentSpotifyTrackIndex];
        playSpotifyTrack(track.id, track.title, track.artist, track.duration);
    });

    $(document).on('click', '#spot-btn-prev', function () {
        currentSpotifyTrackIndex = (currentSpotifyTrackIndex - 1 + spotifyDatabase.length) % spotifyDatabase.length;
        var track = spotifyDatabase[currentSpotifyTrackIndex];
        playSpotifyTrack(track.id, track.title, track.artist, track.duration);
    });

    $('#btn-spotify-search').on('click', function () {
        var query = $('#spotify-search-input').val();
        if (query) {
            playSpotifyTrack("3tmd-ClpJxA", query, "Căutare Spotify", "3:40");
        }
    });

    // CAMERA SHORTCUTS & FLIP HANDLERS
    $(document).on('click', '#shortcut-camera, #cc-btn-camera', function () {
        showComingSoonModal("camera", "Cameră 3D", "bi-camera-fill", "Modulul de Cameră 3D se află în dezvoltare activă (W.I.P.). Revenim curând!");
    });

    $(document).on('click', '.cam-switch-flip', function () {
        $.post('https://phone/toggleSelfieCamera', JSON.stringify({}));
    });

    // ------------------------------------------------------------
    // APP STORE INSTALLATION LOGIC
    // ------------------------------------------------------------
    $(document).on('click', '.btn-install-app', function () {
        var btn = $(this);
        var appName = btn.attr('data-app');

        if (appName === "youtube") {
            showComingSoonModal("yt", "YouTube Mobile", "bi-youtube", "Aplicația YouTube Mobile se află în dezvoltare activă (W.I.P.). Revenim curând!");
            return;
        } else if (appName === "spotify") {
            showComingSoonModal("spotify", "Spotify Music", "bi-spotify", "Aplicația Spotify Music se află în dezvoltare activă (W.I.P.). Revenim curând!");
            return;
        }

        if (btn.hasClass('installed')) {
            $('.app-screen').removeClass('active-screen');
            $('#app-' + appName).addClass('active-screen');
            return;
        }

        btn.html('<i class="bi bi-arrow-repeat spin-icon"></i>');

        setTimeout(function () {
            btn.addClass('installed').html('<span>Deschide</span>');
            installedApps[appName] = true;

            if ($('#app-icon-' + appName).length === 0) {
                var iconClass = appName === "youtube" ? "icon-yt bi-youtube" : "icon-spotify bi-spotify";
                var appTitle = appName === "youtube" ? "YouTube" : "Spotify";
                var appHtml = '<div class="app-item" id="app-icon-' + appName + '" data-app="' + appName + '">';
                appHtml += '  <div class="app-icon ' + (appName === "youtube" ? "icon-yt" : "icon-spotify") + '"><i class="bi ' + (appName === "youtube" ? "bi-youtube" : "bi-spotify") + '"></i></div>';
                appHtml += '  <span class="app-label">' + appTitle + '</span>';
                appHtml += '</div>';

                $('#main-apps-grid').append(appHtml);
            }
        }, 1200);
    });

    // CONTROL CENTER HANDLERS
    $(document).on('click', '#status-icons-btn', function () {
        $('#control-center').toggleClass('active-cc-screen');
    });

    $(document).on('click', '#btn-close-cc', function () {
        $('#control-center').removeClass('active-cc-screen');
    });

    // Toggle Airplane Mode (Mod Avion)
    $(document).on('click', '#btn-toggle-airplane', function () {
        isAirplaneMode = !isAirplaneMode;
        $(this).toggleClass('airplane-active');
        if (isAirplaneMode) {
            $('#net-type-label').html('<i class="bi bi-airplane-fill" style="color:#ff9500"></i>');
            $('#wifi-icon-bar').hide();
        } else {
            $('#net-type-label').text('5G');
            $('#wifi-icon-bar').show();
        }
    });

    // Toggle 5G Data
    $(document).on('click', '#btn-toggle-5g', function () {
        $(this).toggleClass('active-cc');
        if ($(this).hasClass('active-cc')) {
            $('#net-type-label').text('5G');
        } else {
            $('#net-type-label').text('OFF');
        }
    });

    // Toggle WiFi
    $(document).on('click', '#btn-toggle-wifi', function () {
        $(this).toggleClass('active-cc');
        if ($(this).hasClass('active-cc')) {
            $('#wifi-icon-bar').show();
        } else {
            $('#wifi-icon-bar').hide();
        }
    });

    // Toggle Bluetooth
    $(document).on('click', '#btn-toggle-bt', function () {
        $(this).toggleClass('active-cc');
    });

    // Screen Brightness Capsule Slider
    $('#slider-brightness').on('input', function () {
        var val = parseInt($(this).val());
        var opacity = (100 - val) / 100;
        $('#brightness-filter').css('opacity', opacity);
        $('#cc-brightness-fill').css('height', val + '%');
    });

    // Sound Volume Capsule Slider
    $('#slider-volume').on('input', function () {
        var val = parseInt($(this).val());
        phoneVolume = val / 100;
        $('#cc-volume-fill').css('height', val + '%');
    });

    // DND Shortcut
    $(document).on('click', '#cc-btn-dnd', function () {
        $(this).toggleClass('active-qbtn');
    });

    // Flashlight Shortcut
    $(document).on('click', '#cc-btn-flashlight', function () {
        $(this).toggleClass('active-qbtn');
    });

    // Unlock Screen & Face ID Click
    $(document).on('click', '#btn-unlock-screen, .face-id-pill', function () {
        triggerFaceIDScan();
    });

    // Camera Shutter Button
    $(document).on('click', '#btn-take-photo', function () {
        $.post('https://phone/takePhoto', JSON.stringify({}));
        
        var photoUrl = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400";
        savedPhotos.push(photoUrl);
        renderPhotosGrid();

        $('.shutter-inner').css('transform', 'scale(0.8)');
        setTimeout(function () {
            $('.shutter-inner').css('transform', 'scale(1)');
        }, 120);
    });

    // Click Photo Thumbnail in Gallery
    $(document).on('click', '.photo-thumb', function () {
        var url = $(this).attr('data-url');
        $('#photo-modal-img').attr('src', url);
        $('#photo-viewer-modal').addClass('active-modal');
    });

    $(document).on('click', '#btn-close-photo', function () {
        $('#photo-viewer-modal').removeClass('active-modal');
    });

    // Call Action Handlers
    $('#btn-start-call').on('click', function () {
        var num = $('#dial-number').text().trim();
        if (num && num !== "--- --- ---") {
            $.post('https://phone/startCall', JSON.stringify({ targetId: num }));
        }
    });

    $('#btn-accept-call').on('click', function () {
        $.post('https://phone/acceptCall', JSON.stringify({}));
    });

    $('#btn-reject-call').on('click', function () {
        $.post('https://phone/rejectCall', JSON.stringify({}));
    });

    $('#btn-hangup-call').on('click', function () {
        $.post('https://phone/hangupCall', JSON.stringify({}));
    });

    // LB-Phone Setup Wizard Navigation
    $(document).on('click', '.btn-setup-next', function () {
        var nextStep = $(this).attr('data-next');
        $('.setup-step').removeClass('active-step');
        $('#setup-step-' + nextStep).addClass('active-step');
    });

    $(document).on('click', '#btn-finish-setup', function () {
        localStorage.setItem("iphone_setup_done", "true");
        triggerFaceIDScan();
    });

    $(document).on('click', '#btn-trigger-reboot', function () {
        $('.app-screen').removeClass('active-screen');
        triggerAppleBootSequence(function () {
            resetPhoneUI();
        });
    });

    $(document).on('click', '#btn-re-setup', function () {
        localStorage.removeItem("iphone_setup_done");
        $('.app-screen').removeClass('active-screen');
        $('#setup-wizard').addClass('active-screen');
        $('.setup-step').removeClass('active-step');
        $('#setup-step-1').addClass('active-step');
        closeCameraApp();
    });

    // Wallpaper Switcher
    $(document).on('click', '.wp-option', function () {
        $('.wp-option').removeClass('active-wp');
        $(this).addClass('active-wp');
        var theme = $(this).attr('data-wp');
        setWallpaper(theme);
    });

    // App Navigation: Open App
    $(document).on('click', '.app-item', function () {
        var appName = $(this).attr('data-app');
        if (appName) {
            // Handle Coming Soon Apps (YouTube, Spotify, Camera)
            if (appName === "youtube") {
                showComingSoonModal("yt", "YouTube Mobile", "bi-youtube", "Aplicația YouTube Mobile se află în dezvoltare activă (W.I.P.). Revenim curând!");
                return;
            } else if (appName === "spotify") {
                showComingSoonModal("spotify", "Spotify Music", "bi-spotify", "Aplicația Spotify Music se află în dezvoltare activă (W.I.P.). Revenim curând!");
                return;
            } else if (appName === "camera") {
                showComingSoonModal("camera", "Cameră 3D", "bi-camera-fill", "Modulul de Cameră 3D se află în dezvoltare activă (W.I.P.). Revenim curând!");
                return;
            }

            $('.app-screen').removeClass('active-screen');
            closeCameraApp();
            closeComingSoonModal();

            var targetApp = $('#app-' + appName);
            if (targetApp.length) {
                targetApp.addClass('active-screen');
            } else {
                $('#home-screen').addClass('active-screen');
            }
        }
    });

    // Back to Home Button & Home Indicator Click
    $(document).on('click', '.back-btn, #home-indicator', function () {
        closeCameraApp();
        closeComingSoonModal();
        $('.app-screen').removeClass('active-screen');
        $('#control-center').removeClass('active-cc-screen');
        $('#home-screen').addClass('active-screen');
    });

    // Dialer Buttons Handler
    $(document).on('click', '.dial-btn', function () {
        var key = $(this).attr('data-key');
        var curr = $('#dial-number').text();
        if (curr === "--- --- ---") curr = "";
        if (curr.length < 12) {
            $('#dial-number').text(curr + key);
        }
    });

    // GPS Quick Waypoint Click
    $(document).on('click', '.gps-btn-place', function () {
        var x = $(this).attr('data-x');
        var y = $(this).attr('data-y');
        if (x && y) {
            $.post('https://phone/setGpsWaypoint', JSON.stringify({ x: x, y: y }));
        }
    });

    // Bank Transfer Form Submission
    $('#transfer-form').on('submit', function (e) {
        e.preventDefault();
        var targetId = $('#transfer-id').val();
        var amount = $('#transfer-amount').val();

        if (targetId && amount) {
            $.post('https://phone/transferMoney', JSON.stringify({
                targetId: targetId,
                amount: amount
            }));
            $('#transfer-id').val('');
            $('#transfer-amount').val('');
        }
    });

    // GPS Vehicle Button Click
    $(document).on('click', '.btn-gps-veh', function () {
        var plate = $(this).attr('data-plate');
        $.post('https://phone/setVehicleGps', JSON.stringify({ plate: plate }));
    });

    // ESC Key to close phone
    $(document).keyup(function (e) {
        if (e.keyCode === 27) { // ESC key
            phoneOpen = false;
            stopRingtone();
            $('#iphone-wrapper').removeClass('open');
            $('#control-center').removeClass('active-cc-screen');
            $('#yt-account-drawer').removeClass('active-account-drawer').hide();
            $('#island-mini-player-drawer').removeClass('island-expanded-player');
            closeCameraApp();
            closeComingSoonModal();
            $.post('https://phone/closePhone', JSON.stringify({}));
        }
    });
});
