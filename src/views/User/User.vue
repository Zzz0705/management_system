<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd()">+新增</el-button>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="">
                <el-input v-model="formInline.keyword" placeholder="请输入用户名" clearable />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <el-table :data="list" style="width: 100%" height="500px
        ">
            <el-table-column v-for="item in tableLabel" :key="item.id" :label="item.label" :prop="item.prop"
                :width="item.width ? item.width : 125" />
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination small background layout="prev, pager, next" :total="config.total" class="pager mt-4"
            @current-change="changPage" />
    </div>
    <el-dialog v-model="dialogVisible" :title="action == 'add' ? '新增用户' : '编辑用户'" width="60%" :before-close="handleClose">
        <el-form :inline="true" :model="formUser" ref="userForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="姓名" prop="name" :rules="[
                        {
                            required: true,
                            message: '姓名是必填项',
                        },
                    ]">
                        <el-input v-model="formUser.name" placeholder="请输入姓名" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="年龄" prop="age" :rules="[
                        {
                            required: true,
                            message: '年龄是必填项',
                        },
                        {
                            type: 'number',
                            message: '必须填入数字',
                        },
                    ]">
                        <el-input v-model.number="formUser.age" placeholder="请输入年龄" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="性别" prop="sex" :rules="[
                        {
                            required: true,
                            message: '性别是必选项',
                        },
                    ]">
                        <el-select v-model="formUser.sex" placeholder="请选择" clearable>
                            <el-option label="男" value="1" />
                            <el-option label="女" value="0" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出生日期" prop="birth" :rules="[
                        {
                            required: true,
                            message: '出生日期是必选项',
                        },
                    ]">
                        <el-date-picker v-model="formUser.birth" type="date" label="出生日期" placeholder="请输入" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="地址" prop="addr" :rules="[
                    {
                        required: true,
                        message: '地址是必选项',
                    },
                ]">
                    <el-input v-model="formUser.addr" label="地址" placeholder="请输入地址" clearable />
                </el-form-item>
            </el-row>
            <el-row style="justify-content: flex-end">
                <el-form-item>
                    <el-button type="onSubmit" @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="onSubmit"> 确定 </el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { format, number } from "echarts";
export default {
    name: "user",
    setup() {
        const { proxy } = getCurrentInstance();
        const config = reactive({
            total: 0,
            page: 1,
            name: "",
        });

        const formInline = reactive({
            keyword: "",
        });

        // 控制模态框的继承和隐藏
        const dialogVisible = ref(false);

        // 添加用户的 form 数据
        const formUser = reactive({
            name: "", // 添加用户名
            age: "", // 添加年龄
            sex: "", // 添加性别，
            birth: "", // 添加出生日期
            addr: "", // 添加用户的地址
        });

        const timeFormat = (val) => {
            var time = new Date(val);
            var year = time.getFullYear();
            var month = time.getMonth() + 1;
            var date = time.getDate();
            function add(m) {
                return m < 10 ? "0" + m : m;
            }
            return year + "-" + add(month) + "-" + add(date);
        };

        const list = ref([]);
        const tableLabel = reactive([
            {
                prop: "name",
                label: "姓名",
            },
            {
                prop: "age",
                label: "年龄",
            },
            {
                prop: "sexLabel",
                label: "性别",
            },
            {
                prop: "birth",
                label: "出生日期",
                width: 200,
            },
            {
                prop: "addr",
                label: "地址",
                width: 320,
            },
        ]);

        const getUserData = async (config) => {
            let res = await proxy.$api.getUserData(config);
            list.value = res.list.map((item) => {
                item.sexLabel = item.sex == 0 ? "女" : "男";
                return item;
            });
            config.total = res.count;
        };

        const changPage = (page) => {
            config.page = page;
            // 更新后的 config 传入getUserData中重新更新一下
            getUserData(config);
        };

        const handleSearch = () => {
            config.name = formInline.keyword;
            getUserData(config);
        };

        const handleClose = (done) => {
            ElMessageBox.confirm("确定关闭吗？")
                .then(() => {
                    proxy.$refs.userForm.resetFields()
                    done();
                })
                .catch(() => {
                    // catch error
                });
        };

        // 添加用户
        const onSubmit = () => {
            proxy.$refs.userForm.validate(async (vaild) => {
                if (vaild) {
                    if (action.value == "add") {
                        // 新增接口
                        formUser.birth = timeFormat(formUser.birth);
                        let res = await proxy.$api.addUser(formUser);
                        if (res) {
                            proxy.$refs.userForm.resetFields();
                            dialogVisible.value = false;
                            getUserData(config);
                        }
                    } else {
                        // 编辑接口
                        formUser.sex == "男" ? (formUser.sex = 1) : (formUser.sex = 0);
                        let res = await proxy.$api.editUser(formUser);
                        if (res) {
                            proxy.$refs.userForm.resetFields();
                            dialogVisible.value = false;
                            getUserData(config);
                        }
                    }
                } else {
                    ElMessage({
                        showClose: true,
                        message: "请输入内容",
                        type: "error",
                    });
                }
            });
        };

        // 区分编辑或者新增
        const action = ref("add");

        // 编辑用户
        const handleEdit = (row) => {
            // 浅拷贝
            action.value = "edit";
            dialogVisible.value = true;
            console.log(formUser);
            row.sex == 0 ? (row.sex = "女") : (row.sex = "男");
            proxy.$nextTick(() => {
                Object.assign(formUser, row);
            });
        };

        // 添加用户
        const handleAdd = () => {
            action.value = "add";
            dialogVisible.value = true;
        };

        // 删除用户
        const handleDelete = (row) => {
            ElMessageBox.confirm("确定删除吗？")
                .then(async () => {
                    await proxy.$api.deleteUser({
                        id: row.id
                    })

                    ElMessage({
                        showClose: true,
                        message: '删除成功',
                        type: 'success'
                    })

                    getUserData(config)
                })
                .catch(() => {
                    // catch error
                });
        }

        onMounted(() => {
            getUserData(config);
        });

        return {
            list,
            tableLabel,
            config,
            formInline,
            dialogVisible,
            formUser,
            action,
            changPage,
            handleSearch,
            handleClose,
            onSubmit,
            handleEdit,
            handleAdd,
            handleDelete
        };
    },
};
</script>
<style lang="less" scoped>
.table {
    position: relative;
    height: 520px;

    .pager {
        position: absolute;
        right: 50%;
        transform: translate(50%, 0);
        bottom: -20px;
    }
}

.user-header {
    display: flex;
    justify-content: space-between;
}
</style>