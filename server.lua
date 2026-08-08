local Tunnel = module("vrp", "lib/Tunnel")
local Proxy = module("vrp", "lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP","phone")

local activeCalls = {}

-- Helper to generate a realistic Romanian / Los Santos SIM Phone Number
function GetUserPhoneNumber(user_id)
    local num = (user_id * 1492) + 700000
    local s = tostring(num)
    if #s < 6 then s = s .. "000" end
    return "0722-" .. string.sub(s, 1, 3) .. "-" .. string.sub(s, 4, 6)
end

RegisterNetEvent("phone:requestData", function()
    local src = source
    local user_id = vRP.getUserId({src})
    if not user_id then return end

    local phoneNumber = GetUserPhoneNumber(user_id)
    local cash = vRP.getMoney({user_id}) or 0
    local bank = vRP.getBankMoney({user_id}) or 0

    exports.oxmysql:query("SELECT vehicle FROM vrp_user_vehicles WHERE user_id = @id", {['@id'] = user_id}, function(rows)
        local vehicles = {}
        if rows and #rows > 0 then
            for i, row in ipairs(rows) do
                table.insert(vehicles, {
                    model = row.vehicle or "Vehicul",
                    plate = "LS " .. (user_id * 100 + i)
                })
            end
        end

        TriggerClientEvent("phone:updateData", src, {
            phoneNumber = phoneNumber,
            userId = user_id,
            cash = cash,
            bank = bank,
            vehicles = vehicles
        })
    end)
end)

-- Start Call by Target Player ID or SIM Phone Number
RegisterNetEvent("phone:startCall", function(targetInput)
    local src = source
    local user_id = vRP.getUserId({src})
    if not user_id then return end

    local targetSrc = nil
    local targetNum = tonumber(targetInput)

    -- First try direct Player ID
    if targetNum then
        targetSrc = vRP.getUserSource({targetNum})
    end

    -- If not found by ID, search online players for matching SIM Phone Number
    if not targetSrc then
        local players = GetPlayers()
        for _, p in ipairs(players) do
            local pId = vRP.getUserId({tonumber(p)})
            if pId and GetUserPhoneNumber(pId) == tostring(targetInput) then
                targetSrc = tonumber(p)
                break
            end
        end
    end

    if not targetSrc then
        vRPclient.notify(src, {"Numărul sau ID-ul este invalid sau neconectat!"})
        return
    end

    if targetSrc == src then
        vRPclient.notify(src, {"Nu te poți suna pe tine însuți!"})
        return
    end

    activeCalls[src] = { target = targetSrc, state = "dialing" }
    activeCalls[targetSrc] = { target = src, state = "ringing" }

    local callerName = GetPlayerName(src) or ("ID: " .. user_id)
    local callerSIM = GetUserPhoneNumber(user_id)

    TriggerClientEvent("phone:callOutgoing", src, targetInput)
    TriggerClientEvent("phone:incomingCall", targetSrc, user_id, callerName, callerSIM)
end)

-- Accept Incoming Call
RegisterNetEvent("phone:acceptCall", function()
    local src = source
    local callInfo = activeCalls[src]
    if callInfo and callInfo.target then
        local target = callInfo.target
        activeCalls[src].state = "connected"
        activeCalls[target].state = "connected"

        TriggerClientEvent("phone:callConnected", src)
        TriggerClientEvent("phone:callConnected", target)
    end
end)

-- Reject Call
RegisterNetEvent("phone:rejectCall", function()
    local src = source
    local callInfo = activeCalls[src]
    if callInfo and callInfo.target then
        local target = callInfo.target
        activeCalls[src] = nil
        activeCalls[target] = nil

        TriggerClientEvent("phone:callEnded", src, "Apel Respins")
        TriggerClientEvent("phone:callEnded", target, "Apel Respins")
    end
end)

-- Hangup Call
RegisterNetEvent("phone:hangupCall", function()
    local src = source
    local callInfo = activeCalls[src]
    if callInfo and callInfo.target then
        local target = callInfo.target
        activeCalls[src] = nil
        activeCalls[target] = nil

        TriggerClientEvent("phone:callEnded", src, "Apel Încheiat")
        TriggerClientEvent("phone:callEnded", target, "Apel Încheiat")
    end
end)

-- Transfer Money
RegisterNetEvent("phone:transferMoney", function(targetId, amount)
    local src = source
    local user_id = vRP.getUserId({src})
    if not user_id then return end

    local amountNum = tonumber(amount)
    local targetNum = tonumber(targetId)

    if not amountNum or amountNum <= 0 or not targetNum then
        vRPclient.notify(src, {"Suma sau ID invalid!"})
        return
    end

    local targetSource = vRP.getUserSource({targetNum})
    if not targetSource then
        vRPclient.notify(src, {"Jucătorul nu este conectat!"})
        return
    end

    if vRP.tryBankPayment({user_id, amountNum}) then
        vRP.giveBankMoney({targetNum, amountNum})
        vRPclient.notify(src, {"Ai trimis $" .. amountNum .. " către ID " .. targetNum})
        vRPclient.notify(targetSource, {"Ai primit $" .. amountNum .. " de la ID " .. user_id})
    else
        vRPclient.notify(src, {"Nu ai suficienți bani în bancă!"})
    end
end)

-- ============================================================
--  SETARI TELEFON (wallpaper, setup_done)
-- ============================================================
RegisterNetEvent("phone:saveSettings", function(data)
    local src = source
    local user_id = vRP.getUserId({src})
    if not user_id then return end

    exports.oxmysql:query(
        "INSERT INTO phone_settings (user_id, wallpaper, setup_done, operator) VALUES (@uid, @wp, @sd, @op) ON DUPLICATE KEY UPDATE wallpaper=@wp, setup_done=@sd",
        {['@uid'] = user_id, ['@wp'] = data.wallpaper or 'deep-purple', ['@sd'] = data.setup_done and 1 or 0, ['@op'] = data.operator or 'Orange 5G'}
    )
end)

