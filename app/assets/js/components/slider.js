import Util from '~/utils/util';

export default class Slider {
  constructor(options){
    this.el = options.el;
    this.noTouch = options.noTouch || false;
    this.startOnMiddle = options.startOnMiddle || false;
    this.content = options.content;
    this.containerMargin = options.containerMargin !== undefined ? options.containerMargin : true
    this.prevButton = options.prevButton;
    this.nextButton = options.nextButton;
    this.margin = options.margin;
    this.isMobile = window.innerWidth <= 1024;
    this.items = [];
    this.itemsL = this.items.length;
    this.paralax = options.paralax;
    this.max = this.el.scrollWidth;
    this.bar = this.el.querySelector('.bar');
    this.maxBar = this.bar ? this.bar.parentElement.clientWidth : 0;
    this.barW = 0;
    this.clickdown = false;
    this.touch = {prev: 0, start: 0};
    this.target = 0;
    this.event = {};
    this.pause = false;
    this.data = {t: 0, c: 0};
    this.rotation = {t: 0, c: 0};
    this.pauseEvents = false;
    this.render = this.render.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.clickStart = this.clickStart.bind(this);
    this.clickUp = this.clickUp.bind(this);
    this.onMove = this.onMove.bind(this);
    this.eventsManager = this.eventsManager.bind(this);
    this.resize = this.resize.bind(this);
    this.init();
  }
  init(){
    if(!this.noTouch) {
      this.el.addEventListener('touchstart', this.touchStart);
      this.el.addEventListener('touchmove', this.onMove);
    }
    this.el.addEventListener('mousedown', this.clickStart);
    document.addEventListener('mouseup', this.clickUp);
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('keydown', this.onMove);
    this.el.classList.add('horizontal-slider');
    this.updateSections();
    
    this.resize();
    window.addEventListener('resize', () => {
      clearTimeout(this.resizedFinished);
      this.resizedFinished = setTimeout(() => {
        if(!this.lastWidth || this.lastWidth !== window.innerWidth)
          this.resize();
      }, 250);
    });
    this.render();
  }
  touchStart(e){
    this.touch.prev = this.target;
    this.touch.start = e.targetTouches[0].pageX;
  }
  clickStart(e){
    this.rotation.t = 1;
    this.clickdown = true;
    this.touch.prev = this.target;
    this.touch.start = e.clientX;
  }
  clickUp(e){
    this.rotation.t = 0;
    this.clickdown = false;
  }
  onMove(e){
    this.event = e;
    this.prevent(e);
    if(!this.pauseEvents && !this.pause && Util.isInViewportDom(this.el)){
      requestAnimationFrame(this.eventsManager);
      this.pauseEvents = true;
    }
  }
  prevent(t) {
    if(t.cancelable && "keydown" !== t.type && !this.isMobile)
    t.preventDefault();
  }
  eventsManager() {
    var t = this.event.type;
    switch (t) {
      case "touchmove":
        this.touchMove()
      break;
      case "mousemove":
        this.mouseMove()
      break;
      case "wheel":
        this.wheel()
        break;
      case "mousewheel":
        this.mouseWheel()
        break;
      case "keydown":
        this.keyDown()
      break;
      default:
      break;
    }
  }
  touchMove(){
    var t = this.event.targetTouches[0].pageX - this.touch.start;
    this.target = 1.5 * t + this.touch.prev;
    this.update();
  }
  mouseMove(){
    if(this.clickdown){
      var t = this.event.clientX - this.touch.start;
      this.target = 1.5 * t + this.touch.prev;
      this.update();
    }else{
      this.pauseEvents = false;
    }
  }
  mouseWheel() {
    if(Util.isInViewportDom(this.el)){
      this.pausePointer = false;
      var t = this.event.wheelDeltaX ? this.event.wheelDeltaX : this.event.wheelDelta;
      this.delta = t;
      this.target += this.delta;
    }
    this.update();
  }
  wheel() {
    if(Util.isInViewportDom(this.el)){
      this.pausePointer = false;
      var t = this.event.wheelDeltaX || -1 * this.event.deltaX;
      if (Util.testBrowser('firefox') && this.event.deltaMode)
        t *= 60;
      t *= .554;
      this.delta = t;
      this.target += this.delta;
    }
    this.update()
  }
  prev() {
    if(this.isMobile) {
      let currentItem;
      let maxPx = 0;
      this.items.forEach(item => {
        const rect = item.$el.getBoundingClientRect();
        const pxVisible = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
        if(pxVisible > maxPx) {
          maxPx = pxVisible;
          currentItem = item;
        }
      });
      const prevItem = this.items[currentItem.i - 1];
      if(prevItem) {
        this.target = -prevItem.$el.offsetLeft + 30;
      }
    }else {
      this.target += this.spaceDelta;
    }
    this.update();
  }
  next() {
    if(this.isMobile) {
      let currentItem;
      let maxPx = 0;
      this.items.forEach(item => {
        const rect = item.$el.getBoundingClientRect();
        const pxVisible = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
        if(pxVisible > maxPx) {
          maxPx = pxVisible;
          currentItem = item;
        }
      });
      const nextItem = this.items[currentItem.i + 1];
      if(nextItem) {
        this.target = -nextItem.$el.offsetLeft + 30;
      }
    }else {
      this.target += -this.spaceDelta;
    }
    this.update();
  }
  keyDown () {
    var t, kc = this.event.keyCode;
    if(Util.isInViewportDom(this.el)){
      if(kc === 37)
        t = this.spaceDelta;
      else if(39 === kc)
        t = -this.spaceDelta;
      else
        t =  0;
      
      this.target += t;
      this.update();
    }else{
      this.pauseEvents = false;
    }
  }
  scrollTo(t){
    this.target = Util.round(Math.max(Math.min(-t, 0), -this.max));
    this.update();
  }
  update() {
    this.target = Util.round(Math.max(Math.min(this.target, 0), -this.max));
    this.scroll(-this.target);
    this.pauseEvents = false;
  }
  scroll(t) {
    this.data.t = Util.round(t);
  }
  getMax(){
    var offset = this.content.offsetWidth;
    var iw = this.el.clientWidth;
    this.max = Math.max(offset - iw, 0);
    this.data.t = this.startOnMiddle ? Util.round(this.max * 0.5) : 0;
    this.data.c = this.data.t;
    this.target = -this.data.t;
  }
  render(){
    this.data.c += .12 * (this.data.t - this.data.c);
    this.rotation.c += .09 * (this.rotation.t - this.rotation.c);

    var final = Util.round(this.data.c);
    if(final !== this.data.t || this.rotation.c !== this.rotation.t)
      this.updateElements(final);
    requestAnimationFrame(this.render);
  }
  addParalax(fun) {
    if(this.paralax.indexOf(fun) === -1)
    this.paralax.push(fun);
  }
  removeParalax(fun) {
    this.paralax.splice(this.paralax.indexOf(fun), 1);
  }
  updateElements(target){
    if (this.paralax) {
      this.paralax.forEach(p => p(target, this.max));
    }
    for (var i = 0; i < this.itemsL; ++i) {
      var item = this.items[i];
      if(target >= item.rect.left && target <= item.rect.right){
        item.out = false;
        this.translate(item, target);
      }else if(!item.out){
        item.out = true;
        this.translate(item, target);
      }
    }
  }
  translate(item, target) {
    item.$el.style.transform = `translateX(${-target}px)`;

    var rect = item.$el.getBoundingClientRect();
    if(rect.left + rect.width * 0.5 - this.winW > 0) {
      item.$el.classList.add('item-almost');
    }else {
      item.$el.classList.remove('item-almost');
    }
  }
  updateSections() {
    this.items = [];
    Array.from(this.content.children).forEach((item, i) => {
      let s = {};
      s.i = i;
      s.$el = item;
      s.$media = item.querySelector('figure');
      s.$el.classList.add('item');
      s.rect = {};
      s.out = true;
      this.items.push(s);
    });
    this.itemsL = this.items.length;
    this.resize();
  }
  resize (){
    this.isMobile = window.innerWidth <= 1024;
    this.margin = 0;
    if(this.containerMargin) {
      this.margin = document.querySelector('.container').getBoundingClientRect().left;
      if(this.items[0]) {
        this.items[0].$el.style.marginLeft = this.margin + 'px';
        this.items[this.itemsL - 1].$el.style.marginRight = (this.margin + (window.innerWidth - this.el.clientWidth)) + 'px';
      }
    }
    this.getMax();
    var ww = window.innerWidth;
    this.winW = ww;
    const offset = this.el.getBoundingClientRect().left;
    for (var i = 0; i < this.itemsL; ++i) {
      var item = this.items[i];
      this.translate(item, this.data.t);
      var left = item.$el.getBoundingClientRect().left - offset;
      var n = left + item.$el.offsetWidth;
      
      item.rect.left = left - ww + this.data.t;
      item.rect.right = n + this.data.t;
    }
    this.spaceDelta = ww * 0.4;
    if(this.isMobile) {
      this.spaceDelta = ww * 0.85;
    }
    this.update();
    this.content.removeAttribute('style');
    this.lastWidth = window.innerWidth;
  }
}