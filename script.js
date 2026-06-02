const invoices = [];
let invoiceCounter = 1001;

const invoiceNoEl = document.getElementById('invoiceNo');
const estimateIdEl = document.getElementById('estimateId');
const chainIdEl = document.getElementById('chainId');
const serviceDetailsEl = document.getElementById('serviceDetails');
const qtyEl = document.getElementById('qty');
const costPerQtyEl = document.getElementById('costPerQty');
const balanceEl = document.getElementById('balance');
const paymentDateEl = document.getElementById('paymentDate');
const serviceDateEl = document.getElementById('serviceDate');
const deliveryDetailsEl = document.getElementById('deliveryDetails');
const emailIdEl = document.getElementById('emailId');
const editIndexEl = document.getElementById('editIndex');
const invoiceTableEl = document.getElementById('invoiceTable');
const totalInvoicesEl = document.getElementById('totalInvoices');
const totalRevenueEl = document.getElementById('totalRevenue');
const totalBalanceEl = document.getElementById('totalBalance');
const pendingInvoicesEl = document.getElementById('pendingInvoices');
const searchBoxEl = document.getElementById('searchBox');
const clearAllBtn = document.getElementById('clearAllBtn');

invoiceNoEl.value = invoiceCounter;

clearAllBtn.addEventListener('click', () => {
    if (!confirm('Clear all invoices and reset the dashboard?')) return;
    invoices.length = 0;
    invoiceCounter = 1001;
    invoiceNoEl.value = invoiceCounter;
    resetForm();
    renderTable();
    updateSummary();
});

function saveInvoice() {
    const estimateId = estimateIdEl.value.trim();
    const chainId = chainIdEl.value.trim();
    const serviceDetails = serviceDetailsEl.value.trim();
    const qty = Number(qtyEl.value);
    const costPerQty = Number(costPerQtyEl.value);
    const balance = Number(balanceEl.value) || 0;
    const paymentDate = paymentDateEl.value;
    const serviceDate = serviceDateEl.value;
    const deliveryDetails = deliveryDetailsEl.value.trim();
    const emailId = emailIdEl.value.trim();
    const editIndex = editIndexEl.value;

    if (!estimateId || !chainId || !serviceDetails || !qty || !costPerQty || !emailId) {
        alert('Please complete all required fields before saving.');
        return;
    }

    const amountPayable = qty * costPerQty;
    const invoice = {
        invoiceNo: invoiceCounter,
        estimateId,
        chainId,
        serviceDetails,
        qty,
        costPerQty,
        amountPayable,
        balance,
        paymentDate,
        serviceDate,
        deliveryDetails,
        emailId
    };

    if (editIndex === '') {
        invoices.push(invoice);
        invoiceCounter += 1;
    } else {
        invoices[Number(editIndex)] = invoice;
    }

    renderTable();
    updateSummary();
    resetForm();
}

function renderTable() {
    invoiceTableEl.innerHTML = '';

    invoices.forEach((invoice, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${invoice.invoiceNo}</td>
            <td>${invoice.estimateId}</td>
            <td>${invoice.chainId}</td>
            <td>${invoice.serviceDetails}</td>
            <td>₹${invoice.amountPayable.toFixed(2)}</td>
            <td>₹${invoice.balance.toFixed(2)}</td>
            <td>${invoice.emailId}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editInvoice(${index})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteInvoice(${index})">Delete</button>
            </td>
        `;
        invoiceTableEl.appendChild(row);
    });

    searchInvoice();
}

function updateSummary() {
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amountPayable, 0);
    const totalBalance = invoices.reduce((sum, invoice) => sum + invoice.balance, 0);
    const pendingInvoices = invoices.filter(invoice => invoice.balance > 0).length;

    totalInvoicesEl.textContent = totalInvoices;
    totalRevenueEl.textContent = `₹${totalRevenue.toFixed(2)}`;
    totalBalanceEl.textContent = `₹${totalBalance.toFixed(2)}`;
    pendingInvoicesEl.textContent = pendingInvoices;
}

function editInvoice(index) {
    const invoice = invoices[index];
    editIndexEl.value = index;
    estimateIdEl.value = invoice.estimateId;
    chainIdEl.value = invoice.chainId;
    serviceDetailsEl.value = invoice.serviceDetails;
    qtyEl.value = invoice.qty;
    costPerQtyEl.value = invoice.costPerQty;
    balanceEl.value = invoice.balance;
    paymentDateEl.value = invoice.paymentDate;
    serviceDateEl.value = invoice.serviceDate;
    deliveryDetailsEl.value = invoice.deliveryDetails;
    emailIdEl.value = invoice.emailId;
    invoiceNoEl.value = invoice.invoiceNo;
}

function deleteInvoice(index) {
    if (!confirm('Delete this invoice permanently?')) return;
    invoices.splice(index, 1);
    renderTable();
    updateSummary();
    resetForm();
}

function searchInvoice() {
    const filter = searchBoxEl.value.trim().toLowerCase();
    const rows = invoiceTableEl.querySelectorAll('tr');

    rows.forEach(row => {
        const rowText = row.innerText.toLowerCase();
        row.style.display = rowText.includes(filter) ? '' : 'none';
    });
}

function resetForm() {
    editIndexEl.value = '';
    estimateIdEl.value = '';
    chainIdEl.value = '';
    serviceDetailsEl.value = '';
    qtyEl.value = '';
    costPerQtyEl.value = '';
    balanceEl.value = '';
    paymentDateEl.value = '';
    serviceDateEl.value = '';
    deliveryDetailsEl.value = '';
    emailIdEl.value = '';
    invoiceNoEl.value = invoiceCounter;
}

renderTable();
updateSummary();