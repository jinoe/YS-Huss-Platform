<script>
const TRACKS = [
  {
    key: 'ai',
    label: 'AI융합 나노디그리',
    nanoCredits: 6,
    requiredCredits: 9,
    stages: [
      {
        key: 'basic',
        label: '기초',
        courses: [
          { name: '인공지능개론', credit: 3, required: true, status: 'completed' },
          { name: '데이터사이언스입문', credit: 3, required: false, status: 'completed' },
          { name: '파이썬프로그래밍', credit: 3, required: false, status: 'not-taken' }
        ]
      },
      {
        key: 'advanced',
        label: '심화',
        courses: [
          { name: '머신러닝응용', credit: 3, required: true, status: 'in-progress' },
          { name: '딥러닝프로젝트', credit: 3, required: false, status: 'not-taken' },
          { name: '컴퓨터비전', credit: 3, required: false, status: 'not-taken' }
        ]
      },
      {
        key: 'capstone',
        label: '캡스톤',
        courses: [
          { name: 'AI융합캡스톤디자인', credit: 3, required: true, status: 'not-taken' },
          { name: '산학연계프로젝트', credit: 3, required: false, status: 'not-taken' }
        ]
      }
    ]
  },
  {
    key: 'global',
    label: '글로벌통상 나노디그리',
    nanoCredits: 6,
    requiredCredits: 9,
    stages: [
      {
        key: 'basic',
        label: '기초',
        courses: [
          { name: '국제통상개론', credit: 3, required: true, status: 'completed' },
          { name: '글로벌비즈니스커뮤니케이션', credit: 3, required: false, status: 'not-taken' }
        ]
      },
      {
        key: 'advanced',
        label: '심화',
        courses: [
          { name: '국제무역실무', credit: 3, required: true, status: 'not-taken' },
          { name: '해외시장분석', credit: 3, required: false, status: 'not-taken' }
        ]
      },
      {
        key: 'capstone',
        label: '캡스톤',
        courses: [
          { name: '글로벌통상캡스톤', credit: 3, required: true, status: 'not-taken' },
          { name: '해외인턴십연계', credit: 3, required: false, status: 'not-taken' }
        ]
      }
    ]
  }
]

export default {
  name: 'MicrodegreeSimulatorView',
  data() {
    return {
      tracks: TRACKS,
      activeTrack: 'ai',
      simulationMode: false
    }
  },
  computed: {
    currentTrack() {
      return this.tracks.find((t) => t.key === this.activeTrack)
    },
    allCourses() {
      return this.currentTrack.stages.flatMap((stage) => stage.courses)
    },
    earnedCredits() {
      return this.allCourses.filter((c) => c.status === 'completed').reduce((sum, c) => sum + c.credit, 0)
    },
    simulatedCredits() {
      return this.allCourses
        .filter((c) => c.status === 'completed' || c.simulated)
        .reduce((sum, c) => sum + c.credit, 0)
    },
    displayedCredits() {
      return this.simulationMode ? this.simulatedCredits : this.earnedCredits
    },
    progressPercent() {
      return Math.min(100, Math.round((this.displayedCredits / this.currentTrack.requiredCredits) * 100))
    },
    requiredCoursesMet() {
      return this.allCourses
        .filter((c) => c.required)
        .every((c) => c.status === 'completed' || (this.simulationMode && c.simulated))
    },
    nanoMet() {
      return this.displayedCredits >= this.currentTrack.nanoCredits
    },
    microMet() {
      return this.requiredCoursesMet && this.displayedCredits >= this.currentTrack.requiredCredits
    }
  },
  methods: {
    selectTrack(key) {
      this.activeTrack = key
    },
    toggleSimulation() {
      this.simulationMode = !this.simulationMode
      if (!this.simulationMode) {
        this.tracks.forEach((track) => {
          track.stages.forEach((stage) => {
            stage.courses.forEach((course) => {
              course.simulated = false
            })
          })
        })
      }
    },
    toggleCourse(course) {
      if (!this.simulationMode || course.status === 'completed') return
      course.simulated = !course.simulated
    },
    statusLabel(course) {
      if (course.status === 'completed') return '완료'
      if (this.simulationMode && course.simulated) return '시뮬레이션 이수'
      if (course.status === 'in-progress') return '진행중'
      return '미이수'
    },
    statusClass(course) {
      if (course.status === 'completed') return 'completed'
      if (this.simulationMode && course.simulated) return 'simulated'
      if (course.status === 'in-progress') return 'in-progress'
      return 'not-taken'
    }
  }
}
</script>

