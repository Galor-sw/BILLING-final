<h1> BILLING - final assignment </h1>
<h2>We are the Billing team, responsible for charging clients and managing company-wide subscription plans</h2>
<h3>Description:</h3>
plans:
<ol>
<li>Free</li>
<li>Pro</li>
<li>Premium</li>
</ol>

our features:
<ol>
  <li>Purchase plan: This refers to the process by which clients can select and purchase a subscription plan for your company's services.</li>
  <li>Change plan: This refers to the ability for clients to modify their existing subscription plan, such as upgrading or downgrading to a different plan.</li>
  <li>Contact us: This likely refers to a feature on your website or platform that allows clients to get in touch with your team if they have any questions or issues related to their subscription or payment.</li>
  <li>Purchase with credit card or bank transfer: This refers to the payment options available to clients when purchasing a subscription plan. They can either pay with a credit card or initiate a bank transfer.</li>
  <li>Statistics: This refers to the data and metrics that your team collects and analyzes in order to better understand how clients are using your services and how to optimize the billing and subscription process.</li>
  <li>Contact with IAM team and GROWTH team: These likely refer to other teams within your company that are responsible for identity and access management (IAM) and growth initiatives, respectively. Contact with these teams may be necessary in order to coordinate efforts and ensure that all aspects of the subscription process are working smoothly.</li>
</ol>

<h3>Working of the project</h3>
billing system:

<ol>
  <li>New client flow:
    <ul>
      <li>A new client signs up and automatically receives a free plan.</li>
      <li>The client can view three plans, one of which is recommended and another is a best seller.</li>
      <li>If the client is an admin, they can purchase other plans (pro/premium).</li>
      <li>The client can pay with a credit card or bank transfer via a Stripe popup window.</li>
      <li>After completing the payment process, the client receives a success/fail system message and is redirected to the home page.</li>
    </ul>
  </li>
  <li>Existing client flow:
    <ul>
      <li>An existing client can view other plans by clicking on the "plans" link in the navigation bar.</li>
      <li>The existing plan is selected and highlighted with a gray button.</li>
      <li>The client can change their plan by clicking on any other button, which will be highlighted with a blue button.</li>
      <li>If the client wants to change from a paid plan to a free plan, they will be notified that the change will be approved at the end of their existing contract.</li>
      <li>If the client changes to another paid plan, it will be automatically updated and if the new charge is lower than the former, they will receive a refund.</li>
      <li>After the plan change process is complete, the client receives a message with an "OK!" button to redirect them to the home page.</li>
    </ul>
  </li>
  <li>Custom plan flow:
    <ul>
      <li>The client can click on the "contact us" button and fill out a textarea with their request for a custom plan.</li>
      <li>After clicking the "send!" button, a ticket is created in the billing system with the client's personal details and request.</li>
    </ul>
  </li>
</ol>
<h3>Installation Guide</h3>
<ol>
<li>clone git repository:  </li>
<ul>
<li>server side repository</li>
<li>client side repository</li>
</ul>
<li>add file: '.env' into main root of the server side </li>
<li>server + client - run: 'npm i'</li>
<li>server - run: 'npm run start'</li>
<li>client run: 'npm start'</li>
<li>for dev Mode change url to 'http://localhost:5000/'</li>
<li>run the client side - by sign up to the system - than the other flows we presented earlier</li>
</ol>

<h3>credits:</h3>
<h4>The Team-</h4>
<ul>
<li>Alona Rozner, Alonarozner4@gmail.com</li>
<li>Dor Haimovich, dorhaim765@gmail.com</li>
<li>Gal Or, galor546@gmail.com</li>
<li>Gil Davidi, gildavidi75@gmail.com</li>
<li>Itay Aharoni, itay45977@gmail.com</li>

</ul>
<h4>The Lecturer-</h4>
David Avigad, DavidAvigad@shenkar.ac.il

