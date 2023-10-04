document.addEventListener("DOMContentLoaded", function () {
  const reviewForm = document.getElementById("review-form");
  const reviewsContainer = document.getElementById("reviews");

  reviewForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const comment = document.getElementById("comment").value;

    //Отправляю запрос на сервер с отзывами
    const apiUrl = "https://provence-backend.onrender.com/provence/reviews/add";

    const review = {
      reviewersName: name,
      review: comment,
    };

    const getData = (method, url, review) => {
      const headers = {
        "Content-Type": "application/json",
      };

      fetch(url, {
        method: method,
        body: JSON.stringify(review),
        headers: headers,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Что то пошло не так");
          }
        })
        .then((dat) => console.log(dat))
        .catch((error) => console.log(error.message));
    };

    getData("POST", apiUrl, review);
  });

  // Получение отзывов с сервера
  const fetchDataServer = () => {
    fetch("https://provence-backend.onrender.com/provence/reviews")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Что то пошло не так");
        }
      })
      .then((data) => {
        displayFetch(data);
      })
      .catch((error) => console.log(error.massage));
  };

  fetchDataServer();

  const displayFetch = (data) => {
    data.forEach((review) => {
      const reviewElement = document.createElement("div");
      reviewElement.classList.add("review");

      const nameElement = document.createElement("strong");
      nameElement.textContent = `${review.reviewersName}`;

      const commentElement = document.createElement("p");
      commentElement.textContent = `${review.review}`;

      reviewElement.appendChild(nameElement);
      reviewElement.appendChild(commentElement);

      reviewsContainer.appendChild(reviewElement);
    });
  };

  // Авторизация по почте для публикаций отзыва
  const kodModalBtn = document.querySelector("#email-btn");
  const emailKodForm = document.querySelector("#kod-podtverd");

  kodModalBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const emailRequest = document.querySelector("#email-request").value;

    const url =
      "https://provence-backend.onrender.com/provence/orders/verificate";

    const email = {
      email: emailRequest,
    };

    const dataEmail = (method, url, email) => {
      const headers = {
        "Content-Type": "application/json",
      };

      fetch(url, {
        method: method,
        body: JSON.stringify(email),
        headers: headers,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Что то пошло не так");
          }
        })
        .then((data) => console.log(data))
        .catch((error) => console.log(error.message));
    };

    dataEmail("POST", url, email);
  });

  // Запрос на отправку кода
  emailKodForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailKod = document.querySelector("#kodi").value;

    const url = "https://provence-backend.onrender.com/provence/orders/code";

    const kod = emailKod;

    const dataKod = (method, url, kod) => {
      const headers = {
        "Content-Type": "application/json",
      };

      fetch(url, {
        method: method,
        body: JSON.stringify(kod),
        headers: headers,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Что то пошло не так");
          }
        })
        .then((data) => {
          if (data == true) {
            console.log(data);

            localStorage.setItem("isAuthorized", "true");

            disabledReview();
          } else {
            alert("Подтверждение не удалось. Проверьте код подтверждения.");

            noDisabledReview();
          }
          alert("Подтверждение успешно!");
        })
        .catch((error) => console.error(error));
    };

    dataKod("POST", url, kod);
  });

  // Функций для блокиров и разблокировки кнопки отправить отзыв
  const reviewButton = document.querySelector("[data-review-button]");

  function disabledReview() {
    reviewButton.removeAttribute("disabled");
  }

  function noDisabledReview() {
    reviewButton.setAttribute("disabled", "disabled");
  }

  reviewButton.addEventListener("click", function () {
    const isAuthorized = localStorage.getItem("isAuthorized");

    if (isAuthorized === "false") {
      // Если пользователь авторизован, позволяем добавить отзыв (вы можете добавить здесь логику для открытия формы или другие действия)
      alert("Для добавления отзыва вам необходимо авторизоваться.");
    } else {
      // Если пользователь не авторизован, выводим сообщение
      alert("Вы можете оставить отзыв");
    }
  });

  // Проверяет авторизован ли юзер
  window.addEventListener("load", function () {
    const isAuthorized = localStorage.getItem("isAuthorized");
    if (isAuthorized === "true") {
      disabledReview();
    } else {
      noDisabledReview();
    }
  });

  //Модалка для подтверждения кода почты
  const modalKod = document.querySelector("[data-modal-kod]");
  const kodModalClose = document.querySelector("[data-modal-kod-close]");

  const openWithtDelay = () => {
    setTimeout(function () {
      modalKod.classList.remove("hidden");
    }, 1000);
  };

  kodModalBtn.onclick = function (e) {
    e.preventDefault();

    openWithtDelay();
  };

  kodModalClose.addEventListener("click", function (e) {
    e.preventDefault();

    modalKod.classList.add("hidden");
  });
});
