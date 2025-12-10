const listItems = document.querySelectorAll(".listItem");
const mealTable = document.querySelector("#meal-table");

listItems.forEach((item) => {
  const listCheckbox = item.querySelector(".listCheckbox");

  // Change checked items to italics
  if (listCheckbox) {
    listCheckbox.addEventListener("change", (e) => {
      item.style.fontStyle = e.target.checked ? "italic" : "normal";
    });
  }

  // Counter
  const add = item.querySelector(".add");
  const subtract = item.querySelector(".subtract");
  const countDisplay = item.querySelector(".countDisplay");

  // Update Price Total
  const priceCell = item.querySelector(".price");
  let price = Number(priceCell.textContent);

  const changePrice = () => {
    let priceTotal = price * Number(countDisplay.textContent);
    priceCell.textContent = priceTotal.toFixed(2);
  };

  changePrice(price);

  const counter = (numDisplay) => {
    let count = Number(numDisplay.value);

    add.addEventListener("click", () => {
      count++;
      numDisplay.value = count;
      changePrice();
    });

    subtract.addEventListener("click", () => {
      count = Math.max(1, count - 1); // prevent going below 0
      numDisplay.value = count;
      changePrice();
    });
  };

  if (countDisplay) {
    counter(countDisplay);
  }

  // Kitchen
  const kitchenUnits = item.querySelector(".kitchenUnits");

  if (kitchenUnits) {
    counter(kitchenUnits);
    console.log(Number(kitchenUnits.value));
  }
});
