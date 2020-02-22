### Coding Challenge

Sistema pra um e-commerce que deve contemplar: 

- [x] CRUD de produtos 
- [ ] Carrinho de compras em que seja possível ver as promoções aplicadas.
- [ ] CRUD de promoções 


---

1. [Visão Geral](#visão-geral-da-solução)
    1. [Solução sem eval](#solução-sem-eval)
    2. [Solução com eval](#solução-com-eval)
2. [Tips and Tricks](#tips-and-tricks)
------ 

## Visão Geral da Solução
O sistema deve garantir flexibilidade suficiente para que novas promoções sejam adicionadas 
Com pouco esforço. 

A primeira maneira mais simples de conseguir tal feature, 
seria de aplicar um padrão [*Strategy*](https://www.thiengo.com.br/padrao-de-projeto-strategy-estrategia) 
para calcular o valor do carrinho. 

Ou seja, em suma teríamos um serviço para fazer o cálculo de um carrinho de compras, quando um cliente faz o checkout. 

Esse serviço que calcula o valor final para os itens no carrinho, 
Utilizaria algoritmos diferentes para diferentes promoções associadas aos produtos. 

### Solução sem eval
A priori, utilizando esse padrão de projeto e essa organização na estrutura do código, 
temos claro o formato de entrada e saída de dados que as funções calculo deveriam ter. 

Isso aumenta o desacoplamento do código, facilitando manutenção e adição de novas promoções. Que teriam que ser adicionadas junto ao código no backend.

------ 

### Solução com eval
Num segundo momento para minimizar ainda mais o custo para a implementação/manutenção das promoções, 
poderíamos tentar uma abordagem aonde a função é salva no banco de dados. 

Ou seja, uma coluna do tipo texto iria salvar a declaração função, que então seria executada em tempo de execução retornando o resultado do cálculo para produtos naquela promoção.

Algo como: 

```javascript 
let output = []
for (let { product, quantity } of cart) {
    if (product.promotion) {
        let promotion_calculate = eval(product.promotion.calculate);
        output.push(
            ...promotion_calculate(product, quantity) 
            // returns array of objects
        )

    } else {
        output.push({
            ...product, 
            total: quantity * product.value
        })
    }
}
return output; 
```

Entre os problemas que tal funcionalidade poderia causar, 
Seria que funcionários mal intencionados poderiam colocar códigos maliciosos juntos com a função de calculo, podendo deixar o sistema vulnerável. 

Porém dado que certos cuidados fossem tomados, 
auditando a inserção e edição de novas promoções, 
impossibilitando certas palavras chaves, tais riscos poderiam ser mitigados.  

Desta forma sem necessidade de modificação do código, deploy, downtime e afins para adição de novas promoções poderia ser reduzido significativamente. 


## Tips and Tricks 

#### Versões dos softwares utilizados: 
```
$ node --version 
v12.16.1
$ npm --version 
6.13.4
````

#### Problema com filewatchers 

Ao rodar o front e back, pode ser verificado um erro no sistema operacional relacionado aos [*inotify watchers*](https://manage.opsshield.com/index.php/plugin/support_manager/knowledgebase/view/7/what-is-inotify-watch-and-how-will-it-affects-server/1/) que pode ser resolvido da seguinte forma: 


```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```


