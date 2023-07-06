import { setItem, removeItem, getItem } from '../utils/storage.js';
const SPINNER_ICON =
  'https://velog.velcdn.com/images/1g2g/post/45618170-dcde-46a6-b725-5da7e7df8207/image.png';

export default function PostEditor({ target, initialState, onEdit }) {
  const editorElement = document.createElement('form');

  const loadingElement = document.createElement('div');
  loadingElement.innerHTML = `<img src=${SPINNER_ICON} alt='spinner'/>`;
  loadingElement.setAttribute('class', 'loading');

  this.state = initialState;

  this.setState = nextState => {
    this.state = nextState;

    const tempPost = getItem(`temp-post-${nextState.id}`);
    if (tempPost) {
      const callPrevData = window.confirm('지난 데이터를 불러오시겠습니까?');
      if (callPrevData) {
        this.state = tempPost;
      } else {
        removeItem(`temp-post-${this.state.id}`);
      }
    }

    this.render();
  };

  let timer = null;

  this.render = () => {
    target.appendChild(editorElement);
    editorElement.innerHTML = `
        <input type='text' name='title' class='post-title'/>
        <textarea name='content' class='post-content'></textarea>
    `;

    editorElement.addEventListener('keyup', e => {
      // 로딩 중 추가
      const { target } = e;

      const name = target.getAttribute('name');

      if (this.state[name] !== undefined) {
        const nextState = {
          ...this.state,
          [name]: target.value, // key - value
        };

        setItem(`temp-post-${nextState.id}`, nextState);

        editorElement.appendChild(loadingElement);

        if (timer !== null) {
          clearTimeout(timer);
          // editorElement.removeChild(loadingElement);
        }
        timer = setTimeout(async () => {
          await onEdit(nextState.id, {
            title: nextState.title,
            content: nextState.content,
          });

          removeItem(`temp-post-${nextState.id}`);

          if (editorElement.hasChildNodes(loadingElement)) {
            editorElement.removeChild(loadingElement);
          }
          // this.setState(nextState);
        }, 2000);
      }
    });

    if (this.state) {
      // undefined가 아닐 때 : post 삭제 후 뒤로가기
      const { title, content } = this.state;

      editorElement.querySelector('.post-title').value = title;
      editorElement.querySelector('.post-content').value = content;
      console.log(editorElement.querySelector('.post-title').value);
    }
  };

  // this.render();
}
