
export function displayCategories(arr) {
    $("#rowContainer").html("");
  for (let i = 0; i < arr.length; i++) {
    
    $("#rowContainer").append(`
                    <div class="category-item   flex-wrap col-md-4 col-lg-3" data-category="${arr[i].strCategory}">
                        <img src="${arr[i].strCategoryThumb}" class="w-100 d-block" alt="food">
                        <div class="catagory-content position-absolute">
                            <h2 class="text-center">${arr[i].strCategory}</h2> 
                            <p class="text-start">
                                ${arr[i].strCategoryDescription} 
                            </p>
                        </div>
                    </div>
                `);
  }
 $(".category-item ").on("click",function(){
    let clickedCategory = $(this).attr("data-category")
    getMeals("filter", "c", clickedCategory);
    console.log(clickedCategory);
    

    
 })
}
export function displayMeals(meals) {
    $("#rowContainer").html(""); // تنظيف المحتوى السابق
    meals.forEach(meal => {
        $("#rowContainer").append(`
            <div class="meal-item col-md-4 col-lg-3">
                <img src="${meal.strMealThumb}" class="w-100 d-block" alt="meal">
                <div class="meal-content">
                    <h3 class="text-center">${meal.strMeal}</h3>
                    <p>${meal.strInstructions}</p>
                </div>
            </div>
        `);
    });
}

ex$(function () {
  $("#category").on("click", function (e) {
    e.preventDefault();

    getMeals("categories");
  });
});