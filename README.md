# A Forja
### INTRODUÇÃO
O projeto desenvolvido pelo nosso grupo, cujo membros são Cassiano Calazans Coelho Machado ([cassianobigodudo](https://github.com/cassianobigodudo)), Jaime António Cá ([jaime-ac](https://github.com/jaime-ac)), José Vitor de Mattos Pinheiro ([Jouusey](https://github.com/Jouusey)) e Pedro Guedes Almeida Ribeiro ([PedroG4R](https://github.com/pedroG4R)) é uma loja de venda e fabricação de miniaturas para campanhas de RPG de mesa, utilizando a bancada industrial para a industria 4.0 disponibilizada pelo SENAI, queremos fornecer para nosso público-alvo uma loja que produza miniaturas personalizáveis para cada tipo de campanha para nossos jogadores.

## A produção da bancada industrial
Nosso **produto** consiste em miniaturas focadas em personagens de campanhas de RPG customizáveis em que o usuário poderá escolher o que ele quiser em seu personagem, e a bancada industrial vai fazer o correspondente desse boneco em blocos de 3 andares. As miniaturas tem uma variedade enorme de customização, sendo possível customizar o gênero, cor de pele, marcas, vários tipos de cabelo com cores diferentes, armas, roupas de cima, roupas de baixo, sapatos e a base da miniatura.

### O que a bancada produz?
A bancada produz blocos de até três andares, onde cada bloco tem 3 cores (Azul, Vermelho e Preto), e cada bloco possuí 3 facetas com 7 opções de paletas de cores (Branco, Preto, Verde, Amarelo, Azul e Vermelho ou sem faceta) com 4 opções de ilustração nas facetas (Casa, Barco e Estrela ou sem ilustração)

### Relação entre miniatura e blocos
Cada variação de cada andar dos blocos quer dizer alguma coisa sobre a miniatura, visualize a tabela para saber mais sobre cada especificação

### Tabela de Relação: Miniatura vs. Blocos

| Andar | Elemento do Bloco | Característica da Miniatura | Mapeamento / Opções |
| :--- | :--- | :--- | :--- |
| **3º Andar** | Cor do Bloco | Gênero | **2 Opções** (Ex: Azul, Vermelho) |
| **3º Andar** | Cor da Faceta Frontal | Cor da Pele | **6 Opções** (Branco, Preto, Verde, Amarelo, Azul, Vermelho) |
| **3º Andar** | Símbolo da Faceta Frontal | Sardas / Marcas | **4 Opções** (Casa, Barco, Estrela, Sem Ilustração) |
| **3º Andar** | Cor da Faceta Direita | Estilo de Cabelo | **7 Opções** (6 cores de faceta + 1 opção Sem Faceta) |
| **3º Andar** | Símbolo da Faceta Direita | Cor do Cabelo | **4 Opções** (Casa, Barco, Estrela, Sem Ilustração). *Não há símbolo se não houver faceta.* |
| **3º Andar** | Cor e Símbolo da Faceta Esquerda | Acessórios / Chapéus | **25 Opções** (6 cores x 4 símbolos + 1 opção sem faceta/símbolo) |
| **2º Andar** | Cor do Bloco | Acessórios de Pescoço | **3 Opções** (Azul, Vermelho, Preto) |
| **2º Andar** | Cor e Símbolo da Faceta Frontal | Roupa de Cima (Estilo) | **13 Opções** (Combinações de cor e símbolo, sem usar "sem faceta") |
| **2º Andar** | Símbolo na Faceta Direita (Branca) | Roupa de Cima (Variação) | **4 Opções** (A faceta é sempre **Branca** + 4 variações de símbolo) |
| **2º Andar** | Cor e Símbolo da Faceta Esquerda | Armas | **13 Opções** (6 cores x 2 símbolos específicos + 1 opção sem faceta/símbolo) |
| **1º Andar** | Cor do Bloco | Base da Miniatura | **3 Opções** (Azul, Vermelho, Preto) |
| **1º Andar** | Cor e Símbolo da Faceta Frontal | Roupa de Baixo (Estilo) | **13 Opções** (Combinações de cor e símbolo, sem usar "sem faceta") |
| **1º Andar** | Símbolo na Faceta Direita (Branca) | Roupa de Baixo (Variação/Cor) | **4 Opções** (A faceta é sempre **Branca** + 4 variações de símbolo) |
| **1º Andar** | Cor da Faceta Esquerda | Sapatos (Estilo) | **7 Opções** (6 cores de faceta + 1 opção Sem Faceta) |
| **1º Andar** | Símbolo da Faceta Esquerda | Sapatos (Variação/Cor) | **4 Opções** (4 variações de símbolo). *Não há símbolo se não houver faceta.* |

## Requisitos Funcionais
1. **Cadastro, Login, Edição e Exclusão de Usuários (RF-01):** O sistema deve permitir que usuários possam criar suas contas, logar em nosso sistema, editar seus dados e excluir sua conta se desejado.
2. **Customização de Miniaturas (RF-02):** O sistema deve permitir que usuários cadastrados possam customizar suas miniaturas de personagens com várias opções de customização (Cabelo, Roupa, Cor de Pele, Acessório, Base, Gênero).
3. **Visualização de Miniaturas Pré-Forjadas (RF-03):** O sistema deve permitir que os usuários possam navegar pela loja de miniaturas pré-forjadas (miniaturas que não são customizadas e veem sempre do mesmo jeito).
4. **Gestão de Estoque (RF-04):** O sistema vai incluir um gestão de estoques que vai estar conectado com a Bancada Industrial que monitora se tem disponibilidades de matéria-prima e vaga na expedição.
5. **Carrinho de Miniaturas (RF-05):** O sistema deve permitir que o usuário só consiga colocar miniaturas (tanto pré-forjada quanto customizável) no carrinho, desde que ele tenha uma conta já criada.
6. **Compra e Histórico de Compras (RF-06):** O sistema deve permitir o usuário cadastrado comprar dos itens no carrinho colocando seu cartão de crédito/débito ou com pix para começar a produção das miniaturas após a confirmação. Além disso, o usuário cadastrado pode ver seu histórico de compras caso ele já tenha comprado alguma miniatura.

## Requisitos Não-Funcionais
1. **Suporte Aos Principais Navegadores (RNF-01):** O sistema tem compatibilidade com todos os principais navegadores (Chrome, Firefox, Opera, Etc.).
2. **Tempo de Resposta do Sistema para a Máquina 4.0 (RNF-02):** As requisições no sistema para a máquina tem um tempo de resposta de até 3 segundos.
3. **Interface Intuitiva e Navegação Dinâmica (RNF-03):** O sistema terá uma interface fácil de entender, aonde o usuário conseguirá navegar pelas páginas com respostas de até 1 segundo
