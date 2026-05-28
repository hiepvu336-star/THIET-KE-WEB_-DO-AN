document.addEventListener("DOMContentLoaded", function () {
        const decreaseBtn = document.getElementById("decreaseBtn");
        const increaseBtn = document.getElementById("increaseBtn");
        const quantityInput = document.getElementById("quantityInput");
        const addToCartDetailBtn = document.getElementById("addToCartDetailBtn");

        // Logic tăng giảm số lượng sản phẩm
        decreaseBtn.addEventListener("click", function () {
            let value = parseInt(quantityInput.value) || 1;
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });

        increaseBtn.addEventListener("click", function () {
            let value = parseInt(quantityInput.value) || 1;
            quantityInput.value = value + 1;
        });

        // Logic thêm sản phẩm vào giỏ hàng và chuyển hướng
        if (addToCartDetailBtn) {
            addToCartDetailBtn.addEventListener("click", function() {
                const productId = this.dataset.productId;
                const productName = this.dataset.productName;
                const productImage = this.dataset.productImage;
                const productPrice = parseFloat(this.dataset.productPrice); // Đảm bảo là số
                const quantity = parseInt(quantityInput.value); // Lấy số lượng từ input

                // Lấy giỏ hàng hiện tại từ Local Storage
                let cart = JSON.parse(localStorage.getItem('cart')) || [];

                // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
                const existingProductIndex = cart.findIndex(item => item.id === productId);

                if (existingProductIndex > -1) {
                    // Nếu sản phẩm đã tồn tại, cập nhật số lượng
                    cart[existingProductIndex].quantity += quantity;
                } else {
                    // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
                    cart.push({
                        id: productId,
                        name: productName,
                        image: productImage,
                        price: productPrice,
                        quantity: quantity
                    });
                }

                // Lưu giỏ hàng đã cập nhật vào Local Storage
                localStorage.setItem('cart', JSON.stringify(cart));

                // Chuyển hướng đến trang GioHang.html
                window.location.href = "GioHang.html";
            });
        }
        //Chuyển Ảnh
        const thumbnails = document.querySelectorAll('.thumb');
        const mainImage = document.getElementById('mainImage');

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function () {
            mainImage.src = this.src;

            // Xóa border cũ và thêm border mới
            thumbnails.forEach(t => t.classList.remove('border', 'border-danger'));
            this.classList.add('border', 'border-danger');
            });
        });
    });