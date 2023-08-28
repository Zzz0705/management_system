<template>
    <div class="common-layout">
        <el-container class="lay-container">
            <common-aside />
            <el-container class="r-container">
                <common-header />
                <common-tab />
                <el-main class="right-main">
                    <!-- 路由显示的地方，使用router-view作为插槽 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import CommonHeader from '../components/commonHeader.vue';
import CommonAside from '../components/commonAside.vue';
import CommonTab from '../components/commonTab.vue';
export default {
    setup() {

    },

    components: {
        CommonHeader,
        CommonAside,
        CommonTab
    }
}
</script>

<style lang="less" scoped>
.el-container {
    display: flex;
    flex-wrap: wrap;
    align-items: start;
    height: 100%;
}


.common-layout {
    height: 100%;

    .lay-container {
        display: flex;
        flex-wrap: nowrap;

        .right-main {
            height: calc(100% - 124px);
        }
    }

    &>.el-container {
        height: 100%;

        &>.el-aside {
            height: 100%;
            background-color: #545c64;
        }
    }
}
</style>