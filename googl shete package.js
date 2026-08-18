// تعداد بازدید و لایک
let viewsCount = 0;

// مدیریت باز شدن فصل‌ها
function toggleChapter(element) {
  const chapter = element.parentElement;
  chapter.classList.toggle("open");
}

// پخش ویدیو
function playVideo(item, src) {
  const playerContainer = document.getElementById("video-player");
  const player = document.getElementById("player");
  const videoKey = src.split('/').pop(); // کلید یکتا فقط از نام فایل

  playerContainer.classList.remove("hidden");
  player.src = src;
  player.load();
  player.play();

  // افزایش بازدید (LocalStorage برای هر ویدیو)
  let viewsCount = parseInt(localStorage.getItem(videoKey + "_views") || "0");
  viewsCount++;
  localStorage.setItem(videoKey + "_views", viewsCount);
  document.querySelector(".views").textContent = `👁 ${viewsCount} بازدید`;

  // مدیریت لایک
  let likeCount = parseInt(localStorage.getItem(videoKey + "_likes") || "0");
  document.getElementById("like-count").textContent = likeCount;

  const userLiked = localStorage.getItem(videoKey + "_userLiked") === "true";
  const likeBtn = document.getElementById("like-btn");
  likeBtn.disabled = userLiked;

  // ریست کامنت‌ها
  document.getElementById("comment-list").innerHTML = '';

  // ✅ پیام پایان ویدیو با لوگو
  player.onended = () => {
    const popup = document.createElement("div");
    popup.className = "video-end-popup";
    popup.innerHTML = `
      <div class="popup-content">
        <p>این ویدیو به پایان رسید ✅</p>
        <button id="closePopup">باشه</button>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById("closePopup").addEventListener("click", () => {
      popup.remove();
    });
  };
}

// پخش/توقف
function togglePlay() {
  const player = document.getElementById("player");
  if (player.paused) player.play();
  else player.pause();
}

// جلو/عقب
function skip(seconds) {
  const player = document.getElementById("player");
  player.currentTime += seconds;
}

// بستن پلیر
function closePlayer() {
  const playerContainer = document.getElementById("video-player");
  const player = document.getElementById("player");
  player.pause();
  playerContainer.classList.add("hidden");
}

// لایک یک‌بار
function likeVideo() {
  const player = document.getElementById("player");
  const src = player.src;
  const videoKey = src.split('/').pop(); // کلید یکتا فقط از نام فایل

  if (localStorage.getItem(videoKey + "_userLiked") === "true") return;

  let likeCount = parseInt(localStorage.getItem(videoKey + "_likes") || "0");
  likeCount++;
  localStorage.setItem(videoKey + "_likes", likeCount);
  localStorage.setItem(videoKey + "_userLiked", "true");

  document.getElementById("like-count").textContent = likeCount;
  document.getElementById("like-btn").disabled = true;
}

// اضافه کردن کامنت
function addComment(event) {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  const text = document.getElementById("comment-text").value.trim();
  if (!username || !text) return;

  const commentList = document.getElementById("comment-list");
  const commentDiv = document.createElement("div");
  commentDiv.className = "comment-item";
  commentDiv.innerHTML = `<strong>${username}:</strong> ${text}<div class="reply">پاسخ مدرس: متشکرم 🙏</div>`;

  commentList.appendChild(commentDiv);
  document.getElementById("comment-form").reset();
}

// باز و بسته کردن منو
const menuToggle = document.getElementById('menu-toggle');
const menu = document.querySelector('.header ul');

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

// خرید پکیج
document.querySelectorAll('.buy-now').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();

    const productData = {
      id: this.dataset.id,
      title: this.dataset.title,
      price: parseInt(this.dataset.price, 10),
      image: this.dataset.image
    };

    localStorage.setItem('selectedBook', JSON.stringify(productData));
    window.location.href = 'shoping.html';
  });
});

// پنجره چت
const chatBox = document.getElementById("chatBox");
const closeChat = document.getElementById("closeChat");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBody = document.getElementById("chatBody");
const openChatLink = document.getElementById("openChatLink");
const chatToggleWidget = document.getElementById("chatToggleWidget");

openChatLink.addEventListener("click", (e) => {
  e.preventDefault();
  chatBox.classList.add("show");
});

chatToggleWidget.addEventListener("click", () => {
  chatBox.classList.toggle("show");
});

closeChat.addEventListener("click", () => {
  chatBox.classList.remove("show");
});

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

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
// بزگ گزدن ویئویو
function toggleFullScreen() {
  const player = document.getElementById("player");

  if (!document.fullscreenElement) {
    player.requestFullscreen().catch(err => {
      console.error(`خطا در فعال کردن تمام‌صفحه: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}
//  دکمه اشتارم گداری
function updateShareLinks(videoUrl) {
  const pageUrl = window.location.origin + window.location.pathname;
  const fullLink = `${pageUrl}?video=${encodeURIComponent(videoUrl)}`;
  const text = encodeURIComponent("این ویدیو رو ببین! 📹");

  document.getElementById("share-whatsapp").href = `https://api.whatsapp.com/send?text=${text}%20${fullLink}`;
  document.getElementById("share-telegram").href = `https://t.me/share/url?url=${fullLink}&text=${text}`;
  document.getElementById("share-sms").href = `sms:?body=${text}%20${fullLink}`;
  document.getElementById("share-email").href = `mailto:?subject=ویدیوی آموزشی جادوی سئو&body=${text}%0A${fullLink}`;

  document.getElementById("copy-link").onclick = () => {
    navigator.clipboard.writeText(fullLink);
    alert("لینک کپی شد ✅");
  };
}

// --- باز و بسته شدن منوی کشویی ---
document.getElementById("share-toggle").addEventListener("click", () => {
  const menu = document.querySelector(".share-options");
  menu.classList.toggle("hidden");
});

// کوییز
 const openQuiz = document.getElementById('open-quiz');
const quizModal = document.getElementById('quiz-modal');
const submitQuiz = document.getElementById('submit-quiz');
const quizResult = document.getElementById('quiz-result');
const quizForm = document.getElementById('quiz-form');

const correctAnswers = {
  q1: '4',
  q2: 'تهران'
};

// رنگ‌دهی به گزینه‌ها بعد از ارسال
function highlightAnswers(userAnswers) {
  Object.keys(correctAnswers).forEach(q => {
    const radios = quizForm.querySelectorAll(`input[name="${q}"]`);
    radios.forEach(radio => {
      const label = radio.parentElement;
      label.style.display = 'inline-block';
      label.style.padding = '6px 10px';
      label.style.borderRadius = '6px';
      label.style.transition = 'all 0.3s ease';
      label.style.marginBottom = '3px';

      // پاک‌کردن استایل‌های قبلی
      label.style.backgroundColor = '';
      label.style.color = '';
      label.style.fontWeight = 'normal';

      const correctValue = correctAnswers[q].trim().toLowerCase();
      const userValue = (userAnswers[q] || '').trim().toLowerCase();
      const currentValue = radio.value.trim().toLowerCase();

      if (currentValue === correctValue) {
        // ✅ پاسخ صحیح
        label.style.backgroundColor = '#00e676'; // سبز روشن
        label.style.color = '#000';
        label.style.fontWeight = 'bold';
      } else if (radio.checked && currentValue === userValue && userValue !== correctValue) {
        // ❌ پاسخ اشتباه کاربر
        label.style.backgroundColor = '#ff7043'; // نارنجی تیره‌تر
        label.style.color = '#fff';
        label.style.fontWeight = 'bold';
      } else {
        // بقیه گزینه‌ها
        label.style.backgroundColor = 'transparent';
        label.style.color = '#fff';
      }
    });
  });
}



function setInputsDisabled(disabled) {
  const inputs = quizForm.querySelectorAll('input[type="radio"]');
  inputs.forEach(i => (i.disabled = disabled));
}

function readAnswers() {
  const result = {};
  Object.keys(correctAnswers).forEach(q => {
    const selected = quizForm.querySelector(`input[name="${q}"]:checked`);
    result[q] = selected ? selected.value : '';
  });
  return result;
}


function calculateScore(answers) {
  let total = 0,
    correct = 0;
  Object.keys(correctAnswers).forEach(q => {
    if (answers[q]) {
      total++;
      if (answers[q] === correctAnswers[q]) correct++;
    }
  });
  const percent = total ? Math.round((correct / total) * 100) : 0;
  return { total, correct, percent };
}

function loadQuizState() {
  const done = localStorage.getItem('quiz_done') === 'true';
  const storedScore = localStorage.getItem('quiz_score');
  const storedAnswers = JSON.parse(localStorage.getItem('quiz_answers') || '{}');
  return { done, storedScore, storedAnswers };
}

openQuiz.addEventListener('click', () => {
  quizModal.classList.toggle('hidden');

  const { done, storedScore, storedAnswers } = loadQuizState();

  if (done) {
    // نمایش پاسخ‌ها و رنگ‌ها
    setInputsDisabled(true);
    submitQuiz.disabled = true;
    quizResult.textContent = `نتیجهٔ قبلی: ${storedScore} ✅ (قبلاً ارسال شده)`;

    // پر کردن گزینه‌های انتخاب‌شده قبلی
    Object.keys(storedAnswers).forEach(q => {
      const value = storedAnswers[q];
      if (value) {
        const input = quizForm.querySelector(`input[name="${q}"][value="${value}"]`);
        if (input) input.checked = true;
      }
    });

    // رنگ‌دهی به پاسخ‌ها
    highlightAnswers(storedAnswers);
  } else {
    setInputsDisabled(false);
    submitQuiz.disabled = false;
    quizResult.textContent = '';
  }
});

submitQuiz.addEventListener('click', () => {
  const answers = readAnswers();

  const allAnswered = Object.keys(correctAnswers).every(
    q => answers[q] && answers[q].length > 0
  );
  if (!allAnswered) {
    alert('لطفاً به همهٔ سوالات پاسخ دهید قبل از ارسال.');
    return;
  }

  const { total, correct, percent } = calculateScore(answers);

  quizResult.textContent = `نتیجهٔ شما: ${correct} از ${total} درست — (${percent}%)`;

  // رنگ‌دهی بعد از ارسال
  highlightAnswers(answers);

  // ذخیره در localStorage
  localStorage.setItem('quiz_done', 'true');
  localStorage.setItem('quiz_score', `${percent}% (${correct}/${total})`);
  localStorage.setItem('quiz_answers', JSON.stringify(answers));

  // قفل کردن آزمون
  setInputsDisabled(true);
  submitQuiz.disabled = true;
});

// برای استپ مردن ویدو
const video = document.getElementById('player');
const btnIcon = document.getElementById('playIcon');

function togglePlay() {
    if (video.paused) {
        video.play();
        // تغییر به Pause SVG
        btnIcon.innerHTML = '<path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z"></path>';
    } else {
        video.pause();
        // تغییر به Play SVG
        btnIcon.innerHTML = '<path d="M7 6.13402V17.866C7 18.7606 8.02908 19.3042 8.82159 18.8172L18.45 12.9512C19.1833 12.5096 19.1833 11.4904 18.45 11.0374L8.82159 5.18278C8.02908 4.69583 7 5.2394 7 6.13402Z"></path>';
    }
}
//   برای محوز کامنت
function addComment(event) {
  event.preventDefault();

  // بررسی ورود کاربر
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    alert('اول باید اکانت بسازید!');
    window.location.href = 'Create an account.html'; // صفحه ثبت‌نام
    return;
  }

  // گرفتن متن کامنت
  const text = document.getElementById("comment-text").value.trim();
  if (!text) return;

  const commentList = document.getElementById("comment-list");
  const commentDiv = document.createElement("div");
  commentDiv.className = "comment-item";
  commentDiv.innerHTML = `
    <strong>${user.name}:</strong> ${text}
    <div class="reply">پاسخ مدرس: متشکرم 🙏</div>
  `;

  commentList.appendChild(commentDiv);
  document.getElementById("comment-form").reset();
}
 // فانکشن پیام ارور استایل شده
