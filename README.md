<h1 align="center"><img src="./images/logo.png" width="300"/></h1>
<h1 align="center"> FastFeet </h1>

<h3 align="center">Uma aplicação fullstack de entrega de encomendas para uma transportadora fictícia</h3>

<h4> Para o funcionamento desta aplicação você precisa ter o docker instalado, e utilizar imagem do postgres,
e depois ir em config/database.js e alterar host, username, password, database de acordo com seu container.
</h4>

## Instalação
### Backend/API
Clone este repositório e instale as dependências
```sh
git clone https://github.com/rafaelsouz/fastfeet.git
yarn
# ou
npm install
```

<h4>Seeds</h4>
Para criar um usuário utilize o comando:

```
yarn sequelize db:seed:all
```

### Rodar Backend/API
```
yarn dev
```
> Lembre-se de deixar rodando o backend...

### Frontend

Em breve...

## :rocket: Tecnologias

Esse projeto será avaliado para a minha certificação no [Bootcamp GoStack da RocketSeat](https://rocketseat.com.br/bootcamp).
Utilizei as seguintes tecnologias:

-  [Node.js](https://nodejs.org/en/)
-  [Express](https://expressjs.com/)
-  [nodemon](https://nodemon.io/)
-  [Sucrase](https://github.com/alangpierce/sucrase)
-  [Docker](https://www.docker.com/docker-community)
-  [Sequelize](http://docs.sequelizejs.com/)
-  [PostgreSQL](https://www.postgresql.org/)
-  [node-postgres](https://www.npmjs.com/package/pg)
-  [JWT](https://jwt.io/)
-  [Bcrypt](https://www.npmjs.com/package/bcrypt)
-  [Yup](https://www.npmjs.com/package/yup)
-  [VS Code](https://code.visualstudio.com/) with [ESLint](https://eslint.org/)

---

Made with ♥ by Rafael Souza :wave: [linkedin](https://www.linkedin.com/in/rafaelsouz/)
