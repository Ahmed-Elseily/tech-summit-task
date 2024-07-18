async function getJsonData() {
  const response = await fetch('data.json');
  const result = await response.json();
  console.log(result);
  displayCustomer(result);
  setupChart();
}

getJsonData();

function displayCustomer(data) {
  const customers = data.customers;
  const transactions = data.transactions;

  let dataBox = '';
  for (let i = 0; i < Math.min(5, customers.length); i++) {
      const customer = customers[i];
      const customerTransactions = transactions.filter(transaction => transaction.customer_id === customer.id);

      let transaction;
      if (customerTransactions.length) {
          transaction = customerTransactions[0];
      } else {
          transaction = { amount: 'N/A', date: 'N/A' };
      }

      dataBox += `<tr data-customer-id="${customer.id}">
                      <th scope="row">${customer.id}</th>
                      <td>${customer.name}</td>
                      <td>${transaction.amount}</td>
                      <td>${transaction.date}</td>
                  </tr>`;
  }

  document.querySelector("#rowData").innerHTML = dataBox;

  $(document).ready(function () {
      $('#customerTable').DataTable({
          paging: false,
          scrollY: 220,
          info: false,
          order: [[0, 'asc']],
          columns: [
              { title: '#' },
              { title: 'Name' },
              { title: 'Transaction' },
              { title: 'Date' }
          ]
      });

      $("#customerTable tbody").on("click", "tr", function () {
          const customerId = $(this).data("customer-id");
          const customerTransactions = transactions.filter(transaction => transaction.customer_id == customerId);
          updateChart(customerTransactions);
      });
  });
}

let myChart;
function setupChart() {
  const ctx = document.getElementById('myChart').getContext('2d');
  myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: [],
          datasets: [{
              label: 'Transaction Amounts',
              data: [],
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
          }]
      }
  });
}

function updateChart(transactions) {
  myChart.data.labels = transactions.map(t => t.date);
  myChart.data.datasets[0].data = transactions.map(t => t.amount);
  myChart.update();
}
