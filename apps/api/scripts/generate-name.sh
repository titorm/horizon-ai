#!/bin/bash

# Random Name Generator - Script Bash
# Gera nomes aleatórios no formato: "palavra1_palavra2_palavra3"
# 
# Uso:
#   ./scripts/generate-name.sh                    # Uma palavra aleatória
#   ./scripts/generate-name.sh 3                  # Três palavras (padrão)
#   ./scripts/generate-name.sh 5 "-"              # Cinco palavras com "-" como separador
#   ./scripts/generate-name.sh 2 ":" 10           # Dez nomes com dois palavras cada

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Palavras em português
ADJECTIVES=(
  "alpha" "beta" "gamma" "delta" "epsilon" "zeta" "eta" "theta"
  "iota" "kappa" "lambda" "mu" "nu" "xi" "omicron" "pi"
  "rho" "sigma" "tau" "upsilon" "phi" "chi" "psi" "omega"
  "veloz" "rapido" "lento" "forte" "suave" "agil" "astuto" "sabio"
  "bravo" "corajoso" "nobre" "alto" "baixo" "largo" "estreito"
  "quente" "frio" "claro" "escuro" "brilhante" "fosco" "doce" "amargo"
)

NOUNS=(
  "aguia" "abelha" "leao" "tigre" "lobo" "raposa" "urso" "coelho"
  "pato" "ganso" "coruja" "peregrino" "falcao" "gavioo" "cigarra" "sapo"
  "tartaruga" "cobra" "dragao" "fenix" "foca" "golfinho" "baleia" "tubarao"
  "aranha" "escorpiao" "lagosta" "caranguejo" "bola" "bolo" "cama" "cadeira"
  "mesa" "livro" "caneta" "lapis" "fogo" "agua" "ar" "terra"
  "pedra" "areia" "neve" "chuva" "vento" "nuvem" "sol" "lua"
  "estrela" "coracao" "mente" "alma" "corpo" "mao" "pe"
)

NUMBERS=(
  "zero" "um" "dois" "tres" "quatro" "cinco" "seis" "sete" "oito" "nove"
  "dez" "onze" "doze" "treze" "quatorze" "quinze" "dezesseis" "dezessete"
  "dezoito" "dezenove" "vinte" "trinta" "quarenta" "cinquenta" "sessenta"
  "setenta" "oitenta" "noventa" "cem"
)

# Obtém elemento aleatório de um array
get_random_element() {
  local array=("$@")
  local index=$((RANDOM % ${#array[@]}))
  echo "${array[$index]}"
}

# Gera um nome aleatório
generate_name() {
  local word_count=${1:-3}
  local separator=${2:-_}
  local words=()

  for ((i = 0; i < word_count; i++)); do
    if [ $((i % 3)) -eq 0 ]; then
      words+=($(get_random_element "${ADJECTIVES[@]}"))
    elif [ $((i % 3)) -eq 1 ]; then
      words+=($(get_random_element "${NOUNS[@]}"))
    else
      words+=($(get_random_element "${NUMBERS[@]}"))
    fi
  done

  local IFS="$separator"
  echo "${words[*]}"
}

# Argumentos
WORD_COUNT=${1:-3}
SEPARATOR=${2:-_}
NAME_COUNT=${3:-1}

# Validação
if ! [[ "$WORD_COUNT" =~ ^[0-9]+$ ]] || [ "$WORD_COUNT" -lt 1 ]; then
  echo -e "${RED}Erro: Número de palavras deve ser um inteiro positivo${NC}"
  echo "Uso: $0 [word_count] [separator] [name_count]"
  echo "Exemplo: $0 3 _ 5"
  exit 1
fi

# Gera os nomes
if [ "$NAME_COUNT" -eq 1 ]; then
  echo -e "${GREEN}$(generate_name "$WORD_COUNT" "$SEPARATOR")${NC}"
else
  echo -e "${BLUE}Gerando $NAME_COUNT nomes aleatórios:${NC}"
  for ((i = 0; i < NAME_COUNT; i++)); do
    echo -e "${GREEN}  $(generate_name "$WORD_COUNT" "$SEPARATOR")${NC}"
  done
fi
