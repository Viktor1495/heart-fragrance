document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       CART
    ========================================= */

    let cart = [];

    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const cartItems = document.getElementById("cartItems");

    const cartBtn = document.getElementById("cartBtn");
    const cartPanel = document.getElementById("cartPanel");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCart = document.getElementById("closeCart");

    function openCart() {
        cartPanel.classList.add("active");
        cartOverlay.classList.add("active");
    }

    function closeCartPanel() {
        cartPanel.classList.remove("active");
        cartOverlay.classList.remove("active");
    }

    cartBtn.addEventListener("click", openCart);
    closeCart.addEventListener("click", closeCartPanel);
    cartOverlay.addEventListener("click", closeCartPanel);


    function updateCart() {

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        const totalPrice = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        cartCount.textContent = totalItems;

        cartTotal.textContent =
            totalPrice.toLocaleString("ru-RU") + " ₽";


        if (cart.length === 0) {

            cartItems.innerHTML = `
                <div class="empty-cart">
                    <span>🕯️</span>
                    <p>Ваша корзина пока пуста</p>
                </div>
            `;

            return;
        }


        cartItems.innerHTML = "";

        cart.forEach((item, index) => {

            const itemElement = document.createElement("div");

            itemElement.classList.add("cart-item");

            itemElement.innerHTML = `
                <div>
                    <h4>${item.name}</h4>

                    <p>
                        ${item.price.toLocaleString("ru-RU")} ₽
                        × ${item.quantity}
                    </p>
                </div>

                <button data-index="${index}">
                    Удалить
                </button>
            `;

            cartItems.appendChild(itemElement);

        });


        document.querySelectorAll(".cart-item button").forEach(button => {

            button.addEventListener("click", () => {

                const index = Number(button.dataset.index);

                cart.splice(index, 1);

                updateCart();

            });

        });

    }


    document.querySelectorAll(".add-cart").forEach(button => {

        button.addEventListener("click", () => {

            const name = button.dataset.name;
            const price = Number(button.dataset.price);

            const existingProduct = cart.find(
                item => item.name === name
            );


            if (existingProduct) {

                existingProduct.quantity++;

            } else {

                cart.push({
                    name,
                    price,
                    quantity: 1
                });

            }


            updateCart();
            showToast();

        });

    });


    /* =========================================
       TOAST
    ========================================= */

    const toast = document.getElementById("toast");

    function showToast(message = "Товар добавлен в корзину") {

        toast.textContent = message;

        toast.classList.add("show");

        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

    }


    /* =========================================
       FAVORITES
    ========================================= */

    let favoriteCount = 0;

    const favoriteCounter =
        document.getElementById("favoriteCount");


    document.querySelectorAll(".favorite-product").forEach(button => {

        button.addEventListener("click", () => {

            button.classList.toggle("active");

            if (button.classList.contains("active")) {

                button.textContent = "♥";
                favoriteCount++;

                showToast("Добавлено в избранное");

            } else {

                button.textContent = "♡";
                favoriteCount--;

            }

            favoriteCounter.textContent = favoriteCount;

        });

    });


    /* =========================================
       IMAGE HOVER CHANGE
    ========================================= */

    document.querySelectorAll(
        ".catalog-product-image img"
    ).forEach(image => {

        const original =
            image.dataset.original;

        const hover =
            image.dataset.hover;


        image.addEventListener("mouseenter", () => {

            if (hover) {

                image.style.opacity = "0";

                setTimeout(() => {

                    image.src = hover;
                    image.style.opacity = "1";

                }, 150);

            }

        });


        image.addEventListener("mouseleave", () => {

            if (original) {

                image.style.opacity = "0";

                setTimeout(() => {

                    image.src = original;
                    image.style.opacity = "1";

                }, 150);

            }

        });

    });


    /* =========================================
       BESTSELLER HOVER IMAGE
    ========================================= */

    document.querySelectorAll(
        ".product-image img"
    ).forEach(image => {

        const original = image.src;
        const hover = image.dataset.hover;

        image.addEventListener("mouseenter", () => {

            if (hover) {
                image.src = hover;
            }

        });

        image.addEventListener("mouseleave", () => {

            image.src = original;

        });

    });


    /* =========================================
       CATALOG FILTERS
    ========================================= */

    const categoryFilter =
        document.getElementById("categoryFilter");

    const aromaFilter =
        document.getElementById("aromaFilter");

    const sortFilter =
        document.getElementById("sortFilter");

    const catalogProducts =
        document.getElementById("catalogProducts");

    const productsFound =
        document.getElementById("productsFound");


    function filterProducts() {

        const category =
            categoryFilter.value;

        const aroma =
            aromaFilter.value;

        const products =
            Array.from(
                document.querySelectorAll(".catalog-product")
            );


        let visibleProducts = products.filter(product => {

            const categoryMatch =
                category === "all" ||
                product.dataset.category === category;

            const aromaMatch =
                aroma === "all" ||
                product.dataset.aroma === aroma;

            return categoryMatch && aromaMatch;

        });


        products.forEach(product => {

            product.classList.add("hidden");

        });


        visibleProducts.forEach(product => {

            product.classList.remove("hidden");

        });


        sortProducts(visibleProducts);

        productsFound.textContent =
            visibleProducts.length;

    }


    function sortProducts(products) {

        const type = sortFilter.value;

        products.sort((a, b) => {

            if (type === "low") {

                return Number(a.dataset.price) -
                       Number(b.dataset.price);

            }

            if (type === "high") {

                return Number(b.dataset.price) -
                       Number(a.dataset.price);

            }

            if (type === "new") {

                return (b.dataset.new === "true") -
                       (a.dataset.new === "true");

            }

            return 0;

        });


        products.forEach(product => {

            catalogProducts.appendChild(product);

        });

    }


    categoryFilter.addEventListener(
        "change",
        filterProducts
    );

    aromaFilter.addEventListener(
        "change",
        filterProducts
    );

    sortFilter.addEventListener(
        "change",
        filterProducts
    );


    /* =========================================
       CATEGORY BUTTONS
    ========================================= */

    document.querySelectorAll(
        "[data-category]"
    ).forEach(button => {

        button.addEventListener("click", () => {

            const category =
                button.dataset.category;

            if (!category) return;


            categoryFilter.value = category;

            document.querySelectorAll(
                ".category-main"
            ).forEach(item => {

                item.classList.remove("active");

            });


            button.classList.add("active");

            filterProducts();

        });

    });


    /* =========================================
       COLLECTION LINKS
    ========================================= */

    document.querySelectorAll(
        "[data-category-link]"
    ).forEach(link => {

        link.addEventListener("click", () => {

            const category =
                link.dataset.categoryLink;

            categoryFilter.value = category;

            setTimeout(() => {

                filterProducts();

            }, 100);

        });

    });


    /* =========================================
       STORIES
    ========================================= */

    
