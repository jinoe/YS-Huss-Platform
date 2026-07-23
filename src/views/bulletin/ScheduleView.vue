<script>
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export default {
  name: 'ScheduleView',
  data() {
    const today = new Date()
    return {
      year: today.getFullYear(),
      month: today.getMonth(),
      today: today.getDate(),
      todayMonth: today.getMonth(),
      todayYear: today.getFullYear(),
      weekdays: WEEKDAYS,
      events: [
        { range: '07.01 ~ 07.03', title: 'HUSS 융합캠프 아카데미' },
        { range: '07.04 ~ 07.10', title: '글로벌 자원 이용 및 기후변화 완화 국제협력 솔루션 프로그램' },
        { range: '07.07 ~ 07.10', title: '글로벌 역량 강화를 위한 일본 기업 탐방 프로그램' }
      ]
    }
  },
  computed: {
    monthLabel() {
      return `${this.year}년 ${this.month + 1}월`
    },
    eventDays() {
      if (this.month !== this.todayMonth || this.year !== this.todayYear) return []
      return this.events.flatMap((event) => {
        const [start, end] = event.range.split(' ~ ').map((part) => Number(part.split('.')[1]))
        const days = []
        for (let day = start; day <= end; day++) days.push(day)
        return days
      })
    },
    calendarCells() {
      const firstDay = new Date(this.year, this.month, 1).getDay()
      const daysInMonth = new Date(this.year, this.month + 1, 0).getDate()
      const cells = Array(firstDay).fill(null)
      for (let day = 1; day <= daysInMonth; day++) cells.push(day)
      return cells
    }
  },
  methods: {
    isToday(day) {
      return day === this.today && this.month === this.todayMonth && this.year === this.todayYear
    },
    hasEvent(day) {
      return this.eventDays.includes(day)
    },
    prevMonth() {
      if (this.month === 0) {
        this.month = 11
        this.year -= 1
      } else {
        this.month -= 1
      }
    },
    nextMonth() {
      if (this.month === 11) {
        this.month = 0
        this.year += 1
      } else {
        this.month += 1
      }
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>사업단 일정</h3>
    <div class="calendar-head">
      <button type="button" @click="prevMonth" aria-label="이전 달">‹</button>
      <p class="month-label">{{ monthLabel }}</p>
      <button type="button" @click="nextMonth" aria-label="다음 달">›</button>
    </div>
    <div class="weekdays">
      <span v-for="day in weekdays" :key="day">{{ day }}</span>
    </div>
    <div class="days">
      <span
        v-for="(day, index) in calendarCells"
        :key="index"
        class="day"
        :class="{ empty: day === null, today: day && isToday(day), event: day && hasEvent(day) }"
      >
        {{ day }}
      </span>
    </div>
    <ul class="event-list">
      <li v-for="event in events" :key="event.title">
        <strong>{{ event.range }}</strong>
        <span>{{ event.title }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 20px;
}

.calendar-head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 16px;
}

.calendar-head button {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.month-label {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  min-width: 120px;
  text-align: center;
}

.weekdays,
.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.weekdays span {
  font-size: 13px;
  color: var(--color-muted);
  padding: 8px 0;
}

.day {
  padding: 12px 0;
  font-size: 14px;
  border-radius: 4px;
}

.day.empty {
  visibility: hidden;
}

.day.event {
  background: var(--bg-soft);
}

.day.today {
  background: var(--color-primary);
  color: #fff;
  font-weight: 700;
}

.event-list {
  list-style: none;
  margin: 24px 0 0;
  padding: 0;
  border-top: 1px solid var(--color-border);
}

.event-list li {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  font-size: 13px;
  border-bottom: 1px solid var(--color-border);
}

.event-list strong {
  flex-shrink: 0;
  color: var(--color-primary);
}
</style>
