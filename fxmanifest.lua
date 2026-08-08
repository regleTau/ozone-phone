fx_version 'cerulean'
game 'gta5'

ui_page 'html/index.html'

client_scripts {
    '@vrp/client/Proxy.lua',
    '@vrp/client/Tunnel.lua',
    'client.lua'
}

server_scripts {
    '@vrp/lib/utils.lua',
    'server.lua'
}

files {
    'html/index.html',
    'html/css/style.css',
    'html/js/script.js',
    'html/img/wallpaper.png'
}
