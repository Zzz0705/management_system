<template>
    <div class="tags">
        <el-tag v-for="(tag, index) in tags" :key="index" :closable="tag.name !== 'home'" :disable-transitions="false"
            :effect="$route.name === tag.name ? 'dark' : 'plain'" @click="changeMenu(tag)" @close="handleClose(tag, index)">
            {{ tag.label }}
        </el-tag>
    </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { useStore } from 'vuex';
export default {
    setup() {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()

        const tags = store.state.tabsList;
        const changeMenu = (item) => {
            router.push({
                name: item.name
            })
        }

        const handleClose = (tag, index) => {
            let length = tags.length - 1;

            // 处理vuex中的tabList
            store.commit('closeTab', tag)

            // 如果删除的和当前的 tab 不一样，则直接删除
            if (tag.name !== route.name) {
                return;
            } else if (index === length) {
                router.push({
                    name: tags[index - 1].name
                })
            } else {
                router.push({
                    name: tags[index].name
                })
            }
        }

        return {
            tags,
            changeMenu,
            handleClose
        }

    }
}
</script>

<style lang="less" scoped>
.tags {
    padding: 10px;
    width: 100%;

    .el-tag {
        cursor: pointer;
        margin-right: 15px;
    }
}
</style>