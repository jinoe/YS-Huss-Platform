<script>
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export default {
  name: 'ScheduleSection',
  data() {
    const today = new Date()
    return {
      year: today.getFullYear(),
      month: today.getMonth(),
      today: today.getDate(),
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
      return day === this.today
    },
    hasEvent(day) {
      return this.eventDays.includes(day)
    }
  }
}
</script>

<template>
  <section class="schedule">
    <div class="container schedule-grid">
      <div class="calendar">
        <h2>{{ $t('home.scheduleTitle') }}</h2>
        <p class="month-label">{{ monthLabel }}</p>
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
      </div>
      <div class="cta-column">
        <router-link to="/curriculum/program" class="cta-btn primary">{{ $t('home.apply') }}</router-link>
        <router-link to="/share/cardnews" class="cta-btn">{{ $t('home.cardnews') }}</router-link>
        <router-link to="/bulletin/faq" class="cta-btn">{{ $t('home.faq') }}</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.schedule {
  padding: 0 0 64px;
}

.schedule-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.calendar h2 {
  font-size: 22px;
  margin: 0 0 8px;
}

.month-label {
  color: var(--color-muted);
  margin: 0 0 12px;
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
  padding: 4px 0;
}

.day {
  padding: 8px 0;
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
  margin: 16px 0 0;
  padding: 0;
  border-top: 1px solid var(--color-border);
}

.event-list li {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px solid var(--color-border);
}

.event-list strong {
  flex-shrink: 0;
  color: var(--color-primary);
}

.cta-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: flex-start;
}

.cta-btn {
  display: block;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 24px;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  background: #fff;
  text-align: left;
  text-decoration: none;
}

.cta-btn:hover {
  border-color: var(--color-text);
}

.cta-btn.primary {
  background: var(--color-text);
  color: #fff;
  border-color: var(--color-text);
}

@media (max-width: 768px) {
  .schedule-grid {
    grid-template-columns: 1fr;
  }
}
</style>
