<template>
  <div class="wl-calendar">
    <header v-if="headerVisible" class="header">
      <span>{{ currentMonthLabel }} {{ currentYear }}</span>
      <div class="btn" @click="previousMonth">
        <wl-icon name="arrow-left-bold" size="16" />
      </div>
      <div class="btn" @click="nextMonth">
        <wl-icon name="arrow-right-bold" size="16" />
      </div>
    </header>
    <div 
      class="headings" 
      v-for="(dayLabel, idx) in dayLabels"
      :key="`hd${idx}`"
    >
      {{ dayLabel }}
    </div>
    <div 
      v-for="(day, idx) in dates"
      class="day"
      :class="dayClassObj(day)"
      :key="`day${idx}`"
      @click="setSelectedDate(day)"
    >
      <div class="lb" >
        {{ day.date | formatDateToDay }}
      </div>
      <div v-if="inDateList(day.date)" class="bullet"></div>
    </div>
  </div>
</template>

<script>
import {
  format, 
  startOfMonth, 
  lastDayOfMonth, 
  getDay, 
  addDays, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  isSameDay, 
  isEqual, 
  addMonths, 
  getMonth, 
  setMonth,
} from 'date-fns'

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_LABELS = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"];


export default {
  props:{
    defaultDate: {
      required: false,
      type: Date,
    },
    startDate: {
      required: false,
      type: Date,
    },
    headerVisible: {
      default: true,
      type: Boolean,
    },
    dateList: {
      default: () => {
        return [];
      },
      type: Array,
    },
    previousMonthButton: {
      default: null,
    },
    nextMonthButton: {
      default: null,
    },
    todayButton: {
      default: null,
    },
  },
  data() {
    return {
      today: null,
      selectedDate: null,
      currDateCursor: null,
      dayLabels: null,
    };
  },
  computed:{
    theme() {
      return this.$store.state.theme;
    },
    currentMonth() {
      return this.currDateCursor.getMonth();
    },
    currentYear() {
      return this.currDateCursor.getFullYear();
    },
    currentMonthLabel() {
      return MONTH_LABELS[this.currentMonth];
    },
    dates() {
      const cursorDate = this.currDateCursor;
      let startDate = startOfMonth(cursorDate),
          endDate = lastDayOfMonth(cursorDate);
      const daysNeededForLastMonth = getDay(startDate),
            daysNeededForNextMonth = 6 - getDay(endDate);
      startDate = addDays(startDate, -daysNeededForLastMonth);
      endDate = addDays(endDate, daysNeededForNextMonth);
      
      return eachDayOfInterval({start: startDate, end: endDate}).map(date => ({
        date,
        isCurrentMonth:  isSameMonth(cursorDate, date),
        isToday: isToday(date),
        isSelected: isSameDay(this.selectedDate, date)  
      }));
    },
    
  },
  created() {
    this.dayLabels = DAY_LABELS.slice();
    this.today = this.defaultDate ? this.defaultDate : new Date();
    this.selectedDate = this.today;
    this.currDateCursor = this.today;
  },
  mounted(){
    if (this.startDate) {
      this.currDateCursor = this.startDate;
      this.selectedDate = this.startDate;
    }
  },
  beforeDestroy() {
    if (this.previousMonthButton) {
      let el = this.previousMonthButton;
      if (this.previousMonthButton.$el) {
        el = this.previousMonthButton.$el;
      }
      el.removeEventListener('click', this.previousMonth);
    }
    if (this.nextMonthButton) {
      let el = this.nextMonthButton;
      if (this.nextMonthButton.$el) {
        el = this.nextMonthButton.$el;
      }
      el.removeEventListener('click', this.nextMonth);
    }
    if (this.todayButton) {
      let el = this.todayButton;
      if (this.todayButton.$el) {
        el = this.todayButton.$el;
      }
      el.removeEventListener('click', this.goToday);
    }
  },
  watch: {
    previousMonthButton(val) {
      if (val) {
        let el = val;
        if (val.$el) {
          el = val.$el;
        }
        el.addEventListener('click', this.previousMonth);
      }
    },
    nextMonthButton(val) {
      if (val) {
        let el = val;
        if (val.$el) {
          el = val.$el;
        }
        el.addEventListener('click', this.nextMonth);
      }
    },
    todayButton(val) {
      if (val) {
        let el = val;
        if (val.$el) {
          el = val.$el;
        }
        el.addEventListener('click', this.goToday);
      }
    },
  },
  methods:{
    dayClassObj(day) {
      return {
        'today' : day.isToday,
        'current': day.isCurrentMonth,
        'selected': day.isSelected,
      };
    },
    nextMonth() {
      this.currDateCursor = addMonths(this.currDateCursor, 1);
    },
    previousMonth() {
      this.currDateCursor = addMonths(this.currDateCursor, -1);
    },
    goToday() {
      this.selectedDate = this.today;
      this.$emit('input', this.selectedDate);
      const selectedMonth = getMonth(this.selectedDate);
      this.currDateCursor = setMonth(this.currDateCursor, selectedMonth);
    },
    setSelectedDate(day) {
      this.selectedDate = day.date;
      this.$emit('input', this.selectedDate);
      // change calendar to correct month if they select previous or next month's days
      if (!day.isCurrentMonth) {
        const selectedMonth = getMonth(this.selectedDate);
        this.currDateCursor = setMonth(this.currDateCursor, selectedMonth);
      }
    },
    inDateList(date) {
      for (let i = 0; i < this.dateList.length; i++) {
        if (isEqual(this.dateList[i], date)) {
          return true;
        }
      }
      return false;
    },
  },
  filters: {
    formatDateToDay(val) {
      return format(val, 'd');
    }
  },
}
</script>


<style lang="scss" scoped>

.wl-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-items: center;
  align-items: center;
  grid-row-gap: 2px;
  user-select: none;

  > .header {
    grid-column: 1 / span 7;
    @include flex;
    width: 100%;
    margin-bottom: 8px;
    
    >span {
      display: flex;
      flex-grow: 1;
      text-align: center;
      font-weight: 600;
    }
    
    .btn {
      @include flex;
      border: none;
      width: 28px;
      height: 28px;
      border-radius: 50%;

      &:hover {
        background-color: rgba($color: #FFFFFF, $alpha: .11);
      }
      &:active {
        background-color: rgba($color: #FFFFFF, $alpha: .2);
      }
    }
  }

  > * {
    @include flex;
  }

  > .headings {
    font-size: 14px;
    opacity: .7;
    margin-bottom: 4px;
  }

  > .day {
    position: relative;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    
    .lb {
      font-size: 14px;
      opacity: .7;
    }

    .bullet {
      position: absolute;
      bottom: 0;
      left: calc((100% - 4px) / 2);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: $md-blue-60;
      pointer-events: none;
    }
    
    &:hover {
      background-color: rgba($color: #FFFFFF, $alpha: .11);
    }
    &:active {
      background-color: rgba($color: #FFFFFF, $alpha: .2);
    }
    &.selected {
      background-color: $md-blue-60;
    }
    
    &.current {
      .lb {
        opacity: .95;
      }
    }

  }
}

</style>
