import { Component, OnInit } from '@angular/core';
import * as postscribe from 'postscribe'

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  constructor() { }

  ngOnInit() {

    postscribe('#my-card', `<script>
    var paymentezCheckout = new PaymentezCheckout.modal({
        client_app_code: 'PAYMENTEZ_CLIENT_APP_CODE', // Client Credentials Provied by Paymentez
        client_app_key: 'PAYMENTEZ_CLIENT_APP_KEY', // Client Credentials Provied by Paymentez
        locale: 'es', // User's preferred language (es, en, pt). English will be used by default.
        env_mode: 'stg', // 'prod', 'stg', 'dev', 'local' to change environment. Default is 'stg'
        onOpen: function() {
            console.log('modal open');
        },
        onClose: function() {
            console.log('modal closed');
        },
        onResponse: function(response) { // The callback to invoke when the Checkout process is completed

            /*
                  In Case of an error, this will be the response.
                  response = {
                    "error": {
                      "type": "Server Error",
                      "help": "Try Again Later",
                      "description": "Sorry, there was a problem loading Checkout."
                    }
                  }

                  When the User completes all the Flow in the Checkout, this will be the response.
                  response = {
                    "transaction":{
                        "status":"success", // success or failure
                        "id":"CB-81011", // transaction_id
                        "status_detail":3 // for the status detail please refer to: https://paymentez.github.io/api-doc/#status-details
                    }
                  }
                */
            console.log('modal response');
            document.getElementById('response').innerHTML = JSON.stringify(response);
        }
    });

    var btnOpenCheckout = document.querySelector('.js-paymentez-checkout');
    btnOpenCheckout.addEventListener('click', function() {
        // Open Checkout with further options:
        paymentezCheckout.open({
            user_id: '1234',
            user_email: 'eguillen@paymentez.com', //optional
            user_phone: '7777777777', //optional
            order_description: '1 Licencia Estándar (IVA y gastos adm. incluidos)',
            order_taxable_amount: 1,
            order_tax_percentage: 12,
            order_amount: 5,
            order_vat: 0.12,
            order_reference: '#234323411',
        });
    });

    // Close Checkout on page navigation:
    window.addEventListener('popstate', function() {
        paymentezCheckout.close();
    });
</script>`)
  }

}
