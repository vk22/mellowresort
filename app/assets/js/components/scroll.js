/* eslint-disable */
import { gsap } from 'gsap'
import Util from '~/utils/util';

export default class ScrollCtrl {
  constructor(options) {
    this.page = options.page;
    this.hideCursor = options.hideCursor;
    this.sections = [];

    this.tween = null;
    this.isFirefox = Util.testBrowser('firefox');
    this.isIE = Util.testBrowser('ie');
    this.m = this.isIE ? 0.12 : 0.09;
    this.winW = window.innerWidth;
    this.winH = window.innerHeight;
    this.isMobile = Util.isTouch();
    this.scrollingElement = this.isMobile ? document.documentElement : document.getElementById('main');
    this.pointer = options.pointer;
    this.pausePointer = false;
    this.sectionsL = this.sections.length;
    this.paralax = options.paralax || [];
    this.max = document.body.scrollHeight;
    this.maxVirtual = 0;
    this.maxDelta = 80;
    this.touch = { prev: {x: 0, y: 0}, start: {x: 0, y: 0} };
    this.target = 0;
    this.event = {};
    this.pause = false;
    this.data = { t: 0, c: 0 };
    this.onlyVirtual = false;
    this.delta = 0;
    this.pauseEvents = false;
    this.render = this.render.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.clickStart = this.clickStart.bind(this);
    this.clickUp = this.clickUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.onMove = this.onMove.bind(this);
    this.eventsManager = this.eventsManager.bind(this);
    this.resize = this.resize.bind(this);
    this.init();
  }
  init() {
    this.updateSections();
    if(this.isMobile) {
      window.addEventListener('scroll', () => { this.handleScroll() });
      document.addEventListener('touchstart', this.touchStart, { passive: false });
      document.addEventListener('touchmove', this.onMove, { passive: false });
    } else {
      document.addEventListener('mouseup', this.clickUp);
      document.addEventListener('mousemove', this.onMove);
      document.addEventListener('wheel', this.onMove);
      document.addEventListener('keydown', this.onMove);
    }

    this.resize();
    this.updateElements(0);
    window.addEventListener('resize', () => {
      clearTimeout(this.resizedFinished);
      this.resizedFinished = setTimeout(() => {
        this.resize();
      }, 250);
    });
    this.render();
  }
  handleScroll() {
    this.target = -this.scrollingElement.scrollTop;
    this.update();
  }
  goTo(id, noAnimation) {
    const isNumber = !window.isNaN(id);
    const section = Util.isElement(id) || isNumber ? id : document.querySelector(id);
    if (section || isNumber) {
      let pos = isNumber ? id : Util.getPosition(section).y;
      this.isDown = pos > this.data.c;
      if(this.timeOut) clearTimeout(this.timeOut);
      if(this.isMobile) {
        pos = pos;
        gsap.to(this.scrollingElement, {duration: noAnimation ? 0 : 0.5, scrollTop: pos, ease: 'power3.out'});
      }else {
        this.scrollTo(pos);
      }
    }
  }
  updateSections(sections) {
    this.sections = sections ? sections : Array.from(document.querySelectorAll('[data-scroll-section]')).map(s => {
      return { $el: s };
    });
    this.sectionsL = this.sections.length;
    for (var i = 0; i < this.sectionsL; i++) {
      var s = this.sections[i];
      if (s.$el == undefined)
        s.$el = document.querySelector(s.selector);
      s.$el.classList.add('hide');
      s.$el.classList.add('section');
      s.rect = {};
      s.out = true;
      const isSticky = s.$el.getAttribute('data-scroll-sticky') === 'true'
      if(isSticky) {
        s.sticky = true
        s.stickyPlaceholder = s.$el.querySelector('[data-scroll-sticky-placeholder]')
        s.stickyContent = s.$el.querySelector('[data-scroll-sticky-content]')
        s.stickyContainer = s.$el.querySelector('[data-scroll-sticky-container]')
      }
    }
    this.resize();
  }
  touchStart(e) {
    this.touch.prev.y = this.target;
    this.touch.prev.x = this.target;
    this.touch.start.y = e.targetTouches[0].pageY;
    this.touch.start.x = e.targetTouches[0].pageX;
  }
  clickStart(e){
    this.clickdown = true;
    this.touch.prev.y = this.target;
    this.touch.prev.x = this.target;
    this.touch.start.y = e.clientY;
    this.touch.start.x = e.clientX;
  }
  clickUp(e){
    this.clickdown = false;
  }
  onMove(e) {
    this.event = e;
    this.prevent(e);
    if (!this.pauseEvents && !this.pause) {
      requestAnimationFrame(this.eventsManager);
      this.pauseEvents = true;
    }
  }
  prevent(t) {
    if (!this.pauseExternal && t.cancelable && t.type !== 'keydown' && t.type !== 'touchmove')
      t.preventDefault();
  }
  eventsManager() {
    var t = this.event.type;
    switch (t) {
      case "wheel":
        this.wheel()
        break;
      case "mousemove":
        this.mouseMove()
        break;
      case "touchmove":
        this.touchMove()
        break;
      case "keydown":
        this.keyDown()
        break;
      default:
        break;
    }
  }
  touchMove() {
    if (this.tween) this.tween.kill();
    if (this.timeOut) clearTimeout(this.timeOut);

    var t = this.event.targetTouches[0].pageY - this.touch.start.y;
    this.delta = 2.9 * t;
    this.update();
  }
  mouseMove(){
    this.pauseEvents = false;
    this.pausePointer = true;
    this.pointer.style.pointerEvents = 'none';
  }
  wheel() {
    if(!this.event.target.closest('[data-scroll-native]')) {
      this.pausePointer = false;
      var t = this.event.wheelDeltaY || -1 * this.event.deltaY;
      if (this.isFirefox && this.event.deltaMode)
        t *= 60;
      if(this.isIE)
        t *= 2;
      t *= .554;
      if(this.onlyVirtual){
        if(t < 0)
          t = -Math.min(Math.abs(t * 0.7), Math.abs(this.maxDelta * 0.4));
        else
          t = Math.min(Math.abs(t * 0.7), Math.abs(this.maxDelta * 0.4));
      }
      this.delta = t;
      this.target += this.delta;
    }
    this.update()
  }
  keyDown() {
    var t, kc = this.event.keyCode;
    if(kc === 38 || kc === 40){
      if (kc === 38)
        t = 80;
      else if (40 === kc)
        t = -80
      else
        t = 0;
      this.delta = t;
      this.target += this.delta;
    }
    this.update();
  }
  scrollTo(t, noAnimation) {
    if(this.isMobile) {
      this.goTo(t, noAnimation);
    }else {
      this.target = Util.round(Math.max(Math.min(-t, 0), -this.max));
      this.update();
    }
  }
  update() {
    if(this.onlyVirtual)
      this.target = this.maxVirtual === 0 ? Util.round(Math.min(this.target, 0)) : Util.round(Math.max(Math.min(this.target, 0), -this.maxVirtual));
    else
      this.target = Util.round(Math.max(Math.min(this.target, 0), -this.max));
    this.scroll(-this.target);
    this.pauseEvents = false;
  }
  scroll(t) {
    this.data.t = Util.round(t);
  }
  getMax() {
    var offset = this.page.offsetHeight;
    var ih = window.innerHeight;
    if(this.isMobile) offset = this.page.scrollHeight;

    this.max = Math.max(offset - ih, 0);
    this.data.t = Util.round(Math.min(this.data.t, this.max));
    this.data.c = this.data.t;
  }
  render() {
    this.data.c += this.m * (this.data.t - this.data.c);
    var final = Util.round(this.data.c);
    if (final !== this.data.t || this.isMobile) {
      this.updateElements(final);
      if(!this.pausePointer){
        this.pausePointer = true;
        if(!this.isMobile) {
          this.pointer.style.pointerEvents = 'all';
          if(this.hideCursor) this.hideCursor()
        }
      }
    } else {
      this.pausePointer = true;
      this.pointer.style.pointerEvents = 'none';
    }
    requestAnimationFrame(this.render);
  }
  addParalax(fun) {
    if (this.paralax.indexOf(fun) === -1)
      this.paralax.push(fun);
  }
  removeParalax(fun) {
    const i = this.paralax.indexOf(fun);
    if (i !== -1)
      this.paralax.splice(i, 1);
  }
  updateElements(target) {
    if (this.paralax) {
      this.paralax.forEach(p => p(target, this.max, this.delta));
    }
    if(this.onlyVirtual || this.isMobile) return;
    for (var i = 0; i < this.sectionsL; ++i) {
      var section = this.sections[i];
      if(section.sticky){
        if(target > section.rect.top + this.winH && target < section.rect.top + section.stickyHeight) {
          section.$el.setAttribute('data-scroll-fixed', true);
          this.translate(section.stickyContainer, -(target - section.rect.top - this.winH));
        }else {
          section.$el.removeAttribute('data-scroll-fixed');
          if(target < section.rect.top + section.stickyHeight)
            this.translate(section.stickyContainer, 0);
          else
            this.translate(section.stickyContainer, -(section.stickyHeight - this.winH));
        }
      }
      if (target >= section.rect.top && target <= section.rect.bottom) {
        section.out = false;
        section.$el.classList.remove('hide');
        this.translate(section.$el, target);
      } else if (!section.out) {
        section.out = true;
        this.translate(section.$el, target);
        section.$el.classList.add('hide');
      }
    }
  }
  translate(section, target) {
    if(!this.isMobile)
      section.style.transform = `translate3d(0, ${-target}px, 0)`;
  }
  resize() {
    this.getMax();
    this.winW = window.innerWidth;
    this.winH = window.innerHeight;
    this.isMobile = Util.isTouch();
    if(this.isMobile)
      this.m = 1;
    for (var i = 0; i < this.sectionsL; ++i) {
      var section = this.sections[i];
      this.translate(section.$el, this.data.t);
      if(section.sticky) {
        let height = section.stickyContent.getAttribute('data-scroll-sticky-height') ? Number(section.stickyContent.getAttribute('data-scroll-sticky-height')) * this.winH : section.stickyContent.scrollHeight + this.winH;
        const heightMultiply = section.stickyContent.getAttribute('data-scroll-sticky-multiply') ? Number(section.stickyContent.getAttribute('data-scroll-sticky-multiply')) : 1;
        if(section.stickyContent.getAttribute('data-scroll-sticky-slides')) {
          const n = Number(section.stickyContent.getAttribute('data-scroll-sticky-slides'));
          height = 80 * n + this.winH;
        }
        height *= heightMultiply;
        section.stickyPlaceholder.style.height = `${height}px`
        section.stickyHeight = height;
      }
      const rect = section.$el.getBoundingClientRect();
      var top = rect.top;
      var n = top + section.$el.offsetHeight;
      
      section.rect.height = rect.height;
      section.rect.top = top - this.winH + this.data.t;
      section.rect.bottom = n + this.data.t;
    }
    this.spaceDelta = this.winH * 0.7;
    this.update();
  }
  resizeAnimate() {
    let data = {c: this.data.t, t: this.data.t};
    this.getMax();
    data.t = this.data.t;

    this.winW = window.innerWidth;
    this.winH = window.innerHeight;
    this.isMobile = Util.isTouch();
    for (var i = 0; i < this.sectionsL; ++i) {
      var section = this.sections[i];
      gsap.fromTo(data, {c: data.c}, {
        duration: 0.5,
        c: data.t,
        ease: 'Power2.easeOut',
        onUpdate: () => {
          this.translate(section.$el, data.c);
          var top = section.$el.getBoundingClientRect().top;
          var n = top + section.$el.offsetHeight;

          section.rect.top = top - this.winH + data.c;
          section.rect.bottom = n + data.c;
        }
      });
      
    }
    this.spaceDelta = this.winH * 0.7;
    this.update();
  }
}
