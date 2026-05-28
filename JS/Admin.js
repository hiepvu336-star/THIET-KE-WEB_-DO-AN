// js/Admin.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const orderTableBody = document.querySelector('#orderTable tbody');
    const noOrdersMessage = document.getElementById('noOrdersMessage');
    const orderSearchInput = document.getElementById('orderSearchInput');
    const orderFilterStatus = document.getElementById('orderFilterStatus');
    const clearAllOrdersBtn = document.getElementById('clearAllOrdersBtn');

    const orderDetailModal = document.getElementById('orderDetailModal');
    const closeButtons = document.querySelectorAll('.close-button');
    const modalOrderId = document.getElementById('modalOrderId');
    const modalCustomerName = document.getElementById('modalCustomerName');
    const modalCustomerPhone = document.getElementById('modalCustomerPhone');
    const modalCustomerAddress = document.getElementById('modalCustomerAddress');
    const modalPaymentMethod = document.getElementById('modalPaymentMethod');
    const modalOrderDate = document.getElementById('modalOrderDate');
    const modalTotalAmount = document.getElementById('modalTotalAmount');
    const modalOrderItems = document.getElementById('modalOrderItems');
    const modalOrderStatus = document.getElementById('modalOrderStatus');
    const saveOrderStatusBtn = document.getElementById('saveOrderStatusBtn');

    // --- Global Variables ---
    let allOrders = []; // Array to store all orders

    // --- Helper Functions for Local Storage ---
    const getOrdersFromLocalStorage = () => {
        const storedOrders = localStorage.getItem('badmintonShopOrders');
        return storedOrders ? JSON.parse(storedOrders) : [];
    };

    const saveOrdersToLocalStorage = (orders) => {
        localStorage.setItem('badmintonShopOrders', JSON.stringify(orders));
    };

    // --- Format Currency ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // --- Render Orders ---
    const renderOrders = (ordersToDisplay) => {
        orderTableBody.innerHTML = ''; // Clear existing rows

        if (ordersToDisplay.length === 0) {
            noOrdersMessage.classList.remove('hidden');
            orderTableBody.innerHTML = ''; // Ensure table body is empty
            return;
        } else {
            noOrdersMessage.classList.add('hidden');
        }

        ordersToDisplay.forEach(order => {
            const row = orderTableBody.insertRow();
            row.dataset.id = order.id; // Store order ID on the row

            let statusClass = '';
            switch (order.status) {
                case 'Đang chờ xử lý': statusClass = 'status-pending'; break;
                case 'Đã xác nhận': statusClass = 'status-confirmed'; break;
                case 'Đang giao hàng': statusClass = 'status-delivering'; break;
                case 'Đã giao hàng': statusClass = 'status-delivered'; break;
                case 'Đã hủy': statusClass = 'status-cancelled'; break;
            }

            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer.name}</td>
                <td>${order.customer.phone}</td>
                <td>${formatCurrency(order.totalAmount)}</td>
                <td>${order.orderDate}</td>
                <td class="${statusClass}">${order.status}</td>
                <td class="action-btns">
                    <button class="btn btn-info btn-sm view-btn" data-id="${order.id}"><i class="fas fa-eye"></i> Xem</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${order.id}"><i class="fas fa-trash"></i> Xóa</button>
                </td>
            `;
        });
        addEventListenersToOrderButtons(); // Attach events to new buttons
    };

    // --- Filter and Search Orders ---
    const filterAndSearchOrders = () => {
    const searchTerm = orderSearchInput.value.toLowerCase();
    const statusFilter = orderFilterStatus.value;

    let filtered = allOrders.filter(order => {
        // Thay đổi dòng này để ưu tiên tìm kiếm theo số điện thoại
        // và thêm cả tìm kiếm theo tên khách hàng
        const matchesSearch = order.customer.phone.includes(searchTerm) || // <-- THAY ĐỔI TẠI ĐÂY
                              order.customer.name.toLowerCase().includes(searchTerm) || // <-- THÊM DÒNG NÀY
                              order.id.toLowerCase().includes(searchTerm); // Vẫn giữ ID nếu muốn tìm kiếm tổng quát

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });
    renderOrders(filtered);
    };
    orderSearchInput.addEventListener('input', filterAndSearchOrders);
    orderFilterStatus.addEventListener('change', filterAndSearchOrders);

    // --- Order Detail Modal ---
    const openOrderDetailModal = (orderId) => {
        const order = allOrders.find(o => o.id === orderId);
        if (order) {
            modalOrderId.textContent = order.id;
            modalCustomerName.textContent = order.customer.name;
            modalCustomerPhone.textContent = order.customer.phone;
            modalCustomerAddress.textContent = order.customer.address;
            modalPaymentMethod.textContent = order.customer.paymentMethod;
            modalOrderDate.textContent = order.orderDate;
            modalTotalAmount.textContent = formatCurrency(order.totalAmount);
            modalOrderStatus.value = order.status; // Set current status in dropdown

            modalOrderItems.innerHTML = ''; // Clear previous items
            order.items.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.name} (x${item.quantity})</span>
                    <span>${formatCurrency(item.price * item.quantity)}</span>
                `;
                modalOrderItems.appendChild(li);
            });

            saveOrderStatusBtn.dataset.id = order.id; // Store ID for saving status
            orderDetailModal.style.display = 'block';
        }
    };

    // --- Update Order Status ---
    saveOrderStatusBtn.addEventListener('click', () => {
        const orderId = saveOrderStatusBtn.dataset.id;
        const newStatus = modalOrderStatus.value;

        const orderIndex = allOrders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            allOrders[orderIndex].status = newStatus;
            saveOrdersToLocalStorage(allOrders);
            filterAndSearchOrders(); // Re-render table with updated status
            orderDetailModal.style.display = 'none'; // Close modal
            alert('Trạng thái đơn hàng đã được cập nhật!');
        }
    });

    // --- Delete Order ---
    const deleteOrder = (orderId) => {
        if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?')) {
            allOrders = allOrders.filter(order => order.id !== orderId);
            saveOrdersToLocalStorage(allOrders);
            filterAndSearchOrders(); // Re-render table
            alert('Đơn hàng đã được xóa.');
        }
    };

    // --- Clear All Orders ---
    clearAllOrdersBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn XÓA TẤT CẢ đơn hàng không? Hành động này không thể hoàn tác!')) {
            allOrders = [];
            saveOrdersToLocalStorage(allOrders);
            filterAndSearchOrders(); // Re-render table
            alert('Tất cả đơn hàng đã được xóa.');
        }
    });

    // --- Modal Close Functionality ---
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            orderDetailModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === orderDetailModal) {
            orderDetailModal.style.display = 'none';
        }
    });

    // --- Attach Event Listeners to Dynamically Created Buttons ---
    const addEventListenersToOrderButtons = () => {
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                openOrderDetailModal(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                deleteOrder(id);
            });
        });
    };

    // --- Logout Functionality (Basic - for demonstration) ---
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Trong một ứng dụng thực, bạn sẽ xóa token xác thực, session, v.v.
            // Ở đây chỉ là demo, có thể chuyển hướng về trang khách hàng
            alert('Bạn đã đăng xuất khỏi trang quản lý!');
            window.location.href = 'TrangChu.html';
        });
    }

    // --- Initial Load ---
    allOrders = getOrdersFromLocalStorage();
    renderOrders(allOrders); // Display all orders initially
});