# ⚒️ A Forja

> Sua loja de miniaturas de RPG personalizáveis, forjadas para suas aventuras.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

<p align="center">
  <img src="URL_PARA_UM_LOGO_OU_BANNER_AQUI" width="400" alt="Logo do Projeto A Forja">
</p>

## 📜 Índice

* [Sobre o Projeto](#-sobre-o-projeto)
* [✨ Funcionalidades](#-funcionalidades)
* [🏭 A Produção Industrial](#-a-produção-industrial)
    * [Relação Miniatura vs. Blocos](#tabela-de-relação-miniatura-vs-blocos)
* [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [🧑‍💻 Autores](#-autores)

## 📖 Sobre o Projeto

**A Forja** é uma plataforma de e-commerce focada na venda e fabricação de miniaturas customizáveis para campanhas de RPG de mesa.

Utilizando a bancada industrial para Indústria 4.0 disponibilizada pelo SENAI, nosso objetivo é oferecer aos jogadores um espaço onde eles possam dar vida aos seus personagens, criando e comprando miniaturas com um nível profundo de personalização.

## ✨ Funcionalidades

### Requisitos Funcionais
-   ✅ **Gestão de Usuários (RF-01):** Cadastro, login, edição de perfil e exclusão de conta.
-   ✅ **Customizador de Miniaturas (RF-02):** Ferramenta para personalizar gênero, cor de pele, cabelo, roupas, armas, acessórios e a base da miniatura.
-   ✅ **Criação de Enredo com IA Generativa (RF-03):** Geração de uma história com IA após a criação da miniatura.
-   ✅ **Loja de Miniaturas (RF-04):** Galeria para visualizar e comprar miniaturas pré-fabricadas.
-   ✅ **Gestão de Estoque (RF-05):** Integração com a bancada industrial para monitorar matéria-prima e capacidade de expedição.
-   ✅ **Carrinho de Compras (RF-06):** Adição de miniaturas (customizadas ou pré-fabricadas) ao carrinho para usuários logados.
-   ✅ **Checkout e Histórico (RF-07):** Finalização da compra (Pix, Cartão) e acesso ao histórico de pedidos.

### Requisitos Não-Funcionais
-   ⚙️ **Compatibilidade (RNF-01):** Suporte aos principais navegadores do mercado (Chrome, Firefox, Opera, etc.).
-   ⚙️ **Performance (RNF-02):** Tempo de resposta de até 3 segundos para requisições entre o sistema e a bancada industrial.
-   ⚙️ **Usabilidade (RNF-03):** Interface intuitiva com navegação fluida e respostas de página em até 1 segundo.

## 🏭 A Produção Industrial

Nosso produto principal são as miniaturas personalizáveis. O usuário define as características do seu personagem em nossa plataforma, e a bancada industrial produz uma representação física em **blocos empilhados de 3 andares**.

A variedade de customização é o nosso forte. É possível alterar:
* Gênero e cor de pele
* Marcas e sardas
* Estilos e cores de cabelo
* Roupas (superiores e inferiores)
* Sapatos, armas e acessórios
* O tipo de base da miniatura

### O que a bancada produz?
A bancada materializa a miniatura em um conjunto de blocos. Cada um dos 3 andares do conjunto possui:
* **3 opções de cor para o bloco:** Azul, Vermelho ou Preto.
* **3 facetas (frontal, direita, esquerda)** que podem ter:
    * **7 opções de cor de faceta:** Branco, Preto, Verde, Amarelo, Azul, Vermelho ou Sem Faceta.
    * **4 opções de ilustração:** Casa, Barco, Estrela ou Sem Ilustração.

### Tabela de Relação: Miniatura vs. Blocos
Cada variação nos blocos produzidos corresponde a uma característica específica da miniatura, como detalhado abaixo.

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

## 🚀 Tecnologias Utilizadas
* **Frontend:** React
* **Backend:** Node.js, Express
* **Banco de Dados:** PostgreSQL

## 🧑‍💻 Autores
Um projeto desenvolvido por:

| [<img src="https://avatars.githubusercontent.com/cassianobigodudo" width=115><br><sub>Cassiano Machado</sub>](https://github.com/cassianobigodudo) | [<img src="https://avatars.githubusercontent.com/jaime-ac" width=115><br><sub>Jaime António Cá</sub>](https://github.com/jaime-ac) | [<img src="https://avatars.githubusercontent.com/Jouusey" width=115><br><sub>José Vitor Pinheiro</sub>](https://github.com/Jouusey) | [<img src="https://avatars.githubusercontent.com/PedroG4R" width=115><br><sub>Pedro Guedes</sub>](https://github.com/pedroG4R) |
| :---: | :---: | :---: | :---: |
