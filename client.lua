vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP","phone")

local phoneOpen = false
local phoneProp = nil
local inCall = false
local isSelfieMode = true
local cellCam = nil

-- Attach real GTA V iPhone prop to right hand
function AttachPhoneProp()
    DeletePhoneProp()
    local ped = PlayerPedId()
    local model = `prop_npc_phone_02`
    RequestModel(model)
    local timeout = 50
    while not HasModelLoaded(model) and timeout > 0 do
        Citizen.Wait(10)
        timeout = timeout - 1
    end
    
    if HasModelLoaded(model) then
        phoneProp = CreateObject(model, 1.0, 1.0, 1.0, true, true, false)
        local bone = GetPedBoneIndex(ped, 28422) -- Right Hand SKEL_R_Hand
        AttachEntityToEntity(phoneProp, ped, bone, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, true, true, false, false, 2, true)
        SetModelAsNoLongerNeeded(model)
    end
end

function DeletePhoneProp()
    if phoneProp and DoesEntityExist(phoneProp) then
        DeleteEntity(phoneProp)
        phoneProp = nil
    end
end

function PlayPhoneAnim()
    local ped = PlayerPedId()
    local dict = "cellphone@"
    RequestAnimDict(dict)
    local timeout = 50
    while not HasAnimDictLoaded(dict) and timeout > 0 do
        Citizen.Wait(10)
        timeout = timeout - 1
    end
    TaskPlayAnim(ped, dict, "cellphone_text_in", 8.0, 1.0, -1, 50, 0, 0, 0, 0)
    AttachPhoneProp()
end

function PlaySelfieAnim()
    local ped = PlayerPedId()
    local dict = "cellphone@selfie"
    RequestAnimDict(dict)
    local timeout = 50
    while not HasAnimDictLoaded(dict) and timeout > 0 do
        Citizen.Wait(10)
        timeout = timeout - 1
    end
    if HasAnimDictLoaded(dict) then
        TaskPlayAnim(ped, dict, "selfie_in", 8.0, 1.0, -1, 50, 0, 0, 0, 0)
    else
        PlayPhoneAnim()
    end
    AttachPhoneProp()
end

function StopPhoneAnim()
    local ped = PlayerPedId()
    StopAnimTask(ped, "cellphone@", "cellphone_text_in", 1.0)
    StopAnimTask(ped, "cellphone@selfie", "selfie_in", 1.0)
    DeletePhoneProp()
end

-- 3D GTA V Live Camera Viewfinder Engine (Focalized on ped face for Selfie)
function StartInGameCamera(isSelfie)
    DestroyInGameCamera()
    
    local ped = PlayerPedId()
    local coords = GetPedBoneCoords(ped, 31086, 0.0, 0.0, 0.0) -- SKEL_Head
    cellCam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true)
    
    if isSelfie then
        local rot = GetEntityRotation(ped, 2)
        local forward = GetEntityForwardVector(ped)
        -- Position camera directly in front of player ped's face (0.70m away, looking back at face)
        local camCoords = coords + (forward * 0.70) + vector3(0.0, 0.0, 0.05)
        SetCamCoord(cellCam, camCoords.x, camCoords.y, camCoords.z)
        SetCamRot(cellCam, rot.x, rot.y, rot.z + 180.0, 2)
        SetCamFov(cellCam, 52.0)
    else
        local rot = GetEntityRotation(ped, 2)
        local forward = GetEntityForwardVector(ped)
        local camCoords = coords + (forward * 0.35) + vector3(0.0, 0.0, 0.05)
        SetCamCoord(cellCam, camCoords.x, camCoords.y, camCoords.z)
        SetCamRot(cellCam, rot.x, rot.y, rot.z, 2)
        SetCamFov(cellCam, 52.0)
    end
    
    SetCamActive(cellCam, true)
    RenderScriptCams(true, true, 200, true, true)
end

function DestroyInGameCamera()
    if cellCam then
        RenderScriptCams(false, true, 200, true, true)
        SetCamActive(cellCam, false)
        DestroyCam(cellCam, true)
        cellCam = nil
    end
end

