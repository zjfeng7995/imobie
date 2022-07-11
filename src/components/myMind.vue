<template>
    <div class="brain_content">
        <js-mind class="js_mind" :options="options" :values="mind" v-show="isShow" ref="jsMind" height="100%"></js-mind>
    </div>
</template>
 
<script>
import Vue from 'vue'
import jm from "vue-jsmind"
import '@AST/libs/jsmind.menu.js'
import nodeData from '@AST/libs/nodetree.js'
import 'vue-jsmind/src/components/JsMind/jsmind.css'
import iconDelete from '@AST/icons/delete.png'
import iconEdit from '@AST/icons/edit.png'
import iconNodeChild from '@AST/icons/node-child.png'
import iconNode from '@AST/icons/node.png'
import iconMessage from '@AST/icons/message.png'
import iconTriangle from '@AST/icons/triangle.png'

Vue.use(jm)
if (window.jsMind) {
    Vue.prototype.jsMind = window.jsMind
}
export default {
    data() {
        return {
            drawer: false,
            direction: 'rtl',
            theme_value: '',
            mind: {
                meta: {/* 元数据，定义思维导图的名称、作者、版本等信息 */
                    name: 'imobie',
                    author: 'zjfeng16@163.com',
                    version: '0.2'
                },
                format: 'node_tree',
                data: nodeData
            },
            options: {
                container: 'jsmind_container', // [必选] 容器的ID
                editable: false, // [可选] 是否启用编辑
                theme: 'imobie', // [可选] 主题
                support_html: true,    // 是否支持节点里的HTML元素
                view: {
                    engine: 'svg',   // 思维导图各节点之间线条的绘制引擎
                    hmargin: 100,        // 思维导图距容器外框的最小水平距离
                    vmargin: 50,         // 思维导图距容器外框的最小垂直距离
                    line_width: 2,       // 思维导图线条的粗细
                    line_color: '#3e3e3e',   // 思维导图线条的颜色
                },
                layout: {
                    hspace: 70,          // 节点之间的水平间距
                    vspace: 110,          // 节点之间的垂直间距
                    pspace: 0           // 节点与连接线之间的水平间距（用于容纳节点收缩/展开控制器）
                },
                menuOpts: {
                    showMenu: true,
                    injectionList: [
                        {
                            target: 'addBrother', text: '添加兄弟节点', icon: iconNode,
                            callback: function (node) {
                                console.log(node)
                            }
                        },
                        {
                            target: 'addChild', text: '添加子节点', icon: iconNodeChild,
                            callback: function (node) {
                                console.log(node)
                            }
                        },
                        {
                            target: 'edit', text: '编辑节点', icon: '', icon: iconEdit,
                            callback: function (node) {
                                console.log(node)
                            }
                        },
                        {
                            target: 'delete', text: '删除节点', icon: iconDelete,
                            callback: function (node, next) {
                                console.log(node)
                                console.log(next)
                            }
                        },
                        {
                            target: 'setBgColor', text: '设置主题色', icon: iconTriangle,
                            callback: function (node, next) {
                                console.log(node)
                                console.log(next)
                            }
                        }
                    ],
                },
            },
            isShow: true,
            isLoad: false,
        }
    },
    methods: {
        // 获取选中标签的 ID
        get_selected_nodeid() {
            var selectedNode = this.jm.get_selected_node()
            if (selectedNode) {
                return selectedNode.id
            } else {
                return null
            }
        }
    },
    mounted() {
        // 阻止浏览器默认右键事件
        document.oncontextmenu = function () {
            return false;
        };
        this.jm = this.$refs.jsMind.jm
        this.jm.enable_edit()
    },
}
</script>
 
<style lang="less" scoped>
.brain_content {
    background: #fafafa;
    height: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;

    .js_mind {
        flex: 1;

        /deep/ svg {
            position: absolute;
        }
    }
}
</style>