import _ from 'lodash';
import {
  format,
  isFuture,
  isPast,
  isEqual,
  isToday,
  set,
} from 'date-fns'

export default {
  install(Vue) {
    // format name: Lin Wang -> Lin W.
    Vue.prototype.$shortName = name => {
      if (name.includes(' ')) {
        return `${name.split(' ')[0]} ${name.split(' ')[1].substr(0,1)}.`;
      } else {
        return name;
      }
    }

    Vue.prototype.$getInitials = title => {
      if (!title.replace(/\s/g, '').length) return '';
      let letters = [];
      const words = title.trim().split(/ +/);
      const repeatTimes = Math.min(2, words.length);
      for (let i = 0; i < repeatTimes; i++) {
        letters.push(String.fromCodePoint(words[i].codePointAt(0)));
      }
      let l = letters.join('');
      if (isNaN(l)) {
        return letters.join('');
      } else {
        return '#';
      }
    }

    Vue.prototype.$hitTest = (el, x, y) => {
      const rect = el.getBoundingClientRect();
      return (x > rect.left && x < rect.right) && (y > rect.top && y < rect.bottom);
    }

    Vue.prototype.$intersecting = (rect1, rect2) => {
      return !(rect1.right < rect2.left || 
        rect1.left > rect2.right || 
        rect1.bottom < rect2.top || 
        rect1.top > rect2.bottom);
    }

    Vue.prototype.$distance = (point1, point2) => {
      return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
    }

    Vue.prototype.$pointInRect = (point, rect) => {
      return point.x <= rect.right && point.x >= rect.left && point.y <= rect.bottom && point.y >= rect.top;
    }

    Vue.prototype.$rectInRect = (smallRect, bigRect) => {
      return smallRect.right <= bigRect.right && smallRect.left >= bigRect.left && smallRect.bottom <= bigRect.bottom && smallRect.top >= bigRect.top;
    }
    
    Vue.prototype.$isEmail = val => {
      var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      return reg.test(val);
    }

    Vue.prototype.$deepClone = val => {
      return _.cloneDeep(val)
    }

    Vue.prototype.$random = (lower, upper, floating) => {
      return _.random(lower, upper, floating)
    }

    /** date */
    
    Vue.prototype.$formatDate = (d, fmt) => {
      return format(d, fmt);
    }

    Vue.prototype.$isToday = d => {
      return isToday(d);
    }

    Vue.prototype.$isFutureDate = d => {
      return isFuture(d);
    }

    Vue.prototype.$isPastDate = d => {
      return isPast(d);
    }

    Vue.prototype.$isEqualDate = (d1, d2) => {
      return isEqual(d1, d2);
    }

    Vue.prototype.$makeMeetingTime = dayoff => {
      let d = new Date()
        let h = d.getHours()
        let m = d.getMinutes()

        let d1, d2
        if (dayoff === -2) {
          // post meeting
          d1 = set(d, { hours: h-3, minutes: 0, seconds: 0 })
          d2 = set(d, { hours: h-3, minutes: 30, seconds: 0 })
          
        } else if (dayoff === -1) {
          // post meeting
          d1 = set(d, { hours: h-2, minutes: 0, seconds: 0 })
          d2 = set(d, { hours: h-2, minutes: 30, seconds: 0 })
          
        } else if (dayoff === 0) {
          // in progress
          d1 = set(d, { hours: h, minutes: 0, seconds: 0 })
          d2 = set(d, { hours: h+1, minutes: 30, seconds: 0 })
          
        } else {
          // in 15 minutes
          if (m < 15) {
            d1 = set(d, { hours: h, minutes: 15, seconds: 0 })
          } else if (m < 30) {
            d1 = set(d, { hours: h, minutes: 30, seconds: 0 })
          } else if (m < 45) {
            d1 = set(d, { hours: h, minutes: 45, seconds: 0 })
          } else if (m < 60) {
            d1 = set(d, { hours: h+1, minutes: 0, seconds: 0 })
          }
          d2 = set(d, { hours: h+1, minutes: 30, seconds: 0 })
        }
        return [d1, d2];
    }

  }
}
