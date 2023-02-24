<h1> BILLING-phase1</h1>
<h2>A service that allows clients to manage plans and subscriptions
and charge the client's users accordingly</h2>
<h3>Description:</h3>
The service will have three plans:
<ol>
<li>Free</li>
<li>Pro</li>
<li>Premium</li>
</ol>
The service provides a list of all the plans and it's details for the user.
The services will show the  client's user which subscription he owns.
THe client's user will be able to choose another plan.
The service will charge the client's user accordingly (and it will do a renewal for the subscription in an interval of time).
<h3>Working of the project</h3>
<p>Sequence diagram</p>
<img width="335" alt="image" src="https://user-images.githubusercontent.com/80041527/211177017-a4996035-e9cf-443b-a2d6-116f3c8dd71d.png">
<p>ERD</p>
<img width="183" alt="image" src="https://user-images.githubusercontent.com/80041527/211177586-9f19ddb5-4362-4fcf-858f-a742fb4a0945.png">
<p>Flow diagram- purchase</p>
<img width="177" alt="image" src="https://user-images.githubusercontent.com/80041527/211177042-3e2dad95-52e5-4470-8caa-c2f2b97bd8c2.png">
<p>Flow diagram- renewal</p>
<img width="180" alt="image" src="https://user-images.githubusercontent.com/80041527/211177094-b438a636-d937-4699-8a86-11028a4f6c7e.png">
<p>Select plan you want to buy.</p>
<img width="960" alt="image" src="https://user-images.githubusercontent.com/80041527/211153758-ddd827b6-3853-4a75-82d1-9b33401a0622.png">
<p>The selection will take you to an appropriate Stripe purchase page</p>
<img width="943" alt="image" src="https://user-images.githubusercontent.com/80041527/211153792-3569a9bd-a9bb-40c1-ac64-6f73c896f5d2.png">
<p>Get feedback page if the payment was successful.</p>
<img width="958" alt="image" src="https://user-images.githubusercontent.com/80041527/211154160-4932402f-302d-4a61-ac22-baff149fd4aa.png">

<h3>Installation Guide</h3>
<ol>
<li>clone git repository:  </li>
<li>add file: '.env' into config folder </li>
<li>run: 'npm install'</li>
<li>run: 'npm run start'</li>
<li>if you are in dev mode change url to 'http://localhost:5000/'</li>
<li>run in render: https://billing-final-phase1-development.onrender.com/accounts/63b9727c238a2058c3fe4fb2</li>
<li>this is example, account_id : 63b9727c238a2058c3fe4fb2 will provide this account plan selected and option to upgrade</li>
<li>mongoDB: https://cloud.mongodb.com/v2/63aad8f5198ef05c11eb7c72#/metrics/replicaSet/63aada4bc3881d4e4f1ffa14/explorer/billing/plans/find</li>
<li>Stripe: https://dashboard.stripe.com/login?redirect=%2Ftest%2Fdashboard</li>
<li>Notion: https://www.notion.so/c3bff7005a344f728a6cae4d66fee5ee?v=4b106978d3754261b125c444ef0fa25c&p=b1cd15ed9f924f28990c6dfed80314fc&pm=s </li>
<li>API DOCS: https://documenter.getpostman.com/view/24149950/2s8Z75S9pC</li>
</ol>
<h3>MIT License</h3>

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

