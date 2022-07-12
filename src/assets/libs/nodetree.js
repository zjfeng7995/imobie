let nodeData = {
    id: 'root',
    topic: '主题',
    bgColor: '#2c67ff', // 背景色
    children: [
        {
            id: 'child1', // [必选] ID, 所有节点的ID不应有重复，否则ID重复的结节将被忽略
            topic: '节点 节点 节点', // [必选] 节点上显示的内容
            direction: 'right', // [可选] 节点的方向，此数据仅在第一层节点上有效，目前仅支持 left 和 right 两种，默认为 right
            expanded: true, // [可选] 该节点是否是展开状态，默认为 true
            children: [],
            bgColor: '#3bba54', // 背景色
        }, {
            id: 'child2',
            topic: '节点 节点 节点',
            direction: 'right',
            expanded: true,
            children: [
                { id: 'child2-1', topic: `<div class="node_detail"><span class="pic el-icon-picture-outline"></span> <p>节点 节点 节点</p><p><span>2022/05/15</span><span class="icon"></span>3</p></div>` },
                { id: 'child2-2', topic: `<div class="node_detail"><span class="pic el-icon-picture-outline"></span> <p>节点 节点 节点</p><p><span>2022/05/15</span><span class="icon"></span>3</p></div>` }
            ],
            bgColor: '#3bba54', // 背景色
        }
    ]
}
for (let i = 0; i < 2; i++) {
    nodeData.children[0].children.push({ id: `child1-${i + 1}`, topic: '节点 节点 节点' })
}
export default nodeData;