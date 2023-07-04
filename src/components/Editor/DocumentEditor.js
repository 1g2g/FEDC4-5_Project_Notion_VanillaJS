import {
  handlePreventNewLine,
  handleCursorToContent,
  handleRichContent,
  handleChangeInput,
  handleKeyDown,
} from './events.js';
import './DocumentEditor.css';

export default class DocumentEditor {
  constructor({
    $target,
    initialState = {
      documentId: 0,
      document: {
        title: '',
        content: '',
      },
    },
    onChange,
    onOpenStyleMenu,
    onCloseStyleMenu,
  }) {
    this.$target = $target;
    this.$title = document.querySelector('.main__title-editor');
    this.$content = document.querySelector('.main__content-editor');

    this.state = initialState;
    this.onChange = onChange;
    this.onOpenStyleMenu = onOpenStyleMenu;
    this.onCloseStyleMenu = onCloseStyleMenu;

    this.initEvents();
    this.render();
  }

  setState(nextState) {
    this.state = nextState;

    if (this.state.documentId === 0) this.$target.classList.add('hidden');
    else this.$target.classList.remove('hidden');

    this.render();
  }

  initEvents() {
    const { $target, $title, $content, onChange, onOpenStyleMenu, onCloseStyleMenu } = this;

    $title.addEventListener('keydown', (e) => handlePreventNewLine(e));
    $title.addEventListener('keyup', (e) => handleCursorToContent(e, { $content }));

    $content.addEventListener('compositionend', (e) => handleRichContent(e, { $content }));
    $content.addEventListener('keydown', (e) => handleKeyDown(e, { $content }));
    $content.addEventListener('keyup', (e) => handleRichContent(e, { $content }));
    $content.addEventListener('pointerdown', (e) => onCloseStyleMenu(e));
    $content.addEventListener('pointerup', (e) => onOpenStyleMenu(e));

    $target.addEventListener('input', (e) => handleChangeInput(e, { onChange }));
  }

  render() {
    const { documentId, document } = this.state;
    if (!documentId || !document) return;

    this.$title.innerHTML = document.title;
    this.$content.innerHTML = document.content;
  }
}
