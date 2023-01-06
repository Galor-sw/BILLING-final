import {url} from './urlService.js';

const urlEndPoint = url();
const userId = window.location.href.split('/')[4];

$.get(`${urlEndPoint}/plan-management/users/${userId}/plans`)
    .done((result) => {

        // Create container
        let container = document.getElementsByClassName('container')[0];

        // Create card for each plan
        for (let i in result.plans) {

            // shortcut for the plan in the current loop
            const currentPlan = result.plans[i]

            let cardFrame = document.createElement('div');
            cardFrame.className = 'columns';
            let card = document.createElement('ul');
            card.className = 'price';

            // Adding header
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

            // Adding buttons
            card.appendChild(createButtonsDiv(currentPlan, result.clientPlan));

            // Append all
            cardFrame.appendChild(card);
            container.appendChild(cardFrame);
        }

        $('input[type="submit"]').click((e) => {

            $.post(`${urlEndPoint}/plan-management/users/${userId}/plans`, {
                name: e.target.name,
                interval: e.target.value,
                quantity: 1
            })
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

const createSubmitButton = (value, planType, className = 'button', type = 'submit') => {

    let input = document.createElement('input');
    input.className = className;
    input.type = type;
    input.value = value;
    input.name = planType;
    return input;
}

const createButtonsDiv = (currentPlan, clientPlan) => {

    // Create a new div for the buttons
    let buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'buttonsDiv';

    // create default class
    let monthClassName = 'button'
    let yearClassName = 'button'

    // check for selected class
    if (currentPlan.name == clientPlan.name && clientPlan.type == 'month') {
        monthClassName = 'selected'
    } else if (currentPlan.name == clientPlan.name && clientPlan.type == 'year') {
        yearClassName = 'selected'
    }

    // create buttons with the required class
    buttonsDiv.appendChild(createSubmitButton(currentPlan.prices.month.interval, currentPlan.name, monthClassName));

    if (currentPlan.name != "Free") {
        buttonsDiv.appendChild(createSubmitButton(currentPlan.prices.year.interval, currentPlan.name, yearClassName));
    }

    return buttonsDiv
}
