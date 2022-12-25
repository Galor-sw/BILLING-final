// import path from "path";
// const path = require("path");
let  stripe =Stripe(
    "pk_test_51MEs47EyaWpE1SJQwROynikxBSPhWRDjKr0MHv0TvlQysNn19iJ1oaq2MfhnEvfvN1KjdeRe2x61FlFuumgfM49500fBpbNo4n"
);


$.get('http://localhost:5000/GetAllProducts')
    .done((result) => {
        // let product=JSON.stringify(result);
        let f = document.getElementById('form-box');
        let counter = 1;
        for(let i in result.data)
        {

                let div = document.createElement('div');
                div.className = 'columns';
                let ul = document.createElement('ul');
                ul.className = 'price';
                let li = document.createElement('li');
                li.className= 'header';
                li.innerHTML = result.data[i].name;
                ul.appendChild(li);

                if (!result.data[i].prices[1])
                {
                       let li = document.createElement('li');
                       li.className = 'grey';
                       li.innerHTML = "$ " + result.data[i].prices[0].price;
                       ul.appendChild(li);
                }
                else {
                        let li = document.createElement('li');
                        li.className = 'grey';
                        li.innerHTML = "$ " + result.data[i].prices[0].price + " / " + result.data[i].prices[0].interval + " <b>OR</b> " + "$ " + result.data[i].prices[1].price + " / " + result.data[i].prices[1].interval;
                        ul.appendChild(li);
                }
                let li3 = document.createElement('li');
                li3.innerHTML = counter + " users";
                counter = counter +1;
                ul.appendChild(li3);
                result.data[i].prices.forEach((price) =>{
                    if (result.data[i].prices[1] == null) {
                        let input = document.createElement('input');
                        input.className = 'button';
                        input.id = 'selected';
                        input.type = 'submit';
                        input.value = 'selected';
                        input.name = price.id;
                        ul.appendChild(input);
                    }
                    else {
                        let input = document.createElement('input');
                        input.className = 'button';
                        input.type = 'submit';
                        input.value = price.interval;
                        input.name = price.id;
                        ul.appendChild(input);
                    }
                })
                div.appendChild(ul);
                f.appendChild(div);
        }
            $('input[type="submit"]').click((e) => {
                let productId = e.target.name;
                let productJson = {};
                productJson.id = productId;
                productJson.quantity = 1;
                $.post('http://localhost:5000/purchase', productJson)
                    .done((link) => {
                             window.location.replace(link);
                    })

            })
    })


// let json= {id: 'price_1MFYT9EyaWpE1SJQ820Ly78z', quantity: 1};
// $("document").ready(() => {
//
//         $('input[name="select"]').click((e) => {
//                 console.log("Hello dor");
//                 $.post('http://localhost:5000/purchase')
//                     .done((link) => {
//                             window.location.replace(link);
//                     })
//
//         })
// });