<template>
  <section class="page">
    <div class="sim-header">
      <h3>나노디그리 시뮬레이터</h3>
      <button type="button" class="btn-secondary sim-toggle" :class="{ active: simulationMode }" @click="toggleSimulation">
        시뮬레이션 모드 {{ simulationMode ? 'ON' : 'OFF' }}
      </button>
    </div>

    <div class="tabs">
      <button
        v-for="track in tracks"
        :key="track.key"
        class="tab"
        :class="{ active: track.key === activeTrack }"
        @click="selectTrack(track.key)"
      >
        {{ track.label }}
      </button>
    </div>

    <div class="progress-card">
      <div class="stat-row">
        <div class="stat">
          <span class="stat-value">{{ displayedCredits }}</span>
          <span class="stat-label">이수 학점</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ currentTrack.requiredCredits }}</span>
          <span class="stat-label">필요 학점</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ progressPercent }}%</span>
          <span class="stat-label">이수율</span>
        </div>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
        <div class="progress-marker" :style="{ left: (currentTrack.nanoCredits / currentTrack.requiredCredits) * 100 + '%' }" />
      </div>
      <p class="condition-msg" :class="{ met: nanoMet }">
        나노디그리 인증({{ currentTrack.nanoCredits }}학점): {{ nanoMet ? '충족' : '미충족' }}
      </p>
      <p class="condition-msg" :class="{ met: microMet }">
        마이크로디그리 인증({{ currentTrack.requiredCredits }}학점, 필수과목 포함): {{ microMet ? '충족' : '미충족' }}
      </p>
    </div>

    <div class="stage-grid">
      <div v-for="stage in currentTrack.stages" :key="stage.key" class="stage-col">
        <h4>{{ stage.label }}</h4>
        <div
          v-for="course in stage.courses"
          :key="course.name"
          class="course-card"
          :class="{ clickable: simulationMode && course.status !== 'completed' }"
          @click="toggleCourse(course)"
        >
          <p class="course-name">
            {{ course.name }}
            <span v-if="course.required" class="required-mark">필수</span>
          </p>
          <p class="course-credit">{{ course.credit }}학점</p>
          <span class="status" :class="statusClass(course)">{{ statusLabel(course) }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
}

.sim-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.sim-header h3 {
  font-size: 20px;
  margin: 0;
}

.btn-secondary {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-muted);
}

.btn-secondary.active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--bg-soft);
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tab {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 14px;
}

.tab.active {
  background: var(--color-text);
  border-color: var(--color-text);
  color: #fff;
}

.progress-card {
  background: var(--bg-soft);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 28px;
}

.stat-row {
  display: flex;
  gap: 32px;
  margin-bottom: 16px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-primary);
}

.stat-label {
  font-size: 12px;
  color: var(--color-muted);
}

.progress-track {
  position: relative;
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: var(--color-border);
}

.progress-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 999px;
  transition: width 0.25s ease;
}

.progress-marker {
  position: absolute;
  top: -3px;
  width: 2px;
  height: 14px;
  background: var(--color-primary);
  transform: translateX(-1px);
}

.condition-msg {
  margin: 12px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-muted);
}

.condition-msg + .condition-msg {
  margin-top: 4px;
}

.condition-msg.met {
  color: var(--color-accent);
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stage-col h4 {
  font-size: 14px;
  color: var(--color-muted);
  margin: 0 0 12px;
}

.course-card {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 12px;
}

.course-card.clickable {
  cursor: pointer;
}

.course-card.clickable:hover {
  border-color: var(--color-accent);
}

.course-name {
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 4px;
}

.required-mark {
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: var(--color-primary);
  border-radius: 4px;
  padding: 1px 5px;
  margin-left: 4px;
}

.course-credit {
  font-size: 12px;
  color: var(--color-muted);
  margin: 0 0 8px;
}

.status {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  border-radius: 999px;
  padding: 2px 8px;
}

.status.completed {
  background: var(--color-accent);
  color: #fff;
}

.status.in-progress {
  background: var(--color-yellow);
  color: var(--color-text);
}

.status.not-taken {
  background: var(--bg-soft);
  color: var(--color-muted);
}

.status.simulated {
  background: var(--color-primary);
  color: #fff;
}

@media (max-width: 768px) {
  .stage-grid {
    grid-template-columns: 1fr;
  }
  .stat-row {
    gap: 20px;
  }
}
</style>
