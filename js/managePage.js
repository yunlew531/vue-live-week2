const LEEE = {
  api: 'https://vue3-course-api.hexschool.io',
  path: 'yunlew',
  token: '',
  products: [],
  pagination: {},
  async handCheckLoginStatus() {
    try {
      const { data } = await this.checkLoginStatus();
      console.log(data);
      if (data.success) this.handGetProducts();
      else window.location.href = '../login.html';
    }
    catch(err) {
      console.dir(err);
    }
  },
  checkLoginStatus() {
    const api = `${this.api}/api/user/check`;
    return axios.post(api);
  },
  async handLogOut() {
    try {
      const { data } = await this.logOut();
      console.log(data);
      if (data.success) window.location.href = '../index.html';
    }
    catch(err) {
      console.dir(err);
    }
  },
  logOut() {
    const api = `${this.api}/logout`;
    return axios.post(api);
  },
  async handGetProducts(page = 1) {
    try {
      const { data } = await this.getProducts(page);
      this.products =  data.products;
      this.pagination =  data.pagination;
      this.renderProducts();
    }
    catch(err) {
      console.dir(err);
    }
  },
  getProducts(page) {
    const api = `${this.api}/api/${this.path}/admin/products?page=${page}`;
    return axios.get(api);
  },
  async handDeleteProduct(id) {
    try {
      const { data } = await this.deleteProduct(id);
      resMessage.textContent = data.message;
      this.handGetProducts();
      setTimeout(() => {
        resMessage.textContent = '';
      }, 3000);
    }
    catch(err) {
      console.dir(err);
    }
  },
  deleteProduct(id) {
    const api = `${this.api}/api/${this.path}/admin/product/${id}`;
    return axios.delete(api);
  },
  async handAddProduct() {
    try {
      const { data } = await this.addProduct();
      resMessage.textContent = data.message;
      if (data.success) {
        addProductForm.reset();
        this.handGetProducts();
        this.closeModal();
      }
      setTimeout(() => {
        resMessage.textContent = '';
      }, 5000);
    }
    catch(err) {
      console.dir(err);
    }
  },
  addProduct() {
    const api = `${this.api}/api/${this.path}/admin/product`;
    const data = {
      imagesUrl: [],
      title: title.value, 
      category: category.value,
      origin_price: parseInt(originPrice.value),
      price: parseInt(price.value),
      unit: productUnit.value,
      description: description.value,
      content: content.value,
      is_enabled: isEnabled.checked,
      imageUrl: imageUrl.value,
    }
    return axios.post(api, { data });
  },
  showAddProductModal() {
    addProductModal.classList.remove('hidden');
    addProductModal.classList.add('block');
  },
  closeModal() {
    addProductModal.classList.add('hidden');
    addProductModal.classList.remove('block');
  },
  watchProductsList(e) {
    const el = e.target;
    if (el.dataset.action === 'delete-product') {
      const id = el.closest('tr').dataset.id;
      this.handDeleteProduct(id);
    }
  },
  watchPaginationPanel(e) {
    if (e.target.dataset.page === 'pre') {
      const currentPage = this.pagination.current_page === 1 ? 1 : this.pagination.current_page - 1;
      this.handGetProducts(currentPage);
    } else if (e.target.dataset.page === 'next') {
      const currentPage = this.pagination.current_page === this.pagination.total_pages ? 1 : this.pagination.current_page + 1;
      this.handGetProducts(currentPage);
    } else {
      const currentPage = e.target.dataset.page;
      this.handGetProducts(currentPage);
    }
  },
  renderPagination() {
    const perv = `
      <li class="relative block leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 ml-0 rounded-l hover:bg-gray-200">
        <button ${this.pagination.has_pre ? '' : 'disabled'} data-page="pre"
          class="block py-2 px-3 ${this.pagination.has_pre ? '' : 'bg-blue-50 text-gray-300 cursor-default'}">Previous</button>
      </li>
    `;
    const next = `
      <li class="relative block leading-tight bg-white border border-gray-300 text-blue-700 rounded-r hover:bg-gray-200">
        <button ${this.pagination.has_next ? '' : 'disabled'} data-page="next"
          class="block py-2 px-3 ${this.pagination.has_next ? '' : 'bg-blue-50 text-gray-300 cursor-default'}">Next
        </button>
      </li>
    `;
    let template = '';
    for (let i=0; i<this.pagination.total_pages; i++) {
      template+= `
        <li class="relative block leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 hover:bg-gray-200">
          <button ${this.pagination.current_page === i+1 ? 'disabled' : ''} data-page="${i+1}"
            class="block py-2 px-3 ${this.pagination.current_page === i+1  ? 'bg-blue-300 text-white cursor-default' : ''}" href="javascript:;">${i+1}
          </button>
        </li>
      `;
    }
    paginationPanel.innerHTML = perv + template + next;
  },
  renderProducts() {
    let template = '';
    this.products.forEach(product => {
      const { id, imageUrl, imagesUrl, title, origin_price, price, is_enabled } = product;
      template+= `
        <tr data-id="${id}">
          <td class="px-6 py-2">
            <div class="flex items-center space-x-3">
              <div class="inline-flex w-20 h-20">
                <img class='w-20 h-20 object-cover' src='${imageUrl || imagesUrl[0]}'>
              </div>
              <div>
                <p class="">${title}</p>
              </div>
            </div>
          </td>
          <td class="px-6 py-2">
            <p class="line-through">$${origin_price.toLocaleString()}</p>
          </td>
          <td class="px-6 py-2 text-center">
            <p class="text-red-500 text-lg font-bold">$${price.toLocaleString()}</p>
          </td>
          <td class="px-6 py-2 text-center">
            <label class="flex items-center justify-center">
              <span 
                class="ml-1.5 ${is_enabled ? 'text-green-400' : 'text-red-400'}">
                ${is_enabled ? '啟用' : '未啟用'}
              </span>
            </label>
          </td>
          <td class="px-6 py-2 text-center">
            <a href="#" data-action="delete-product" class="rounded px-2 py-0.5 duration-200 text-red-500 border border-red-500 hover:text-white hover:bg-red-500 font-bold">刪除</a>
          </td>
        </tr>
      `
    });
    productsList.innerHTML = template;
    this.renderPagination();
  },
  init() {
    this.token = document.cookie.replace(/(?:(?:^|.*;\s*)Hegoze\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = this.token;
    this.handCheckLoginStatus();
    logOutBtn.addEventListener('click', this.handLogOut.bind(this));
    productsList.addEventListener('click', this.watchProductsList.bind(this));
    addProductModalBtn.addEventListener('click', this.showAddProductModal);
    closeModalBtn.addEventListener('click', this.closeModal);
    addProductBtn.addEventListener('click', this.handAddProduct.bind(this));
    paginationPanel.addEventListener('click', this.watchPaginationPanel.bind(this));
  }
};

const logOutBtn = document.querySelector('#log-out-btn');
const productsList = document.querySelector('#products-list');
const resMessage = document.querySelector('#res-message');
const addProductModal = document.querySelector('#add-product-modal');
const addProductModalBtn = document.querySelector('#add-product-modal-btn');
const closeModalBtn = document.querySelector('#close-modal-btn');
const addProductForm = document.querySelector('#add-product-form');
const title = document.querySelector('#title');
const category = document.querySelector('#category');
const originPrice = document.querySelector('#origin-price');
const price = document.querySelector('#price');
const productUnit = document.querySelector('#product-unit');
const description = document.querySelector('#description');
const content = document.querySelector('#content');
const isEnabled = document.querySelector('#is-enabled');
const imageUrl = document.querySelector('#imageUrl');
const addProductBtn = document.querySelector('#add-product-btn');
const paginationPanel = document.querySelector('#pagination-panel');

LEEE.init();