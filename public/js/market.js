import { url } from './urlService.js';

const urlEndPoint = url();
const userId = window.location.href.split('/')[4];

$.get(`${urlEndPoint}/accounts/${userId}/plans`)
  .done((result) => {
    // Create container
    const container = document.getElementsByClassName('container')[0];

    // Create card for each plan
    for (const i in result.plans) {
      // shortcut for the plan in the current loop
      const currentPlan = result.plans[i];

      const cardFrame = document.createElement('div');
      cardFrame.className = 'columns';
      const card = document.createElement('ul');
      card.className = 'price';

      // Adding header
      card.appendChild(createLi(currentPlan.name, 'header'));

      // Adding prices
      if (currentPlan.name == 'Free') {
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

      // adding features
      card.appendChild(createLi(`Features:
                                        <br>
                                        ${currentPlan.features[0]}
                                        <br>
                                        ${currentPlan.features[1]}
                                        <br>
                                        ${currentPlan.features[2]}`));

      // Adding buttons
      card.appendChild(createButtonsDiv(currentPlan, result.clientPlan));

      // Append all
      cardFrame.appendChild(card);
      container.appendChild(cardFrame);
    }

    $('input[type="submit"]').click((e) => {
      $.post(`${urlEndPoint}/accounts/${userId}/plans`, {
        name: e.target.name,
        interval: e.target.value,
        quantity: 1,
        accountId: userId
      })
        .done((link) => {
          window.location.replace(link);
        });
    });
  });

const createLi = (string, className = '') => {
  const li = document.createElement('li');
  if (className) {
    li.className = className;
  }
  li.innerHTML = string;

  return li;
};

const createSubmitButton = (value, planType, className = 'button', type = 'submit') => {
  const input = document.createElement('input');
  input.className = className;
  input.type = type;
  input.value = value;
  input.name = planType;
  return input;
};

const createButtonsDiv = (currentPlan, clientPlan) => {
  // Create a new div for the buttons
  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'buttonsDiv';

  // create default class
  let monthClassName = 'button';
  let yearClassName = 'button';

  // check for selected class
  if (currentPlan.name == clientPlan.name && clientPlan.type == 'month') {
    monthClassName = 'selected';
  } else if (currentPlan.name == clientPlan.name && clientPlan.type == 'year') {
    yearClassName = 'selected';
  }

  // create buttons with the required class
  buttonsDiv.appendChild(createSubmitButton(currentPlan.prices.month.interval, currentPlan.name, monthClassName));

  if (currentPlan.name != 'Free') {
    buttonsDiv.appendChild(createSubmitButton(currentPlan.prices.year.interval, currentPlan.name, yearClassName));
  }

  return buttonsDiv;
};
