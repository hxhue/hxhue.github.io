(function () {
  const wrapTables = () => {
    document.querySelectorAll(".post-body > table").forEach((t) => {
      const div = document.createElement("div");
      div.style.overflowX = "auto";
      t.insertAdjacentElement("beforebegin", div);
      t.remove();
      div.appendChild(t);
    });
  };
  document.addEventListener("DOMContentLoaded", wrapTables);
})();
