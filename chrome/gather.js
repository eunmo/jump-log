'use strict';

function extract() {
let tocButton = document.getElementById('showTableOfContents');
tocButton.click();

var toc = document.getElementById('tableOfContents');
console.log(toc);

var list = [];

toc.childNodes.forEach(item => {
  var title = item.getElementsByClassName("tocTitle")[0].textContent;
  var creator = item.getElementsByClassName("tocCreator")[0].textContent;

  if (false
  || title.includes("(モノクロ冒頭ページ)")
  || title.includes("(オールカラー)")
  || title.includes("本誌版次号予告"))
    return;

  title = title.replace("(巻頭カラー)", "");

  if (creator.includes(", ")) {
    creator = creator.split(", ").reverse().join("　／　");
  }

  list.push({ title: title, creator: creator });
});

var url = "http://13.230.33.104:3070/new/" + encodeURIComponent(JSON.stringify(list));
var jump = window.open(url, '_blank', 'toolbar=0,location=0,menubar=0');

tocButton.click();
};

extract();
