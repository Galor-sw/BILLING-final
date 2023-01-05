import {url} from './urlService.js';

const urlEndPoint = url();

$.get(`${urlEndPoint}/plan-management/users/galorstudent@gmail.com/plans`)
    .done((result) => {

        // Create container
        let container = document.getElementsByClassName('container')[0];

        // Create card for each plan
        for (let i in result.plans) {

            // shortcut for exact plan in the loop
            const currentPlan = result.plans[i]

            let cardFrame = document.createElement('div');
            cardFrame.className = 'columns';
            let card = document.createElement('ul');
            card.className = 'price';

            // Adding header with plan name
            card.appendChild(createLi(currentPlan.name, 'header'));

            // Adding prices
            if (currentPlan.name == "Free") {
                card.appendChild(createLi('Free of charge', 'grey'));
            } else {
                card.appendChild(createLi(`$ ${currentPlan.prices.month.amount} 
                                                    per 
                                                    ${currentPlan.prices.month.interval}  
                                                    <br> <b>OR</b> <br>
                                                    $ ${currentPlan.prices.year.amount} 
                                                    per 
                                                    ${currentPlan.prices.month.interval}`,
                    'grey'));
            }

            // Adding details
            card.appendChild(createLi(`Seats: ${currentPlan.seats} 
                            <br> 
                            Credits: ${currentPlan.credits}`));

            // Create a new div for the buttons
            let buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'buttonsDiv';

            let buttonClassName;
            // Select buttons class for choosing the current plan
            if (currentPlan.name == result.currentPlan) {
                buttonClassName = 'selected'
            } else {
                buttonClassName = 'button'
            }
            // Create the buttons
            if (currentPlan.name == "Free") {
                buttonsDiv.appendChild(createSubmitButton(currentPlan.prices.month.interval, buttonClassName));
            } else {
                buttonsDiv.appendChild(createSubmitButton(currentPlan.prices.month.interval, buttonClassName));
                buttonsDiv.appendChild(createSubmitButton(currentPlan.prices.year.interval, buttonClassName));
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
            $.post(`${urlEndPoint}/plans`, productJson)
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

