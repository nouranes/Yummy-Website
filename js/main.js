// & HTML elements
let searchName, searchLetter;
// & SideBar Box
const navInsideWidth = $(".upper").outerWidth();
let isShown = false;

$(".nav-inside").css({ left: `-${navInsideWidth}px` });

$(".fa-bars").on("click", function () {
  if (isShown) {
    $(".nav-inside").animate({ left: `-${navInsideWidth}px` }, 500);
    $(".bars-icon").removeClass("fa-xmark").addClass("fa-bars");

    // ^li animate ----------------
    $(".nav-inside ul li").css({
      opacity: 0,
      transform: "translateY(40px)",
    });

    isShown = false;
  } else {
    $(".nav-inside").animate({ left: `0` }, 500);
    $(".bars-icon").removeClass("fa-bars").addClass("fa-xmark");

    setTimeout(() => {
      $(".nav-inside ul li").each(function (index) {
        $(this)
          .delay(100 * index)
          .queue(function () {
            $(this)
              .css({
                opacity: 1,
                transform: "translateY(0)",
              })
              .dequeue();
          });
      });
    }, 300);

    isShown = true;
  }
});
// & End SideBar Box
function showLoading() {
  $(".loading-screen").css('display', 'flex').hide().fadeIn(300);
}

function hideLoading() {
  $(".loading-screen").fadeOut(300);
}

// & fetch data from api
async function getMeals(category, paramName = "", paramValue = "") {
  showLoading();
  let url;
  
  if (category === "lookup") {
    url = `https://www.themealdb.com/api/json/v1/1/lookup.php?${paramName}=${paramValue}`;
  } else {
    url = paramName && paramValue
      ? `https://www.themealdb.com/api/json/v1/1/${category}.php?${paramName}=${paramValue}`
      : `https://www.themealdb.com/api/json/v1/1/${category}.php`;
  }

try {
    let response = await fetch(url);
    let data = await response.json();
    hideLoading(); 
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    hideLoading(); 
    return { meals: null };
  }
}

// &------------------------------------------------------------->
// ?functions reusability 
function displayMeals(meals, imgKey = "", textKey = "") {
  $("#rowContainer").html("");
  for (let i = 0; i < meals.length; i++) {
    let imgSrc = meals[i][imgKey];
    let text = meals[i][textKey];
    let id = meals[i].idMeal;

    $("#rowContainer").append(`
      <div class="category-item flex-wrap col-md-4 col-lg-3" data-id="${id}">
        <img src="${imgSrc}" class="w-100 d-block" alt="food">
        <div class="catagory-content position-absolute">
          <p class="text-start">${text}</p>
        </div>
      </div>
    `);
  }

 
  $(".category-item").on("click", function() {
    let mealId = $(this).attr("data-id");
    getMealDetails(mealId);
  });
}

function getMealDetails(mealId) {
  getMeals("lookup", "i", mealId).then((data) => {
    let meal = data.meals[0];
    displayRecipeDetails(meal);
  });
}

