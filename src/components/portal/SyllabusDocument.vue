<script>
import session from '../../data/session.js'

const UNIVERSITY_LABELS = {
  yonsei: '연세대학교',
  gongju: '국립공주대학교',
  dongeui: '동의대학교',
  ewha: '이화여자대학교',
  handong: '한동대학교'
}

export default {
  name: 'SyllabusDocument',
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      session,
      editing: false
    }
  },
  computed: {
    isProfessor() {
      return this.session.role === 'professor'
    },
    canEdit() {
      return this.isProfessor && this.editing
    },
    universityLabel() {
      return UNIVERSITY_LABELS[this.course.university] || this.course.university
    }
  },
  methods: {
    toggleEditing() {
      this.editing = !this.editing
    },
    now() {
      return new Date().toISOString().slice(0, 19).replace('T', ' ')
    },
    touch() {
      const s = this.course.syllabus
      if (!s.registeredAt) s.registeredAt = this.now()
      s.updatedAt = this.now()
    },
    addAssignment() {
      this.course.syllabus.assignments.push({ title: '', dueDate: '', type: '' })
      this.touch()
    },
    removeAssignment(idx) {
      this.course.syllabus.assignments.splice(idx, 1)
      this.touch()
    },
    addTextbook() {
      this.course.syllabus.textbooks.push({ type: '', title: '', author: '', publisher: '', year: '', isbn: '' })
      this.touch()
    },
    removeTextbook(idx) {
      this.course.syllabus.textbooks.splice(idx, 1)
      this.touch()
    }
  }
}
</script>

