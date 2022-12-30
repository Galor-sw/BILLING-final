
$.get('http://localhost:5000/plans')
    .done((result) => {
        // let product=JSON.stringify(result);
        let f = document.getElementById('form-box');
        let counter = 1;
        for (let i in result.data) {

            let div = document.createElement('div');
            div.className = 'columns';
            let ul = document.createElement('ul');
            ul.className = 'price';
            let li = document.createElement('li');
            li.className = 'header';
            li.innerHTML = result.data[i].name;
            ul.appendChild(li);

            if (!result.data[i].prices[1]) {
                let li = document.createElement('li');
                li.className = 'grey';
                li.innerHTML = "$ " + result.data[i].prices[0].price;
                ul.appendChild(li);
            } else {
                let li = document.createElement('li');
                li.className = 'grey';
                li.innerHTML = "$ " + result.data[i].prices[0].price + " / " + result.data[i].prices[0].interval + " <b>OR</b> " + "$ " + result.data[i].prices[1].price + " / " + result.data[i].prices[1].interval;
                ul.appendChild(li);
            }
            let li3 = document.createElement('li');
            li3.innerHTML = counter + " users";
            counter = counter + 1;
            ul.appendChild(li3);
            let buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'buttonsDiv';
            result.data[i].prices.forEach((price) => {
                if (result.data[i].prices[1] == null) {
                    let input = document.createElement('input');
                    buttonsDiv.className = 'buttonsDivSelected';
                    input.className = 'button';
                    input.id = 'selected';
                    input.type = 'submit';
                    input.value = 'selected';
                    input.name = price.id;
                    buttonsDiv.appendChild(input);
                } else {
                    let input = document.createElement('input');
                    input.className = 'button';
                    input.type = 'submit';
                    input.value = price.interval;
                    input.name = price.id;
                    buttonsDiv.appendChild(input);
                }
            })
            ul.appendChild(buttonsDiv);
            div.appendChild(ul);
            f.appendChild(div);
        }
        $('input[type="submit"]').click((e) => {
            let productId = e.target.name;
            let productJson = {};
            productJson.id = productId;
            productJson.quantity = 1;
            $.post('http://localhost:5000/plans', productJson)
                .done((link) => {
                    window.location.replace(link);
                })

        })
    })





