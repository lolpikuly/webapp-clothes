
const CATEGORIES = [
  "Мужские", "Женские", "Кроссовки", "Кофты", "Штаны",
  "Аксессуары", "Новинки", "Распродажа", "Утеплённые", "Летняя линия"
];

const PRODUCTS = [
  {id:1,name:"Черный худи VAULT",price:4500,img:"/img/hoodie.jpg",cat:"Кофты",desc:"Тёплый худи премиум"},
  {id:2,name:"Базовая футболка",price:1200,img:"/img/tshirt.jpg",cat:"Мужские",desc:"Мягкий хлопок 230 г/м2"},
  {id:3,name:"Кроссовки Runner",price:8700,img:"/img/sneakers.jpg",cat:"Кроссовки",desc:"Лёгкие и удобные"},
  {id:4,name:"Штаны Classic",price:3200,img:"/img/pants.jpg",cat:"Штаны",desc:"Универсальные штаны"},
  {id:5,name:"Аксессуар: ремень",price:800,img:"/img/belt.jpg",cat:"Аксессуары",desc:"Кожаный ремень"}
];

function goHome(){location.href = "index.html"}
function goBack(){history.back()}
function openCart(){alert("Корзина пока заглушка")}

function formatPrice(n){return new Intl.NumberFormat('ru-RU').format(n)+" ₽"}

function renderCategories(){
  const el=document.getElementById("categories");
  if(!el) return;
  el.innerHTML = "";
  CATEGORIES.forEach(c=>{
    const d = document.createElement("div");
    d.className="category";
    d.innerHTML = `<h3>${c}</h3><div class="small">Посмотреть →</div>`;
    d.onclick = ()=>{location.href = "category.html?c="+encodeURIComponent(c)};
    el.appendChild(d);
  });
}

function renderProducts(limit=4){
  const el=document.getElementById("products");
  if(!el) return;
  el.innerHTML = "";
  PRODUCTS.slice(0,limit).forEach(p=>{
    const card = document.createElement("div");
    card.className="card";
    card.innerHTML = `<div class="product"><img src="${p.img}" onerror="this.style.opacity=0.25"><div><div style="display:flex;justify-content:space-between;align-items:center"><div>${p.name}</div><div class=price>${formatPrice(p.price)}</div></div><div class="small">${p.desc}</div><div style="margin-top:8px"><button class="button" onclick="viewProduct(${p.id})">Открыть</button></div></div></div>`;
    el.appendChild(card);
  });
}

function viewProduct(id){
  location.href = "product.html?id="+id;
}

function renderCategoryPage(){
  const params = new URLSearchParams(location.search);
  const cat = params.get("c") || "Категория";
  document.getElementById("catTitle").innerText = cat;
  const el=document.getElementById("catProducts");
  el.innerHTML = "";
  PRODUCTS.filter(p=>p.cat===cat).forEach(p=>{
    const card = document.createElement("div");
    card.className="card";
    card.innerHTML = `<div class="product"><img src="${p.img}" onerror="this.style.opacity=0.25"><div><div style="display:flex;justify-content:space-between;align-items:center"><div>${p.name}</div><div class=price>${formatPrice(p.price)}</div></div><div class="small">${p.desc}</div><div style="margin-top:8px"><button class="button" onclick="viewProduct(${p.id})">Открыть</button></div></div></div>`;
    el.appendChild(card);
  });
}

function renderProductPage(){
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id")||"0");
  const p = PRODUCTS.find(x=>x.id===id) || PRODUCTS[0];
  document.getElementById("pname").innerText = p.name;
  document.getElementById("pprice").innerText = formatPrice(p.price);
  document.getElementById("pdesc").innerText = p.desc;
  document.getElementById("pimg").src = p.img;
  document.getElementById("sumItem").innerText = formatPrice(p.price);
  document.getElementById("sumShip").innerText = "—";
  document.getElementById("total").innerText = formatPrice(p.price);
  window._currentProduct = p;
}

// Simple mock shipping calculator: uses city length and price to simulate cost
function calcShipping(){
  const city = (document.getElementById("city")||{}).value || "";
  const base = 250; // base cost
  const price = window._currentProduct ? window._currentProduct.price : 0;
  // mock: cheaper in big cities
  const isBig = ["москва","санкт","питер","сочи","екат"].some(s=>city.toLowerCase().includes(s));
  const ship = Math.max(120, Math.round(base + (price*0.03) + (isBig? -80:80)));
  document.getElementById("shipResult").innerText = formatPrice(ship);
  document.getElementById("sumShip").innerText = formatPrice(ship);
  document.getElementById("total").innerText = formatPrice(price + ship);
  window._lastShipping = ship;
}

// Checkout placeholder: builds order payload, redirects to Tinkoff (mock)
function checkout(){
  const p = window._currentProduct;
  const ship = window._lastShipping || 0;
  const total = p.price + ship;
  const order = {
    id: Date.now(),
    productId:p.id,
    productName:p.name,
    price:p.price,
    shipping:ship,
    total: total,
    city: (document.getElementById("city")||{}).value || "",
    status: "pending"
  };
  // In real app: send order to backend, create payment via Tinkoff Kassa, get payUrl and redirect.
  // Here: simulate and show JSON
  alert("Заказ (демо):\n" + JSON.stringify(order,null,2) + "\n\nЗдесь будет редирект на Tinkoff Kassa.");
}

// Routing
document.addEventListener("DOMContentLoaded",()=>{
  renderCategories();
  renderProducts(6);
  if(location.pathname.endsWith("category.html")) renderCategoryPage();
  if(location.pathname.endsWith("product.html")) renderProductPage();
  if(location.pathname.endsWith("index.html") || location.pathname=="/" ) { /* already rendered */ }
});
