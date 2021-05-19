<template>
  <el-popover placement="bottom" :width="150" popper-class="popover-search" trigger="click">
    <template #reference>
      <i class="el-icon-search" style="color: #c0c4cc"></i>
    </template>
    <div>
      <el-input size="mini" v-model="search" style="padding: 10px"></el-input>
      <div class="split-line">
        <el-button class="filter-button" type="text" :disabled="search === ''" @click="handleSearch">搜索</el-button>
        <el-button class="filter-button" type="text" @click="handleSearchReset">重置</el-button>
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElPopover, ElLink } from 'element-plus'

export default defineComponent({
  props: {
    prop: {
      type: String,
      require: true
    }
  },
  emits: ['search'],
  components: { [ElPopover.name]: ElPopover, [ElLink.name]: ElLink },
  setup(props, { emit }) {
    const search = ref('')
    const handleSearch = () => {
      emit('search', { prop: props.prop, value: search.value })
    }
    const handleSearchReset = () => {
      search.value = ''
    }

    return { search, handleSearch, handleSearchReset }
  }
})
</script>

<style lang="scss" scoped>
.filter-button {
  background: transparent;
  border: none;
  color: #606266;
  cursor: pointer;
  font-size: 13px;
  padding: 0 3px;
  min-height: 18px;
  &[disabled] {
    color: #c0c4cc;
    cursor: not-allowed;
  }
  &:hover {
    color: $--color-text-link;
  }
  &[disabled]:hover {
    color: #c0c4cc;
  }

  & + .filter-button {
    margin-left: 3px;
  }
}
.split-line {
  border-top: 1px solid #ebeef5;
  padding: 8px;
}
::v-deep(.el-link) {
  &.el-link--inner:hover {
    text-decoration: none !important;
  }
}
</style>
