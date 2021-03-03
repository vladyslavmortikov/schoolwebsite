var curPage = document.getElementById("page");
var lastPage = document.getElementById("lastPage");
var searchInput = document.getElementById("searchInput");
var paginationAmount = 3;

function updPage(newPage) {
    if (searchInput.value != "") {
        if (newPage > 0 && newPage <= new Number(lastPage.innerHTML)) {
            curPage.innerText = newPage;
            Promise.all([
                fetch("/templates/items.mst").then(x => x.text()),
                fetch("/api/v1/items").then(x => x.json()),
            ])
                .then(([templateStr, itemsData]) => {
                    let news = new Array();
                    let renderNews = new Array();
                    for (let i = 0; i < itemsData.length; i++) {
                        if (itemsData[i].name.toLowerCase().indexOf(searchInput.value.toLowerCase()) > -1) {
                            news.push(itemsData[i]);
                        }
                    }

                    for (let i = (new Number(curPage.innerHTML) - 1) * paginationAmount; i < (new Number(curPage.innerHTML) - 1) * paginationAmount + paginationAmount && i < news.length; i++) {
                        if (news[i].name.toLowerCase().indexOf(searchInput.value.toLowerCase()) > -1) {
                            renderNews.push(news[i]);
                        }
                    }
                    const dataObject = { news : renderNews }
                    const renderedHtmlStr = Mustache.render(templateStr, dataObject);
                    return renderedHtmlStr;
                })
                .then(htmlStr => {
                    const appEl = document.getElementById('app');
                    appEl.innerHTML = htmlStr;
                })
                .catch(err => console.log(err))
        }
    }
    else 
    {
        if (newPage > 0 && newPage <= new Number(lastPage.innerHTML)) {
            curPage.innerText = newPage;
            Promise.all([
                fetch("/templates/items.mst").then(x => x.text()),
                fetch("/api/v1/items").then(x => x.json()),
            ])
                .then(([templateStr, itemsData]) => {
                    let itemsData2 = new Array();
                    for (let i = (new Number(curPage.innerHTML) - 1) * paginationAmount; i < (new Number(curPage.innerHTML) - 1) * paginationAmount + paginationAmount && i < itemsData.length; i++) {
                        itemsData2.push(itemsData[i]);
                    }
                    const dataObject = { news: itemsData2 }
                    const renderedHtmlStr = Mustache.render(templateStr, dataObject);
                    return renderedHtmlStr;
                })
                .then(htmlStr => {
                    const appEl = document.getElementById('app');
                    appEl.innerHTML = htmlStr;
                })
                .catch(err => console.log(err))
        }
    }
}

function search(str) {
    Promise.all([
        fetch("/templates/items.mst").then(x => x.text()),
        fetch("/api/v1/items").then(x => x.json()),
    ])
        .then(([templateStr, itemsData]) => {
            let news = new Array();
            let renderNews = new Array();
            for (let i = 0; i < itemsData.length; i++) {
                if (itemsData[i].name.toLowerCase().indexOf(str.toLowerCase()) > -1) {
                    news.push(itemsData[i]);
                    if (renderNews.length < paginationAmount)
                        renderNews.push(itemsData[i]);
                }
            }
            lastPage.innerHTML = Math.ceil(news.length / paginationAmount);
            if (new Number(lastPage.innerHTML) == 0)
                lastPage.innerHTML = 1;
            curPage.innerHTML = 1;

            const dataObject = { news: renderBlogs }
            const renderedHtmlStr = Mustache.render(templateStr, dataObject);
            return renderedHtmlStr;
        })
        .then(htmlStr => {
            const appEl = document.getElementById('app');
            appEl.innerHTML = htmlStr;
        })
        .catch(err => console.log(err))
}
function clearSearch() {
    searchInput.value = "";
    search("");
}
var lb = document.getElementById("leftButton1");
lb.addEventListener("click", () => updPage(new Number(curPage.innerHTML) - 1));
var rb = document.getElementById("rightButton1");
rb.addEventListener("click", () => updPage(new Number(curPage.innerHTML) + 1));
var cb = document.getElementById("clearButton");
cb.addEventListener("click", () => clearSearch());