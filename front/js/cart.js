let panier = JSON.parse(localStorage.getItem("panier"));
if (panier === null) panier = [];
const panierSection = document.getElementById("cart__items");

/**
 * Fonction pour enregistrer le panier
 */
function save() {
  const panierStr = JSON.stringify(panier);
  localStorage.setItem("panier", panierStr);
}

/**
 * Fonction pour supprimer un article du panier
 * @param {number} id
 */
function deleteItem(id, color) {
  const index = panier.findIndex((i) => i.id === id && i.color === color);
  panier.splice(index, 1);
  save();
  updatePrice();
  deleteProduct(id, color);
}

/**
 * Fonction pour retirer un produit du panier en fonction de son Id + Color
 * @param {string} productId 
 * @param {string} color 
 */
function deleteProduct(productId, color) {
  const product = panierSection.querySelector(`article[data-id="${productId}"][data-color="${color}"]`)
  product.remove();
}

/**
 * Fonction qui permet de modifier la quantité du canapé
 * @param {*} event 
 * @param {string} id 
 * @param {string} color 
 */
function itemQuantity(event, id, color) {
  // On récupère le bon produit grâce a l'id + color pour changer la quantité du canapé
  const index = panier.findIndex((i) => i.id === id && i.color === color);
  panier[index].quantity = event.value;

  // Si un canapé passe a 0 en quantité, on fait appel a la fonction deleteItem pour retirer le canapé
  if (panier[index].quantity <= 0) {
    deleteItem(id, color);
  }
  save();
  updatePrice();
}

/**
 * Fonction pour mettre à jour le prix total du panier
 */
async function updatePrice() {
  let totalPrice = 0;
  let totalQuantity = 0;

  for (let i = 0; i < panier.length; i++) {
    const id = panier[i].id;
    const quantity = panier[i].quantity;
    const API_URL = `http://localhost:3000/api/products/${id}`;

    const res = await fetch(API_URL);
    const product = await res.json();

    totalQuantity += parseInt(quantity);
    totalPrice += quantity * product.price;
  }
  const totalQuantitySpan = document.getElementById("totalQuantity");
  totalQuantitySpan.textContent = totalQuantity;
  const totalPriceSpan = document.getElementById("totalPrice");
  totalPriceSpan.textContent = totalPrice;
}

async function main() {
  for (let i = 0; i < panier.length; i++) {
    const id = panier[i].id;
    const API_URL = `http://localhost:3000/api/products/${id}`;

    const res = await fetch(API_URL);
    const product = await res.json();

    const quantity = panier[i].quantity;
    const color = panier[i].color;

    panierSection.innerHTML += `
      <article class="cart__item" data-id="${id}" data-color="${color}">
          <div class="cart__item__img">
              <img src="${product.imageUrl}" alt="Photographie d'un canapé">
          </div>
          <div class="cart__item__content">
              <div class="cart__item__content__description">
                  <h2>${product.name}</h2>
                  <p>${color}</p>
                  <p>${product.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                      <p>Qté :</p>
                      <input type="number" onchange="itemQuantity(this, '${id}', '${color}')" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                      <p class="deleteItem" onclick="deleteItem('${id}', '${color}')">Supprimer</p>
                  </div>
              </div>
          </div>
      </article>
      `;
  }
  updatePrice();
}

/**
 * Fonction pour vérifier les coordonnées du formulaire
 */
function form() {
  const orderForm = document.getElementsByClassName("cart__order__form");
  orderForm[0].addEventListener("submit", async (event) => {
    event.preventDefault();
    // On initialise error sur la valeur faux
    let error = false;

    // On test si il y a un chiffre dans la saisie du "prénom"
    const firstName = document.getElementById("firstName").value;
    if (firstName === '' || /\d/.test(firstName)) {
      const firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
      firstNameErrorMsg.textContent = "Le prénom ne doit pas contenir de chiffre"
      error = true;
    }

    const lastName = document.getElementById("lastName").value;
    if (lastName === '' || /\d/.test(lastName)) {
      const lastNameErrorMsg = document.getElementById("lastNameErrorMsg")
      lastNameErrorMsg.textContent = "Le nom ne doit pas contenir de chiffre"
      error = true;
    }

    const address = document.getElementById("address").value;
    if (address === '') {
      const addressErrorMsg = document.getElementById("addressErrorMsg")
      addressErrorMsg.textContent = "L'addresse renseigné est vide"
      error = true;
    }

    const city = document.getElementById("city").value;
    if (city === '') {
      const cityErrorMsg = document.getElementById("cityErrorMsg")
      cityErrorMsg.textContent = "La ville renseigné est vide"
      error = true;
    }

    const email = document.getElementById("email").value;
    if (email === '' || !/@/.test(email)) {
      const emailErrorMsg = document.getElementById("emailErrorMsg")
      emailErrorMsg.textContent = "L'addresse email est incorrecte"
      error = true;
    }

    // Si error est différent de faux, alors on termine la fonction ici
    if (error) {
      return
    }

    // Si il n'y a pas eu d'erreur dans la saisie des coordoonnées, on crée un objet contact
    const contact = {
      firstName,
      lastName,
      address,
      city,
      email
    };

    let products = [];
    for (let i = 0; i < panier.length; i++) {
      const id = panier[i].id;
      products.push(id);
    }

    const API_URL = "http://localhost:3000/api/products/order";

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact: contact,
        products: products
      })
    });
    const content = await res.json();
    window.location.assign(`confirmation.html?id=${content.orderId}`);
    localStorage.removeItem('panier');
  });
}

main();
form();