function addComment(event) {
  event.preventDefault();

  // بررسی ورود کاربر
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    showError('اول باید اکانت بسازید!');
    setTimeout(() => {
      window.location.href = 'Create an account.html'; // صفحه ثبت‌نام
    }, 1000);
    return;
  }

  // گرفتن متن کامنت
  const text = document.getElementById("comment-text").value.trim();
  if (!text) return;

  const commentList = document.getElementById("comment-list");
  const commentDiv = document.createElement("div");
  commentDiv.className = "comment-item";
  commentDiv.innerHTML = `
    <strong>${user.name}:</strong> ${text}
    <div class="reply">پاسخ مدرس: متشکرم 🙏</div>
  `;

  commentList.appendChild(commentDiv);
  document.getElementById("comment-form").reset();
}

// فانکشن پیام ارور استایل شده
function showError(msg) {
  let errorDiv = document.getElementById("comment-error");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.id = "comment-error";
    document.body.appendChild(errorDiv);
  }
  errorDiv.textContent = msg;
  errorDiv.style.position = "fixed";
  errorDiv.style.top = "20px";
  errorDiv.style.right = "20px";
  errorDiv.style.backgroundColor = "#4d0405ff";
  errorDiv.style.color = "#fff";
  errorDiv.style.padding = "10px 20px";
  errorDiv.style.borderRadius = "8px";
  errorDiv.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
  errorDiv.style.zIndex = "9999";
  setTimeout(() => errorDiv.remove(), 3000);
}
//  ریچ لای کانت
function addComment(event) {
  event.preventDefault();

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    showError('اول باید اکانت بسازید!');
    setTimeout(() => {
      window.location.href = 'Create an account.html';
    }, 1000);
    return;
  }

  const text = document.getElementById("comment-text").value.trim();
  if (!text) return;

  const commentList = document.getElementById("comment-list");
  const commentDiv = document.createElement("div");
  commentDiv.className = "comment-item";
  commentDiv.innerHTML = `
    <strong>${user.name}:</strong> ${text}
    <button class="reply-btn">پاسخ</button>
    <div class="replies"></div>
  `;

  commentList.appendChild(commentDiv);
  document.getElementById("comment-form").reset();

  // دکمه ریپلای
  const replyBtn = commentDiv.querySelector(".reply-btn");
  replyBtn.addEventListener("click", () => {
    const replyText = prompt("پاسخ خود را بنویسید:");
    if (!replyText) return;

    const replyDiv = document.createElement("div");
    replyDiv.className = "reply-item";
    replyDiv.innerHTML = `<strong>پاسخ:</strong> ${replyText}`;
    commentDiv.querySelector(".replies").appendChild(replyDiv);
  });
}
// 
// مسیر صفحات (می‌تونه داینامیک از URL یا JS بیاد)
const breadcrumb = document.getElementById("breadcrumb");

// مثال مسیر
const path = [
  { name: "پکیج گوگل شیت", url: "./googl shete package.html" },


];

// ایجاد breadcrumb
path.forEach(item => {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = item.url;
  a.textContent = item.name;
  li.appendChild(a);
  breadcrumb.appendChild(li);
});