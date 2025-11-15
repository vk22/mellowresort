/* eslint-disable */
function isInViewportDom($el, offset) {
  let rect = $el.getBoundingClientRect();
  let x, y, w, h;
  x = rect.left;
  y = rect.top + (offset !== undefined ? offset : 0);

  w = rect.width;
  h = rect.height;

  let ww = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  let hw = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return ((y < hw && y + h > 0) && (x < ww && x + w > 0));
}
function isElement(obj) {
  try {
    return obj instanceof HTMLElement;
  }
  catch (e) {
    return (typeof obj === "object") &&
      (obj.nodeType === 1) && (typeof obj.style === "object") &&
      (typeof obj.ownerDocument === "object");
  }
}
function getPosition(element) {
  var xPosition = 0;
  var yPosition = 0;

  while (element) {
    xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
    yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
    element = element.offsetParent;
  }

  return { x: xPosition, y: yPosition };
}
function waitForFont(fontName, cb) {
  const isReady = document.fonts.check(`1em ${fontName}`);
  if (isReady && testBrowser('chrome')) {
    cb();
  } else {
    if (document.fonts.size > 0) {
      document.fonts.ready.then(() => {
        cb();
      });
    } else {
      const interval = setInterval(() => {
        if (document.fonts.size > 0) {
          if (interval) clearInterval(interval);

          document.fonts.ready.then(() => {
            cb();
          });
        }
      }, 100);
    }
  }
}
function round(number, r) {
  var r = r ? Math.pow(10, r) : 1e3;
  return Math.round(number * r) / r;
}
function getStyleNumber(el, property) {
  return Number(getComputedStyle(el)[property].replace('px', ''));
}
function lerp(from, to, t) {
  return (1 - t) * from + t * to;
}
var ease = {
  out4: function (t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }
};
function random(from, to) {
  return Math.random() * (to - from) + from;
}
function getVideoId(url) {
  if (url.search && url.search(/\/\/www.youtube.com|\/\/youtube.com|\/\/www.youtu.be|\/\/youtu.be/) !== -1) {
    var id;
    if (url.search(/\/\//) !== -1) {
      if (url.search('youtu.be') !== -1) {
        id = url.replace(/.*youtu.be\//, '');
      } else {
        const u = new URL(url);
        id = u.searchParams.get('v');
      }
    }
    return id;
  }
  if (url.search && url.search(/\/\/www.vimeo.com|\/\/vimeo.com/) !== -1) {
    id = url.replace(/.*vimeo.com\//, '');
    return id;
  }
}
function lineBreak(text, max, $container, noAlone, breakLetters) {
  // console.log('lineBreak ', text)
  const keepWords = $container.closest('.keep-words') !== null;
  if (!keepWords) {
    text = $container.innerHTML;
    $container.innerHTML = text.split(/\s/).map(w => { return '<span class="word">' + w + ' </span>' }).join('');
  } else {
    Array.from($container.querySelectorAll('.word')).forEach((w, i) => {
      if (i > 0) w.innerHTML = ' ' + w.innerHTML;
    });
    Array.from($container.querySelectorAll('.word')).forEach(function (word) {
      const text = word.innerHTML;
      if (text[0] === ' ') {
        word.classList.add('left-space');
      }
      if (text[text.length - 1] === ' ') {
        word.classList.add('right-space');
      }
    });
  }
  var len = 0;
  Array.from($container.querySelectorAll('.word')).forEach(function (w) { len += getWidth(w) });
  if (len > max) {
    const words = Array.from($container.querySelectorAll('.word')).map($w => $w.cloneNode(true));
    $container.innerHTML = '';
    var $l = document.createElement('span');
    $l.classList.add('line');
    $container.appendChild($l);
    var $currentLine = $l;
    if (keepWords) {
      words.forEach(($w, i) => {
        var w = $w.innerText;
        $w.innerHTML = i == 0 ? w : (' ' + w);

        $currentLine.appendChild($w);
        if (getWidth($currentLine) > max) {
          var $nwl = document.createElement('span');
          $nwl.classList.add('line');

          $nwl.appendChild($w);
          $currentLine = $nwl;
          $container.appendChild($nwl);
        }
      });
    } else {
      text.split(/\s/).forEach((w, i) => {
        var $w = document.createElement('span');
        $w.classList.add('word');
        $w.innerHTML = i == 0 ? w : (' ' + w);

        $currentLine.appendChild($w);
        if (getWidth($currentLine) > max) {
          $w.remove();
          var $nwl = document.createElement('span');
          $nwl.classList.add('line');

          var $w = document.createElement('span');
          $w.classList.add('word');
          $w.innerHTML = i == 0 ? w : (' ' + w);

          $nwl.appendChild($w);
          $currentLine = $nwl;
          $container.appendChild($nwl);
        }
      });
    }
    var $alone = Array.from($container.querySelectorAll('.line')).find($l => { return $l.children.length == 1 });
    if (noAlone && $alone) {
      var $last = $alone.previousElementSibling.querySelector('.word:last-child');
      var t = $last.innerHTML.replace(/^\s/, '');
      $last.remove();

      var $w = document.createElement('span');
      $w.classList.add('word');
      $w.innerHTML = t;
      $alone.prepend($w);
    }
  } else {
    if (keepWords) text = $container.innerHTML;
    $container.innerHTML = '';
    var $l = document.createElement('span');
    $l.classList.add('line');
    $container.append($l);
    $l.innerHTML = keepWords ? text : text.split(/\s/).map(w => { return `<span class="word">${w} </span>` }).join('');
  }
  Array.from($container.querySelectorAll('.word')).forEach(function (word) {
    const text = word.innerHTML;
    if (text[0] === ' ') {
      word.classList.add('left-space');
    }
    if (text[text.length - 1] === ' ') {
      word.classList.add('right-space');
    }
  });
  Array.from($container.querySelectorAll('.line')).forEach(function (l) {
    if (l.innerText === '' || l.innerText === ' ')
      l.remove();
    else
      l.innerHTML = '<span class="text">' + l.innerHTML + '</span>';
  });
  if (breakLetters) {
    Array.from($container.querySelectorAll('.text')).forEach(function (text) {
      const letters = text.innerText.split('').map(letter => `<span class="letter${letter === ' ' ? ' space' : ''}">${letter}</span>`).join('')
      text.innerHTML = letters;
    });
  }
  function getWidth($el) {
    if ($el.classList.contains('word')) {
      let wordW = $el.getBoundingClientRect().width;
      const content = $el.innerHTML;
      if (content.indexOf(' ') !== -1) {
        wordW += wordW / content.length * 0.1
      }
      return wordW;
    } else {
      let w = 0;
      Array.from($el.querySelectorAll('.word')).forEach(word => {
        w += getWidth(word);
      });
      return w;
    }
  }
}


function testBrowser(browser) {
  var result;
  switch (browser) {
    case 'safari':
      result = (typeof window.safari !== 'undefined' && window.safari.pushNotification);
      break;
    case 'safari mobile':
      result = (/iPhone/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent)) && /Safari/i.test(navigator.userAgent);
      break;
    case 'ios':
      result = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
      break;
    case 'samsung':
      result = /SamsungBrowser/.test(navigator.userAgent);
      break;
    case 'chrome':
      result = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) && !/SamsungBrowser/.test(navigator.userAgent);
      break;
    case 'chrome mobile':
      result = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) && !/SamsungBrowser/.test(navigator.userAgent) && window.chrome && !window.chrome.webstore;
      break;
    case 'chrome mobile ios':
      result = /iPhone/i.test(navigator.userAgent) && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) && !/SamsungBrowser/.test(navigator.userAgent) && window.chrome && !window.chrome.webstore;
      break;
    case 'firefox mobile':
      result = !/Chrome/.test(navigator.userAgent) && /Mozilla/.test(navigator.userAgent) && /Firefox/.test(navigator.userAgent) && /Mobile/.test(navigator.userAgent);
      break;
    case 'firefox':
      result = !/Chrome/.test(navigator.userAgent) && /Mozilla/.test(navigator.userAgent) && /Firefox/.test(navigator.userAgent);
      break;
    case 'ie':
      result = /MSIE/.test(window.navigator.userAgent) || /NET/.test(window.navigator.userAgent);
      break;
    case 'edge':
      result = /Edge/.test(window.navigator.userAgent);
      break;
    case 'ms':
      result = /Edge/.test(window.navigator.userAgent) || /MSIE/.test(window.navigator.userAgent) || /NET/.test(window.navigator.userAgent);
      break;
    default:
      result = false;
      break
  }
  return result;
}
function getBrowser() {
  if (testBrowser('ios'))
    return 'ios';
  if (testBrowser('chrome'))
    return 'chrome';
  if (testBrowser('safari'))
    return 'safari';
  if (testBrowser('safari mobile'))
    return 'safari-mobile';
  if (testBrowser('firefox'))
    return 'firefox';
  if (testBrowser('ie'))
    return 'ie';
  if (testBrowser('edge'))
    return 'edge';
}
function isTouch() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
}
function loadImage(url, callback) {
  var image = new Image();
  image.src = url;
  image.onload = callback;
  return image;
}
function loadImages(images, callback, max) {
  if (isElement(images)) images = Array.from(images.querySelectorAll('img'));
  if (max) images = images.slice(0, max);
  let done = false;
  function loadedL() {
    return images.filter(image => image.complete).length;
  }
  if (loadedL() === images.length) {
    done = true;
    callback();
  }
  else {
    images.forEach(image => {
      image.addEventListener('load', () => {
        if (!done && loadedL() === images.length) {
          done = true;
          callback();
        }
      });
    })
  }
  setTimeout(() => {
    if (!done) {
      done = true;
      callback();
    }
  }, 10000);
}
function waitForVideos(videos, callback, max) {
  if (isElement(videos)) videos = Array.from(videos.querySelectorAll('video'));
  if (max) videos = videos.slice(0, max);
  let done = false;
  function loadedL() {
    return videos.filter(video => video.readyState > 0).length;
  }
  if (loadedL() === videos.length) {
    done = true;
    callback();
  }
  else {
    videos.forEach(video => {
      video.addEventListener('loadeddata', () => {
        if (!done && loadedL() === videos.length) {
          done = true;
          callback();
        }
      });
    })
  }
  setTimeout(() => {
    if (!done) {
      done = true;
      callback();
    }
  }, 10000);
}
function waitForAssets(container, callback, max) {
  let images = container.querySelectorAll('img');
  let videos = container.querySelectorAll('video');
  let done = false;
  if (images.length || videos.length) {
    loadImages(container, () => {
      if (videos.length) waitForVideos(container, callback, max);
      else {
        if (!done) {
          done = true;
          callback();
        }
      }
    }, max);
  }
  else {
    if (!done) {
      done = true;
      callback();
    }
  }
  const maxT = max ? max * 1000 : 20000;
  setTimeout(() => {
    if (!done) {
      done = true;
      callback();
    }
  }, maxT);
}
function queryLang(lang) {
  const langs = { es: 'es-es', en: 'en-us', fr: 'fr-fr' };
  return langs[lang] || lang;
}
function pxVisible(element) {
  const rect = element.getBoundingClientRect();
  const winTop = window.innerHeight;
  const elemTop = Math.round(rect.top);
  const elemBottom = elemTop + rect.height;
  const visibleTop = Math.max(0, elemTop);
  const visibleBottom = Math.min(winTop, elemBottom);
  return Math.max(0, visibleBottom - visibleTop);
}

export default {
  pxVisible: pxVisible,
  getStyleNumber: getStyleNumber,
  isInViewportDom: isInViewportDom,
  lineBreak: lineBreak,
  isElement: isElement,
  getVideoId: getVideoId,
  getPosition: getPosition,
  testBrowser: testBrowser,
  getBrowser: getBrowser,
  ease: ease,
  round: round,
  lerp: lerp,
  loadImages: loadImages,
  loadImage: loadImage,
  waitForFont: waitForFont,
  waitForAssets: waitForAssets,
  waitForVideos: waitForVideos,
  isTouch: isTouch,
  random: random,
  queryLang: queryLang,
}