<script>
import * as professorApi from '../../api/professor.js'
import AlertModal from './AlertModal.vue'

export default {
  name: 'SyllabusDocument',
  components: { AlertModal },
  props: {
    course: {
      type: Object,
      required: true
    },
    // true면 담당교수 화면 — 개요/주별계획을 직접 수정할 수 있다.
    // (제출된 실제 요구사항: "간단히 개요 + 주차별 내용만" — 시험일정/교수연락처 등
    // 나머지 강의계획서 항목은 대응 데이터가 없어 계속 주석 처리 상태로 둔다.)
    editable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['saved'],
  data() {
    return {
      editing: false,
      saving: false,
      saveError: '',
      form: { objectives: '', weeks: [] }
    }
  },
  methods: {
    startEdit() {
      this.saveError = ''
      this.form.objectives = this.course.objectives || ''
      this.form.weeks = Array.from({ length: 16 }, (_, i) => {
        const week = i + 1
        const existing = (this.course.syllabusWeeks || []).find((w) => w.week === week)
        return { week_no: week, topic: existing?.topic || '', activity: existing?.activity || '' }
      })
      this.editing = true
    },
    cancelEdit() {
      this.editing = false
    },
    async saveSyllabus() {
      this.saving = true
      this.saveError = ''
      try {
        // PATCH는 초안(draft) 상태에서만 가능하고 발행된 계획서는 다시 못 고친다
        // (backend/app/api/v1/professor.py의 edit_syllabus) — 그래서 저장할 때마다
        // 새 버전을 만들고(parse) 채운 뒤(edit) 바로 발행(publish)한다.
        const draft = await professorApi.parseSyllabus(this.course.id, {
          text: '(교수 직접 입력)',
          source_file_name: null
        })
        const weeks = this.form.weeks.map((w) => ({
          week_no: w.week_no,
          topic: w.topic || null,
          activity: w.activity || null
        }))
        await professorApi.editSyllabus(draft.id, { objectives: this.form.objectives || null, weeks })
        await professorApi.publishSyllabus(draft.id)
        this.editing = false
        this.$emit('saved')
      } catch (e) {
        this.saveError = e?.response?.data?.detail?.message || e?.response?.data?.detail || '저장에 실패했습니다. 잠시 후 다시 시도해주세요.'
        console.error('[api] syllabus save', e)
      }
      this.saving = false
    }
  }
}
</script>

<template>
  <div class="sheet">
    <div class="doc-header">
      <h1 class="doc-title">{{ course.semester }} 수업계획서</h1>
      <div v-if="editable" class="doc-header-actions">
        <button v-if="!editing" type="button" class="btn-edit-toggle" @click="startEdit">수정</button>
        <template v-else>
          <button type="button" class="btn-edit-toggle" :disabled="saving" @click="cancelEdit">취소</button>
          <button type="button" class="btn-edit-toggle primary" :disabled="saving" @click="saveSyllabus">{{ saving ? '저장 중...' : '저장(발행)' }}</button>
        </template>
      </div>
    </div>
    <AlertModal :message="saveError" @close="saveError = ''" />

    <table class="doc-table">
      <tbody>
        <tr>
          <th>교과목명</th>
          <td>{{ course.name }}</td>
          <th>학정번호-분반번호</th>
          <td>{{ course.courseCode }}-{{ course.section }}</td>
        </tr>
        <tr>
          <th>학점</th>
          <td>{{ course.credit }}</td>
          <th>개설학과</th>
          <td>{{ course.group }}</td>
        </tr>
        <tr>
          <th>수업시간</th>
          <td>{{ course.scheduleText || '미정' }}</td>
          <th>강의실</th>
          <td>{{ course.locationText || '미정' }}</td>
        </tr>
      </tbody>
    </table>

    <!--
      아래 항목들(시험일시/교수 연락처·조교/수업방법·성적평가 비율/과제/교재/유의사항)은
      학생에게 노출되는 강의계획서 API(GET /courses/{id})에 대응 데이터가 없다.
      실데이터 없이 보여주면 더미 정보가 되므로, 실제 백엔드 필드가 붙기 전까지 주석 처리한다.
      (교과목 개요만 실제 Syllabus.objectives 필드가 있어 아래에서 real로 다룬다.)

    <table class="doc-table">
      <tbody>
        <tr>
          <th colspan="4">최초등록일 / 최종수정일</th>
        </tr>
      </tbody>
    </table>

    <table class="doc-table">
      <tbody>
        <tr>
          <th>시험일시</th>
          <td colspan="3" class="split-cell">
            <span class="split-item">
              <span class="split-label">중간시험</span>
              <span>{{ course.syllabus.examSchedule.midterm || '-' }}</span>
            </span>
            <span class="split-item">
              <span class="split-label">기말시험</span>
              <span>{{ course.syllabus.examSchedule.final || '-' }}</span>
            </span>
          </td>
        </tr>
        <tr>
          <th>수업진행언어</th>
          <td colspan="3">{{ course.language }}</td>
        </tr>
      </tbody>
    </table>

    <table class="doc-table">
      <tbody>
        <tr>
          <th rowspan="3" class="group-th">담당교수</th>
          <th>성명</th>
          <td>{{ course.professor }}</td>
          <th>전화</th>
          <td>{{ course.syllabus.professorContact.phone || '-' }}</td>
        </tr>
        <tr>
          <th>소속</th>
          <td>{{ course.universityLabel }} {{ course.group }}</td>
          <th>메일</th>
          <td>{{ course.syllabus.professorContact.email || '-' }}</td>
        </tr>
        <tr>
          <th>연구실</th>
          <td>{{ course.syllabus.professorContact.office || '-' }}</td>
          <th>면담정보</th>
          <td>{{ course.syllabus.professorContact.officeHours || '-' }}</td>
        </tr>
        <tr>
          <th>조교정보</th>
          <th>성명</th>
          <td>{{ course.syllabus.ta.name || '-' }}</td>
          <th>연락처</th>
          <td>{{ course.syllabus.ta.phone || '-' }}</td>
        </tr>
      </tbody>
    </table>

    <table class="doc-table ratio-table">
      <thead>
        <tr class="ratio-caption-row"><th colspan="5">수업방법(%)</th></tr>
        <tr><th>강의</th><th>실습</th><th>발표</th><th>토론</th><th>팀프로젝트</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ course.syllabus.methodRatio.lecture || 0 }}%</td>
          <td>{{ course.syllabus.methodRatio.practice || 0 }}%</td>
          <td>{{ course.syllabus.methodRatio.presentation || 0 }}%</td>
          <td>{{ course.syllabus.methodRatio.discussion || 0 }}%</td>
          <td>{{ course.syllabus.methodRatio.teamProject || 0 }}%</td>
        </tr>
      </tbody>
    </table>

    <table class="doc-table ratio-table">
      <thead>
        <tr class="ratio-caption-row"><th colspan="7">성적평가방법(%)</th></tr>
        <tr><th>중간시험</th><th>기말시험</th><th>퀴즈</th><th>개인과제</th><th>팀과제</th><th>출석</th><th>기타</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ course.syllabus.evalRatio.midterm || 0 }}%</td>
          <td>{{ course.syllabus.evalRatio.final || 0 }}%</td>
          <td>{{ course.syllabus.evalRatio.quiz || 0 }}%</td>
          <td>{{ course.syllabus.evalRatio.individual || 0 }}%</td>
          <td>{{ course.syllabus.evalRatio.team || 0 }}%</td>
          <td>{{ course.syllabus.evalRatio.attendance || 0 }}%</td>
          <td>{{ course.syllabus.evalRatio.etc || 0 }}%</td>
        </tr>
      </tbody>
    </table>

    <table class="doc-table">
      <thead>
        <tr><th colspan="3" class="section-caption">과제/레포트, 프로젝트 안내</th></tr>
        <tr><th>과제명/프로젝트명 및 작성 방법</th><th>제출마감일</th><th>제출물유형 및 제출방법</th></tr>
      </thead>
      <tbody>
        <tr v-for="(a, idx) in course.syllabus.assignments" :key="idx">
          <td>{{ a.title || '-' }}</td>
          <td>{{ a.dueDate || '-' }}</td>
          <td>{{ a.type || '-' }}</td>
        </tr>
        <tr v-if="!course.syllabus.assignments.length"><td colspan="3" class="empty-row">-</td></tr>
      </tbody>
    </table>

    <table class="doc-table">
      <tbody>
        <tr>
          <th>선수 추천과목</th>
          <td>{{ course.syllabus.prerequisite || '-' }}</td>
          <th>온라인강의 사이트</th>
          <td>{{ course.syllabus.onlineSite || '-' }}</td>
        </tr>
      </tbody>
    </table>

    <table class="doc-table">
      <thead>
        <tr><th>교재구분</th><th>교재명</th><th>저자</th><th>출판사</th><th>출판년도</th><th>ISBN</th></tr>
      </thead>
      <tbody>
        <tr v-for="(t, idx) in course.syllabus.textbooks" :key="idx">
          <td>{{ t.type || '-' }}</td>
          <td>{{ t.title || '-' }}</td>
          <td>{{ t.author || '-' }}</td>
          <td>{{ t.publisher || '-' }}</td>
          <td>{{ t.year || '-' }}</td>
          <td>{{ t.isbn || '-' }}</td>
        </tr>
        <tr v-if="!course.syllabus.textbooks.length"><td colspan="6" class="empty-row">-</td></tr>
      </tbody>
    </table>

    <table class="doc-table">
      <tbody>
        <tr>
          <th class="wide-label">주요 학습자 유의사항</th>
          <td><p class="readonly-text">{{ course.syllabus.notes || '-' }}</p></td>
        </tr>
      </tbody>
    </table>
    -->

    <table class="doc-table">
      <tbody>
        <tr>
          <th>교과목 개요</th>
          <td>
            <textarea v-if="editing" v-model="form.objectives" rows="4" placeholder="교과목 개요를 입력하세요" />
            <p v-else class="readonly-text">{{ course.objectives || '-' }}</p>
          </td>
        </tr>
      </tbody>
    </table>

    <h2 class="doc-subtitle">주별계획</h2>
    <table class="doc-table week-table">
      <thead>
        <tr>
          <th>주차</th>
          <th>수업내용 및 학습활동</th>
        </tr>
      </thead>
      <tbody v-if="editing">
        <tr v-for="w in form.weeks" :key="w.week_no">
          <td>{{ w.week_no }}주</td>
          <td class="week-edit-cell">
            <input v-model="w.topic" type="text" placeholder="주제" />
            <input v-model="w.activity" type="text" placeholder="학습활동" />
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="w in course.syllabusWeeks || []" :key="w.week">
          <td>{{ w.week }}주</td>
          <td>{{ w.topic || w.activity ? [w.topic, w.activity].filter(Boolean).join(' — ') : '-' }}</td>
        </tr>
        <tr v-if="!course.syllabusWeeks || !course.syllabusWeeks.length">
          <td colspan="2" class="empty-row">주별계획이 아직 등록되지 않았습니다.</td>
        </tr>
      </tbody>
    </table>

    <div class="policy-block">
      <h2 class="doc-subtitle">출석의무</h2>
      <p>실제 수업시수의 1/3 이상을 결석한 학생은 시험결과와 관계없이 F 또는 NP의 성적을 받게 됩니다. 중간, 기말시험을 실시하지 않는 교과목은 해당 기간 중 수업을 실시합니다.</p>

      <h2 class="doc-subtitle">장애학생 지원</h2>
      <p>학기 시작 전 담당교수와의 면담을 통해 출석, 강의, 과제 및 시험에 관한 교수학습지원 사항을 요청할 수 있습니다. 실제 지원 내용은 수업의 본질적 특성을 고려하여 담당교수의 재량에 따라 달라질 수 있습니다.</p>

      <h2 class="doc-subtitle">안전주의</h2>
      <p>이공계열 및 생활과학계열 등 실험실 환경안전교육 이수대상자는 개강 전 온라인교육을 이수하고 첫 시간에 이수증을 제출하여야 하며, 미제출자는 수업 참여를 불허합니다.</p>

      <h2 class="doc-subtitle">수업 운영 안내</h2>
      <p>휴강, 보강, 강의실 변경 및 기타 수업 운영 관련 안내는 각 대학 LMS를 통해 별도 공지될 수 있으므로 관련 공지사항을 수시로 확인 바랍니다.</p>
    </div>
  </div>
