<script>
export default {
  name: 'BoardTable',
  props: {
    items: {
      type: Array,
      required: true
    },
    basePath: {
      type: String,
      required: true
    }
  }
}
</script>

<template>
  <table class="board-table">
    <thead>
      <tr>
        <th class="col-no">번호</th>
        <th class="col-title">제목</th>
        <th class="col-date">등록일</th>
        <th class="col-author">작성자</th>
        <th class="col-views">조회수</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in items" :key="row.id">
        <td class="col-no">
          <span v-if="row.notice" class="notice-badge">공지</span>
          <span v-else>{{ row.no }}</span>
        </td>
        <td class="col-title">
          <router-link :to="`${basePath}/${row.id}`" class="title-link">{{ row.title }}</router-link>
        </td>
        <td class="col-date">{{ row.date }}</td>
        <td class="col-author">{{ row.author }}</td>
        <td class="col-views">{{ row.views }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.board-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.board-table th {
  background: var(--bg-soft);
  padding: 12px 8px;
  border-bottom: 2px solid var(--color-text);
  font-weight: 700;
}

.board-table td {
  padding: 12px 8px;
  border-bottom: 1px solid var(--color-border);
  text-align: center;
}

.col-title {
  text-align: left;
}

.title-link {
  color: var(--color-text);
}

.title-link:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

.notice-badge {
  display: inline-block;
  background: var(--color-accent);
  color: #fff;
  font-size: 11px;
  border-radius: 999px;
  padding: 2px 8px;
}

@media (max-width: 768px) {
  .col-author,
  .col-views {
    display: none;
  }
}
</style>
