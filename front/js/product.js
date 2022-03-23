const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);
let id;

// Si il y a une présence d'un id dans l'url alors on le stock dans la variable id
if (searchParams.has("id")) {
    id = searchParams.get("id");
}

const API_URL = `http://localhost:3000/api/products/${id}`;

fetch(API_URL)
    .then(function (productRes) {
        if (productRes.ok) {
            return productRes.json();
        }
    })
    .then(function (oneProduct) {
        let productId = oneProduct._id;
        let productName = oneProduct.name;
        let productColors = oneProduct.colors;
        let productImg = oneProduct.imageUrl;
        let productDescription = oneProduct.description;
        let productPrice = oneProduct.price;

        let img = document.getElementById("image");
        image.setAttribute("src", productImg);

        let title = document.getElementById("title");
        title.textContent = productName;

        let price = document.getElementById("price");
        price.textContent = productPrice;

        let description = document.getElementById("description");
        description.textContent = productDescription;

        let colors = document.getElementById("colors");
        for (i = 0; i < productColors.length; i++) {
            colors.innerHTML += `
            <option value="${productColors[i]}">${productColors[i]}</option>
        `;
        }
        const addToCart = document.getElementById("addToCart");
        let panier = JSON.parse(localStorage.getItem("panier"));
        console.log(panier);
        if (panier === null) {
            panier = [];
        }

        addToCart.addEventListener("click", (event) => {
            event.preventDefault();
            const quantity = parseInt(document.getElementById("quantity").value);
            const color = document.getElementById("colors").value;
            
            const order = {
                id: productId,
                quantity: quantity,
                color: color,
            };
            

            if (panier.some((element) => element.id == order.id && element.color == order.color)) {
                const index = panier.findIndex((element) => element.id == order.id && element.color == order.color);
                const total = panier[index].quantity + order.quantity;

                if(total <= 100) {
                    panier[index].quantity += order.quantity;
                }
                else {
                    console.log("%c Message d'erreur : Quantité saisie", "color: red;");
                }
            } else {
                panier.push(order);
            }

            const panierStr = JSON.stringify(panier);
            console.log(panier);
            localStorage.setItem("panier", panierStr);

            window.location.assign("cart.html");
        });
    })
    .catch(function (err) {
        console.log(err);
    });