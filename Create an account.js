// === سوئیچ بین تب ها ===
const tabs = document.querySelectorAll('.tab');
const forms = {
  loginForm: document.getElementById('loginForm'),
  registerForm: document.getElementById('registerForm'),
};

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const target = tab.getAttribute('data-target');
    Object.keys(forms).forEach(key => {
      forms[key].classList.remove('active');
    });
    forms[target].classList.add('active');
    clearErrorsAndMessages();
  });
});

function clearErrorsAndMessages() {
  document.querySelectorAll('.error').forEach(e => e.textContent = '');
  document.querySelectorAll('.success').forEach(s => s.textContent = '');
}

// === OTP (کد ۸ رقمی) ===
let generatedOtp = null;
const sendOtpBtn = document.getElementById('sendOtpBtn');
const otpContainer = document.getElementById('otpContainer');
const otpSentMessage = document.getElementById('otpSentMessage');
const otpInput = document.getElementById('otpInput');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');

function isValidIranMobile(phone) {
  return /^09\d{9}$/.test(phone);
}

sendOtpBtn && sendOtpBtn.addEventListener('click', () => {
  const phone = document.getElementById('regPhone').value.trim();
  clearErrorsAndMessages();

  if (!isValidIranMobile(phone)) {
    document.getElementById('regPhoneError').textContent = 'شماره موبایل معتبر وارد کنید (مثال: 09123456789).';
    return;
  }

  // نمایش کانتینر OTP
  otpContainer.style.display = 'block';

  // تولید کد ۸ رقمی
  generatedOtp = Math.floor(10000000 + Math.random() * 90000000).toString();
  console.log('کد OTP تولید شده (برای تست):', generatedOtp);

  otpSentMessage.textContent = 'کد تایید برای شمارهٔ شما ارسال شد. لطفاً کد ۸ رقمی را وارد کنید.';
  otpInput.focus();
});

verifyOtpBtn && verifyOtpBtn.addEventListener('click', () => {
  const entered = otpInput.value.trim();
  clearErrorsAndMessages();

  if (!/^\d{8}$/.test(entered)) {
    document.getElementById('otpError').textContent = 'کد باید ۸ رقم عددی باشد.';
    return;
  }

  if (entered === generatedOtp) {
    document.getElementById('otpSuccessMessage').textContent = 'کد تایید صحیح است. عملیات ادامه پیدا می‌کند.';
    onSuccessfulLogin();
  } else {
    document.getElementById('otpError').textContent = 'کد تایید اشتباه است. دوباره تلاش کنید.';
  }
});

// === فرم ثبت نام ===
forms.registerForm.addEventListener('submit', e => {
  e.preventDefault();
  clearErrorsAndMessages();

  const regName = document.getElementById('regName');
  const regEmail = document.getElementById('regEmail');
  const regPassword = document.getElementById('regPassword');
  const regConfirmPassword = document.getElementById('regConfirmPassword');
  let valid = true;

  if (regName.value.trim().length < 3) {
    document.getElementById('regNameError').textContent = 'نام باید حداقل 3 کاراکتر باشد.';
    valid = false;
  }
  if (!validateEmail(regEmail.value)) {
    document.getElementById('regEmailError').textContent = 'ایمیل معتبر وارد کنید.';
    valid = false;
  }
  if (regPassword.value.length < 6) {
    document.getElementById('regPasswordError').textContent = 'رمز عبور باید حداقل 6 کاراکتر باشد.';
    valid = false;
  }
  if (regPassword.value !== regConfirmPassword.value) {
    document.getElementById('regConfirmPasswordError').textContent = 'رمزها مطابقت ندارند.';
    valid = false;
  }

  if (!valid) return;

  document.getElementById('registerSuccess').textContent = 'ثبت نام موفق! حالا وارد شوید.';
  setTimeout(() => {
    forms.registerForm.reset();
    tabs[0].click(); // رفتن به تب ورود
    document.getElementById('registerSuccess').textContent = '';
  }, 2000);
});

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// === ورود موفق ===
function onSuccessfulLogin() {
  localStorage.setItem('loggedIn', 'true');
  const back = localStorage.getItem('afterLoginRedirect') || 'User panel.html';
  localStorage.removeItem('afterLoginRedirect');
  window.location.href = back;
}

// === ورود با گوگل ===
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  if (!data) {
    alert('خطا در خواندن اطلاعات گوگل. لطفاً دوباره تلاش کنید.');
    return;
  }

  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('userEmail', data.email || '');
  localStorage.setItem('userName', data.name || '');

  alert(`ورود موفق با گوگل — ${data.name || ''} (${data.email || ''})`);
  onSuccessfulLogin();
}
