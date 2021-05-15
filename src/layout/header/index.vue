<template>
  <div class="header-container">
    <el-row>
      <el-col :span="8">
        <ul class="list-unstyled bar left">
          <li><Hamburger /></li>
          <li><Breadcrumb /></li>
        </ul>
      </el-col>
      <el-col :span="16">
        <ul class="list-unstyled bar right">
          <li>
            <i class="el-icon-search" />
          </li>
          <li>
            <i class="el-icon-search" />
          </li>
          <li>
            <Avatar />
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Hamburger from './Hamburger.vue'
import Breadcrumb from './Breadcrumb.vue'
import Avatar from './Avatar.vue'

export default defineComponent({
  components: { Hamburger, Avatar, Breadcrumb }
})
</script>

<style lang="scss" scoped>
.header-container {
  height: $--header-height;
  line-height: $--header-height;
  overflow: hidden;
  position: relative;
  background: #fff;
  // box-shadow: $--box-shadow-light-small;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}

.bar {
  display: flex;
  margin: 0;
  padding: 0 15px 0 0;

  & li {
    display: flex;
    justify-content: center;
    align-items: center;
    height: $--header-height;
    line-height: $--header-height;
    cursor: pointer;
    &:not(:last-child):hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }

  &.left {
    justify-content: flex-start;
    align-items: flex-start;
    & li:last-child {
      padding: 0 15px;
    }
  }
  &.right {
    justify-content: flex-end;
    align-items: flex-end;
    & li {
      width: $--header-height;
    }
  }
}
</style>
