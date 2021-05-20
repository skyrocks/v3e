<template>
  <el-popover
    v-model:visible="visible"
    :placement="placement"
    :width="150"
    popper-class="popover-search"
    trigger="click"
  >
    <template #reference>
      <span class="icon-wrap"><i class="el-icon-search"></i></span>
    </template>
    <div>
      <el-input v-model="modelValue" size="mini" style="padding: 10px" @keyup.enter="handleSearch"></el-input>
      <div class="split-line">
        <el-button class="filter-button" type="text" :disabled="modelValue === ''" @click="handleSearch"
          >搜索</el-button
        >
        <el-button class="filter-button" type="text" @click="handleSearchReset">重置</el-button>
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { ElPopover, ElLink } from 'element-plus'

export default defineComponent({
  components: { [ElPopover.name]: ElPopover, [ElLink.name]: ElLink },
  props: {
    prop: {
      type: String,
      require: true,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'bottom'
    }
  },
  emits: ['search', 'update:value'],
  setup(props, { emit }) {
    const visible = ref(false)

    const modelValue = computed({
      get: () => props.value,
      set: val => emit('update:value', val)
    })

    const handleSearch = () => {
      visible.value = false
      emit('search', { prop: props.prop })
    }
    const handleSearchReset = () => {
      visible.value = false
      modelValue.value = ''
      emit('search', { prop: props.prop })
    }

    return { modelValue, visible, handleSearch, handleSearchReset }
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
.icon-wrap {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: flex-end;
  -ms-flex-align: flex-end;
  align-items: flex-end;
  height: 14px;
  width: 20px;
  vertical-align: middle;
  cursor: pointer;
  overflow: initial;
  position: relative;
  i {
    color: $--color-text-placeholder;
  }
}
</style>
