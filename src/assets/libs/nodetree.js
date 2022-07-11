export default {
    id: 'root',
    topic: '主题',
    children: [
        {
            id: 'child1', // [必选] ID, 所有节点的ID不应有重复，否则ID重复的结节将被忽略
            topic: '节点 节点 节点1', // [必选] 节点上显示的内容
            direction: 'right', // [可选] 节点的方向，此数据仅在第一层节点上有效，目前仅支持 left 和 right 两种，默认为 right
            expanded: true, // [可选] 该节点是否是展开状态，默认为 true
            children: [
                { id: 'child1-1', topic: '节点 节点 节点' }
            ],
            bgColor: '#ffffff', // 背景色
        }, {
            id: 'child2',
            topic: '节点 节点 节点',
            direction: 'right',
            expanded: true,
            children: [
                { id: 'child2-1', topic: '节点 节点 节点' }
            ]
        }, {
            id: 'child3',
            topic: '节点 节点 节点',
            direction: 'right',
            expanded: true,
            children: [
                { id: 'child3-1', topic: '节点 节点 节点' }
            ]
        }, {
            id: 'child4',
            topic: '节点 节点 节点',
            direction: 'right',
            expanded: true,
            children: [
                { id: 'child4-1', topic: '节点 节点 节点' }
            ]
        }
    ]
}