const LEEE = {
  api: 'https://vue3-course-api.hexschool.io',
  path: 'yunlew',
  token: '',
  async handCheckLoginStatus() {
    try {
      const { data } = await this.checkLoginStatus();
      if (data.success) {
        resMessage.textContent = '已登入，跳轉中@@';
        window.location.href = '../vue-live-week2/managePage.html'
        console.log(data);
      }
      else resMessage.textContent = data.message;
    }
    catch(err) {
      console.dir(err);
    }
  },
  checkLoginStatus() {
    const api = `${this.api}/api/user/check`;
    return axios.post(api);
  },
  async handLogin() {
    try {
      const { data } = await this.login();
      document.cookie = `Hegoze=${data.token};expires=${new Date(data.expired)};`;
      if (data.success) window.location.href = '../vue-live-week2/managePage.html'
      else resMessage.textContent = data.message;
    }
    catch(err) {
      console.dir(err);
    }
  },
  login() {
    const api = `${this.api}/admin/signin`;
    const user = {
      username: email.value,
      password: password.value
    };
    for (const props in user) {
      if (!user[props]) return { data: { message: '空空的'} };
    }
    return axios.post(api, user);
  },
  init() {
    this.token = document.cookie.replace(/(?:(?:^|.*;\s*)Hegoze\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = this.token;
    this.handCheckLoginStatus();
    submitBtn.addEventListener('click', this.handLogin.bind(this));
  }
};

const resMessage = document.querySelector('#res-message');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const submitBtn = document.querySelector('#submit-btn');

LEEE.init();
