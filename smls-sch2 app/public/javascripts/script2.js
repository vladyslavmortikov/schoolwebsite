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
                    let items = new Array();
                    let renderItems = new Array();
                    for (let i = 0; i < itemsData.length; i++) {
                        if (itemsData[i].name.toLowerCase().indexOf(searchInput.value.toLowerCase()) > -1) {
                            items.push(itemsData[i]);
                        }
                    }

                    for (let i = (new Number(curPage.innerHTML) - 1) * paginationAmount; i < (new Number(curPage.innerHTML) - 1) * paginationAmount + paginationAmount && i < items.length; i++) {
                        if (items[i].name.toLowerCase().indexOf(searchInput.value.toLowerCase()) > -1) {
                            renderItems.push(items[i]);
                        }
                    }
                    const dataObject = { items : renderItems }
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
                    const dataObject = { items: itemsData2 }
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
            let items = new Array();
            let renderItems = new Array();
            for (let i = 0; i < itemsData.length; i++) {
                if (itemsData[i].name.toLowerCase().indexOf(str.toLowerCase()) > -1) {
                    items.push(itemsData[i]);
                    if (renderItems.length < paginationAmount)
                        renderItems.push(itemsData[i]);
                }
            }
            lastPage.innerHTML = Math.ceil(items.length / paginationAmount);
            if (new Number(lastPage.innerHTML) == 0)
                lastPage.innerHTML = 1;
            curPage.innerHTML = 1;

            const dataObject = { items: renderBlogs }
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