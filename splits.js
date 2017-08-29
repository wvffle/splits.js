(function(global) {
  
  // shorthands
  const H = 'horizontal';
  const V = 'vertical';
  const M = 'move';
  const D = 'drag';
  
  // functions
  const elem = (...classes) => {
    const res = document.createElement('div');
    if (classes.length) res.className = classes.join(' ');
    return res;
  };
  
  const on = (element, event, handler) => {
    return element.addEventListener(event, handler);
  }

  // Layout class
  class Layout {
    constructor(parent, data = {}) {
      this.data = data;
      this.element = elem('layout');

      this.mode = null;
      this.moving = null;

      // remove all event data
      on(document, 'mouseup', e => {
        this.mode = null;
        this.moving = null;

        this.element.classList.remove('event');
        this.element.classList.remove('v-resize');
        this.element.classList.remove('h-resize');
      });

      // execute event
      on(this.element, 'mousemove', e => {
        
        // drag event
        if (this.mode === D) {
          const parent = this.moving.parentElement;
          const rect = this.element.getBoundingClientRect();
          const direction = parent.classList.contains(H) ? H : V;

          const e1 = this.moving;
          const e2 = this.moving.nextElementSibling;
          const r1 = e1.getBoundingClientRect();
          const r2 = e2.getBoundingClientRect();

          let prop;
          let diff;
          let s1;
          let s2;

          if (direction === V) {
            prop = 'height';
            s1 = e.clientY - r1.top;
            diff = s1 - r1.height;
            s2 = r2.height - diff;
          } else {
            prop = 'width';
            s1 = e.clientX - r1.left;
            diff = s1 - r1.width;
            s2 = r2.width - diff;
          }

          const S1 = e1.data.size || {};
          const S2 = e2.data.size || {};

          const m1 = S1.min || 30;
          const m2 = S2.min || 30;
          if (m1 >= s1 || m2 >= s2) return;

          const M1 = S1.max || 1e666;
          const M2 = S2.max || 1e666;
          if (M1 <= s1 || M2 <= s2) return;

          const p1 = s1 / rect[prop] * 100;
          const p2 = s2 / rect[prop] * 100;

          e1.style[prop] = `${p1}%`;
          e2.style[prop] = `${p2}%`;
        }
      });

      parent.appendChild(this.element);
      this.render();
    }

    // render layout from data
    render(data, parent = {}) {

      const element = elem();
      const gutter  = elem('gutter');

      element.appendChild(gutter);

      const siblings = parent.children == null || parent.children.length === 0 ? [null] : parent.children;

      if (data == null) {
        data = this.data;
        this.element.appendChild(element);
      }

      if (parent.direction === V) {
        element.style.height = `${100 / siblings.length}%`;
      } else {
        element.style.width = `${100 / siblings.length}%`;
      }

      element.data = data;

      // bind events
      on(element, 'mousedown', e => {
        if (e.target === gutter) {
          if (data.direction === V) {
            this.element.classList.add('v-resize');
          } else {
            this.element.classList.add('h-resize');
          }

          this.element.classList.add('event');
          this.mode = D;
          this.moving = element;

        }

      });

      if (typeof data === 'string') {
        data = document.createTextNode(data);
      }
      
      if (data instanceof Element || data instanceof Text) {
        element.classList.add('module');
        element.appendChild(data);

        return element;
      }
      
      if (typeof data === 'object') {
        const direction = data.direction || H;
        element.classList.add(direction);
        element.classList.add('pane');

        const children = data.children || [];

        for (let child of children) {
          element.appendChild(this.render(child, data));
        }
      }


      return element;
    }
  };
  
  global.Splits = {
    Layout,
  };
  
})(window);
