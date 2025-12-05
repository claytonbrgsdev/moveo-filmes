import Link from "next/link"

export default function Home() {
  const components = [
    { name: "Carrousel", path: "/carrousel", description: "Carrossel 3D com rotação baseada em scroll" },
    { name: "ScrollTrigger Demo", path: "/scrolltrigger-demo", description: "Galeria horizontal com scroll alternado" },
    { name: "Opening Header", path: "/opening-header", description: "Header que se abre revelando conteúdo" },
    { name: "Vertical Gallery", path: "/vertical-gallery", description: "Galeria vertical com transição animada" },
    {
      name: "Content Transition",
      path: "/content-transition",
      description: "Transição de conteúdo com barras animadas",
    },
    {
      name: "Content Transition 2",
      path: "/content-transition-2",
      description: "Transição: AS MIÇANGAS → O MISTÉRIO DA CARNE",
    },
    {
      name: "Section Transition",
      path: "/section-transition",
      description: "Transição de seção: *DESTAQUES* DO NOSSO CATÁLOGO",
    },
  ]

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Componentes de Animação</h1>
      <div className="grid gap-4 max-w-2xl">
        {components.map((component) => (
          <Link
            key={component.path}
            href={component.path}
            className="block p-6 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">{component.name}</h2>
            <p className="text-neutral-400">{component.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
