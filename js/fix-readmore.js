document.addEventListener("DOMContentLoaded", () => {
  const isOverflowingY = (e) => e.scrollHeight > e.clientHeight;
  // 加上 [readmore] 条件可以只选中主页的文章
  const postBlocks = document.querySelectorAll(".post-block:has([readmore])");
  for (const postBlock of postBlocks) {
    // 找出那些说是已经完整显示但实际上又因为最大高度限制被截断的文章，为其添加正确的“阅读全文”按钮
    const postBody = postBlock.querySelector(".post-body");
    const readMore = postBlock.querySelector("[readmore]");
    if (isOverflowingY(postBody)) {
      readMore.setAttribute("readmore", "true");
    }
    // 尝试获取对应页面的信息原地展开
    // const anchor = postBlock.querySelector(".readmore-overlay a");
    // anchor.onclick = (e) => {
    //   e.preventDefault();
    //   anchor.style.pointerEvents = "none";
    //   setTimeout(() => {
    //     anchor.classList.add("readmore-loading");
    //     anchor.textContent = "加载中";
    //   }, 50);
    //   fetch(anchor.href)
    //     .then((response) => {
    //       if (!response.ok) {
    //         throw new Error(`Cannot fetch ${anchor.href}.`);
    //       }
    //       return response.text();
    //     })
    //     .then((html) => {
    //       const parser = new DOMParser();
    //       const doc = parser.parseFromString(html, "text/html");
    //       const fullPostBody = doc.querySelector(".post-body");
    //       postBody.replaceChildren(...fullPostBody.childNodes);
    //       postBody.style.maxHeight = "none";
    //       readMore.setAttribute("readmore", "false");
    //     });
    // };
  }
});
