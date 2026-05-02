const fquery = (el) => document.querySelector(el);
const fqueryAll = (el) => document.querySelectorAll(el);
let modalQt = 1;
let cart = []; //carinhos de compras
let modalKey;
let sizePizza = 0;

//listagem de pizzas
pizzaJson.map((item, index) => {

    //clonar item
    let pizzaItem = fquery('.pizza-item').cloneNode(true);

    //adicionar uma key nos itens
    pizzaItem.setAttribute('data-key', index);

    //mostrar itens
    fquery('.pizza-area').append(pizzaItem);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;



    //adc evento ao button click abrir o modal:
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault(); //parar event

        modalQt = 1; /*toda vez que abrir o modal, esse será o valor setado. */


        //pegar e mostrar a pizza
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        //closest vai procurar aquela classe, pois é ela que tem o atributo que queremos!

        modalKey = key; //armazenar a pizza selecionada.



        //encurtando a pegar a pizza
        let pizza = pizzaJson[key];

        //reset o selected do modal, tirar o selecioando - 
        fquery('.pizzaInfo--size.selected').classList.remove('selected');

        //preenchendo o modal:
        fquery('.pizzaBig img').src = pizza.img;
        fquery('.pizzaInfo h1').innerHTML = pizza.name;
        fquery('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizza.price.toFixed(2)}`;
        fquery('.pizzaInfo--desc').innerHTML = pizza.description;
        //qt no html 
        fquery('.pizzaInfo--qt').innerHTML = modalQt;

        //preenchendo os sizes
        fqueryAll('.pizzaInfo--size').forEach((size, sizeIndex) => {

            //adicionando o select no tmanho, vai comecar sempre selecioando o grande
            if (sizeIndex == 2) { //nao entendi essa parte, se so vvai adiconar o select se o sizeindex == 2, pq fica sempre acionado -feit
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizza.sizes[sizeIndex];
        });

        //qt no html 
        fquery('.pizzaInfo--qt').innerHTML = modalQt;

        //exibir modal após click:
        fquery('.pizzaWindowArea').style.opacity = '0';
        fquery('.pizzaWindowArea').style.display = 'flex';
        //efeito de abrir o modal:
        setTimeout(() => {
            fquery('.pizzaWindowArea').style.opacity = '1';
        }, 200);


        //evento modal
        fqueryAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
            item.addEventListener('click', closeModal); /*usamos o all(+1 item), pois a 2 botoes de cancelar, um pr cel e um para pc */
        });




    })

});

//botao clear
fquery('.clear').addEventListener('click', () => {
    cart=[];
    uptadeCart();
})

//funtion para fechar o modal:
function closeModal() {
    //modl ficar invisivel na tela
    fquery('.pizzaWindowArea').style.opacity = '0';

    //modal sumir na tela:
    setTimeout(() => {
        fquery('.pizzaWindowArea').style.display = 'none';
    }, 200);
}

//eventos de quantidade
fquery('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        fquery('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

fquery('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    fquery('.pizzaInfo--qt').innerHTML = modalQt;
});

//clicar no botao de tamanho eventos  
fqueryAll('.pizzaInfo--size').forEach((itemCLick) => {
    itemCLick.addEventListener('click', (e) => {
        //primeiro desmarcar todos
        fquery('.pizzaInfo--size.selected').classList.remove('selected');

        //adiciona no clicado
        itemCLick.classList.add('selected')
    });

})


//evnt adicionar ao carrinho
fquery('.pizzaInfo--addButton').addEventListener('click', () => {
    //pegar qual o tamanho selecionado:
    let tamanhoPizza = parseInt(fquery('.pizzaInfo--size.selected').getAttribute('data-key'));

    //criar um identificador 
    let identifier = pizzaJson[modalKey].id + "@" + tamanhoPizza;
    // vai pegar o id da pizza selecionada+ concatenar com "@" e com o numero do tamanho;

    //busca se vai ter o mesmo item
    let key = cart.findIndex(itemCarrinho => itemCarrinho.identifier == identifier);


    //verificacao se tem o item(pois findInde vai retornar -1 se nao achar e >-1 se achar)
    if (key > -1) {//se achar
        cart[key].qt += modalQt;
    } else { //se nao achar, vai adicionar.
        cart.push(
            {
                identifier, //salvar o indentificador;
                id: pizzaJson[modalKey].id,
                size: tamanhoPizza,
                qt: modalQt,
            }
        );
    }


    //atualizar carrinho, vai ser executada, toda vez que adicionar algo nele
    uptadeCart();
    //após adc, fechar o modal
    closeModal();
})

//event mobile
fquery('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        fquery('aside').style.left = '0' //abrir o carrinho na tela
    }
})

//fechar carrinho
fquery('.menu-closer').addEventListener('click', () => {
    fquery('aside').style.left = '100vw' //fechar o carrinho
})

//funcao para mostrar o cart na tela e atualizar ele
function uptadeCart() {
    //mobile aparecer numero no carrinho
    fquery('.menu-openner span').innerHTML = cart.length;


    if (cart.length > 0) {

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        fquery('aside').classList.add('show'); //abrir a aba do carrinho
        fquery('.cart').innerHTML = '';

        for (let i in cart) {//ver itens do carrinho

            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id); //se o item é o mesmo do item do carrinho)

            subtotal += pizzaItem.price * cart[i].qt;
            let cartItem = fquery('.models .cart--item').cloneNode(true); //fazer o clone

            let pizzaSize;
            switch (cart[i].size) {
                case 0:
                    pizzaSize = 'P';
                    break;
                case 1:
                    pizzaSize = 'M';
                    break;
                case 2:
                    pizzaSize = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSize})`;

            //preenchendo as informacoes
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            //eventos de aumentar e diminuir
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                    fquery('.cart--item--qt').innerHTML = cart[i].qt;
                } else { //caso diminuia o item, tem que tirar do carrinho
                    cart.splice(i, 1);
                }
                uptadeCart();
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                uptadeCart();

            })

            desconto = subtotal * 0.1;
            total = subtotal - desconto;

            //sao dois span, entao usamos o :last-child para informar que é o ultimo
            fquery('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
            fquery('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            fquery('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


            fquery('.cart').append(cartItem); //adicionr os clones para mostrar
        }



    } else {
        //se nao tiver item
        fquery('aside').classList.remove('show'); //remover a aba do carrinho;
        fquery('aside').style.left = '100vw'; //fechar aba do celualr tbm
    }
}