const storiesTrack =
    document.getElementById("storiesTrack");

const storiesPrev =
    document.getElementById("storiesPrev");

const storiesNext =
    document.getElementById("storiesNext");

const storyIndicators =
    document.querySelectorAll(".story-indicator");


let storiesPosition = 0;
let currentStory = 0;


/*
    Размер одной карточки + расстояние
*/

function getStoryStep() {

    const card =
        document.querySelector(".story-card");

    if (!card) return 252;

    const styles =
        window.getComputedStyle(storiesTrack);

    const gap =
        parseFloat(styles.columnGap) || 22;

    return card.offsetWidth + gap;

}


/*
    Количество доступных позиций
*/

function getMaxStoryPosition() {

    const cards =
        document.querySelectorAll(".story-card");

    if (!cards.length) return 0;

    const step =
        getStoryStep();

    const windowWidth =
        document.querySelector(".stories-window").offsetWidth;

    const totalWidth =
        storiesTrack.scrollWidth;

    const max =
        Math.ceil(
            (totalWidth - windowWidth) / step
        );

    return Math.max(0, max);

}


/*
    Обновление индикаторов
*/

function updateStoryIndicators() {

    storyIndicators.forEach(
        (indicator, index) => {

            indicator.classList.toggle(
                "active",
                index === currentStory
            );

        }
    );

}


