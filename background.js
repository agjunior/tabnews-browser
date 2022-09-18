const tabnewsUrl = "https://tabnews-a1kfcsd7i-tabnews.vercel.app"
const apiUrl = `${tabnewsUrl}/api/v1`

const setLocal = async (key, value) => await chrome.storage.local.set({[key]: value})
const getLocal = async (key) => (await chrome.storage.local.get([key]))[key]

let configInCache = {updateIntervalInMinutes: 5, notificationsEnabled: true, notificationsGroupEnabled: true}
const setConfig = async (options) => {
  if(options.updateIntervalInMinutes) {
    setLocal("config.updateIntervalInMinutes", options.updateIntervalInMinutes)
    chrome.alarms.clear("checkNewArticle")
    chrome.alarms.create('checkNewArticle', {
      periodInMinutes: config.updateIntervalInMinutes,
      delayInMinutes: 0
    });
  }
  if(options.notificationsEnabled) setLocal("notificationsEnabled", options.notificationsEnabled)
  if(options.notificationsGroupEnabled) setLocal("notificationsGroupEnabled", options.notificationsGroupEnabled)
  getConfig()
}
const getConfig = async () => {
  const config = {};
  config.updateIntervalInMinutes = await getLocal("updateIntervalInMinutes") || 5
  config.notificationsEnabled = await getLocal("notificationsEnabled") || true
  config.notificationsGroupEnabled = await getLocal("notificationsGroupEnabled") || true

  configInCache = config;
  return config;
}

function setInitialSettings() {
  chrome.storage.local.set({
    content: null,
    last_content_viewed: null,
    count_pending: 0,
    last_update: null,
    tabnewsUrl: tabnewsUrl,
    updateIntervalInMinutes: 5,
    notificationsEnabled: true,
    notificationsGroupEnabled: true
  })
}

const alarms = {
  checkNewArticle: requestNewArticles
}

function handleAlarm(alarm) {
  let alarmFunction = alarms[alarm.name]
  if(typeof alarmFunction == "function") alarmFunction()
}

const messages = {
  updateContent: requestNewArticles,
  clear: clear,
  setConfig: setConfig
}

function handleMessage(request, sender, sendResponse) {
  let messageFunction = messages[request.message]
  if(typeof messageFunction == "function") messageFunction()

  sendResponse();
}

function requestNewArticles() {
  fetch(`${apiUrl}/contents?strategy=new`).then(response => response.json()).then(json => {
    setLocal('content', json)
    checkForNewArticles()
  }).catch(err => console.log('Error', err))
}

function updateBadge(number) {
  if (!number) return

  const text = number < 30 ? number : '29+'
  chrome.action.setBadgeText({ text: text.toString() });
}

async function clear() {
  chrome.action.setBadgeText({ text: '' });
  const content = await getLocal('content')
  if(!content[0]) return;

  setLocal('last_content_viewed', content[0].id)
  setLocal('count_pending', 0)
}

function showNotification(title, message, context = null , notificationId) {
  if (!configInCache.notificationsEnabled) return
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'images/logo128.png',
    contextMessage: context,
    title,
    message
  })
}

function calcNewArticles(content, lastContentViewed) {
  let countNewArticles = 0
  content.some((article, index) => {
    if(lastContentViewed == article.id) {
      countNewArticles = index
      return true
    }
  })
  return countNewArticles
}

async function checkForNewArticles() {  
  const content = await getLocal('content')
  const lastUpdate = await getLocal('last_update')
  const countPending = await getLocal('count_pending')
  const mostRecentItem = content[0]
  let lastContentViewed = await getLocal('last_content_viewed')

  if (!lastContentViewed) {
    lastContentViewed = mostRecentItem.id
    setLocal('last_content_viewed', mostRecentItem.id)
  }

  const countNewArticles = calcNewArticles(content, lastContentViewed)
  const pendingDiff = countNewArticles - countPending

  setLocal('last_update', Date.now())
  setLocal('count_pending', countNewArticles)
  updateBadge(countNewArticles)

  if (pendingDiff <= 0) return

  if(countNewArticles == 1 || !configInCache.notificationsGroupEnabled && pendingDiff == 1) showNotification('Nova publicação', mostRecentItem.title, mostRecentItem.username)
  else if (countNewArticles > 1) showNotification('Novas publicações', `${countNewArticles} novas publicações não lidas`)
}

(async () => {
  const config = await getConfig()
  chrome.runtime.onMessage.addListener(handleMessage)
  chrome.action.setBadgeBackgroundColor({ color: '#24292f' });
  chrome.alarms.create('checkNewArticle', {
    periodInMinutes: parseFloat(config.updateIntervalInMinutes) || 5,
    delayInMinutes: 0
  });
  chrome.alarms.onAlarm.addListener(handleAlarm);
})()

setInitialSettings()