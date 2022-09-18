const buttonSave = document.querySelector("#save")
const footer = document.querySelector("footer")
const saveImage = document.querySelector("#save-image")
const inputMinutes = document.querySelector("#minutes-to-check")
const inputNotifications = document.querySelector("#notifications-input")

let configs = {updateIntervalInMinutes: 5,notificationsEnabled: true,notificationsGroupEnabled: true}
let saving = false;

buttonSave.addEventListener("click", () => {
    if(saving) return;
    saving = true;

    inputMinutes.disabled = true;
    inputNotifications.disabled = true;

    setConfig()
    saveImage.classList = "rotate"
    setTimeout(() => {
        saveImage.classList = ""
        footer.classList = "popup"
        getConfig()
        setTimeout(() => {
            footer.classList = ""
            inputMinutes.disabled = false;
            inputNotifications.disabled = false;
            saving = false
        }, 2500)
    }, 1500)
})

function getConfigFromInputs(){
    return {
        updateIntervalInMinutes: inputMinutes.value || configs.updateIntervalInMinutes || 5,
        notificationsEnabled: inputNotifications.checked,
        notificationsGroupEnable: inputNotifications.checked
    }
}

function setConfigInInputs(config){
    inputMinutes.value = config.updateIntervalInMinutes
    inputNotifications.checked = config.notificationsEnabled
}

function getConfig(callback){
    chrome.storage.local.get((storage) => {
        if(typeof callback == "function") callback(storage)
        configs = storage;
    })
}

function setConfig(){
    chrome.storage.local.set(getConfigFromInputs())
    chrome.runtime.sendMessage("setConfig") //atualiza no background.js os valores
}

getConfig((storage) => {
    setConfigInInputs(storage)
})