const SITE_URL = 'https://www.tabnews.com.br/'

function writeHtml() {
  chrome.storage.local.get(store => {

    if (!store.content) return

    let html = ''  
    store.content.forEach(element => {
      html += itemHtml(element)
    });  
    document.querySelector('.content').innerHTML = html

    if (store.last_update) {
      const time = relativeTime(Date.now(), store.last_update)
      document.querySelector('.header-update').innerHTML = `atualizado ${time}`
    }

    chrome.runtime.sendMessage({message: "clear"});
  })
}

const updateButton = document.querySelector('.header-icon')
updateButton.addEventListener("click", handleUpdate)

function handleUpdate() {
  const updateImage = document.querySelector('.reload')
  updateImage.classList.add('rotate')
  chrome.runtime.sendMessage({message: "updateContent"}, () => {
    writeHtml()
    updateImage.classList.remove('rotate')
  });
}

function itemHtml(item) {
  const dateEpoch = new Date(item.published_at).getTime()
  const time = relativeTime(Date.now(), dateEpoch)
  return `
    <a href="${SITE_URL}/${item.username}/${item.slug}" class="item" target="_blank">
    <div class="item-content">
      <div class="content-title">${item.title}</div>
      <div class="content-info">
        <span class="content-tabcoins">${item.tabcoins} TabCoins</span>
        <span>&#8231;</span>
        <span class="content-comments">${item.children_deep_count} coment&#225;rios</span>
        <span>&#8231;</span>
        <span class="content-date">${time}</span>
        <span>&#8231;</span>
        <span class="content-user">${item.username}</span>
      </div>
    </div>
  </a>
  `
}

writeHtml()
