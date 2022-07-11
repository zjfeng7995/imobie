<template>
	<div class="container">
		<div id="myMind" ref="myMind"></div>
	</div>
</template>

<script>
import 'jsmind/style/jsmind.css'
import jsmind from 'jsmind'
require('jsmind/js/jsmind.draggable.js')
export default {
	name: "",
	data() {
		return {
			jm: null
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			var mind = {
				/* 元数据，定义思维导图的名称、作者、版本等信息 */
				meta: {
					name: 'jsMind_demo',
					author: 'zjfeng16@163.com',
					version: '0.2',
				},
				/* 数据格式声明 */
				format: 'node_tree',
				data: {
					id: 'root',
					topic: 'Easy',
					children: [
						{
							id: 'easy',
							topic: 'Easy',
							direction: 'left',
							expanded: false,
							children: [
								{ id: 'easy1', topic: 'Easy to show' },
								{ id: 'easy2', topic: 'Easy to edit' },
								{ id: 'easy3', topic: 'Easy to store' },
								{ id: 'easy4', topic: 'Easy to embed' },
							]
						}, {
							id: 'open',
							topic: 'Open Source',
							direction: 'right',
							extended: true,
							children: [
								{ id: 'open1', topic: 'on GitHub' },
								{ id: 'open2', topic: 'BSD License' },
							]
						}
					]
				}
			};
			var options = {
				container: 'myMind',
				theme: 'greensea',
				editable: true,
			};
			this.jm = new jsmind(options);
			this.jm.show(mind);
		}
	}
}
</script>
<style lang="less" scoped>
.container {
	height: 100vh;

	#myMind {
		height: 500px;
	}
}
</style>