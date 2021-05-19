const LEEE = {
  api: 'https://vue3-course-api.hexschool.io',
  path: 'yunlew',
  token: '',
  async checkLoginStatus() {
    const api = `${this.api}/api/user/check`;
    const { data } = await axios.post(api);
    console.log(data);
    try {
      if (data.success) {
        resMessage.textContent = '已登入，跳轉中@@';
        setTimeout(()=>{
          window.location.href = '../vue-live-week2/managePage.html'

        }, 3000);
        console.log(data);
      }
      else resMessage.textContent = data.message;
    }
    catch(err) {
      console.dir(err);
    }
  },
  async login() {
    const api = `${this.api}/admin/signin`;
    const user = {
      username: email.value,
      password: password.value
    };
    for (const props in user) {
      if (!user[props]) return { data: { message: '空空的'} };
    }
    try {
      const { data } = await axios.post(api, user);
      document.cookie = `Hegoze=${data.token};expires=${new Date(data.expired)};`;
      if (data.success) window.location.href = '../vue-live-week2/managePage.html'
      else resMessage.textContent = data.message;
    }
    catch(err) {
      console.dir(err);
    }
  },
  init() {
    this.token = document.cookie.replace(/(?:(?:^|.*;\s*)Hegoze\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = this.token;
    this.checkLoginStatus();
    submitBtn.addEventListener('click', this.login.bind(this));
  }
};

const resMessage = document.querySelector('#res-message');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const submitBtn = document.querySelector('#submit-btn');

LEEE.init();
