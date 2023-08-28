<template>
  <el-header>
    <div class="l-content">
      <!-- 图标的展示 -->
      <el-button size="small" @click="handleCollapse">
        <el-icon :size="20">
          <Menu />
        </el-icon>
      </el-button>
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="current.path" v-if="current">
          {{ current.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img class="user" :src="getImgSrc('user')" alt="" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLoginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const getImgSrc = (user) => {
      return new URL(`../assets/${user}.png`, import.meta.url).href;
    };

    const handleCollapse = () => {
      // 调用vuex中的mutations
      store.commit("updateIsCollapse");
    };

    // 计算属性
    const current = computed(() => {
      return store.state.currentMenu;
    });

    const handleLoginOut = () => {
      store.commit("cleanMenu");
      router.push({
        name: "login",
      });
    };

    return {
      getImgSrc,
      handleCollapse,
      handleLoginOut,
      current,
    };
  },
};
</script>

<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: #333;
}

.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
  }

  h3 {
    color: #fff;
  }
}

:deep(.bread span) {
  color: #fff;
  cursor: pointer;
}
</style>
