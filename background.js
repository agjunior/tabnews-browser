const API_URL = 'https://www.tabnews.com.br/api/v1/'
const UPDATE_INTERVAL_IN_MINUTES = 5
const NOTIFICATIONS_ENABLED = 1
const NOTIFICATIONS_GROUP_ENABLED = 1

chrome.runtime.onStartup.addListener(setInitialSettings)
chrome.runtime.onMessage.addListener(handleMessage)

chrome.action.setBadgeBackgroundColor({ color: '#24292f' });

chrome.alarms.create('checkNewArticle', {
  periodInMinutes: UPDATE_INTERVAL_IN_MINUTES,
  delayInMinutes: 0
});
chrome.alarms.onAlarm.addListener(handleAlarm);

async function setLocal(key, value) {
  return await chrome.storage.local.set({[key]: value})
}

async function getLocal(key) {
  let obj = await chrome.storage.local.get([key])
  return obj[key]
}

function setInitialSettings() {
  chrome.storage.local.set({
    content: null,
    last_content_viewed: null,
    count_pending: 0,
    last_update: null
  })
}

function handleAlarm(alarm) {
  if (alarm.name === 'checkNewArticle')
  requestNewArticles()
}

function handleMessage(request, sender, sendResponse) {
  if (request.message === 'updateContent') {
    requestNewArticles()
  }
  if (request.message === 'clear') {
    clear()
  }
  sendResponse();
}

function requestNewArticles() {
  fetch(API_URL + 'contents?strategy=new')
    .then(response => response.json())
    .then(json => {
      setLocal('content', json)
      checkForNewArticles()
    })
    .catch(err => console.log('Error', err))
}

function updateBadge(number) {
  if (!number) return

  const text = number < 30 ? number : '29+'
  chrome.action.setBadgeText({ text: text.toString() });
}

async function clear() {
  chrome.action.setBadgeText({ text: '' });
  const content = await getLocal('content')
  setLocal('last_content_viewed', content[0].id)
  setLocal('count_pending', 0)
}

function showNotification(title, message, context = null , notificationId) {

  if (!NOTIFICATIONS_ENABLED) return

  /* Notificações com o mesmo ID só são disparadas uma única vez */
  chrome.notifications.create(/* notificationId, */{
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

  if(countNewArticles == 1 || !NOTIFICATIONS_GROUP_ENABLED && pendingDiff == 1)
    showNotification('Nova publicação', mostRecentItem.title, mostRecentItem.username)
  else if (countNewArticles > 1)
    showNotification('Novas publicações', `${countNewArticles} novas publicações não lidas`)
}