<template>
  <div class="sheet" @input="touch">
    <div class="doc-header">
      <h1 class="doc-title">{{ course.semester }} 수업계획서</h1>
      <button v-if="isProfessor" type="button" class="btn-edit-toggle" @click="toggleEditing">
        {{ editing ? '수정 완료' : '수정' }}
      </button>
    </div>

    <table class="doc-table">
      <tbody>
        <tr>
          <th>최초등록일</th>
          <td>{{ course.syllabus.registeredAt || '-' }}</td>
          <th>최종수정일</th>
          <td>{{ course.syllabus.updatedAt || '-' }}</td>
        </tr>
        <tr>
          <th>교과목명</th>
          <td>{{ course.name }}</td>
          <th>학정번호-분반번호</th>
          <td>{{ course.courseCode }}-{{ course.section }}</td>
        </tr>
        <tr>
          <th>학점/강의시간</th>
          <td>{{ course.credit }}/{{ course.lectureTime }}</td>
          <th>개설학과</th>
          <td>{{ course.group }}</td>
        </tr>
        <tr>
          <th>수업시간</th>
          <td>{{ course.lectureTime }}</td>
          <th>강의실</th>
          <td>{{ course.room }}</td>
        </tr>
        <tr>
          <th>시험일시</th>
          <td colspan="3" class="split-cell">
            <span class="split-item">
              <span class="split-label">중간시험</span>
              <input v-if="canEdit" v-model="course.syllabus.examSchedule.midterm" type="text" placeholder="예: 10월 중간고사 기간" />
              <span v-else>{{ course.syllabus.examSchedule.midterm || '-' }}</span>
            </span>
            <span class="split-item">
              <span class="split-label">기말시험</span>
              <input v-if="canEdit" v-model="course.syllabus.examSchedule.final" type="text" placeholder="예: 12월 기말고사 기간" />
              <span v-else>{{ course.syllabus.examSchedule.final || '-' }}</span>
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
          <td><input v-if="canEdit" v-model="course.syllabus.professorContact.phone" type="text" /><span v-else>{{ course.syllabus.professorContact.phone || '-' }}</span></td>
        </tr>
        <tr>
          <th>소속</th>
          <td>{{ universityLabel }} {{ course.group }}</td>
          <th>메일</th>
          <td><input v-if="canEdit" v-model="course.syllabus.professorContact.email" type="text" /><span v-else>{{ course.syllabus.professorContact.email || '-' }}</span></td>
        </tr>
        <tr>
          <th>연구실</th>
          <td><input v-if="canEdit" v-model="course.syllabus.professorContact.office" type="text" /><span v-else>{{ course.syllabus.professorContact.office || '-' }}</span></td>
          <th>면담정보</th>
          <td><input v-if="canEdit" v-model="course.syllabus.professorContact.officeHours" type="text" /><span v-else>{{ course.syllabus.professorContact.officeHours || '-' }}</span></td>
        </tr>
        <tr>
          <th>조교정보</th>
          <th>성명</th>
          <td><input v-if="canEdit" v-model="course.syllabus.ta.name" type="text" /><span v-else>{{ course.syllabus.ta.name || '-' }}</span></td>
          <th>연락처</th>
          <td><input v-if="canEdit" v-model="course.syllabus.ta.phone" type="text" /><span v-else>{{ course.syllabus.ta.phone || '-' }}</span></td>
        </tr>
      </tbody>
    </table>

    <table class="doc-table">
      <tbody>
        <tr>
          <th class="wide-label">교과목 개요<br /><span class="sub">교과목에 대한 간략한 소개</span></th>
          <td>
            <textarea v-if="canEdit" v-model="course.syllabus.overview" rows="4" placeholder="교과목 개요를 입력하세요" />
            <p v-else class="readonly-text">{{ course.syllabus.overview || '-' }}</p>
          </td>
        </tr>
      </tbody>
    </table>

    <table class="doc-table ratio-table">
      <thead>
        <tr class="ratio-caption-row">
          <th colspan="5">수업방법(%) — 합계 없이 100이 되도록</th>
        </tr>
        <tr>
          <th>강의</th>
          <th>실습</th>
          <th>발표</th>
          <th>토론</th>
          <th>팀프로젝트</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input v-if="canEdit" v-model.number="course.syllabus.methodRatio.lecture" type="number" min="0" max="100" /><span v-else>{{ course.syllabus.methodRatio.lecture || 0 }}%</span></td>
          <td><input v-if="canEdit" v-model.number="course.syllabus.methodRatio.practice" type="number" min="0" max="100" /><span v-else>{{ course.syllabus.methodRatio.practice || 0 }}%</span></td>
          <td><input v-if="canEdit" v-model.number="course.syllabus.methodRatio.presentation" type="number" min="0" max="100" /><span v-else>{{ course.syllabus.methodRatio.presentation || 0 }}%</span></td>
          <td><input v-if="canEdit" v-model.number="course.syllabus.methodRatio.discussion" type="number" min="0" max="100" /><span v-else>{{ course.syllabus.methodRatio.discussion || 0 }}%</span></td>
          <td><input v-if="canEdit" v-model.number="course.syllabus.methodRatio.teamProject" type="number" min="0" max="100" /><span v-else>{{ course.syllabus.methodRatio.teamProject || 0 }}%</span></td>
        </tr>
      </tbody>
    </table>

    <table class="doc-table ratio-table">
      <thead>
        <tr class="ratio-caption-row">
          <th colspan="7">성적평가방법(%) — 합계값이 100이 되도록</th>
        </tr>
        <tr>
          <th>중간시험</th>
          <th>기말시험</th>
          <th>퀴즈</th>
          <th>개인과제</th>
          <th>팀과제</th>
          <th>출석</th>
          <th>기타</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input v-if="canEdit" v-model.number="course.syllabus.evalRatio.midterm" type="number" min="0" max="100" /><span v-else>{{ course.syllabus.evalRatio.midterm || 0 }}%</span></td>
          <td><input v-if="canEdit" v-model.number="course.syllabus.evalRatio.final" type="number" min="0" max="100" /><span v-else>{{ course.syllabus.evalRatio.final || 0 }}%</span></td>
          <td><input v-if="canEdit" v-model.number="course.syllabus.evalRatio.quiz" type="number" min="0" max="100" /><span v-else>{{ course.syllabus.evalRatio.quiz || 0 }}%</span></td>
          <td><input v-if="canEdit" v-model.number="course.syllabus.evalRatio.individual" type="number" min="0" max="100" /><span v-else>{{ course.syllabus.evalRatio.individual || 0 }}%</span></td>
          <td><input v-if="canEdit" v-model.number="course.syllabus.evalRatio.team" type="number" min="0" max="100" /><span v-else>{{ course.syllabus.evalRatio.team || 0 }}%</span></td>
          <td><input v-if="canEdit" v-model.number="course.syllabus.evalRatio.attendance" type="number" min="0" max="100" /><span v-else>{{ course.syllabus.evalRatio.attendance || 0 }}%</span></td>
          <td><input v-if="canEdit" v-model.number="course.syllabus.evalRatio.etc" type="number" min="0" max="100" /><span v-else>{{ course.syllabus.evalRatio.etc || 0 }}%</span></td>
        </tr>
      </tbody>
    </table>

    <table class="doc-table">
      <thead>
        <tr>
          <th colspan="3" class="section-caption">과제/레포트, 프로젝트 안내</th>
        </tr>
        <tr>
          <th>과제명/프로젝트명 및 작성 방법</th>
          <th>제출마감일</th>
          <th>제출물유형 및 제출방법</th>
          <th v-if="canEdit" class="row-action-col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(a, idx) in course.syllabus.assignments" :key="idx">
          <td><input v-if="canEdit" v-model="a.title" type="text" /><span v-else>{{ a.title || '-' }}</span></td>
          <td><input v-if="canEdit" v-model="a.dueDate" type="text" /><span v-else>{{ a.dueDate || '-' }}</span></td>
          <td><input v-if="canEdit" v-model="a.type" type="text" /><span v-else>{{ a.type || '-' }}</span></td>
          <td v-if="canEdit" class="row-action-col"><button type="button" class="btn-row-remove" @click="removeAssignment(idx)">삭제</button></td>
        </tr>
        <tr v-if="!course.syllabus.assignments.length">
          <td colspan="3" class="empty-row">-</td>
          <td v-if="canEdit" class="row-action-col"></td>
        </tr>
      </tbody>
    </table>
    <button v-if="canEdit" type="button" class="btn-row-add" @click="addAssignment">+ 과제 행 추가</button>

    <table class="doc-table">
      <tbody>
        <tr>
          <th>선수 추천과목</th>
          <td><input v-if="canEdit" v-model="course.syllabus.prerequisite" type="text" /><span v-else>{{ course.syllabus.prerequisite || '-' }}</span></td>
          <th>온라인강의 사이트</th>
          <td><input v-if="canEdit" v-model="course.syllabus.onlineSite" type="text" /><span v-else>{{ course.syllabus.onlineSite || '-' }}</span></td>
        </tr>
      </tbody>
    </table>

    <table class="doc-table">
      <thead>
        <tr>
          <th>교재구분</th>
          <th>교재명</th>
          <th>저자</th>
          <th>출판사</th>
          <th>출판년도</th>
          <th>ISBN</th>
          <th v-if="canEdit" class="row-action-col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(t, idx) in course.syllabus.textbooks" :key="idx">
          <td><input v-if="canEdit" v-model="t.type" type="text" /><span v-else>{{ t.type || '-' }}</span></td>
          <td><input v-if="canEdit" v-model="t.title" type="text" /><span v-else>{{ t.title || '-' }}</span></td>
          <td><input v-if="canEdit" v-model="t.author" type="text" /><span v-else>{{ t.author || '-' }}</span></td>
          <td><input v-if="canEdit" v-model="t.publisher" type="text" /><span v-else>{{ t.publisher || '-' }}</span></td>
          <td><input v-if="canEdit" v-model="t.year" type="text" /><span v-else>{{ t.year || '-' }}</span></td>
          <td><input v-if="canEdit" v-model="t.isbn" type="text" /><span v-else>{{ t.isbn || '-' }}</span></td>
          <td v-if="canEdit" class="row-action-col"><button type="button" class="btn-row-remove" @click="removeTextbook(idx)">삭제</button></td>
        </tr>
        <tr v-if="!course.syllabus.textbooks.length">
          <td colspan="6" class="empty-row">-</td>
          <td v-if="canEdit" class="row-action-col"></td>
        </tr>
      </tbody>
    </table>
    <button v-if="canEdit" type="button" class="btn-row-add" @click="addTextbook">+ 교재 행 추가</button>

    <table class="doc-table">
      <tbody>
        <tr>
          <th class="wide-label">주요 학습자 유의사항</th>
          <td>
            <textarea v-if="canEdit" v-model="course.syllabus.notes" rows="3" placeholder="유의사항을 입력하세요" />
            <p v-else class="readonly-text">{{ course.syllabus.notes || '-' }}</p>
          </td>
        </tr>
      </tbody>
    </table>

    <h2 class="doc-subtitle">주별계획</h2>
    <table class="doc-table week-table">
      <thead>
        <tr>
          <th>주차</th>
          <th>기간</th>
          <th>수업내용 및 학습활동</th>
          <th>비고</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="w in course.syllabus.weeklyPlan" :key="w.week">
          <td>{{ w.week }}주</td>
          <td><input v-if="canEdit" v-model="w.period" type="text" placeholder="YYYY-MM-DD ~ YYYY-MM-DD" /><span v-else>{{ w.period || '-' }}</span></td>
          <td><input v-if="canEdit" v-model="w.content" type="text" /><span v-else>{{ w.content || '-' }}</span></td>
          <td><input v-if="canEdit" v-model="w.remark" type="text" /><span v-else>{{ w.remark || '-' }}</span></td>
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
  position: absolute;
  top: 0;
  right: 0;
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

