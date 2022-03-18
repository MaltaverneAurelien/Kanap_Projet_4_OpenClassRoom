const API_URL = "http://localhost:3000/api/products"

// Méthode qui permet de récupérer les informations des products
fetch(API_URL)
    .then(function(products) {
        if(products.ok) {
            return products.json();
        }
    })
    .then(function(order) {
        // Boucle qui permet de récupèrer les informations en fonction de la taille de l'order (canapé différent)
        for(let i=0 ; i < order.length; i++) {
            let productId = order[i]._id;
            let productName = order[i].name;
            let productImg = order[i].imageUrl;
            let productDescription = order[i].description;
           
            const section = document.getElementById("items")
            // On crée une partie HTML avec les informations récupèrer auparavant pour afficher le produit (canapé)
            section.innerHTML += `
            <article id="${productId}" class="items">
                <a href="./product.html?id=${productId}">
                    <article>
                        <img src="${productImg}" alt="${productName}">
                        <h3 class="productName">${productName}</h3>
                        <p class="productDescription">${productDescription}</p>
                    </article>
                </a>
            </article>
            `
        }
    })
    .catch(function(err) {
        console.log(err);
    });