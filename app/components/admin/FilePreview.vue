<template>
	<!-- {{ props.file.file.type }} -->
	<component :is="props.tag" class="file-preview" v-if="props.file.file.type.split('/')[0] === 'image'">
		<button @click="$emit('remove', props.file)" class="close-icon">&times;</button>
		<img :src="props.file.url" :alt="props.file.file.name" :title="props.file.file.name"/>
		<span class="status-indicator loading-indicator" v-show="props.file.status == 'loading'">In Progress</span>
		<span class="status-indicator success-indicator" v-show="props.file.status == true">Uploaded</span>
		<span class="status-indicator failure-indicator" v-show="props.file.status == false">Error</span>
	</component>
	<component :is="props.tag" class="file-name" v-else>
		<span>{{props.file.file.name}}</span>
		<button @click="$emit('remove', props.file)" class="close-icon">&times;</button>
	</component>
</template>

<script setup>
const props = defineProps({
	file: { type: Object, required: true },
	tag: { type: String, default: 'li' },
	type: { type: String, required: true }
})

defineEmits(['remove'])
</script>

<style scoped lang="scss">
.file-preview {
	width: 150px;
	margin-right: 1rem;
	position: relative;
	aspect-ratio: 1/1;
	overflow: hidden;
	img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}
	.close-icon {
		width: var(--size);
		font-size: var(--size);
		background: rgb(34, 34, 34);
		color: #fff;
		top: 0.25rem;
		cursor: pointer;
	}
	.status-indicator {
		font-size: calc(0.75 * var(--size));
		bottom: 0.25rem;
		padding: 0 10px;
	}
	.loading-indicator {
		animation: pulse 1.5s linear 0s infinite;
		color: #000;
	}
	.success-indicator {
		background: #6c6;
		color: #040;
	}
	.failure-indicator {
		background: #933;
		color: #fff;
	}
}
.file-preview .close-icon,
.file-preview .status-indicator {
	--size: 20px;
	position: absolute;
	line-height: var(--size);
	height: var(--size);
	border-radius: var(--size);
	box-shadow: 0 0 5px currentColor;
	right: 0.25rem;
	appearance: none;
	border: 0;
	padding: 0;
}

.file-name {
	display: flex;
	margin-right: 1rem;
	position: relative;

	.close-icon {
		width: var(--size);
		font-size: var(--size);
		background: rgb(34, 34, 34);
		color: #fff;
		top: 0.15rem;
		cursor: pointer;
		--size: 20px;
		position: relative;
		line-height: var(--size);
		height: var(--size);
		border-radius: var(--size);
		box-shadow: 0 0 5px currentColor;
		right: 0.25rem;
		appearance: none;
		border: 0;
		padding: 0;
		margin-left: 1rem
	}
	.status-indicator {
		font-size: calc(0.75 * var(--size));
		bottom: 0.25rem;
		padding: 0 10px;
	}
	.loading-indicator {
		animation: pulse 1.5s linear 0s infinite;
		color: #000;
	}
	.success-indicator {
		background: #6c6;
		color: #040;
	}
	.failure-indicator {
		background: #933;
		color: #fff;
	}
}

</style>