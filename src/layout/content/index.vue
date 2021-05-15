<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition name="zoom-fade" mode="out-in" appear>
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
