const LEEE = {
  api: 'https://vue3-course-api.hexschool.io',
  path: 'yunlew',
  clientProductsData: [],
  pagination: {},
  async handGetProducts(page = 1) {
    try {
      const { data } = await this.getClientProducts(page);
      this.pagination = data.pagination;
      this.clientProductsData = data.products;
      this.renderClientProducts();
    } 
    catch(err) {
      console.dir(err);
    }
  },
  getClientProducts(page) {
    const api = `${this.api}/api/${this.path}/products?page=${page}`;
    return axios.get(api);
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
          class="block py-2 px-3 ${this.pagination.has_pre ? '' : 'bg-blue-100 text-gray-300 cursor-default'}">Previous</button>
      </li>
    `;
    const next = `
      <li class="relative block leading-tight bg-white border border-gray-300 text-blue-700 rounded-r hover:bg-gray-200">
        <button ${this.pagination.has_next ? '' : 'disabled'} data-page="next"
          class="block py-2 px-3 ${this.pagination.has_next ? '' : 'bg-blue-100 text-gray-300 cursor-default'}">Next
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
  renderClientProducts() {
    let template = '';
    this.clientProductsData.forEach((item) => {
      template+= `
      <li class="col-span-4 h-full">
      <a href="javascript:;" class="flex flex-col bg-white rounded group relative h-full">
        <span class="h-full duration-100 block absolute w-full h-full group-hover:bg-white opacity-20"></span>
        <span class="block h-64 bg-cover bg-center bg-no-repeat rounded-t-lg "
          style="background-image: url(${item.imageUrl || item.imagesUrl[0]})">
        </span>
        <div class="shadow-lg p-5 rounded-b-lg flex-grow flex flex-col justify-between">
          <div class="">
            <h2 class="text-2xl">${item.title}</h2>
            <p class="text-gray-500 mb-2">${item.description}</p>
          </div>
          <p class="flex justify-between">
            <span class="line-through">$${item.origin_price.toLocaleString()}元</span>
            <span class="text-red-500 text-lg font-bold">$${item.price.toLocaleString()}元</span>
          </p>
        </div>
      </a>
      </li>
      `
    });
    clientProductListDom.innerHTML = template;
    this.renderPagination();
  },
  init() {
    this.handGetProducts();
    paginationPanel.addEventListener('click', this.watchPaginationPanel.bind(this));
  },
};

const clientProductListDom = document.querySelector('#client-product-list');
const paginationPanel = document.querySelector('#pagination-panel');

LEEE.init();