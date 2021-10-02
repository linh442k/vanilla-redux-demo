const { createStore } = window.Redux;

const initialState = JSON.parse(localStorage.getItem("hobby_list")) || [];

const hobbyReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_HOBBY": {
      const newList = [...state];

      // the check should come from middleware
      if (!newList.includes(action.payload)) newList.push(action.payload);
      return newList;
    }
    case "REMOVE_HOBBY": {
      // the check should come from middleware
      const newList = [...state].filter((listItem) =>
        listItem.localeCompare(action.payload)
      );
      return newList;
    }
    default:
      return state;
  }
};

const hobbyStore = createStore(hobbyReducer);
const updateDeleteBtn = () => {
  const deleteHobbyBtn = document.querySelectorAll(".deleteHobbyBtn");
  if (deleteHobbyBtn) {
    const deleteHobby = (e) => {
      const action = {
        type: "REMOVE_HOBBY",
        payload: e.target.id,
      };
      hobbyStore.dispatch(action);
    };
    for (var i = 0; i < deleteHobbyBtn.length; i++)
      deleteHobbyBtn[i].addEventListener("click", deleteHobby);
    // console.log(deleteHobbyBtn);
  }
};
const renderHobbyList = (hobbyList) => {
  if (!Array.isArray(hobbyList)) return;
  const ulElement = document.querySelector("#hobbyListId");
  if (!ulElement) return;

  ulElement.innerHTML = "";

  for (const hobby of hobbyList) {
    const divElement = document.createElement("div");
    divElement.setAttribute("style", "display: flex; flex-direction: row;");

    const liElement = document.createElement("li");
    liElement.textContent = hobby;

    const btnElement = document.createElement("button");
    btnElement.textContent = "delete";
    btnElement.setAttribute("id", hobby);
    btnElement.setAttribute("class", "deleteHobbyBtn");
    divElement.appendChild(liElement);
    divElement.appendChild(btnElement);
    ulElement.appendChild(divElement);
    updateDeleteBtn();
  }
};

const initialHobbyList = hobbyStore.getState();
console.log(initialHobbyList);
renderHobbyList(initialHobbyList);

const hobbyFormElement = document.querySelector("#hobbyFormId");
if (hobbyFormElement) {
  const hobbyFormSubmit = (e) => {
    e.preventDefault();
    const hobbyFormText = document.querySelector("#hobbyTextId");
    if (!hobbyFormText) return;

    const action = {
      type: "ADD_HOBBY",
      payload: hobbyFormText.value.trim(),
    };
    hobbyStore.dispatch(action);

    hobbyFormElement.reset();
  };

  hobbyFormElement.addEventListener("submit", hobbyFormSubmit);
}

hobbyStore.subscribe(() => {
  const currentHobbyList = hobbyStore.getState();
  renderHobbyList(currentHobbyList);
  console.log(currentHobbyList);
  // save local
  localStorage.setItem("hobby_list", JSON.stringify(currentHobbyList));
});

// const action = {
//   type: "REMOVE_HOBBY",
//   payload: "qqq",
// };
// hobbyStore.dispatch(action);
