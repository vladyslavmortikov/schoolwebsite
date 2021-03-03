var curPage = document.getElementById('page');
var paginationAmount = 3;

Promise.all([
    fetch("/templates/items.mst").then(x => x.text()),
    fetch("/api/v1/items").then(x => x.json())
])
    .then(([templateStr, itemsData]) => {
        let lastPage = Math.ceil(itemsData.length / paginationAmount);
        let itemsToRender = new Array();
        for (let i = (new Number(curPage.innerHTML) - 1) * paginationAmount; i < (new Number(curPage.innerHTML) - 1) * paginationAmount + paginationAmount && i < itemsData.length; i++) {
            itemsToRender.push(itemsData[i]);
        }
        const dataObject = { news: itemsToRender };
        const lp = document.getElementById('lastPage');
        lp.innerText = Math.ceil(lastPage);
        const renderedHtmlStr = Mustache.render(templateStr, dataObject);
        return renderedHtmlStr;
    })
    .then(htmlStr => {
        const appEl = document.getElementById('app');
        appEl.innerHTML = htmlStr
    })
    .catch(err => console.error(err));