function TogglePhone()
    phoneOpen = not phoneOpen
    SetNuiFocus(phoneOpen, phoneOpen)
    
    if phoneOpen then
        SendNUIMessage({ action = "openPhone" })
        TriggerServerEvent("phone:requestData")
        PlayPhoneAnim()
    else
        SendNUIMessage({ action = "closePhone" })
        DestroyInGameCamera()
        StopPhoneAnim()
    end
end

RegisterCommand("phone", function()
    TogglePhone()
end)

RegisterKeyMapping("phone", "Deschide Telefon iPhone 14 Pro Max", "keyboard", "F1")

-- Live In-Game Clock Update Thread (Updates every second)
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(1000)
        local hours = GetClockHours()
        local minutes = GetClockMinutes()
        local timeStr = string.format("%02d:%02d", hours, minutes)
        
        SendNUIMessage({
            action = "updateClock",
            time = timeStr
        })
    end
end)

-- NUI Callbacks
RegisterNUICallback("closePhone", function(data, cb)
    phoneOpen = false
    SetNuiFocus(false, false)
    DestroyInGameCamera()
    StopPhoneAnim()
    cb("ok")
end)

RegisterNUICallback("openCamera", function(data, cb)
    isSelfieMode = true
    PlaySelfieAnim()
    StartInGameCamera(true)
    cb("ok")
end)

RegisterNUICallback("closeCamera", function(data, cb)
    DestroyInGameCamera()
    PlayPhoneAnim()
    cb("ok")
end)

RegisterNUICallback("toggleSelfieCamera", function(data, cb)
    isSelfieMode = not isSelfieMode
    if isSelfieMode then
        PlaySelfieAnim()
    else
        PlayPhoneAnim()
    end
    StartInGameCamera(isSelfieMode)
    cb("ok")
end)

RegisterNUICallback("takePhoto", function(data, cb)
    PlaySoundFrontend(-1, "CAMERA_SNAP", "FULL_SNAP_CODESET", true)
    cb("ok")
end)

RegisterNUICallback("startCall", function(data, cb)
    if data.targetId then
        TriggerServerEvent("phone:startCall", data.targetId)
    end
    cb("ok")
end)

RegisterNUICallback("acceptCall", function(data, cb)
    TriggerServerEvent("phone:acceptCall")
    cb("ok")
end)

RegisterNUICallback("rejectCall", function(data, cb)
    TriggerServerEvent("phone:rejectCall")
    cb("ok")
end)

RegisterNUICallback("hangupCall", function(data, cb)
    TriggerServerEvent("phone:hangupCall")
    cb("ok")
end)

RegisterNUICallback("transferMoney", function(data, cb)
    TriggerServerEvent("phone:transferMoney", data.targetId, data.amount)
    cb("ok")
end)

RegisterNUICallback("setVehicleGps", function(data, cb)
    TriggerServerEvent("phone:locateVehicle", data.plate)
    cb("ok")
end)

RegisterNUICallback("setGpsWaypoint", function(data, cb)
    local x = tonumber(data.x)
    local y = tonumber(data.y)
    if x and y then
        SetNewWaypoint(x, y)
    end
    cb("ok")
end)

-- Call Events from Server
RegisterNetEvent("phone:incomingCall", function(callerId, callerName, callerSIM)
    if not phoneOpen then
        TogglePhone()
    end
    SendNUIMessage({
        action = "incomingCall",
        callerId = callerId,
        callerName = callerName or ("ID: " .. callerId),
        callerSIM = callerSIM or ""
    })
end)

RegisterNetEvent("phone:callOutgoing", function(targetId)
    SendNUIMessage({
        action = "callOutgoing",
        targetId = targetId
    })
end)

RegisterNetEvent("phone:callConnected", function()
    inCall = true
    SendNUIMessage({
        action = "callConnected"
    })
end)

RegisterNetEvent("phone:callEnded", function(reason)
    inCall = false
    SendNUIMessage({
        action = "callEnded",
        reason = reason or "Apel Încheiat"
    })
end)

RegisterNetEvent("phone:updateData")
AddEventHandler("phone:updateData", function(data)
    SendNUIMessage({
        action = "updateData",
        phoneNumber = data.phoneNumber or "0722-000-000",
        userId = data.userId or 1,
        cash = data.cash or 0,
        bank = data.bank or 0
    })
    
    if data.vehicles then
        SendNUIMessage({
            action = "updateVehicles",
            vehicles = data.vehicles
        })
    end
end)
