import Component from "./Component.js";

export default class DocumentList extends Component {
  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    const { pathname } = location;
    const [, , documnetId] = pathname.split("/");

    const list = (document) => {
      return (
        Array.isArray(document) &&
        `<ul>${document
          .map(
            ({ id, isOpen, title, documents }) => `
          <li data-id="${id}">
            <div class="document">
            <button class="toggle ${isOpen ? "open" : ""}">&gt</button>
            <span>📄</span>
            <span class="title ${documnetId === String(id) ? "current" : ""}">${
              title.length > 0 ? title : "제목이 없습니다."
            }</span>
            <span class="createDelete">
              <button class="create">+</button>
              <button class="delete">-</button>
            </span>
            </div>
            ${
              Array.isArray(documents) && documents.length > 0 && isOpen
                ? list(documents)
                : ""
            }
          </li>`
          )
          .join("")}
        </ul>`
      );
    };

    this.$target.innerHTML = `
      <div class="topSpace">
        <span>documents</span>
        <button class="createRoot">+</button>
      </div>
      ${list(this.state) || ""}
    `;
  }

  addEvent() {
    const {
      onClickDocumentTitle,
      onCreateDocument,
      onDeleteDocument,
      onToggleDocument,
    } = this.props;

    this.$target.addEventListener("click", (e) => {
      const { target } = e;
      const $li = target.closest("li");
      const { className, classList } = target;

      if ($li) {
        const { id } = $li.dataset;

        if (classList.contains("title")) {
          onClickDocumentTitle(id);
        }

        if (className === "create") {
          onCreateDocument(id);
        }

        if (className === "delete") {
          onDeleteDocument(id);
        }

        if (classList.contains("toggle")) {
          onToggleDocument(id);
        }
      } else {
        if (className === "createRoot") {
          onCreateDocument(null);
        }
      }
    });
  }
}
