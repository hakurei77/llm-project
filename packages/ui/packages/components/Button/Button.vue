<template>
    <div class="w-full pt-2.5 pb-2.5 pr-6 pl-6 cursor-text items-center justify-center flex" @click="focusTextarea">
        <div class="max-w-[800px] flex-1 rounded-xl p-3 shadow-sm transition-all duration-300 
                    focus-within:ring-2 focus-within:ring-[var(--pd-aaa)]" :style="{
                        backgroundColor: props.backgroundColor,
                        '--pd-aaa': props.primaryColor
                    }">
            <div class="pl-1.5 pr-1.5">
                <textarea ref="textarea" rows="1" placeholder="输入信息..."
                    class="w-full mt-[4px] max-h-[350px] overflow-y-auto resize-none bg-transparent outline-none placeholder-[var(--pd-aab)] text-sm"
                    :style="{
                        '--pd-aab': props.textColor,
                    }" v-model="textareaContent" @input="handleTextareaInput" @keydown.enter="handleKeydown" />
                <div v-if="attachments.length > 0" class="flex pt-[16px] overflow-x-auto scroll-smooth"
                    @wheel="handleHorizontalScroll">
                    <template v-for="(attachment, index) in attachments" :key="index">
                        <div v-if="attachment.type === 'image'"
                            class="w-[64px] h-[64px] relative rounded-xl mr-2 flex-shrink-0">
                            <img :src="attachment.preview" class="w-full h-full object-cover rounded-xl">
                            <div class="w-[24px] h-[24px] rounded-full absolute top-[-12px] right-[-12px] bg-white flex items-center justify-center cursor-pointer"
                                @click="removeAttachment(index)">
                                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <div v-else
                            class="h-[64px] relative mr-2 p-3 rounded-xl flex items-center border-solid border-[1px] border-[var(--pd-aac)] flex-shrink-0"
                            :style="{
                                '--pd-aac': props.lineColor,
                            }">
                            <div class="w-[24px] h-[24px] mr-2 flex items-center justify-center">
                                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" 
                                     stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                                     stroke-linejoin="round">
                                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                                    <path d="M13 2v7h7"/>
                                </svg>
                            </div>
                            <div class="flex flex-col">
                                <span>{{ attachment.name }}</span>
                                <span class="text-sm text-[var(--pd-aad)]" :style="{
                                    '--pd-aad': props.textColor,
                                }">文件 · {{ attachment.size
                                    }}</span>
                            </div>
                            <div class="w-[24px] h-[24px] rounded-full absolute top-[-12px] right-[-12px] bg-white flex items-center justify-center cursor-pointer"
                                @click="removeAttachment(index)">
                                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <div class="flex relative mt-[4px]">
                <div class="group relative">
                    <div class="w-[30px] h-[30px] rounded-full flex items-center justify-center hover:bg-[var(--pd-aae)] cursor-pointer"
                        :style="{
                            '--pd-aae': props.hoverColor,
                        }" @click="openFilePicker">
                        <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="black"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 5v14m-7-7h14" />
                        </svg>
                    </div>
                    <span
                        class="absolute bottom-[120%] left-1/2 -translate-x-1/2 mb-1 px-3 py-2 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap
                                 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-t-black after:border-x-transparent after:border-b-transparent">
                        选择附件
                    </span>
                    <input ref="fileInput" type="file" hidden multiple accept=".png , .jepg , .jpg , .webp"
                        @change="handleFileSelect">
                </div>
                <div class="flex items-center absolute right-0">
                    <span class="text-xs text-[var(--pd-aaf)] mr-2" :style="{
                        '--pd-aaf': props.textColor,
                    }">Enter 发送 · Ctrl+Enter 换行</span>
                    <template v-if="props.isLoading">
                        <div class="w-[30px] h-[30px] flex items-center justify-center">
                            <div class="w-[70%] h-[70%] border-2 border-[var(--pd-aag)] border-t-transparent rounded-full animate-spin"
                                :style="{
                                    '--pd-aag': props.primaryColor,
                                }">
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div v-if="textareaContent.trim() !== '' || attachments.length > 0"
                            class="w-[30px] h-[30px] rounded-full flex items-center justify-center bg-[var(--pd-aah)] cursor-pointer"
                            :style="{
                                '--pd-aah': props.primaryColor,
                            }" @click="handleSubmit">
                            <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="white"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14m-7-7l7 7l-7 7" />
                            </svg>
                        </div>
                        <div v-else
                            class="w-[30px] h-[30px] rounded-full flex items-center justify-center cursor-not-allowed">
                            <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" :stroke="props.textColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14m-7-7l7 7l-7 7" />
                            </svg>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, nextTick } from 'vue';
