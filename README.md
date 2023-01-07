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
![image](https://user-images.githubusercontent.com/80041527/211164192-7988d540-392b-455d-8438-896527b7a97c.png)
<p>ERD</p>
<img width="189" alt="image" src="https://user-images.githubusercontent.com/80041527/211164340-bc1176e3-32f2-46b4-8103-bb2f113b48bd.png">
<p>Flow diagram- purchase</p>
![image](https://user-images.githubusercontent.com/80041527/211164378-57259be2-5b9a-47eb-9b36-5d0eabd8e0e4.png)
<p>Flow diagram- renewal</p>
![image](https://user-images.githubusercontent.com/80041527/211164424-bc511327-6c83-4b08-a83f-2183586ee084.png)
<p>Select plan you want to buy.</p>
<img width="960" alt="image" src="https://user-images.githubusercontent.com/80041527/211153758-ddd827b6-3853-4a75-82d1-9b33401a0622.png">
<p>The selection will take you to an appropriate Stripe purchase page</p>
<img width="943" alt="image" src="https://user-images.githubusercontent.com/80041527/211153792-3569a9bd-a9bb-40c1-ac64-6f73c896f5d2.png">
<p>Get feedback page if the payment was successful.</p>
<img width="958" alt="image" src="https://user-images.githubusercontent.com/80041527/211154160-4932402f-302d-4a61-ac22-baff149fd4aa.png">

<h3>Installation Guide</h3>
TODO: add links and missing sections.
<ol>
<li>clone git repository:  </li>
<li>add file: '.env' into config folder </li>
<li>run: 'npm install'</li>
<li>run: 'npm run start'</li>
<li>run: 'http://localhost:5000/' if you are working in development </li>
<li>run in render: </li>
<li>mongoDB:</li>
<li>API DOCS:</li>
</ol>
<h3>Contributing Guidelines</h3>
TODO: another things you want to add...
<h3>License</h3>
TODO: ask DAVID



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

