<template>
    <template v-if="props.type === 'header'">
        <div class="flex-shrink-0 flex bg-[var(--background-gray)] w-full h-[50px] items-center border-b-[1px] border-solid border-[var(--divided-line)]">
            <SvgIcon name="list" :scale="1.5" class="ml-5 cursor-pointer lg:hidden" @click="handleClick" />
            <template v-if="props.img === ''">
                <pd-imgBox :scale="3.5" :src="pudhing" class="ml-5" />
            </template>
            <template v-else>
                <pd-imgBox :scale="3.5" :src="getImageSrc" class="ml-5" />
            </template>
            <span class="ml-2 font-bold">{{ props.name }}</span>
            <InlineButton class="absolute right-0 mr-20"/>
        </div>
    </template>
    <template v-if="props.type === 'sidebar'">
        <div class="flex-shrink-0 flex bg-[var(--background-gray)] w-full h-[50px] items-center border-b-[1px] border-solid border-[var(--divided-line)]">
            <pd-imgBox :scale="3.5" :src="pudhing" class="ml-5" />
            <span class="ml-2 font-bold">Pudhing</span>
        </div>
    </template>

</template>

<script setup lang="ts">
import pudhing from "@/assets/imgs/pudhing.png";
import { computed } from "vue";
import { processImg } from "@/utils/processImg";
import InlineButton from "./InlineButton.vue";
const props = withDefaults(defineProps<{
    name?: string,
    img?: string
    type?: string
}>(), {
    type: "header",
    img:""
});
/**
 * 向MainLayout组件传出true来修改侧边栏
*/
const emit = defineEmits(['click']);
const handleClick = () => {
    emit('click'); // 改为 'click' 事件
};
/**
 * 处理图片
*/
const getImageSrc = computed(() => {
    return processImg(props.img);
});

</script>

<style scoped></style>