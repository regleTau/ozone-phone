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
