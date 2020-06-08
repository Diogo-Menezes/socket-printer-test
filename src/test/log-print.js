const formatValue = require('../utils/formatValue');

const object = require('../mock/mockedOrder');

function logPrint() {
  console.log('print function called');

  const date = new Intl.DateTimeFormat('en-UK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).format(new Date(object.createdAt));

  //Header

  console.log('');
  console.log('');
  console.log('');

  console.log('Loql order');

  console.log(`Order no: ${object.orderNum}`);
  console.log('');
  console.log(`Delivery: ${object.customer.deliveryOptions}`);
  console.log('');
  console.log(`Allergies/Intolerance:`);
  console.log(
    object.customer.allergiesIntolerances
      ? object.customer.allergiesIntolerances
      : 'N/A',
  );
  console.log('');

  console.log(object.stripePaid ? ' Online ' : ' Pay on collection ');

  console.log('');
  console.log('Order received');
  console.log(date);
  console.log('');

  console.log(`Quantity   Name    Price`);
  console.log('-------------------------------------------------------');

  //Basket
  object.basket.forEach(item => {
    console.log(`${item.quantity}    ${item.name}   ${item.price}`);

    if (item.optionName !== '') {
      console.log(`      ${item.optionName}    ${item.optionPrice}`);
    }

    if (item.extras.length > 0) {
      item.extras.forEach(extra => {
        console.log(`      ${extra.extraName}    ${extra.extraPrice}`);
      });
    }
  });

  const formattedTotal = formatValue(object.amount);

  //Total

  console.log('');
  console.log(`Total: ${formattedTotal}`);
  console.log('');
  console.log('');

  //Special Requests
  console.log('Special Requests:');
  console.log(
    object.customer.specialRequest ? object.customer.specialRequest : 'N/A',
  );
  console.log('');
  console.log('');

  //Customer Details
  console.log('Customer details:');
  console.log(`${object.customer.firstName} ${object.customer.lastName}`);

  //Phone
  object.customer.phone && console.log(`${object.customer.phone}`);

  //House number + street
  object.customer.houseNumber &&
    console.log(`${object.customer.houseNumber} ${object.customer.street}`);

  //Town
  object.customer.townCity && console.log(`${object.customer.townCity}`);

  //PostCode
  object.customer.postcode && console.log(`${object.customer.postcode}`);

  console.log('');
  console.log('');
  console.log('');
  console.log('');
  console.log('');
  console.log(
    '------------------------------------------------------',
  );
}

logPrint();