.doc-table th.group-th {
  width: 90px;
  text-align: center;
}

.doc-table th.section-caption,
.ratio-caption-row th {
  background: #e8e8e8;
  text-align: center;
  width: auto;
}

.doc-table thead th {
  text-align: center;
  width: auto;
}

.sub {
  font-weight: 400;
  font-size: 11px;
  color: #444;
}

.split-cell {
  display: flex;
  gap: 24px;
}

.split-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.split-label {
  font-weight: 700;
  font-size: 12px;
  white-space: nowrap;
}

.readonly-text {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.6;
}

.empty-row {
  text-align: center;
  color: #666;
}

.row-action-col {
  width: 60px;
  text-align: center;
}

.ratio-table td {
  text-align: center;
}

.doc-table input,
.doc-table textarea {
  width: 100%;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  color: #000;
  padding: 0;
}

.ratio-table input {
  text-align: center;
}

.doc-table input:focus,
.doc-table textarea:focus {
  outline: 1px dashed #000;
}

.doc-table textarea {
  resize: vertical;
  line-height: 1.6;
}

.btn-row-add {
  align-self: flex-start;
  border: 1px solid #000;
  background: #fff;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  margin: -8px 0 16px;
}

.btn-row-add:hover {
  background: #000;
  color: #fff;
}

.btn-row-remove {
  border: 1px solid #000;
  background: #fff;
  padding: 3px 8px;
  font-size: 11px;
}

.btn-row-remove:hover {
  background: #000;
  color: #fff;
}

.week-table td:nth-child(1) {
  text-align: center;
  width: 60px;
}

.policy-block p {
  font-size: 12px;
  color: #333;
  line-height: 1.7;
  margin: 0 0 4px;
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
  .split-cell {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
