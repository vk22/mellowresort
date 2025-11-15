<template>
  <div class="tiptap-container">
    <div v-if="editor" class="tiptap-tools">
      <button class="tiptap-btn" @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        Bold
      </button>
      <button class="tiptap-btn" @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }">
        Italic
      </button>
      <button class="tiptap-btn" @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }">
        Strike
      </button>
      <button class="tiptap-btn" @click="editor.chain().focus().setParagraph().run()"
        :class="{ 'is-active': editor.isActive('paragraph') }">
        Paragraph
      </button>
      <button class="tiptap-btn" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        H1
      </button>
      <button class="tiptap-btn" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
        H2
      </button>
      <button class="tiptap-btn" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
        H3
      </button>
      <button class="tiptap-btn" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
        H4
      </button>
      <button class="tiptap-btn" @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }">
        Bullet list
      </button>
      <button class="tiptap-btn" @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }">
        Ordered list
      </button>
      <button class="tiptap-btn" @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }">
        Blockquote
      </button>
      <button class="tiptap-btn" @click="editor.chain().focus().setHorizontalRule().run()">
        Horizontal rule
      </button>
      <button class="tiptap-btn" @click="editor.chain().focus().setHardBreak().run()">
        Hard break
      </button>
      <button class="tiptap-btn" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
        Undo
      </button>
      <button class="tiptap-btn" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
        Redo
      </button>
      <button class="tiptap-btn" @click="addImage">Add image from URL</button>
      <button class="tiptap-btn" @click="setLink" :class="{ 'is-active': editor.isActive('link') }">
          Set link
      </button>
      <button class="tiptap-btn" @click="addYoutubeVideo" :class="{ 'is-active': editor.isActive('link') }">
          Add YouTube video
      </button>
    </div>
    <TiptapEditorContent :editor="editor" class="textarea"/>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
// const CustomYoutube = Youtube.extend({
//   renderHTML({ HTMLAttributes }) {
//     return [
//       'div',
//       { class: 'youtube-container' },
//       [
//         'iframe',
//         {
//           ...HTMLAttributes,
//           allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
//           allowfullscreen: 'true',
//         },
//       ],
//     ]
//   },
// })
// import CustomYoutube from '@/compositions/tiptapCustomYoutube';
const props = defineProps({
  modelValue: String
})
const emit = defineEmits({
  'update:modelValue': String
})

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    TiptapStarterKit, 
    Image, 
    Link,
    Youtube.configure({
      controls: true,
      nocookie: true,
    }),
  ],
  onUpdate: () => {
        // HTML
        emit('update:modelValue', editor.value.getHTML())

        // JSON
        // this.$emit('update:modelValue', this.editor.getJSON())
      },
});

const addImage = () => {
  const url = window.prompt('URL')
  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

const setLink = () => {
      const previousUrl = editor.value.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)
      // cancelled
      if (url === null) {
        return
      }
      // empty
      if (url === '') {
        editor.value
          .chain()
          .focus()
          .extendMarkRange('link')
          .unsetLink()
          .run()

        return
      }
      // update link
      editor.value
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
}

function getYouTubeEmbedUrl(inputUrl) {
  try {
    const url = new URL(inputUrl)

    // Поддержка стандартного вида: https://www.youtube.com/watch?v=...
    if (url.hostname.includes('youtube.com') && url.pathname === '/watch') {
      const videoId = url.searchParams.get('v')
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    }

    // Поддержка короткого вида: https://youtu.be/...
    if (url.hostname === 'youtu.be') {
      const videoId = url.pathname.split('/')[1]
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    }

    // Поддержка embed-ссылок (оставляем как есть)
    if (url.hostname.includes('youtube.com') && url.pathname.startsWith('/embed/')) {
      return inputUrl
    }

    return null
  } catch (e) {
    return null
  }
}

const addYoutubeVideo = () => {
    const url = window.prompt('Enter YouTube URL')
    const embedUrl = getYouTubeEmbedUrl(url)
    editor.value.commands.setYoutubeVideo({
      src: embedUrl,
      width: '100%',
      height: 480,
    })
}

// const insertContent = () => {
//   editor.value.commands.insertContent('<h1>Example Text</h1>')
// }

onBeforeUnmount(() => {
  unref(editor).destroy();
});

watch(() => props.modelValue, (value) => {
  const isSame = editor.value.getHTML() === value
      if (isSame) {
        return
      }
      editor.value.commands.setContent(value, false)
    });
</script>

<style lang="scss">


.tiptap-container {
  // background: #f2f2f2;
  //border: 1px solid #dfdfdf;
  padding: 1rem;
  border-radius: .5rem;
}
.tiptap {
  background: #fff;
  border: 1px solid #dfdfdf;
  border-radius: .5rem;
  padding: 20px 20px;
  min-height: 200px;

  h1 {
    font-size: 2.5rem;
    font-weight: 500;
    margin-bottom: 20px;
    line-height: 3rem;
  }
  h2 {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 20px;
    line-height: 2rem;
  }
  h3 {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 20px;
    line-height: 1.5rem;
  }

  p {
    margin-bottom: 0;;
  }

  a {
    text-decoration: underline;
    color: blue;
  }
}

.tiptap-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: .2rem .5rem;
  margin: 1px;
  background: rgba($color: #3d2514, $alpha: 0.05);
  border: 0px solid #3d251414;
  text-align: left;
  font-weight: 500;
  font-size: 0.85rem;
  text-transform: none;
  letter-spacing: 0px;
  color: #111;
  cursor: pointer;
  transition-property: all;
  transition-duration: 0.25s;
  transition-timing-function: ease-out;
  border-radius: 4px;

  .icon {
    font-size: 16px;
    line-height: 14px;
    font-weight: 300;
    margin-right: 8px;
  }

  &:hover {
    background: rgba($color: #3d2514, $alpha: 0.15);
    color: #111;
  }
}

.tiptap-tools {
  background: transparent;
  padding-bottom: 1rem;
  
}

</style>