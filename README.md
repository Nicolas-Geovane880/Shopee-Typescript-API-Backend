#### PROJETO PARTE II

O Sistema de verificação via E-mail para confirmar login está funcionando.

- Ao fazer login, o access token não é fornecido de imediato. Para ter acesso ao token, é necessário informar o código que foi enviado para o email que tentou o login.

<code>
{<br>
    <span style="margin-left: 4ch;"></span>"challengeId: "ID_DA_TENTATIVA"<br>
    <span style="margin-left: 4ch;"></span>"code": "CODIGO_VERIFICAO"<br>
}
</code>

#### Novas mudanças futuras.

- Adicionar o domínio de fato da aplicação (os produtos para criar os cálculos).


