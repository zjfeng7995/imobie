<template>
	<div class="home">
		<Xmind />
	</div>
</template>

<script>
import Xmind from '@/components/xMind.vue'

export default {
	name: 'Home',
	components: { Xmind }
}
</script>
<style lang="less" scoped>

.home{
	height: 100vh;
}
</style>