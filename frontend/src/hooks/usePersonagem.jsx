import { useGlobalContext } from '../context/GlobalContext';

// ===================================================================
// 1. OS MAPEAMENTOS (DICIONÁRIOS) VIVEM AQUI DENTRO DO MESMO ARQUIVO!
// Eles são definidos fora da função do hook para não serem recriados a cada renderização.
// ===================================================================
const generoMap = {
    "Feminino": 2,
    "Masculino": 3
};

const corPeleMap = {
    "Negra": 0,
    "Parda": 1,
    "Leite": 2,
    "Branca": 3,
    "Verde": 4,
    "Laranja": 5,
    "Cinza": 6
};


// ===================================================================
// 2. O CUSTOM HOOK UTILIZA OS MAPAS DEFINIDOS ACIMA
// ===================================================================
export const usePersonagem = () => {
  // O hook continua acessando o contexto global normalmente
  const { dadosDoPersonagem, imagemPersonagem } = useGlobalContext();

  // A lógica de "tradução" usa os mapas que estão logo acima, no mesmo arquivo.
  const nomeGenero = dadosDoPersonagem ? generoMap[dadosDoPersonagem.generoNum] : null;
  const nomeCorPele = dadosDoPersonagem ? corPeleMap[dadosDoPersonagem.corPeleNum] : null;

  // O hook retorna o mesmo objeto de antes, com tudo pronto para o JSX.
  return {
    personagem: dadosDoPersonagem,
    imagem: imagemPersonagem,
    nomeGenero,
    nomeCorPele,
    isLoading: !dadosDoPersonagem
  };
};