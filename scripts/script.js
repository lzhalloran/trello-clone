//declare the trelloData variable
//and object with an array of columns, each column is an object with a name and an array of cards.
// each card is an object with a title, content, a timestamp
let trelloData = {
  columns: [
    {
      name: "To-Do",
      cards: [
        {
          title: "Example card",
          content: "Drag this card around to try out the app!",
          timestamp: null,
        },
      ],
    },
    {
      name: "Doing",
      cards: [],
    },
  ],
};

console.log(trelloData);

function renderColumns() {
  let trelloDataRowRootNode = document.getElementById("dataDisplayRow");

  //Removing any stale or old HTML content
  trelloDataRowRootNode.innerHTML = "";

  //Generate new HTML content
  trelloData.columns.forEach((column) => {
    console.log(column.name);

    //create the element to contain the column
    let columnNode = document.createElement("div");

    //set the column ID in the DOM
    columnNode.id = column.name;
    columnNode.classList.add("trelloColumn");

    //Give the columns some drag and drop event handling
    columnNode.addEventListener("dragover", allowDrop);

    // Allow us to detect when a card is dropped into a column
    columnNode.addEventListener("drop", dropCard);

    //create content to render column data
    let columnHeading = document.createElement("h3");
    columnHeading.innerText = column.name;
    columnNode.appendChild(columnHeading);

    //create the cards
    column.cards.forEach((card) => {
      //Find the card preview, copy it, and save the copy to the variable
      let newCard = document.getElementById("cardPreview").cloneNode(true);
      if (!card.timestamp || isNaN(card.timestamp)) {
        card.timestamp = Date.now();
      }

      newCard.id = card.timestamp;

      //Find the h3 of the card title and change its content
      newCard.querySelector("h3").innerText = card.title;
      newCard.querySelector(".cardDisplay-title").innerText = card.title;

      //Same as the above for the paragraph
      newCard.querySelector(".cardDisplay-content").innerText = card.content;

      //allow cards to be draggable
      newCard.addEventListener("dragstart", drag);

      //After data is all done, attach card to column
      columnNode.appendChild(newCard);

      // Create a delete button for the cards
      let deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.classList.add("deleteButton");

      // Listener for delete
      deleteButton.addEventListener("click", function () {
        deleteCard(card.timestamp, column.name);
      });

      // Append delete button to card
      newCard.appendChild(deleteButton);
    });

    //after column is created, append it to its node as a child
    trelloDataRowRootNode.appendChild(columnNode);
  });
}

// Delete a card function
function deleteCard(timestamp, columnName) {
  let column = trelloData.columns.find((col) => col.name === columnName);
  column.cards = column.cards.filter((card) => card.timestamp !== timestamp);
  renderColumns();
}

// Update card preview function
function updateCardPreview(event) {
  event.preventDefault();
  let cardPreview = document.getElementById("cardPreview");
  let newTitle = document.getElementById("cardTitle").value;
  let newContent = document.getElementById("cardContent").value;
  cardPreview.querySelector("h3").innerText = newTitle;
  cardPreview.querySelector("p").innerText = newContent;
}

// Update card preview event listener
document.getElementById("cardSubmitButton").addEventListener("click", updateCardPreview);

//When we drag a DOM element around,
// Tell the browser some data about what we are dragging
function drag(event) {
  console.log("Element dragged, id: " + event.target.id);
  event.dataTransfer.setData("text", event.target.id);
}

document.getElementById("cardPreview").addEventListener("dragstart", drag);

function allowDrop(event) {
  event.preventDefault();
}

function dropCard(event) {
  event.preventDefault();
  console.log("Event target: " + event.target.id);

  let data = event.dataTransfer.getData("text");
  //console.log("Dropped card, id: " + data);

  let oldCardElement = document.getElementById(data);
  console.log(oldCardElement);
  let oldCardData = {
    title: oldCardElement.querySelector(".cardDisplay-title").innerText,
    content: oldCardElement.querySelector(".cardDisplay-content").innerText,
    timestamp: oldCardElement.id,
  };

  //Find the column data for the column the we just dragged the card on to
  // push the card into its data
  trelloData.columns.forEach((column) => {
    column.cards = column.cards.filter(
      (card) => card.timestamp != oldCardData.timestamp
    );
    if (column.name == event.target.id) {
      column.cards.push(oldCardData);
    }
  });

  //Any time we modify trelloData, we should re-render columns and cards
  renderColumns();
}

renderColumns();
