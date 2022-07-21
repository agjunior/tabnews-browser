# TabNews for Browser
Extensão não oficial do TabNews para navegadores


### O que a extensão tem/faz

- Verifica a cada X minutos por novos posts publicados no TabNews
- Se tiver novos posts um contador fica disponível ao lado do ícone
- Uma notificação é disparada no desktop
- Um painel com a últimas publicações fica sempre acessível ao clicar no ícone

### Limitações

- Por enquanto a única ordenação disponível é pelas mais recentes
- A lista de publicações é limitada apenas a primeira página (30 mais recentes)
- Somente novas publicações são notificadas (não inclui comentários)
- Não tem uma tela de configuração ainda, mas é possível alterar o intervalo e configurar as notificações
- Por não estar na loja, será necessário baixar o código e usar o modo de desenvolvedor
- Testado apenas no Chromemas pode funcionar em outros navegadores com a mesma base


### Como usar

Acessar página de extensões e habilitar o **Modo do desenvolvedor** no canto direito. Usar a opção **Carregar sem compactação** e selecionar a pasta da extensão descompactada.

### Configuração

Ainda não existe uma página de configuração, mas há 3 constantes no arquivo **background.js** que é possível alterar:

**UPDATE_INTERVAL_IN_MINUTES** é o tempo em minutos que e extensão vai verificar por novos posts (o padrão é 5)
**NOTIFICATIONS_ENABLED** habilita ou não as notificações no desktop (o badge do ícone sempre mostra novos posts)
**NOTIFICATIONS_GROUP_ENABLED** mostra a quantidade em vez do conteúdo da última notificação se acumular mais de uma publicação não lida

### Screenshots

![](https://i.imgur.com/ldnjQMj.png)
