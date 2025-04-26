import React, { useCallback, useState } from 'react';
import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { storage } from '../firebase'; // Adjust the path to your firebase setup
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";


const TiptapEditor = ({ value, onChange }) => {
  const [progress, setProgress] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
  });

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            console.error(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            editor.chain().focus().setImage({ src: downloadURL }).run();
            setProgress(null);
          }
        );
      }
    };
  }, [editor]);

  return (
    <div>
      <EditorContent editor={editor} />
      {editor && (
        <>
          <FloatingMenu editor={editor}>
            <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
              Bold
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
              Italic
            </button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
              Strike
            </button>
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()} disabled={!editor.can().chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>
              Blockquote
            </button>
            <button onClick={handleImageUpload}>
              Image
            </button>
            <button onClick={() => editor.chain().focus().toggleLink({ href: 'https://www.example.com' }).run()} disabled={!editor.can().chain().focus().toggleLink({ href: 'https://www.example.com' }).run()} className={editor.isActive('link') ? 'is-active' : ''}>
              Link
            </button>
          </FloatingMenu>
          <BubbleMenu editor={editor}>
            <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
              Bold
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
              Italic
            </button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
              Strike
            </button>
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()} disabled={!editor.can().chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>
              Blockquote
            </button>
            <button onClick={handleImageUpload}>
              Image
            </button>
            <button onClick={() => editor.chain().focus().toggleLink({ href: 'https://www.example.com' }).run()} disabled={!editor.can().chain().focus().toggleLink({ href: 'https://www.example.com' }).run()} className={editor.isActive('link') ? 'is-active' : ''}>
              Link
            </button>
          </BubbleMenu>
        </>
      )}
      {progress !== null && <div>Uploading image: {progress}%</div>}
    </div>
  );
};

export default TiptapEditor;