/*
    Перемещение
*/

function moveStories(position) {

    const maxPosition =
        getMaxStoryPosition();

    storiesPosition =
        Math.max(
            0,
            Math.min(position, maxPosition)
        );

    const step =
        getStoryStep();

    storiesTrack.style.transform =
        `translateX(-${storiesPosition * step}px)`;


    currentStory =
        storiesPosition;


    updateStoryIndicators();

}


/*
    Следующая карточка
*/

storiesNext.addEventListener(
    "click",
    () => {

        const maxPosition =
            getMaxStoryPosition();

        if (storiesPosition < maxPosition) {

            moveStories(
                storiesPosition + 1
            );

        } else {

            moveStories(0);

        }

    }
);


/*
    Предыдущая карточка
*/

storiesPrev.addEventListener(
    "click",
    () => {

        const maxPosition =
            getMaxStoryPosition();

        if (storiesPosition > 0) {

            moveStories(
                storiesPosition - 1
            );

        } else {

            moveStories(maxPosition);

        }

    }
);


/*
    Клик по индикатору
*/

storyIndicators.forEach(
    (indicator, index) => {

        indicator.addEventListener(
            "click",
            () => {

                moveStories(index);

            }
        );

    }
);


/* =========================================
   TOUCH / SWIPE
========================================= */

let touchStartX = 0;
let touchCurrentX = 0;
let isTouching = false;


storiesTrack.addEventListener(
    "touchstart",
    event => {

        touchStartX =
            event.touches[0].clientX;

        touchCurrentX =
            touchStartX;

        isTouching = true;

        storiesTrack.classList.add(
            "dragging"
        );

    },
    { passive: true }
);


storiesTrack.addEventListener(
    "touchmove",
    event => {

        if (!isTouching) return;

        touchCurrentX =
            event.touches[0].clientX;

    },
    { passive: true }
);


storiesTrack.addEventListener(
    "touchend",
    () => {

        if (!isTouching) return;

        const difference =
            touchStartX - touchCurrentX;


        storiesTrack.classList.remove(
            "dragging"
        );


        if (Math.abs(difference) > 45) {

            if (difference > 0) {

                const maxPosition =
                    getMaxStoryPosition();

                if (
                    storiesPosition <
                    maxPosition
                ) {

                    moveStories(
                        storiesPosition + 1
                    );

                }

            } else {

                if (storiesPosition > 0) {

                    moveStories(
                        storiesPosition - 1
                    );

                }

            }

        }


        isTouching = false;

    }
);


/* =========================================
   MOUSE DRAG
========================================= */

let mouseStartX = 0;
let mouseEndX = 0;
let isDragging = false;


storiesTrack.addEventListener(
    "mousedown",
    event => {

        mouseStartX =
            event.clientX;

        mouseEndX =
            mouseStartX;

        isDragging = true;

        storiesTrack.classList.add(
            "dragging"
        );

    }
);


storiesTrack.addEventListener(
    "mousemove",
    event => {

        if (!isDragging) return;

        mouseEndX =
            event.clientX;

    }
);


storiesTrack.addEventListener(
    "mouseup",
    () => {

        if (!isDragging) return;

        const difference =
            mouseStartX - mouseEndX;


        storiesTrack.classList.remove(
            "dragging"
        );


        if (Math.abs(difference) > 45) {

            if (difference > 0) {

                const maxPosition =
                    getMaxStoryPosition();

                if (
                    storiesPosition <
                    maxPosition
                ) {

                    moveStories(
                        storiesPosition + 1
                    );

                }

            } else {

                if (storiesPosition > 0) {

                    moveStories(
                        storiesPosition - 1
                    );

                }

            }

        }

        isDragging = false;

    }
);


