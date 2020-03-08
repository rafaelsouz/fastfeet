<h2> Requisitos da API </h2>

## Requisitos Funcionais
<table>

  <tr>
    <td>Usuários devem ser mantidos no sistema.</td>
    <td>O usuário deverá ser mantido (cadastrado/atualizado) na aplicação para ter uma conta de acesso.</td>
  </tr>
  <tr>
    <td>Gerar Hash da senha.</td>
    <td>Quando usuario é cadastrado no sistema, é gerado um hash da senha informada e após isso o hash é guardado na base de dado.</td>
  </tr>
  <tr>
    <td>Usuários são autenticadados ao fazer login.</td>
    <td>Quando o usuário entrar no sistema, é vinculado ao seu login, um token de autenticação, que através deste token é verificado se o usuário está autenticado para interagir com o sistema.</td>
  </tr>
  <tr>
    <td>Validar dados de entrada.</td>
    <td>Todos os dados informados pelo o usuário para fazer algum cadastro/edição deve ser validado para verificar se estão no formato correto.</td>
  </tr>
  <tr>
    <td>Nenhuma entidade do sistema deve ser excluída, apenas desativada</td>
    <td>Por questão de segurança entregadores, entregas, usuários e destinatários não devem ser excluidos da base de dados, apenas ter seu status alterado para 0 - Inativo, dessa forma mantendo todas as informações no sistema.</td>
  </tr>
  <tr>
    <td>Apenas administradores podem cadastrar, alterar e desativar dados</td>
    <td>Usuários com admin 1 - administradores podem cadastrar, alterar e listar dados.</td>
  </tr>
  <tr>
    <td>Usuários supervisores podem listar dados</td>
    <td>Todos os usuários com admin 0 - supervisores, podem apenas fazer listagem dos dados, não pode alterar ou cadastrar nenhuma informação do banco.</td>
  </tr>
  <tr>
    <td>CRUD permitidos para administradores</td>
    <td>Administradores podem cadastrar, remover, atualizar e listar: entregadores, encomendas, destinatários e usuários.</td>
  </tr>
  <tr>
    <td>Avatar para entregadores</td>
    <td>Usuários que são entregadores podem adicionar um avatar(foto) a sua conta.</td>
  </tr>
  <tr>
    <td>Administradores podem vincular encomendas aos entregadores.</td>
    <td>Apenas administradores podem cadastrar encomendas para os entregadores.</td>
  </tr>
  <tr>
    <td>Entregadores recebem email quando tiver uma encomenda nova</td>
    <td>Quando houver uma nova encomenda cadastrada para o entregador, ele deve receber um email avisando que a entrega está disponível para retirada.</td>
  </tr>
  <tr>
    <td>Apenas os entregadores podem fazer retiradas das encomendas</td>
    <td>Apenas os entregadores podem retirar encomendas vinculadas a ele, todas as retiradas só podem ser feitas das 08:00 as 18:00.</td>
  </tr>
  <tr>
    <td>Só entregadores podem finalizar uma encomenda.</td>
    <td>Quando entregador for finalizar uma encomenda, é preciso verificar se a encomendo foi realmente retirada do sistema e obrigar que seja enviada uma foto da assinatura do destinatário.</td>
  </tr>
  <tr>
    <td>Entregadores podem visualizar suas encomendas</td>
    <td>O entregador pode visualizar as suas encomendas informando apenas o ID dele, dessa forma ele visualizar todas as encomendas que ainda não foram entregue ou que não foi cancelada. Permita também que ele liste apenas as encomendas que já foram entregues por ele.</td>
  </tr>
  <tr>
    <td>Usuários podem listar as encomendas com problema .</td>
    <td>Qualquer usuário pode listar as entregas com problemas, porém apenas administradores podem altera-la.</td>
  </tr>
  <tr>
    <td>Administradores podem cancelar uma encomenda.</td>
    <td>Quando houver um problema na encomenda, o adminstrador pode cancelar a entrega de uma encomenda, esse cancelamento pode acontecer devido a gravidade do problema da entrega, por exemplo, em caso de perda da encomenda.</td>
  </tr>
  <tr>
    <td>Entregador recebe um email em casa de cancelamento de entrega.</td>
    <td>Quando uma encomenda for cancelada, o entregador deve receber um e-mail informando-o sobre o cancelamento.</td>
  </tr>

</table>

## Requisitos não funcionais

<table>

  <tr>
    <td>RedisDB para fila dos email.s</td>
    <td>Para diminuir o tempo de resposta das rotas de envio de email, usaremos filas(backgrounds jobs), utilizaremos RedisDB para guardar a chave-valor dos registros dos emails.</td>
  </tr>
  <tr>
    <td>Postgres como base de dados principal.</td>
    <td>Postgres vai ser utilizado para guardar o restanto dos dados da aplicação, dados do usuarios, agendamentos, dados dos avatares entre outros.</td>
  </tr>
  <tr>
    <td>Autenticação do usuários.</td>
    <td>Por ser uma API RESTFul a autenticação vai ser utilizando o JWT, (Json Web Token)</td>
  </tr>
  <tr>
    <td>Tratamento de exceções.</td>
    <td>Quando a aplicação tiver em produção, o tratamento de exceções será utilizando o Sentry, por ter uma otima integração com o NodeJS</td>
  </tr>

</table>
