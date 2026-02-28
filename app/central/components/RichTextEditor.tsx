'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'

const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  title: string
  children: React.ReactNode
  disabled?: boolean
}

function ToolbarButton({ onClick, isActive, title, children, disabled }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: FONT_BODY,
        fontSize: '12px',
        padding: '3px 7px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none',
        background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
        color: isActive ? 'white' : disabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
        borderRadius: '2px',
        transition: 'background 0.15s, color 0.15s',
        lineHeight: 1,
        minWidth: '24px',
      }}
      onMouseEnter={e => {
        if (!disabled && !isActive) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.color = 'white'
        }
      }}
      onMouseLeave={e => {
        if (!disabled && !isActive) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
        }
      }}
    >
      {children}
    </button>
  )
}

function Separator() {
  return (
    <span style={{
      display: 'inline-block',
      width: '1px',
      height: '16px',
      background: 'rgba(255,255,255,0.12)',
      margin: '0 4px',
      verticalAlign: 'middle',
    }} />
  )
}

export function RichTextEditor({ value, onChange, placeholder, minHeight = '200px' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { style: 'color: rgba(255,255,255,0.8); text-decoration: underline;' },
      }),
      Underline,
      Placeholder.configure({
        placeholder: placeholder ?? 'Digite o conteúdo…',
        emptyNodeClass: 'tiptap-placeholder',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        style: `
          min-height: ${minHeight};
          padding: 12px;
          outline: none;
          font-family: ${FONT_BODY};
          font-size: 14px;
          color: white;
          line-height: 1.6;
        `,
      },
    },
  })

  // Sync inbound value changes (e.g., when form data loads from API)
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value !== current) {
      // Avoid resetting if editor is focused (would cause cursor jump)
      if (!editor.isFocused) {
        editor.commands.setContent(value ?? '', { emitUpdate: false })
      }
    }
  }, [value, editor])

  const setLink = () => {
    if (!editor) return
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL do link:', prev ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.2)',
      background: 'transparent',
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '2px',
        padding: '6px 8px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.03)',
      }}>
        {/* Text styles */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          isActive={editor?.isActive('bold')}
          title="Negrito (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          isActive={editor?.isActive('italic')}
          title="Itálico (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          isActive={editor?.isActive('underline')}
          title="Sublinhado (Ctrl+U)"
        >
          <span style={{ textDecoration: 'underline' }}>U</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          isActive={editor?.isActive('strike')}
          title="Tachado"
        >
          <span style={{ textDecoration: 'line-through' }}>S</span>
        </ToolbarButton>

        <Separator />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor?.isActive('heading', { level: 1 })}
          title="Título 1"
        >H1</ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor?.isActive('heading', { level: 2 })}
          title="Título 2"
        >H2</ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor?.isActive('heading', { level: 3 })}
          title="Título 3"
        >H3</ToolbarButton>

        <Separator />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          isActive={editor?.isActive('bulletList')}
          title="Lista não ordenada"
        >• —</ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          isActive={editor?.isActive('orderedList')}
          title="Lista ordenada"
        >1.</ToolbarButton>

        <Separator />

        {/* Block */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          isActive={editor?.isActive('blockquote')}
          title="Citação"
        >&ldquo;</ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleCode().run()}
          isActive={editor?.isActive('code')}
          title="Código inline"
        >{'{}'}</ToolbarButton>

        <Separator />

        {/* Link */}
        <ToolbarButton
          onClick={setLink}
          isActive={editor?.isActive('link')}
          title="Inserir/editar link"
        >🔗</ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Limpar formatação"
        >✕</ToolbarButton>
      </div>

      {/* Editor area */}
      <style>{`
        .tiptap-placeholder::before {
          content: attr(data-placeholder);
          float: left;
          color: rgba(255,255,255,0.2);
          pointer-events: none;
          height: 0;
          font-family: ${FONT_BODY};
          font-size: 14px;
        }
        .tiptap p { margin: 0 0 0.75em 0; }
        .tiptap p:last-child { margin-bottom: 0; }
        .tiptap h1 { font-size: 1.6em; font-weight: 700; margin: 0.8em 0 0.4em; }
        .tiptap h2 { font-size: 1.3em; font-weight: 700; margin: 0.8em 0 0.4em; }
        .tiptap h3 { font-size: 1.1em; font-weight: 700; margin: 0.8em 0 0.4em; }
        .tiptap ul, .tiptap ol { padding-left: 1.4em; margin: 0.5em 0; }
        .tiptap li { margin-bottom: 0.25em; }
        .tiptap blockquote { border-left: 3px solid rgba(255,255,255,0.3); padding-left: 1em; margin: 0.75em 0; color: rgba(255,255,255,0.6); }
        .tiptap code { background: rgba(255,255,255,0.08); padding: 1px 5px; border-radius: 2px; font-size: 0.9em; }
        .tiptap hr { border: none; border-top: 1px solid rgba(255,255,255,0.15); margin: 1em 0; }
      `}</style>
      <EditorContent editor={editor} className="tiptap" />
    </div>
  )
}
