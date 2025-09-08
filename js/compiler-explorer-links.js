(function () {
  function g(maybeDocument) {
    let found = false;
    const postBody = maybeDocument.querySelector("div.post-body");
    Array.from(maybeDocument.querySelectorAll("a")).forEach((anchor) => {
      const result = anchor.href.match(/^(https:\/\/godbolt.org\/z\/[^\/]+)/);
      const elementFromHTML = (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.firstElementChild;
      };
      if (result) {
        const url = result[1] + "/code/1";
        let paragraph = anchor.parentElement;
        while (paragraph && paragraph.parentElement !== postBody) {
          paragraph = paragraph.parentElement;
        }
        if (!paragraph) {
          console.log(
            "unexpected anchor during godbolt link processing:",
            anchor
          );
          return;
        }

        // 插入包含 tooltip 的 HTML 结构
        const wrapper = elementFromHTML(
          `
          <div class='godbolt-code-preview'>
            <div class='tooltip'>
              <iframe src="${url}"></iframe>
            </div>
          </div>
          `
        );

        // 加到里面，而不是旁边
        anchor.insertAdjacentElement("beforeend", wrapper);
        // 只有 anchor 中没有图片的时候才手动添加 godbolt 图标。
        // 在《GCC optimize-sibling-calls 的反向优化》这篇文章中就有这种反例。
        if (
          !Array.from(anchor.children).some((elem) => elem.tagName == "IMG")
        ) {
          anchor.firstElementChild.insertAdjacentElement(
            "beforebegin",
            elementFromHTML(
              `
            <div style='display: inline-flex; vertical-align: -15.5%; margin: 0 -2px 0 2px'>
              <img class='emoji' height='24px' style='margin: 0; padding: 0' src='https://www.google.com/s2/favicons?domain=godbolt.org&sz=128'>
              </img>
            </div>
            `
            )
          );
        }

        // http://localhost:1313/posts/programming/cuda/cuda-kernel-%E5%B8%B8%E7%94%A8-float-%E7%B1%BB%E5%9E%8B%E8%BF%99%E4%BB%B6%E4%BA%8B/
        // http://localhost:1313/posts/series/cppcon-talks/cppcon-2023-c++-memory-model---from-c++11-to-c++23---alex-dathskovsky/
        // 添加事件监听器以在鼠标悬停时更新提示框位置
        const updateTooltipPosition = (
          event,
          tooltipWidthInPx,
          anchor,
          wrapper,
          tooltip
        ) => {
          if (tooltipWidthInPx == 0) {
            // 用 transitionend 来处理，这里就不处理了
            // tooltip.style.width = 0;
            return;
          }
          const wrapperRect = wrapper.getBoundingClientRect();
          // 计算相对位置
          let left = event.clientX - wrapperRect.left;
          let top = event.clientY - wrapperRect.top;
          // 修正 left，防止其超出边界
          const leftBound = 0 - wrapperRect.left;
          // magic number 40
          const rightBound =
            maybeDocument.body.clientWidth -
            tooltipWidthInPx / 2 -
            40 -
            wrapperRect.left;
          left = Math.min(Math.max(leftBound, left), rightBound);
          // 更新位置
          tooltip.style.left = `${left}px`;
          tooltip.style.top = `${top}px`;
          tooltip.style.width = `${tooltipWidthInPx}px`;
        };

        const tooltip = wrapper.querySelector(".tooltip");
        tooltip.addEventListener("transitionend", (event) => {
          if (
            event.propertyName === "opacity" &&
            event.target === tooltip &&
            tooltip.style.opacity < 0.05
          ) {
            event.target.style.width = 0;
          }
        });

        // FIXED: mouseenter 和 mouseleave 会触发多次
        // 1. 原因是 tooltip 遮住了 anchor 导致反复触发：https://stackoverflow.com/a/7127328/
        // 2. 把 tooltip 和所在预览块的指针事件设置为 none 会导致 tooltip 不能滚动（离开 anchor 就消失）
        // TODO 获取行高以设置图片高度，获取文本宽度以设置框的宽度
        const showTooltip = (event) => {
          updateTooltipPosition(event, 450, anchor, wrapper, tooltip);
          tooltip.style.opacity = 1;
        };
        const hideTooltip = (event) => {
          updateTooltipPosition(event, 0, anchor, wrapper, tooltip);
          tooltip.style.opacity = 0;
        };
        anchor.addEventListener("mouseenter", showTooltip);
        anchor.addEventListener("mouseleave", hideTooltip);
        found = true;
      }
    });
    if (!found) {
      // console.log("godbolt.org links not found");
    }
  }

  document.addEventListener("DOMContentLoaded", () => g(document));
})();