defineOptions({
    name: 'PdButton'
})
const props = withDefaults(defineProps<{
    isLoading?: boolean;
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    lineColor?: string;
    hoverColor?: string;
}>(), {
    isLoading: false,
    primaryColor: "var(--pd-primary-color)",
    backgroundColor: "var(--pd-submit-background-color)",
    textColor: "var(--pd-submit-background-test-color)",
    lineColor: "var(--pd-submit-divided-line-color)",
    hoverColor: "var(--pd-submit-hover-color)",
});
interface Attachment {  // 附件类型
    file: File;
    type: 'image' | 'file';
    name: string;
    size: string;
    base64: string;
    preview?: string;
}
const attachments = ref<Attachment[]>([]);  // 附件列表
const textareaContent = ref('');        //文本信息
// ======================
// 页面交互
// ======================
//控制滚动条横向滑动
const handleHorizontalScroll = (e: WheelEvent) => {
    e.preventDefault();
    const container = e.currentTarget as HTMLElement;
    if (!(container instanceof HTMLElement)) return;
    container.scrollLeft += e.deltaY;
};
//文本聚焦
const textarea = ref<HTMLTextAreaElement | null>(null); //文本域，用来控制输入框聚焦
const focusTextarea = () => {
    textarea.value?.focus();
};
// 文本域高度自适应
const handleTextareaInput = () => {
    if (!textarea.value) return;
    textarea.value.style.height = 'auto';
    const newHeight = Math.min(textarea.value.scrollHeight, 350);
    textarea.value.style.height = `${newHeight}px`;
};
// 打开文件
const fileInput = ref<HTMLInputElement | null>(null);   //文件选择器（支持多选）
const openFilePicker = () => {
    fileInput.value?.click();
};
//键盘换行控制
const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        // 处理 Ctrl+Enter 或 Cmd+Enter（Mac）
        if (e.ctrlKey || e.metaKey) {
            // 手动插入换行并更新内容
            const textarea = e.target as HTMLTextAreaElement;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            textareaContent.value = textareaContent.value.substring(0, start) + '\n' + textareaContent.value.substring(end);
            // 更新光标位置
            nextTick(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 1;
                handleTextareaInput();  // 触发高度调整
            });
        } else {
            e.preventDefault();
            if (textareaContent.value.trim() !== '' || attachments.value.length > 0) {
                handleSubmit();
            }
        }
    }
};
// ======================
// 主要逻辑
// ======================
// 选择文件
const handleFileSelect = async (e: Event) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;
    Array.from(files).forEach(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
            alert(`文件 ${file.name}  太大了，最大支持 ${formatFileSize(MAX_FILE_SIZE)}!`);
            return;
        }
        try {
            const base64 = await converTtoBase64(file);
            const type = file.type.startsWith('image/') ? 'image' : 'file';
            const attachment: Attachment = {
                file,
                type,
                name: file.name,
                size: formatFileSize(file.size),
                base64: base64
            };
            if (type === 'image') {
                attachment.preview = URL.createObjectURL(file);
            }
            attachments.value.push(attachment);
        } catch (error) {
            alert('Error  converting file:' + error);
        }
    });
};
// 格式化文件大小
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
// 将文件转换为base64
const converTtoBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64 = reader.result as string;
            if (base64) {
                resolve(base64);
            } else {
                reject(new Error('Failed to convert file to base64'));
            }
        };
        reader.onerror = () => {
            reject(new Error('Failed to convert file to base64'));
        };
    });
};
// 删除附件
const removeAttachment = (index: number) => {
    const [removed] = attachments.value.splice(index, 1);
    if (removed.preview) {
        URL.revokeObjectURL(removed.preview);
    }
};
// 清理预览URL
onBeforeUnmount(() => {
    attachments.value.forEach(attachment => {
        if (attachment.preview) {
            URL.revokeObjectURL(attachment.preview);
        }
    });
});
// ======================
// 核心逻辑
// ======================
const emit = defineEmits<{
    click: [{ text: string, attachments: Attachment[] }]
}>();

const handleSubmit = () => {
    emit('click', {
        text: textareaContent.value,
        attachments: attachments.value
    });
    // 提交后重置表单
    dataInit();
};
// 提交表单
// const isLoading = ref(false); // 加载状态
// const handleSubmit = async () => {
//     if (textareaContent.value.trim() === '' && attachments.value.length === 0) {
//         alert('不可提交空内容');
//         return;
//     }
//     isLoading.value = true;
//     formDataStore.value = {
//         text: textareaContent.value,
//         file: attachments.value
//     };
//     formDataStore.changeDataFormat();
//     dataInit();
//     const sendData = JSON.parse(JSON.stringify(formDataStore.submitData));
//     router.push('/chat/'+ assistantDataStore.currentId);
//     sendFormDataApi({
//         assistantId:assistantDataStore.currentId,
//         data:sendData
//     });
//     isLoading.value = false;
// };
// ======================
// 全局逻辑
// ======================
//  表单数据重置
const dataInit = () => {
    if (textarea.value) {
        textarea.value.style.height = 'auto';
    }
    textareaContent.value = '';
    attachments.value = [];
};
</script>
<style scoped></style>