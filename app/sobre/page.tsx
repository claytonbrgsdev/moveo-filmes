'use client'

import { useLanguage } from '@/lib/hooks/useLanguage';
import { MainLayout } from '../components/MainLayout';

export default function SobrePage() {
  const { language } = useLanguage();

  return (
    <MainLayout>
      <div className="relative w-full h-full overflow-auto px-4 py-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Seção Sobre a Empresa */}
        <section className="mb-16">
          {/* Título */}
            <h1 className="text-4xl font-bold text-white mb-8">
            {language === 'pt' ? 'Sobre a empresa' : 'About the company'}
          </h1>

          {/* Container de texto 1 */}
          <div className="mb-6">
              <p className="text-white">
              {language === 'pt' 
                ? 'Moveo Filmes, fundada em 2018 em Brasília, dedica-se a filmes de arte para o mercado internacional, com foco em promissores cineastas brasileiros. A empresa construiu um histórico sólido, colaborando com talentos emergentes como Rafaela Camelo, que dirigiu o primeiro longa-metragem internacional da Moveo, "A Natureza das Coisas Invisíveis" (2025). Este filme teve sua estreia mundial na Berlinale e foi financiado pelo FAC-DF, FSA/Ancine, Fundo de Coprodução Minoritária Chileno, e desenvolvimento pela Nouvelle-Aquitaine, França.'
                : 'Moveo Filmes, founded in 2018 in Brasília, focuses on arthouse films for the international market, with an emphasis on promising Brazilian filmmakers. The company has built a strong track record, collaborating with emerging talents like Rafaela Camelo, who directed Moveo\'s first international feature, "A Natureza das Coisas Invisíveis" (2025). This film had its world premiere at Berlinale, and it was funded by FAC-DF, FSA/Ancine, the Chilean Minor Coproduction Fund, and development by Nouvelle-Aquitaine, France.'}
            </p>
          </div>

          {/* Container de texto 2 */}
          <div className="mb-6">
              <p className="text-white">
              {language === 'pt'
                ? 'A jornada internacional da Moveo começou com "O Mistério da Carne", de Rafaela Camelo, que estreou em Sundance em 2019. Desde então, a empresa produziu vários curtas-metragens de sucesso, incluindo "O Véu de Amani", de Renata Diniz, Melhor Roteiro em Gramado; "Lubrina", de Leonardo Hecht e Vinicius Fernandes, exibido no FICCI; "As Miçangas", de Rafaela Camelo e Emanuel Lavor, selecionado para a Berlinale Shorts 2023; e "Três", de Lila Foster, selecionado para o 35º Festival Internacional de Curtas-Metragens de São Paulo. Todos foram financiados pelo FAC-DF, com "As Miçangas" também apoiado pela plataforma de streaming Cardume.'
                : 'Moveo\'s international journey began with "O Mistério da Carne", by Rafaela Camelo, which premiered at Sundance in 2019. Since then, the company has produced several successful shorts, including "O Véu de Amani", by Renata Diniz, Best Script at Gramado; "Lubrina", by Leonardo Hecht and Vinicius Fernandes, screened at FICCI; "As Miçangas", by Rafaela Camelo and Emanuel Lavor, selected for Berlinale Shorts 2023, and "Três", by Lila Foster, selected for the 35th São Paulo International Short Film Festival. All were funded by FAC-DF, with "As Miçangas" also supported by the streaming platform Cardume.'}
            </p>
          </div>

          {/* Container de texto 3 */}
          <div className="mb-6">
              <p className="text-white">
              {language === 'pt'
                ? 'Atualmente, a Moveo está em pós-produção de "Música Secular", de Emanuel Lavor, e "Aqua Blue", de Patrícia Colmenero, ambos financiados pelo FAC-DF. Projetos futuros incluem "Rodante", de Renata Diniz, "Garden of Delights", de Rafaela Camelo, também financiado pelo FAC-DF, e "Apollo", de Marcelo Grabowsky, apoiado pela RioFilme.'
                : 'Currently, Moveo is in post-production on "Música Secular", by Emanuel Lavor, and "Aqua Blue", by Patrícia Colmenero, both funded by FAC-DF. Upcoming projects include "Rodante", by Renata Diniz, "Garden of Delights", by Rafaela Camelo, also funded by FAC-DF, and "Apollo", by Marcelo Grabowsky, supported by RioFilme.'}
            </p>
          </div>
        </section>

        {/* Seção Nossa Equipe */}
        <section className="mb-16">
          {/* Título */}
            <h2 className="text-4xl font-bold text-white mb-8">
            {language === 'pt' ? 'Nossa Equipe' : 'Our Team'}
          </h2>

          {/* Subtítulo */}
            <h3 className="text-2xl font-semibold text-white mb-6">
            {language === 'pt' ? 'Daniela Marinho - Sócia-fundadora' : 'Daniela Marinho - Founding Partner'}
          </h3>

          {/* Container de texto 1 */}
          <div className="mb-6">
              <p className="text-white">
              {language === 'pt'
                ? 'Daniela Marinho é produtora de cinema, formada em Direito e com mestrado em Comunicação Social. Atualmente, atua como Produtora Executiva e Programadora de Cinema no Cine Brasília, uma sala de cinema pública inaugurada em 1960. Entre seus créditos de produção cinematográfica estão os curtas O Mistério da Carne, de Rafaela Camelo, exibido no Festival de Sundance em 2019, e O Véu de Amani, de Renata Diniz, vencedor de melhor roteiro no Festival de Gramado em 2019. Daniela também produziu o curta As Miçangas, dirigido por Emanuel Lavor e Rafaela Camelo, selecionado para o Berlinale Shorts em 2023.'
                : 'Daniela Marinho is a film producer with a degree in Law and a master\'s degree in Social Communication. She currently serves as Executive Producer and Film Programmer at Cine Brasília, a public movie theater built in 1960. Among her film production credits are the short films O Mistério da Carne, by Rafaela Camelo, showcased at Sundance in 2019, and O Véu de Amani, by Renata Diniz, featured at the Gramado Festival in 2019. Daniela is also the producer of the short film As Miçangas, directed by Emanuel Lavor and Rafaela Camelo, selected for Berlinale Shorts in 2023.'}
            </p>
          </div>

          {/* Container de texto 2 */}
          <div className="mb-6">
              <p className="text-white">
              {language === 'pt'
                ? 'Além disso, é produtora do longa-metragem A Natureza das Coisas Invisíveis (anteriormente Sangue do Meu Sangue), dirigido por Rafaela Camelo, uma coprodução entre Brasil e Chile, que teve sua premiére na 75ª edição do Festival Internacional de Cinema de Berlim, na seção Generation.'
                : 'Additionally, she is main producer of the feature film A Natureza das Coisas Invisíveis (formerly Sangue do Meu Sangue), directed by Rafaela Camelo, in co-production with Brazil and Chile, premiered at the 75th edition of the Berlin International Film Festival, in the Generation section.'}
            </p>
          </div>

          {/* Container de texto 3 */}
          <div className="mb-6">
              <p className="text-white">
              {language === 'pt'
                ? 'Daniela também desenvolve os projetos Rodante, de Renata Diniz (participante do BrLab 2022),  Apollo, de Marcelo Grabowsky (financiado pelo Rio Filme), e O Jardim das Delícias, de Rafaela Camelo (com apoio do FAC-DF no desenvolvimento.)'
                : 'Furthermore, she is developing Rodante by Renata Diniz (a participant in BrLab 2022),  Apollo with Marcelo Grabowsky (funded by Rio Filme), and The Garden of Delights, by Rafaela Camelo (with the support by FAC-DF)'}
            </p>
          </div>
        </section>

        {/* Seção de Imagens */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Container de imagem retangular 1 */}
              <div className="w-full h-64 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image Placeholder</span>
            </div>

            {/* Container de imagem retangular 2 */}
              <div className="w-full h-64 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image Placeholder</span>
            </div>

            {/* Container de imagem quadrado */}
              <div className="w-full aspect-square bg-gray-800 animate-pulse rounded-lg flex items-center justify-center md:col-span-2 md:max-w-md md:mx-auto">
              <span className="text-gray-400 text-sm">Image Placeholder</span>
            </div>
          </div>
        </section>
      </div>
      </div>
    </MainLayout>
  );
}
