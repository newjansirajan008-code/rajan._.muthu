let cart =
    JSON.parse(
        localStorage.getItem("smartCanteenCart")
    ) || [];


/* ================= SAVE CART ================= */

function saveCart() {

    localStorage.setItem(
        "smartCanteenCart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


/* ================= ADD TO CART ================= */

function addToCart(name, price, emoji) {

    const existing =
        cart.find(item => item.name === name);


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            name: name,

            price: price,

            emoji: emoji,

            quantity: 1

        });

    }


    saveCart();


    showToast(
        "✓ " + name + " added to cart"
    );
}


/* ================= CART COUNT ================= */

function updateCartCount() {

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const countElement =
        document.getElementById(
            "cartCount"
        );


    if (countElement) {

        countElement.textContent =
            count;

    }


    const mobileText =
        document.getElementById(
            "mobileCartText"
        );


    const mobilePrice =
        document.getElementById(
            "mobileCartPrice"
        );


    if (mobileText && mobilePrice) {

        const total =
            getSubtotal();


        mobileText.textContent =
            count === 0
                ? "View Cart"
                : `${count} item${count > 1 ? "s" : ""}`;

        mobilePrice.textContent =
            "₹" + total;

    }

}


/* ================= SUBTOTAL ================= */

function getSubtotal() {

    return cart.reduce(

        (total, item) =>

            total +
            item.price *
            item.quantity,

        0

    );

}


/* ================= REMOVE ITEM ================= */

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    renderCart();

}


/* ================= CHANGE QUANTITY ================= */

function changeQuantity(index, amount) {

    cart[index].quantity += amount;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();

    renderCart();

}


/* ================= RENDER CART ================= */

function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    if (!container) return;


    if (cart.length === 0) {

        container.innerHTML = `

            <div style="
                text-align:center;
                padding:50px 10px;
            ">

                <div style="
                    font-size:60px;
                ">
                    🛒
                </div>

                <h2>
                    Your cart is empty
                </h2>

                <p style="
                    color:#777;
                    margin-top:8px;
                ">
                    Add some delicious food!
                </p>

                <a
                    href="menu.html"
                    class="checkout-btn"
                    style="
                        max-width:250px;
                        margin:20px auto;
                    "
                >
                    Browse Menu
                </a>

            </div>

        `;

        updateSummary();

        return;
    }


    container.innerHTML =

        cart.map(
            (item, index) => `

            <div class="cart-item">

                <div class="cart-item-icon">
                    ${item.emoji}
                </div>


                <div class="cart-item-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ₹${item.price}
                        each
                    </p>

                </div>


                <div class="qty">

                    <button
                        onclick="
                            changeQuantity(
                                ${index},
                                -1
                            )
                        "
                    >
                        −
                    </button>

                    <strong>
                        ${item.quantity}
                    </strong>

                    <button
                        onclick="
                            changeQuantity(
                                ${index},
                                1
                            )
                        "
                    >
                        +
                    </button>

                </div>


                <strong>
                    ₹${item.price * item.quantity}
                </strong>

            </div>

        `
        ).join("");


    updateSummary();

}


/* ================= SUMMARY ================= */

function updateSummary() {

    const subtotal =
        getSubtotal();


    const serviceFee =
        subtotal > 0 ? 5 : 0;


    const total =
        subtotal + serviceFee;


    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );


    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            "₹" + subtotal;

    }


    if (totalElement) {

        totalElement.textContent =
            "₹" + total;

    }

}


/* ================= SEARCH ================= */

function searchFood() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) return;


    const query =
        input.value.toLowerCase();


    const cards =
        document.querySelectorAll(
            ".food-card"
        );


    cards.forEach(card => {

        const name =
            card.dataset.name
                .toLowerCase();


        if (name.includes(query)) {

            card.style.display =
                "block";

        } else {

            card.style.display =
                "none";

        }

    });

}


/* ================= FILTER ================= */

function filterFood(category, button) {

    const cards =
        document.querySelectorAll(
            ".food-card"
        );


    document
        .querySelectorAll(".category")
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );

        });


    button.classList.add("active");


    cards.forEach(card => {

        if (
            category === "all" ||
            card.dataset.category ===
                category
        ) {

            card.style.display =
                "block";

        } else {

            card.style.display =
                "none";

        }

    });

}


/* ================= TOAST ================= */

function showToast(message) {

    let toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id = "toast";


        toast.style.position =
            "fixed";

        toast.style.bottom =
            "90px";

        toast.style.left =
            "50%";

        toast.style.transform =
            "translateX(-50%)";

        toast.style.background =
            "#222";

        toast.style.color =
            "white";

        toast.style.padding =
            "12px 20px";

        toast.style.borderRadius =
            "8px";

        toast.style.fontSize =
            "13px";

        toast.style.fontWeight =
            "700";

        toast.style.zIndex =
            "9999";

        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.style.opacity = "1";


    setTimeout(() => {

        toast.style.opacity = "0";

    }, 2000);

}


/* ================= PLACE ORDER ================= */

function placeOrder(event) {

    if (event) {

        event.preventDefault();

    }


    if (cart.length === 0) {

        alert(
            "Please add food to your cart first."
        );

        return;

    }


    const name =
        document.getElementById(
            "studentName"
        )?.value;


    const department =
        document.getElementById(
            "department"
        )?.value;


    const phone =
        document.getElementById(
            "phone"
        )?.value;


    if (!name || !department || !phone) {

        alert(
            "Please fill all details."
        );

        return;

    }


    const token =
        "SC" +
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    const total =
        getSubtotal() + 5;


    const order = {

        token: token,

        name: name,

        department: department,

        phone: phone,

        items: cart,

        total: total,

        status:
            "Order Received",

        createdAt:
            new Date().toLocaleString()

    };


    localStorage.setItem(

        "smartCanteenOrder",

        JSON.stringify(order)

    );


    cart = [];


    saveCart();


    window.location.href =
        "success.html";

}


/* ================= LOAD SUCCESS ================= */

function loadSuccess() {

    const order =
        JSON.parse(
            localStorage.getItem(
                "smartCanteenOrder"
            )
        );


    if (!order) return;


    const token =
        document.getElementById(
            "tokenNumber"
        );


    const customer =
        document.getElementById(
            "customerName"
        );


    const total =
        document.getElementById(
            "successTotal"
        );


    if (token) {

        token.textContent =
            "#" + order.token;

    }


    if (customer) {

        customer.textContent =
            "Thank you, " +
            order.name +
            "!";

    }


    if (total) {

        total.textContent =
            "₹" + order.total;

    }

}


/* ================= TRACKING ================= */

function loadTracking() {

    const order =
        JSON.parse(
            localStorage.getItem(
                "smartCanteenOrder"
            )
        );


    if (!order) return;


    const token =
        document.getElementById(
            "trackToken"
        );


    if (token) {

        token.textContent =
            "#" + order.token;

    }

}


/* ================= PAGE LOAD ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartCount();

        renderCart();

        loadSuccess();

        loadTracking();

    }
);
