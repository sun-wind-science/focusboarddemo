// 通用：页脚年份

(() => {

&nbsp; const el = document.getElementById("year");

&nbsp; if (el) el.textContent = String(new Date().getFullYear());

})();



// --- Post 页面：用 ?id=1 的方式假装动态 ---

(() => {

&nbsp; const titleEl = document.getElementById("title");

&nbsp; const metaEl = document.getElementById("meta");

&nbsp; const contentEl = document.getElementById("content");

&nbsp; if (!titleEl || !metaEl || !contentEl) return;



&nbsp; const posts = {

&nbsp;   "1": {

&nbsp;     title: "我为什么做 FocusBoard",

&nbsp;     meta: "2026-02-11 · 3 min",

&nbsp;     paragraphs: \[

&nbsp;       "我想把“网页是什么、怎么演化成产品”这条链路做一遍。",

&nbsp;       "阶段1先把页面结构跑通；阶段2引入后端与数据；阶段3做成 SPA + 登录。"

&nbsp;     ]

&nbsp;   },

&nbsp;   "2": {

&nbsp;     title: "静态网站：从零到上线",

&nbsp;     meta: "2026-02-11 · 5 min",

&nbsp;     paragraphs: \[

&nbsp;       "静态网站的优势是简单、稳定、便宜。",

&nbsp;       "部署可以用 GitHub Pages 或 Vercel；内容可以用 Markdown 管理（后续再上）。"

&nbsp;     ]

&nbsp;   },

&nbsp;   "3": {

&nbsp;     title: "我如何组织学习与项目",

&nbsp;     meta: "2026-02-11 · 4 min",

&nbsp;     paragraphs: \[

&nbsp;       "每次只推进一个可验收点：能看、能用、能迭代。",

&nbsp;       "先做最小版本，再逐步加功能，避免一上来就做大而全。"

&nbsp;     ]

&nbsp;   }

&nbsp; };



&nbsp; const params = new URLSearchParams(window.location.search);

&nbsp; const id = params.get("id") || "1";

&nbsp; const post = posts\[id] || posts\["1"];



&nbsp; document.title = `FocusBoard - ${post.title}`;

&nbsp; titleEl.textContent = post.title;

&nbsp; metaEl.textContent = post.meta;

&nbsp; contentEl.innerHTML = post.paragraphs.map(p => `<p>${p}</p>`).join("");

})();



// --- Dashboard：用 localStorage 存 goals（阶段1） ---

(() => {

&nbsp; const form = document.getElementById("goalForm");

&nbsp; const list = document.getElementById("goalList");

&nbsp; const clearBtn = document.getElementById("clearGoals");

&nbsp; if (!form || !list || !clearBtn) return;



&nbsp; const KEY = "focusboard\_goals\_v1";



&nbsp; function loadGoals() {

&nbsp;   try { return JSON.parse(localStorage.getItem(KEY) || "\[]"); }

&nbsp;   catch { return \[]; }

&nbsp; }



&nbsp; function saveGoals(goals) {

&nbsp;   localStorage.setItem(KEY, JSON.stringify(goals));

&nbsp; }



&nbsp; function render() {

&nbsp;   const goals = loadGoals();

&nbsp;   if (goals.length === 0) {

&nbsp;     list.innerHTML = `<li class="muted">暂无目标。先加一个。</li>`;

&nbsp;     return;

&nbsp;   }



&nbsp;   list.innerHTML = goals.map((g, idx) => {

&nbsp;     const safeTitle = String(g.title).replaceAll("<", "\&lt;").replaceAll(">", "\&gt;");

&nbsp;     const p = Math.max(0, Math.min(100, Number(g.progress) || 0));

&nbsp;     return `

&nbsp;       <li>

&nbsp;         <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">

&nbsp;           <div>

&nbsp;             <strong>${safeTitle}</strong>

&nbsp;             <div class="meta muted">进度：${p}%</div>

&nbsp;             <div style="height:10px;border-radius:999px;background:rgba(255,255,255,0.08);overflow:hidden;margin-top:8px;">

&nbsp;               <div style="width:${p}%;height:100%;background:rgba(255,255,255,0.22);"></div>

&nbsp;             </div>

&nbsp;           </div>

&nbsp;           <button class="btn btn-ghost" data-del="${idx}" type="button">删除</button>

&nbsp;         </div>

&nbsp;       </li>

&nbsp;     `;

&nbsp;   }).join("");



&nbsp;   // 绑定删除

&nbsp;   list.querySelectorAll("\[data-del]").forEach(btn => {

&nbsp;     btn.addEventListener("click", () => {

&nbsp;       const goals = loadGoals();

&nbsp;       const idx = Number(btn.getAttribute("data-del"));

&nbsp;       goals.splice(idx, 1);

&nbsp;       saveGoals(goals);

&nbsp;       render();

&nbsp;     });

&nbsp;   });

&nbsp; }



&nbsp; form.addEventListener("submit", (e) => {

&nbsp;   e.preventDefault();

&nbsp;   const title = document.getElementById("goalTitle").value.trim();

&nbsp;   const progress = document.getElementById("goalProgress").value;

&nbsp;   if (!title) return;



&nbsp;   const goals = loadGoals();

&nbsp;   goals.unshift({ title, progress: Number(progress) });

&nbsp;   saveGoals(goals);



&nbsp;   form.reset();

&nbsp;   document.getElementById("goalProgress").value = 0;

&nbsp;   render();

&nbsp; });



&nbsp; clearBtn.addEventListener("click", () => {

&nbsp;   localStorage.removeItem(KEY);

&nbsp;   render();

&nbsp; });



&nbsp; render();

})();



