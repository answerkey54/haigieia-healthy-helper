// TODO: move the api key to a separate file
const fetch = require("node-fetch");

function get_nutritional_information(food)
{
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "ApplicationGatewayAffinity=b001f71a48e62c89a2bc9438e34dce20; ApplicationGatewayAffinityCORS=b001f71a48e62c89a2bc9438e34dce20");

  var raw = JSON.stringify({
    "query": `${food}`
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://api.nal.usda.gov/fdc/v1/foods/search?api_key=JZfAg8Eu8kWcNUca5PVTnvEyFjNJioCYNknNWdw9", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error)); 
}

get_nutritional_information("kiwi")
