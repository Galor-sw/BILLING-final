$.get('http://localhost:5000/plans')
    .done((result) => {

        // Create container
        let container = document.getElementById('container');

        // Create card for each plan
        for (let i in result) {

            let cardFrame = document.createElement('div');
            cardFrame.className = 'columns';
            let card = document.createElement('ul');
            card.className = 'price';

            // Adding header with plan name
            card.appendChild(createLi(result[i].name, 'header'));

            // Adding prices
            if (result[i].name == "Free") {
                card.appendChild(createLi('Free of charge', 'grey'));
            } else {
                card.appendChild(createLi(`$ ${result[i].prices.month.amount} 
                                                    per 
                                                    ${result[i].prices.month.interval}  
                                                    <br> <b>OR</b> <br>
                                                    $ ${result[i].prices.year.amount} 
                                                    per 
                                                    ${result[i].prices.month.interval}`,
                    'grey'));
            }

            // Adding details
            card.appendChild(createLi(`Seats: ${result[i].seats} 
                            <br> 
                            Credits: ${result[i].credits}`));

            // Create a new div for the buttons
            let buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'buttonsDiv';

            // Create the buttons
            // We will change that selected to be Dynamic
            if (result[i].name == "Free") {
                buttonsDiv.appendChild(createSubmitButton('selected'));
            } else {
                buttonsDiv.appendChild(createSubmitButton(result[i].prices.month.interval));
                buttonsDiv.appendChild(createSubmitButton(result[i].prices.year.interval));
            }

            // Append all
            card.appendChild(buttonsDiv);
            cardFrame.appendChild(card);
            container.appendChild(cardFrame);
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


const createLi = (string, className = '') => {
    let li = document.createElement('li');
    if (className) {
        li.className = className;
    }
    li.innerHTML = string;

    return li;
}

const createSubmitButton = (value, className = 'button', type = 'submit') => {

    let input = document.createElement('input');
    input.className = className;
    input.type = type;
    input.value = value;
    input.name = name;

    return input;
}

