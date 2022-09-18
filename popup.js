class Item {
  constructor(content, tabnewsUrl){
    this.published_at = new Date(content.published_at).getTime()
    this.owner_username = content.owner_username
    this.slug = content.slug
    this.title = content.title
    this.tabcoins = content.tabcoins
    this.children_deep_count = content.children_deep_count
    this.site_url = tabnewsUrl
  }

  toHtml(){
    const {owner_username, slug, title, tabcoins, children_deep_count, site_url, published_at} = this;
    const url = `${site_url}/${owner_username}/${slug}`
    const time = relativeTime(Date.now(), published_at) //new Date(item.published_at).getTime()

    return `
      <a href="${url}" class="item" target="_blank">
      <div class="item-content">
        <div class="content-title">${title}</div>
        <div class="content-info">
          <span class="content-tabcoins">${tabcoins} TabCoins</span>
          <span>&#8231;</span>
          <span class="content-comments">${children_deep_count} coment&#225;rios</span>
          <span>&#8231;</span>
          <span class="content-date">${time}</span>
          <span>&#8231;</span>
          <span class="content-user">${owner_username}</span>
        </div>
      </div>
    </a>
    `
  }
}

function setContents() {
  chrome.storage.local.get(storage => {
    if(!storage.content) return
    if(!storage.tabnewsUrl) return setTimeout(setContents, 1500)

    let contentsHtml = ""

    storage.content.forEach(content => {
      contentsHtml += new Item(content, storage.tabnewsUrl).toHtml()
    });  

    document.querySelector('.content').innerHTML = contentsHtml
    
    if(storage.last_update){
      const time = relativeTime(Date.now(), storage.last_update)
      document.querySelector('.header-update').innerHTML = `atualizado ${time}`
    }

    chrome.runtime.sendMessage({message: "clear"});
  })
}


const updateButton = document.querySelector('.reload')

async function handleUpdate() {
  updateButton.classList = "reload rotate"
  
  await new Promise(r => setTimeout(r, 1000)) //Delay fake porque fica mais bonito.
  chrome.runtime.sendMessage({message: "updateContent"}, () => {
    setContents()
    updateButton.classList = "reload"
  });
}

function handleConfig(){
  window.open(location.origin + "/config.html")
}

setContents()

updateButton.addEventListener("click", handleUpdate)
const configButton = document.querySelector(".config")
configButton.addEventListener("click", handleConfig)