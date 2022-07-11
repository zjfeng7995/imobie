<template>
    <div class="app-container">
        <div class="header">
            <div style="float: right;margin: 10px 20px 0px 0px;display:inline-block;">
                <el-button type="primary" class="noimpor-btn" @click="addNode"><i class="el-icon-plus"></i> 添加节点
                </el-button>
                <el-button type="primary" class="noimpor-btn" @click="editNode"><i class="el-icon-edit"></i> 编辑节点
                </el-button>
                <el-button type="primary" class="noimpor-btn" @click="onRemoveNode"><i class="el-icon-minus"></i> 删除节点
                </el-button>
                <el-divider direction="vertical"></el-divider>
            </div>
        </div>
        <js-mind :values="mind" :options="options" ref="jsMind" :height="mindHeight"></js-mind>
        <el-dialog title="编辑节点" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
            <el-form ref="nodeForm" :model="nodeOption" :rules="rules" label-width="80px">
                <el-form-item label="节点名称" prop="targetName">
                    <el-input v-model="nodeOption.targetName" style="width: 60%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" class="common-btn" @click="sureEditNode('nodeForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import 'jsmind/style/jsmind.css'
import jsMind from 'jsmind'
import nodeData from '@/assets/libs/nodetree.js'
import Xmind from '@/components/Xmind.vue'
require('jsmind/js/jsmind.draggable.js')
export default {
    name: 'targetConfig',
    data() {
        return {
            tableDisabled: false,
            tablePage: 0,
            tableOptions: [],
            optionTotal: 0,
            dialogVisible: false,
            nodeOption: {
                order: '',
                connect: '',
                targetName: ""
            },
            defaultTableList: [],
            rules: {
                targetName: [
                    { required: true, message: '请输入目录名称', trigger: 'blur' },
                ],
                order: [
                    { required: true, message: '顺序不能为空', trigger: 'blur' },
                ],
            },
            theme_value: '',
            mindHeight: 'calc(100vh - 127px)',
            themOptions: ['primary', 'warning', 'danger', 'success', 'info', 'greensea', 'nephrite', 'belizehole', 'wisteria', 'asphalt', 'orange', 'pumpkin', 'pomegranate', 'clouds', 'asbestos'],
            mind: {
                meta: {
                    name: 'jsMind remote',
                    author: 'hizzgdev@163.com',
                    version: '0.2'
                },
                format: 'node_tree',
                data: {
                    id: "0",
                    topic: "根目录",
                    children: []
                }
            },
            options: {
                container: 'jsmind_container', // [必选] 容器的ID
                shortcut: { //禁用快捷键
                    enable: false
                },
                editable: false, // [可选] 是否启用编辑
                theme: 'info' // [可选] 主题
            },
            formData: {
                id: '',
                mindCode: '',
                mindName: '',
                mindType: '',
                mindData: '',
                mindOptions: ''
            },
            mindOptions: {
                theme: ''
            },
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            color: 'rgba(255, 69, 0, 0.68)',
        }
    },
    mounted() {
        this.jm = this.$refs.jsMind.jm
        this.jm.enable_edit()
        this.jm.enable_event_handle('dblclick')
        this.getMind()
        let that = this
        Object.defineProperties(jsMind.dragObj, { //拖拽完成事件
            target_direct: {
                configurable: true,
                set: function (newValue) {
                    let target_direct = newValue;
                    that.moveHandle(target_direct)
                }
            },
        });
        Object.defineProperties(jsMind.dragObj, { //点击事件
            edit_value: {
                configurable: true,
                set: function (newValue) {
                    that.$nextTick(() => {
                        that.dblclickEditHandle(newValue)
                    })
                }
            }
        })
    },
    methods: {
        dblclickEditHandle() {
            this.getMind()
        },
        getMind() {
            console.log('zjfng', JSON.parse(JSON.stringify(nodeData)));
            this.mind.data = nodeData;
            this.jm.show(this.mind)
        },
        moveHandle() {

        },
        // 新增节点
        addNode() {
            let selectedNode = this.jm.get_selected_node() // as parent of new node
            if (!selectedNode) {
                this.$message({
                    type: 'warning',
                    message: '请先选择一个节点!'
                })
                return
            }
            let nodeid = this.jsMind.util.uuid.newid()
            let topic = '新增节点'
            this.jm.add_node(selectedNode, nodeid, topic)
        },
        // 重置
        resetForm() {
            this.nodeOption = {
                targetName: '',
                order: null,
                connect: null
            }
            setTimeout(() => {
                if (this.$refs.nodeForm) {
                    this.$refs.nodeForm.clearValidate()
                }
            }, 300)
            this.tablePage = 0
        },
        // 编辑节点
        editNode() {
            let selectedId = this.get_selected_nodeid()
            if (!selectedId) {
                this.$message({
                    type: 'warning',
                    message: '请先选择一个节点!'
                })
                return
            }
            this.resetForm()
        },
        sureEditNode(formName) {
            let selectedId = this.get_selected_nodeid()
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    setTimeout(() => {
                        this.dialogVisible = false
                        this.getMind()
                        this.jm.update_node(selectedId, this.nodeOption.content)
                        this.jm.set_node_font_style(selectedId, this.nodeOption.fontSize, this.nodeOption.fontWeight, this.nodeOption.fontStyle)
                        this.jm.set_node_color(selectedId, this.nodeOption.bgColor, this.nodeOption.fontColor)
                        this.nodeOption = {
                            content: '',
                            bgColor: '',
                            fontColor: '',
                            fontSize: '',
                            fontWeight: '',
                            fontStyle: ''
                        }
                        this.$refs.nodeForm.resetFields()
                    }, 500);
                }
            })
        },
        // 删除节点
        onRemoveNode() {
            let selectedId = this.get_selected_nodeid()
            if (!selectedId) {
                this.$message({
                    type: 'warning',
                    message: '请先选择一个节点!'
                })
                return
            }
            // let selectedNode = this.jm.get_selected_node()
            this.$confirm('确定删除此节点吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.jm.remove_node(selectedId)
                this.getMind()
                this.$message({
                    type: "success",
                    message: "已删除"
                })
            })
        },
        // 选择主题颜色
        set_theme() {
            this.jm.set_theme(this.theme_value)
        },
        // 获取选中标签的 ID
        get_selected_nodeid() {
            let selectedNode = this.jm.get_selected_node()
            if (selectedNode) {
                return selectedNode.id
            } else {
                return null
            }
        },
    },
    components: { jsMind: Xmind }
}
</script>

<style rel="stylesheet/scss" lang="less" scoped>
.app-container {
    padding: 0;

    .header {
        height: 60px;
        background-color: #eee;
        border-bottom: solid 1px #aaa;
        z-index: 100;
    }
}
</style>

