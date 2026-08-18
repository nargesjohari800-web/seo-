document.addEventListener('DOMContentLoaded', function() {

  // ================== دکمه "بیشتر" ==================
  const moreBtn = document.querySelector('.more-btn');
  const moreText = document.querySelector('.more-text');
  if (moreBtn && moreText) {
    moreBtn.addEventListener('click', () => {
      moreText.classList.toggle('show');
      moreBtn.textContent = moreText.classList.contains('show') ? 'بستن' : 'بیشتر';
    });
  }

  // ================== منوی موبایل ==================
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.querySelector('.header ul');
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      menuToggle.textContent = menu.classList.contains('active') ? '✕' : '☰';
    });
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        menuToggle.textContent = '☰';
      });
    });
  }

  // ================== پنجره چت ==================
  const chatBox = document.getElementById("chatBox");
  const closeChat = document.getElementById("closeChat");
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const chatBody = document.getElementById("chatBody");
  const openChatLink = document.getElementById("openChatLink");
  const chatToggleWidget = document.getElementById("chatToggleWidget");

  if (openChatLink) {
    openChatLink.addEventListener("click", (e) => {
      e.preventDefault();
      chatBox.classList.add("show");
    });
  }

  if (chatToggleWidget) {
    chatToggleWidget.addEventListener("click", () => {
      chatBox.classList.toggle("show");
    });
  }

  if (closeChat) {
    closeChat.addEventListener("click", () => {
      chatBox.classList.remove("show");
    });
  }

  function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.textContent = text;
    chatBody.appendChild(userMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
    userInput.value = "";

    setTimeout(() => {
      const botMsg = document.createElement("div");
      botMsg.className = "message bot";
      botMsg.textContent = "پیامت دریافت شد ✅ به زودی پاسخ می‌دم.";
      chatBody.appendChild(botMsg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 800);
  }

  if (sendBtn && userInput) {
    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }


document.addEventListener('DOMContentLoaded', function() {
  const commentForm = document.querySelector('.comment-box form');
  const userComments = document.getElementById('userComments');

  if (commentForm && userComments) {
    commentForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // بررسی ورود کاربر
      const userName = localStorage.getItem('userName');
      const userProfileImg = localStorage.getItem('userProfileImg');

      if (!userName || !userProfileImg) {
        // نمایش هشدار
        alert('⚠️ شما ابتدا باید حساب کاربری بسازید یا وارد شوید!');

        // هدایت کاربر به صفحه ساخت اکانت
        window.location.href = './Create%20an%20account.html';
        return; // جلوگیری از ادامه عملیات ارسال کامنت
      }

      const commentInput = this.querySelector('textarea[name="comment"]');
      const comment = commentInput.value.trim();

      if (!comment) {
        alert('⚠️ کامنت نمی‌تواند خالی باشد!');
        return;
      }

      // اضافه کردن کامنت کاربر
      const div = document.createElement('div');
      div.classList.add('user-comment');
      div.innerHTML = `
        <img src="${userProfileImg}" style="width:40px; height:40px; border-radius:50%;">
        <strong>${userName}:</strong> ${comment}
      `;
      userComments.appendChild(div);

      // پاک کردن فیلد کامنت
      commentInput.value = '';
    });
  }
});


  // ================== آپلود عکس + برش مربع + لایت‌باکس ==================
  const uploadForm = document.querySelector('.upload-box form');
  const uploadedImages = document.getElementById('uploadedImages');

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  if (uploadedImages && lightbox && lightboxImg) {
    uploadedImages.addEventListener('click', function(e){
      if(e.target.tagName === 'IMG'){
        lightboxImg.src = e.target.src;
        lightbox.style.display = 'flex';
      }
    });

    lightbox.addEventListener('click', function(){
      lightbox.style.display = 'none';
    });
  }

  if (uploadForm && uploadedImages) {
    uploadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const fileInput = this.querySelector('input[name="image"]');
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function() {
          const canvas = document.createElement('canvas');
          const size = 150; // سایز 1:1
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          const minSide = Math.min(img.width, img.height);
          const sx = (img.width - minSide) / 2;
          const sy = (img.height - minSide) / 2;

          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

          const finalImg = document.createElement('img');
          finalImg.src = canvas.toDataURL('image/png');
          finalImg.style.width = '100px';
          finalImg.style.margin = '5px';
          finalImg.style.cursor = 'pointer';
          uploadedImages.appendChild(finalImg);

          // فعال کردن لایت‌باکس روی عکس جدید
          finalImg.addEventListener('click', () => {
            lightboxImg.src = finalImg.src;
            lightbox.style.display = 'flex';
          });
        };
      };
      reader.readAsDataURL(file);
      fileInput.value = '';
    });
  }

});

// ================== تنظیم اطلاعات کاربر ==================
function setUserProfile(username, profileImgUrl) {
  localStorage.setItem('userName', username);
  localStorage.setItem('userProfileImg', profileImgUrl);
}

// مثال: وقتی کاربر اکانت ساخت یا وارد شد
// setUserProfile('نرگس جوهری', './img/008.jpg');

// پیغان اتمام ویئ=دئو
document.addEventListener("DOMContentLoaded", () => {
  const player = document.getElementById("player");

  player.addEventListener("ended", () => {
    // ساخت باکس پایان ویدیو
    const popup = document.createElement("div");
    popup.className = "video-end-popup";
    popup.innerHTML = `
      <div class="popup-content">
        <p>🎬 این ویدیو به پایان رسید!</p>
        <button id="closePopup">باشه</button>
      </div>
    `;
    document.body.appendChild(popup);

    // بستن پیام
    document.getElementById("closePopup").addEventListener("click", () => {
      popup.remove();
    });
  });
});