storiesTrack.addEventListener(
    "mouseleave",
    () => {

        isDragging = false;

        storiesTrack.classList.remove(
            "dragging"
        );

    }
);


/*
    Не выделяем изображения
    при перетаскивании
*/

storiesTrack.addEventListener(
    "dragstart",
    event => {

        event.preventDefault();

    }
);


/* =========================================
   RESIZE
========================================= */

window.addEventListener(
    "resize",
    () => {

        moveStories(
            Math.min(
                storiesPosition,
                getMaxStoryPosition()
            )
        );

    }
);

    /* =========================================
       MODAL CLOSE
    ========================================= */

    document.querySelectorAll(
        "[data-close]"
    ).forEach(button => {

        button.addEventListener("click", () => {

            document
                .getElementById(button.dataset.close)
                .classList.remove("active");

        });

    });


    document.querySelectorAll(".modal").forEach(modal => {

        modal.addEventListener("click", event => {

            if (event.target === modal) {

                modal.classList.remove("active");

            }

        });

    });


    /* =========================================
       SEARCH
    ========================================= */

    const searchBtn =
        document.getElementById("searchBtn");

    const searchModal =
        document.getElementById("searchModal");

    const searchInput =
        document.getElementById("searchInput");

    const searchResults =
        document.getElementById("searchResults");


    searchBtn.addEventListener("click", () => {

        searchModal.classList.add("active");

        setTimeout(() => {

            searchInput.focus();

        }, 200);

    });


    searchInput.addEventListener("input", () => {

        const query =
            searchInput.value
                .toLowerCase()
                .trim();


        searchResults.innerHTML = "";


        if (!query) return;


        const products =
            document.querySelectorAll(".catalog-product");


        let found = 0;


        products.forEach(product => {

            const title =
                product.querySelector("h3")
                    .textContent
                    .toLowerCase();

            const description =
                product.querySelector("p")
                    .textContent
                    .toLowerCase();


            if (
                title.includes(query) ||
                description.includes(query)
            ) {

                found++;

                const result =
                    document.createElement("div");

                result.className =
                    "search-result";

                result.textContent =
                    product.querySelector("h3").textContent;

                result.addEventListener("click", () => {

                    searchModal.classList.remove("active");

                    categoryFilter.value =
                        product.dataset.category;

                    filterProducts();

                    document
                        .getElementById("catalog")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                });

                searchResults.appendChild(result);

            }

        });


        if (found === 0) {

            searchResults.innerHTML =
                `<div class="search-result">
                    Ничего не найдено
                </div>`;

        }

    });


    /* =========================================
       BESTSELLER SLIDER
    ========================================= */

    const slider =
        document.getElementById("bestsellerSlider");

    const nextProduct =
        document.getElementById("nextProduct");

    const prevProduct =
        document.getElementById("prevProduct");


    let sliderPosition = 0;


    nextProduct.addEventListener("click", () => {

        if (window.innerWidth <= 1050) {

            sliderPosition -= 320;

            if (sliderPosition < -960) {
                sliderPosition = 0;
            }

        } else {

            sliderPosition -= 150;

            if (sliderPosition < -300) {
                sliderPosition = 0;
            }

        }

        slider.style.transform =
            `translateX(${sliderPosition}px)`;

    });


    prevProduct.addEventListener("click", () => {

        sliderPosition += 150;

        if (sliderPosition > 0) {
            sliderPosition = 0;
        }

        slider.style.transform =
            `translateX(${sliderPosition}px)`;

    });


    /* =========================================
       SUBSCRIBE
    ========================================= */

    document
        .getElementById("subscribeForm")
        .addEventListener("submit", event => {

            event.preventDefault();

            const email =
                document.getElementById("emailInput");

            showToast(
                "Спасибо! Скидка скоро будет отправлена"
            );

            email.value = "";

        });


    /* =========================================
       ESC CLOSE
    ========================================= */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            document
                .querySelectorAll(".modal.active")
                .forEach(modal => {

                    modal.classList.remove("active");

                });

            closeCartPanel();

        }

    });

});