</template>

<style scoped>
.sheet {
  background: #fff;
  border: 2px solid #000;
  padding: 32px 40px 40px;
  font-family: Batang, AppleMyungjo, '나눔명조', 'Nanum Myeongjo', Georgia, serif;
  color: #000;
}

.doc-header {
  position: relative;
  margin: 0 0 24px;
}

.doc-title {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
}

.btn-edit-toggle {
  border: 1px solid #000;
  background: #fff;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.btn-edit-toggle:hover {
  background: #000;
  color: #fff;
}

.btn-edit-toggle.primary {
  background: #000;
  color: #fff;
}

.btn-edit-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.doc-header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 8px;
}

.doc-subtitle {
  font-size: 15px;
  font-weight: 700;
  margin: 24px 0 8px;
}

.doc-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
}

.doc-table th,
.doc-table td {
  border: 1px solid #000;
  padding: 8px 10px;
  text-align: left;
  vertical-align: middle;
}

.doc-table th {
  background: #f2f2f2;
  font-weight: 700;
  white-space: nowrap;
  width: 140px;
}

.doc-table th.wide-label {
  width: 160px;
  vertical-align: top;
}

.sub {
  font-weight: 400;
  font-size: 11px;
  color: #444;
}

.readonly-text {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.6;
}

.doc-table textarea,
.doc-table input {
  width: 100%;
  border: 1px solid #000;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  color: #000;
  padding: 6px 8px;
}

.week-edit-cell {
  display: flex;
  gap: 8px;
}

.week-edit-cell input {
  flex: 1;
}


.empty-row {
  text-align: center;
  color: #666;
}

.policy-block p {
  font-size: 12px;
  color: #333;
  line-height: 1.7;
  margin: 0 0 4px;
}

.week-table td:nth-child(1) {
  text-align: center;
  width: 60px;
}

@media (max-width: 768px) {
  .sheet {
    padding: 20px;
  }
  .doc-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
