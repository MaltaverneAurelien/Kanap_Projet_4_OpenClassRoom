// On récupère l'orderId de l'url dans la variable id
const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);
const id = searchParams.get("id");
// On affiche la variable id dans le span qui a pour id = orderId
const orderId = document.getElementById("orderId")
orderId.textContent = id;