function displayRecipeDetails(meal) {
  
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    let ingredient = meal[`strIngredient${i}`];
    let measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredientsList += `<p class="recipes">${measure} ${ingredient}</p>`;
    }
  }


  let tags = meal.strTags ? meal.strTags.split(",") : [];
  let tagsHtml = tags.map(tag => `<span class="tags me-1 mb-3">${tag}</span>`).join("");

  let recipeHTML = `
    <div class="row">
      <div class="col-md-6 text-white">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid rounded">
        <h2 class="py-3">${meal.strMeal}</h2>
      </div>
      <div class="col-md-6 text-white">
        <h3>Instructions</h3>
        <p class="lh-lg">${meal.strInstructions}</p>
        <h4 class="py-2">Area: <span>${meal.strArea}</span></h4>
        <h4 class="py-2">Category: <span>${meal.strCategory}</span></h4>
        <h4 class="py-2">Ingredients:</h4>
        ${ingredientsList}
        <h4 class="py-2 my-3">Tags:</h4>
        ${tagsHtml}
        <div class="recipe-btns py-2 my-3">
          ${meal.strSource ? `<a href="${meal.strSource}" target="_blank" class="btn btn-success">Source</a>` : ''}
          ${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>` : ''}
        </div>
      </div>
    </div>`;

  $("#rowContainer").html(recipeHTML);
}

// ? Pages
// * Search Page HTML & Logic

function displaySearchPage() {
  let searchHTML = `
    <div class="container py-4" id="searchContainer">
      <div class="container  row justify-content-center g-3">
       <h3 class="text-white text-center mb-4">Search Recipes</h3>
        <div class="container col-md-6 justify-content-center ">
        <label class="text-white mb-2">Search by Name</label>
          <input id="searchByName" type="text" class="form-control" placeholder="ex .pizza">
        </div>
        <div class="container col-md-6">
        <label class="text-white mb-2">Search by Letter</label>
          <input id="searchByLetter" type="text" maxlength="1" class="form-control" placeholder="ex .A">
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row d-flex justify-content-center" id="searchResults"></div>
    </div>
  `;

  $("#rowContainer").html(searchHTML);

 
  $("#searchByName").on("input", function () {
    let name = $(this).val().trim();
    if (name !== "") {
      getMeals("search", "s", name).then((data) => {
        if (data.meals) {
          displaySearchResults(data.meals);
        } else {
          $("#searchResults").html("<p class='text-white text-center'>No meals found</p>");
        }
      });
    } else {
      $("#searchResults").html("");
    }
  });

  
  $("#searchByLetter").on("input", function () {
    let letter = $(this).val().trim();
    if (letter !== "" && /^[a-zA-Z]$/.test(letter)) {
      getMeals("search", "f", letter).then((data) => {
        if (data.meals) {
          displaySearchResults(data.meals);
        } else {
          $("#searchResults").html("<p class='text-white text-center'>No meals found</p>");
        }
      });
    } else {
      $("#searchResults").html("");
    }
  });
}


function displaySearchResults(meals) {
  $("#searchResults").html("");
  for (let i = 0; i < meals.length; i++) {
    let imgSrc = meals[i].strMealThumb;
    let text = meals[i].strMeal;
    let id = meals[i].idMeal;

    $("#searchResults").append(`
      <div class="category-item  col-md-4 col-lg-3 mx-3  gx-4 gy-3" data-id="${id}">
        <img src="${imgSrc}" class="w-100 d-block" alt="food">
        <div class="catagory-content position-absolute">
          <p class="text-start">${text}</p>
        </div>
      </div>
    `);
  }

  $(".category-item").on("click", function () {
    let mealId = $(this).attr("data-id");
    getMealDetails(mealId);
  });
}

$(function () {
  $("#search").on("click", function (e) {
    e.preventDefault();
    displaySearchPage();
  });
});


// *Category page HTML
function displayCategories(arr) {
  $("#rowContainer").html("");
  for (let i = 0; i < arr.length; i++) {
    $("#rowContainer").append(`
      <div class="category-item flex-wrap col-md-4 col-lg-3" data-category="${arr[i].strCategory}">
        <img src="${arr[i].strCategoryThumb}" class="w-100 d-block" alt="food">
        <div class="catagory-content position-absolute">
          <h2 class="text-center">${arr[i].strCategory}</h2> 
          <p class="description text-start">${arr[i].strCategoryDescription}</p>
        </div>
      </div>
    `);
  }

  $(".category-item").on("click", function () {
    let clickedCategory = $(this).attr("data-category");
    getMeals("filter", "c", clickedCategory).then((data) => {
      displayMeals(data.meals, "strMealThumb", "strMeal");
    });
  });
}

$(function () {
  $("#category").on("click", function (e) {
    e.preventDefault();
    getMeals("categories").then((data) => {
      displayCategories(data.categories);
    });
  });
});

// * area Page HTML
// * area Page HTML - Modified to use the same functions as Category
function displayArea(arr) {
  $("#rowContainer").html("");
  for (let i = 0; i < arr.length; i++) {
    $("#rowContainer").append(`
      <div class="category-item col-md-6 col-lg-3 p-3 text-white text-center" data-category="${arr[i].strArea}">
        <i class="fa-solid fa-globe fs-1"></i> <!-- Changed icon to globe -->
        <p class="fs-4">${arr[i].strArea}</p>
      </div>
    `);
  }
  
  $(".category-item").on("click", function () {
    let clickedArea = $(this).attr("data-category");
    getMeals("filter", "a", clickedArea).then((data) => {
      displayMeals(data.meals, "strMealThumb", "strMeal");
    });
  });
}

$(function () {
  $("#area").on("click", function (e) {
    e.preventDefault();
    getMeals("list", "a", "list").then((data) => {
      displayArea(data.meals);
    });
  });
});
// *Ingredients page

function displayIngredient(arr) {
  $("#rowContainer").html("");
  for (let i = 0; i < arr.length; i++) {
    $("#rowContainer").append(`
      <div class="category-item p-3 col-md-6 col-lg-3 p-3 text-white text-center" data-category="${arr[i].strIngredient}">
        <i class="fa-solid fa-igloo fs-1"></i> <!-- Changed icon to carrot -->
        <h2 class="py-2 fs-3">${arr[i].strIngredient}</h2>
        <p class="description fs-6">${arr[i].strDescription || 'No description available'}</p>
      </div>
    `);
  }
  
  $(".category-item").on("click", function () {
    let clickedIngredient = $(this).attr("data-category");
    getMeals("filter", "i", clickedIngredient).then((data) => {
      displayMeals(data.meals, "strMealThumb", "strMeal");
    });
  });
}
// *final page contact us -------------------
$(function () {
  $("#ingredient").on("click", function (e) {
    e.preventDefault();
    getMeals("list", "i", "list").then((data) => {
      displayIngredient(data.meals);
    });
  });
});
$(function () {
  $("#contact").on("click", function (e) {
    e.preventDefault();

    let contactHTML = `
    <div class="d-flex justify-content-center align-items-center min-vh-100">
      <form class="form-item w-100">
        <div class="container">
          <div class="row mb-3">
            <div class="col-md-6 mb-3 mb-md-0">
              <input type="text" id="name" class="form-control rounded" placeholder="Enter Your Name">
            </div>
            <div class="col-md-6">
              <input type="email" id="email" class="form-control rounded" placeholder="Enter Your Email">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6 mb-3 mb-md-0">
              <input type="text" id="phone" class="form-control rounded" placeholder="Enter Your Phone">
            </div>
            <div class="col-md-6">
              <input type="number" id="age" class="form-control rounded" placeholder="Enter Your Age">
            </div>
          </div>
          <div class="row mb-4">
            <div class="col-md-6 mb-3 mb-md-0">
              <input type="password" id="password" class="form-control rounded" placeholder="Enter Your Password">
            </div>
            <div class="col-md-6">
              <input type="password" id="repassword" class="form-control rounded" placeholder="Repassword">
            </div>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-outline-danger px-4">Submit</button>
          </div>
        </div>
      </form>
    </div>`;

    $("#rowContainer").html(contactHTML);

    
    const nameRegex = /^[a-zA-Z ]{3,}$/;
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
    const ageRegex = /^(1[89]|[2-9]\d)$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    $(".form-item").on("submit", function (e) {
      e.preventDefault();

      let isValid = true;

      let name = $("#name").val().trim();
      let email = $("#email").val().trim();
      let phone = $("#phone").val().trim();
      let age = $("#age").val().trim();
      let password = $("#password").val().trim();
      let repassword = $("#repassword").val().trim();

      if (!nameRegex.test(name)) {
        alert("❌ Please enter a valid name (at least 3 letters)");
        isValid = false;
      }

      if (!emailRegex.test(email)) {
        alert("❌ Please enter a valid email");
        isValid = false;
      }

      if (!phoneRegex.test(phone)) {
        alert("❌ Please enter a valid Egyptian phone number");
        isValid = false;
      }

      if (!ageRegex.test(age)) {
        alert("❌ Age must be 18 or more");
        isValid = false;
      }

      if (!passwordRegex.test(password)) {
        alert("❌ Password must be at least 6 characters and contain letters and numbers");
        isValid = false;
      }

      if (password !== repassword) {
        alert("❌ Passwords do not match");
        isValid = false;
      }

      if (isValid) {
        alert("✅ All inputs are valid. Form submitted!");
      }
    });
  });
});
// *default category
$(document).ready(function() {
  
  getMeals("categories").then((data) => {
    displayCategories(data.categories);
  });
});
