class Todolist {
  constructor(api) {
    this.api = api;
    this.get();
    this.box = document.querySelector(".box");
    this.AddModal = document.querySelector(".AddModal");
    this.formAdd = document.querySelector(".formAdd");
    this.btnAdd = document.querySelector(".btnAdd");
    this.EditModal = document.querySelector(".EditModal");
    this.formEdit = document.querySelector(".formEdit");
    this.cancelEdit = document.querySelector(".cancelEdit");
    this.cancelAdd = document.querySelector(".cancelAdd");
    this.Search = document.querySelector(".Search");
    this.cancelInfo = document.querySelector(".cancelInfo");
    this.InfoModal = document.querySelector(".InfoModal");
    this.InfoTitle = document.querySelector(".InfoTitle");
    this.InfoDescription = document.querySelector(".InfoDescription");
    this.selectStatus = document.querySelector(".selectStatus");
    this.InfoStatus = document.querySelector(".InfoStatus");
    this.x1 = document.querySelector(".x1");
    this.x2 = document.querySelector(".x2");
    this.idx = null;

    this.btnAdd.onclick = () => {
      this.AddModal.showModal();
      this.addUser();
    };

    this.cancelInfo.onclick = () => {
      this.InfoModal.close();
    };

    this.cancelAdd.onclick = () => {
      this.AddModal.close();
    };

    this.cancelEdit.onclick = () => {
      this.EditModal.close();
    };

    this.Search.oninput = () => {
      this.search();
    };

    this.x1.onclick = () => {
      this.AddModal.close();
    };

    this.x2.onclick = () => {
      this.EditModal.close();
    };

    this.selectStatus.onchange = () => {
      this.selSt();
    };
  }
  async get() {
    try {
      let responce = await fetch(this.api);
      let data = await responce.json();
      this.getData(data);
    } catch (error) {
      console.error(error);
    }
  }
  getData(data) {
    this.box.innerHTML = "";
    data.forEach((e) => {
      let container = document.createElement("div");
      let action = document.createElement("div");
      let Actions = document.createElement("div");
      let check = document.createElement("div");
      let text = document.createElement("p");
      let done = document.createElement("input");
      let Title = document.createElement("h3");
      let Description = document.createElement("p");
      let del = document.createElement("p");
      let edit = document.createElement("p");
      let info = document.createElement("button");

      text.innerHTML = "done";
      done.type = "checkbox";
      info.innerHTML = "Info";
      info.classList.add("infoBtn");
      check.append(done, text);
      check.style.display = "flex";
      check.style.gap = "10px";
      Title.innerHTML = e.title;
      Description.innerHTML = e.description;
      del.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#EF4444"/>
  </svg>
  `;
      edit.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2.99878 17.2512V21.0013H6.74878L17.8088 9.94125L14.0588 6.19125L2.99878 17.2512ZM20.7088 7.04125C21.0988 6.65125 21.0988 6.02125 20.7088 5.63125L18.3688 3.29125C17.9788 2.90125 17.3488 2.90125 16.9588 3.29125L15.1288 5.12125L18.8788 8.87125L20.7088 7.04125Z" fill="black" fill-opacity="0.56"/>
  </svg>
  `;

      del.onclick = () => {
        this.delFunc(e.id);
      };

      check.onclick = () => {
        this.checkFunc(e);
      };

      info.onclick = () => {
        this.infoFunc(e);
        this.InfoModal.showModal();
      };

      edit.onclick = () => {
        this.EditModal.showModal();
        this.formEdit["EditTitle"].value = e.title;
        this.formEdit["EditDescription"].value = e.description;
        this.formEdit["EditStatus"].value = e.status ? "true" : "false";
        this.idx = e.id;
        this.editUser();
      };

      if (e.status) Title.style.textDecoration = "line-through";
      if (!e.status) Title.style.textDecoration = "none";
      done.checked = e.status;
      Actions.style.display = "flex";
      Actions.style.alignItems = "center";
      Actions.style.justifyContent = "space-between";
      action.append(edit, del, info);
      Actions.append(action, check);
      Actions.style.marginTop = "38px";
      action.style.display = "flex";
      action.style.gap = "12px";
      Title.style.fontSize = "20px";
      Title.style.marginBottom = "17px";
      container.style.borderRadius = "10px";
      container.style.padding = "0px 20px";
      container.style.paddingTop = "15px";
      container.style.backgroundColor = "#FFF9DE";
      Description.style.width = "276px";
      Description.style.wordBreak = "break-word";
      container.style.width = "358px";
      container.style.height = "187px";
      container.style.fontSize = "15px";
      container.append(Title, Description, Actions);
      this.box.append(container);
    });
  }
  async delFunc(id) {
    try {
      await fetch(`${this.api}/${id}`, {
        method: "DELETE",
      });
      this.get();
    } catch (error) {
      console.log(error);
    }
  }
  addUser() {
    this.formAdd.onsubmit = async (event) => {
      event.preventDefault();
      let newUser = {
        title: event.target["AddTitle"].value,
        description: event.target["AddDescription"].value,
        status: event.target["AddStatus"].value == "true" ? true : false,
      };
      try {
        await fetch(this.api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
        this.get();
      } catch (error) {
        console.log(error);
      }
      this.AddModal.close();
    };
  }
  async checkFunc(e) {
    let editCheck = {
      ...e,
      status: !e.status,
    };
    try {
      await fetch(`${this.api}/${e.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCheck),
      });
      this.get();
    } catch (error) {
      console.error(error);
    }
  }
  editUser() {
    this.formEdit.onsubmit = async (event) => {
      event.preventDefault();
      let editUser = {
        title: event.target["EditTitle"].value,
        description: event.target["EditDescription"].value,
        status: event.target["EditStatus"].value == "true" ? true : false,
      };
      try {
        await fetch(`${this.api}/${this.idx}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editUser),
        });
        this.get();
      } catch (error) {
        console.log(error);
      }
      this.EditModal.close();
    };
  }
  async infoFunc(e) {
    try {
      let responce = await fetch(`${this.api}/${e.id}`);
      let data = await responce.json();
      this.InfoTitle.innerHTML = data.title;
      this.InfoDescription.innerHTML = data.description;
      this.InfoStatus.value = data.status;
    } catch (error) {
      console.error(error);
    }
  }
  async search() {
    try {
      let responce = await fetch(this.api);
      let data = await responce.json();
      data = data.filter((e) =>
        e.title.toLowerCase().includes(this.Search.value.toLowerCase())
      );
      this.getData(data);
    } catch (error) {
      console.error(error);
    }
  }
  async selSt() {
    if (this.selectStatus.value != "All") {
      try {
        let responce = await fetch(
          `${this.api}?status=${this.selectStatus.value}`
        );
        let data = await responce.json();
        this.getData(data);
      } catch (error) {
        console.error(error);
      }
    } else {
      this.get();
    }
  }
}

new Todolist("http://localhost:3000/data");
