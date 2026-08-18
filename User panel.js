// 🟢 بررسی لاگین بودن کاربر
// if (localStorage.getItem('loggedIn') !== 'true') {
//   alert('برای دسترسی به پنل لطفاً وارد شوید.');
//   window.location.href = 'Create an account.html';
// }

// 🟣 سوئیچ بین صفحات در پنل
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // حذف کلاس active از همه لینک‌ها و صفحات
    navLinks.forEach(l => l.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));

    // اضافه کردن active به لینک کلیک شده و صفحه مرتبط
    link.classList.add('active');
    const pageId = link.getAttribute('data-page');
    document.getElementById(pageId).classList.add('active');
  });
});

// 🟡 مدیریت فرم تنظیمات
const settingsForm = document.getElementById('settingsForm');
const settingsMessage = document.getElementById('settingsMessage');

if (settingsForm) {
  settingsForm.addEventListener('submit', e => {
    e.preventDefault();
    const emailNotif = settingsForm.emailNotif.value;
    settingsMessage.textContent = `تنظیمات ذخیره شد: دریافت اعلان ایمیل = ${emailNotif}`;
    setTimeout(() => settingsMessage.textContent = '', 3000);
  });
}

// 🟢 مدیریت فرم پروفایل
const profileForm = document.getElementById('profileForm');
const profileMessage = document.getElementById('profileMessage');

if (profileForm) {
  profileForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = profileForm.username.value.trim();
    const bio = profileForm.bio.value.trim();

    if (!username) {
      profileMessage.style.color = 'red';
      profileMessage.textContent = 'نام کاربری نمی‌تواند خالی باشد.';
      return;
    }

    profileMessage.style.color = 'green';
    profileMessage.textContent = `پروفایل با نام "${username}" بروزرسانی شد.`;
    setTimeout(() => profileMessage.textContent = '', 3000);
  });
}

// 🟠 نمایش سفارش‌های کاربر
const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
const dash = document.getElementById('dashboard');
if (dash) {
  if (purchases.length === 0) {
    dash.innerHTML += '<p>هیچ سفارشی ثبت نشده است.</p>';
  } else {
    const list = purchases.map(p => 
      `<li>${p.title} — ${Number(p.total).toLocaleString()} تومان — ${new Date(p.date).toLocaleDateString('fa-IR')}</li>`
    ).join('');
    dash.innerHTML += `<h3>سفارش‌های شما</h3><ul>${list}</ul>`;
  }
}

// 🔴 دکمه خروج
const exitBtn = document.querySelector('.Exit');
if (exitBtn) {
  exitBtn.addEventListener('click', () => {
    if (confirm('آیا می‌خواهید از حساب خارج شوید؟')) {
      localStorage.removeItem('loggedIn');
      window.location.href = 'Create an account.html';
    }
  });
}


// 🔵 شبیه‌سازی Progress Bar
const progressContainer = document.querySelector('.progress-bar');
if(progressContainer){
  const userPackage = {
    title: "پکیج HTML + CSS",
    totalVideos: 20,
    watchedVideos: 7
  };
  const progressPercent = Math.round((userPackage.watchedVideos / userPackage.totalVideos) * 100);
  progressContainer.style.width = progressPercent + "%";
  progressContainer.textContent = progressPercent + "%";
}

//  یزای قشمت پکیح  خیرداری شده 
const packages = [
    {name: "پکیج Google Sheets", price: "150,000 تومان", status: "active", date: "1403/03/10", imageUrl: "./img/google-sheets.jpg"},
    {name: "پکیج سو", price: "200,000 تومان", status: "expired", date: "1403/02/15", imageUrl: "./img/su.jpg"},
    {name: "پکیج HTML + CSS", price: "190,000 تومان", status: "active", date: "1403/03/01", imageUrl: "./img/mon.jpg"}
  ];

  let currentPackageIndex = 0;
  const container = document.getElementById("userPackage");

  function displayPackage(index){
    const pkg = packages[index];
    container.innerHTML = `
      <img class="package-image" src="${pkg.imageUrl}" alt="تصویر پکیج" style="width:150px;height:150px;">
      <div class="package-details">
        <h2>پکیج خریداری شده شما</h2>
        <div class="package-info"><span>نام پکیج:</span> ${pkg.name}</div>
        <div class="package-info"><span>قیمت:</span> ${pkg.price}</div>
        <div class="package-info"><span>تاریخ خرید:</span> ${pkg.date}</div>
        <div class="package-info"><span>وضعیت:</span> 
          <span class="${pkg.status === 'active' ? 'active' : 'expired'}">
            ${pkg.status === 'active' ? 'فعال' : 'منقضی شده'}
          </span>
        </div>
      </div>
    `;
  }

  // نمایش اولیه
  displayPackage(currentPackageIndex);

  // دکمه تغییر پکیج
  document.getElementById("changePackage").addEventListener("click", () => {
    currentPackageIndex = (currentPackageIndex + 1) % packages.length;
    displayPackage(currentPackageIndex);
  });

