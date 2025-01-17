# Usando a imagem oficial do Node.js como base
FROM node:22

# Diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiando arquivos de dependências
COPY package*.json ./

# Instalando dependências como root
RUN npm install

# Crie um novo usuário e altere para esse usuário
RUN useradd -m myuser
USER myuser

# Copiando o restante do código da aplicação
COPY --chown=myuser:myuser . .

# Expondo a porta em que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:dev"]