RegisterNetEvent("phone:getSettings", function()
    local src = source
    local user_id = vRP.getUserId({src})
    if not user_id then return end

    exports.oxmysql:query("SELECT * FROM phone_settings WHERE user_id = @uid", {['@uid'] = user_id}, function(rows)
        if rows and rows[1] then
            TriggerClientEvent("phone:receiveSettings", src, rows[1])
        else
            TriggerClientEvent("phone:receiveSettings", src, {wallpaper = 'deep-purple', setup_done = 0, operator = 'Orange 5G'})
        end
    end)
end)

-- ============================================================
--  CONTACTE
-- ============================================================
RegisterNetEvent("phone:getContacts", function()
    local src = source
    local user_id = vRP.getUserId({src})
    if not user_id then return end

    exports.oxmysql:query("SELECT id, name, number FROM phone_contacts WHERE owner_id = @uid ORDER BY name ASC", {['@uid'] = user_id}, function(rows)
        TriggerClientEvent("phone:receiveContacts", src, rows or {})
    end)
end)

RegisterNetEvent("phone:saveContact", function(name, number)
    local src = source
    local user_id = vRP.getUserId({src})
    if not user_id then return end

    if not name or #name < 1 or not number or #number < 3 then
        vRPclient.notify(src, {"Nume sau număr invalid!"})
        return
    end

    exports.oxmysql:query(
        "INSERT INTO phone_contacts (owner_id, name, number) VALUES (@uid, @name, @num)",
        {['@uid'] = user_id, ['@name'] = name, ['@num'] = number},
        function()
            vRPclient.notify(src, {"Contact salvat: " .. name})
            TriggerEvent("phone:getContacts")
        end
    )
end)

RegisterNetEvent("phone:deleteContact", function(contactId)
    local src = source
    local user_id = vRP.getUserId({src})
    if not user_id then return end

    exports.oxmysql:query(
        "DELETE FROM phone_contacts WHERE id = @cid AND owner_id = @uid",
        {['@cid'] = contactId, ['@uid'] = user_id}
    )
end)

-- ============================================================
--  SMS
-- ============================================================
RegisterNetEvent("phone:sendSMS", function(receiverNumber, message)
    local src = source
    local user_id = vRP.getUserId({src})
    if not user_id then return end

    if not message or #message < 1 then return end

    local senderNumber = GetUserPhoneNumber(user_id)

    -- Salveaza mesajul in baza de date
    exports.oxmysql:query(
        "INSERT INTO phone_messages (sender_id, receiver_number, message) VALUES (@sid, @rnum, @msg)",
        {['@sid'] = user_id, ['@rnum'] = receiverNumber, ['@msg'] = message}
    )

    -- Livreaza live daca destinatarul e online
    local players = GetPlayers()
    for _, p in ipairs(players) do
        local pId = vRP.getUserId({tonumber(p)})
        if pId and GetUserPhoneNumber(pId) == receiverNumber then
            TriggerClientEvent("phone:receiveSMS", tonumber(p), {
                from = senderNumber,
                message = message,
                time = os.date("%H:%M")
            })
            break
        end
    end
end)

RegisterNetEvent("phone:getSMSHistory", function(withNumber)
    local src = source
    local user_id = vRP.getUserId({src})
    if not user_id then return end

    local myNumber = GetUserPhoneNumber(user_id)

    exports.oxmysql:query(
        "SELECT * FROM phone_messages WHERE (sender_id = @uid AND receiver_number = @with) OR (receiver_number = @mynum AND sender_id IN (SELECT user_id FROM vrp_users WHERE id IN (SELECT user_id FROM vrp_user_ids))) ORDER BY sent_at ASC LIMIT 50",
        {['@uid'] = user_id, ['@with'] = withNumber, ['@mynum'] = myNumber},
        function(rows)
            TriggerClientEvent("phone:receiveSMSHistory", src, rows or {})
        end
    )
end)

-- ============================================================
--  ISTORIC APELURI
-- ============================================================
local callStartTimes = {}

RegisterNetEvent("phone:logCallStart", function()
    local src = source
    callStartTimes[src] = os.time()
end)

RegisterNetEvent("phone:logCallEnd", function(receiverId, status)
    local src = source
    local user_id = vRP.getUserId({src})
    local target_id = tonumber(receiverId)
    if not user_id or not target_id then return end

    local duration = 0
    if callStartTimes[src] then
        duration = os.time() - callStartTimes[src]
        callStartTimes[src] = nil
    end

    local callerNum = GetUserPhoneNumber(user_id)
    local receiverNum = GetUserPhoneNumber(target_id)

    exports.oxmysql:query(
        "INSERT INTO phone_calls (caller_id, receiver_id, caller_number, receiver_number, status, duration) VALUES (@cid, @rid, @cnum, @rnum, @st, @dur)",
        {['@cid'] = user_id, ['@rid'] = target_id, ['@cnum'] = callerNum, ['@rnum'] = receiverNum, ['@st'] = status or 'missed', ['@dur'] = duration}
    )
end)

RegisterNetEvent("phone:getCallHistory", function()
    local src = source
    local user_id = vRP.getUserId({src})
    if not user_id then return end

    exports.oxmysql:query(
        "SELECT * FROM phone_calls WHERE caller_id = @uid OR receiver_id = @uid ORDER BY called_at DESC LIMIT 30",
        {['@uid'] = user_id},
        function(rows)
            TriggerClientEvent("phone:receiveCallHistory", src, rows or {})
        end
    )
end)
