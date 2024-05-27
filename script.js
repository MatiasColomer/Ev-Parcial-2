$(document).ready(function() {
    const cart = {};

    
    $('.add-to-cart').on('click', function() {
        const productName = $(this).data('product');
        const productPrice = parseFloat($(this).data('price'));
        const productQuantity = 1; 

        if (cart[productName]) {
            cart[productName].quantity += productQuantity;
            if (cart[productName].quantity > 10) {
                cart[productName].quantity = 10;
                alert('La cantidad total de este producto no puede ser mayor a 10.');
            }
            cart[productName].totalPrice = cart[productName].quantity * productPrice;
        } else {
            cart[productName] = { name: productName, quantity: productQuantity, price: productPrice, totalPrice: productPrice };
        }

        updateCart();
    });

    function updateCart() {
        const $cart = $('#cart');
        $cart.empty();

        let totalCartPrice = 0;

        Object.values(cart).forEach(item => {
            totalCartPrice += item.totalPrice;

            const $item = $('<li></li>')
                .addClass('list-group-item d-flex justify-content-between align-items-center')
                .html(`${item.name} - Cantidad: ${item.quantity} - Precio Total: $${item.totalPrice.toFixed(2)}`);

            const $removeButton = $('<button></button>')
                .addClass('btn btn-danger btn-sm')
                .text('Eliminar')
                .on('click', function() {
                    delete cart[item.name];
                    updateCart();
                });

            const $decrementButton = $('<button></button>')
                .addClass('btn btn-secondary btn-sm')
                .text('-')
                .on('click', function() {
                    if (item.quantity > 1) {
                        item.quantity--;
                        item.totalPrice = item.quantity * item.price;
                        updateCart();
                    }
                });

            const $actionButtons = $('<div></div>')
                .addClass('action-buttons')
                .append($decrementButton, $removeButton);

            $item.append($actionButtons);
            $cart.append($item);
        });

        $('#totalPrice').text(totalCartPrice.toFixed(2));
    }

    function fetchEconomicIndicators() {
        $.ajax({
            url: 'https://mindicador.cl/api',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                const indicators = data;
                const $indicatorsDiv = $('#economicIndicators');
                $indicatorsDiv.empty();

                Object.keys(indicators).forEach(key => {
                    const indicator = indicators[key];
                    if (indicator.nombre) {
                        const $card = $('<div></div>')
                            .addClass('carousel-item')
                            .html(`
                                <div class="card indicator-card">
                                    <div class="card-body">
                                        <h5 class="card-title">${indicator.nombre}</h5>
                                        <p class="card-text">${indicator.valor} ${indicator.unidad_medida}</p>
                                    </div>
                                </div>
                            `);

                        $indicatorsDiv.append($card);
                    }
                });

                $indicatorsDiv.children().first().addClass('active');
            },
            error: function() {
                alert('Error al obtener los indicadores económicos.');
            }
        });
    }

    fetchEconomicIndicators();

    $('#economicIndicatorsCarousel').carousel({
        interval: 3000, 
        pause: 'hover'
    });

    $('#toggleDarkMode').on('click', function() {
        $('body').toggleClass('dark-mode');
    });
});