
// const VoiceResponse = require('twilio').twiml.VoiceResponse;

const disconnectTwiml = `<?xml version="1.0" encoding="UTF-8"?>
  <Response>
  <Say voice="Polly.Joanna" language="en-US">
  Thank you!
  </Say>
  <Pause>1</Pause>
  <Say voice="Polly.Joanna" language="en-US">
  We look forward to seeing you!
  </Say>
  <Pause>1</Pause>
  <Hangup/>
  </Response>`;

const confirmAppointmentTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Say voice="Polly.Joanna" language="en-US">
<p>Your appointment is confirmed.</p>
</Say>
<Say voice="Polly.Joanna" language="en-US">
<p>We look forward to seeing you.</p>
</Say>
<Hangup/>
</Response>`;

const redirectWelcomeTwiml = `<?xml version="1.0" encoding="UTF-8"?><Response>
<Say voice="Joanna" language="en-US">
Replay message
</Say>
<Redirect>/ivr/welcome</Redirect>
</Response>`;


const appointmentConfirmStartTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Gather input="speech dtmf" timeout="5" 
 numDigits="1" action="/ivr/menu" method="POST">

<Say voice="Polly.Joanna">

<prosody  rate="90%" >
Appointment Reminder for Tammy,
<break time='300ms'/>
You have an appointment with:
<break time='300ms'/>
Dr. Jeffrey Ross Gunter MD  
<break time='300ms'/>
on:
4/20/2022 
<break time='500ms'/>
at 07:00 PM
<break time='300ms'/>
at:
Canyon Dermatology and Skin Cancer Center.
<break time='500ms'/>
We are located at:
1101 4th Avenue, Canyon, TX
<break time='1000ms'/>
If you have any questions, you can call us at:
<say-as interpret-as="telephone">(806)391-8220</say-as>
<break time='1000ms'/>
To confirm this appointment, press 1.
<break time='1000ms'/>
To hear this appointment message again, press 2.
<break time='1000ms'/>
To end this call, press 3.
<break time='5000ms'/>
</prosody>

<prosody  rate="100%" pitch="+10%" >
<p>Thank You!</p>
<p>We look forward to seeing you!</p>
</prosody>

<break time='1000ms'/>

</Say>
</Gather>
</Response>
`;

const badKeyPressedTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Gather input="speech dtmf" timeout="5" 
 numDigits="1" action="/ivr/menu" method="POST">

<Say voice="Polly.Joanna">

<prosody  rate="90%" >
<p>Unknown key pressed<p>
To confirm this appointment, press 1.
<break time='1000ms'/>
To hear this appointment message again, press 2.
<break time='1000ms'/>
To end this call, press 3.
<break time='5000ms'/>
</prosody>

<prosody  rate="100%" pitch="+10%" >
<p>Thank You!</p>
<p>We look forward to seeing you!</p>
</prosody>

<break time='1000ms'/>

</Say>
</Gather>
</Response>
`;

exports.welcome = function welcome(body) {
  console.log('welcome body:', body);

  // Based on the direction of the call figure out who called/we called
  let recipientPhone;
  if(body.Direction == 'inbound')
    recipientPhone = body.Caller;
  else recipientPhone = body.To;

  // Look up this phone number for pending appointment confirmations in database
  console.log('Playing Appointment Reminder for Recipient @', recipientPhone);

  return appointmentConfirmStartTwiml;
};

exports.menu = function menu(digit, body) {
  console.log('menu body:', body);
  console.log('menu digit:', digit);
  switch (digit) {
    case '1':
      return confirmAppointment(body);
    case '2':
      return redirectWelcomeTwiml;
    case '3':
      return disconnectCall(body);
    default:
      return badKeyPressedTwiml;
  }
};


/**
 * ConfirmAppointment
 * Returns Twiml
 * @return {String}
 */
function confirmAppointment(body) {
// Based on the direction of the call figure out who called/we called
  let recipientPhone;
  if(body.Direction == 'inbound')
    recipientPhone = body.Caller;
  else recipientPhone = body.To;

  // Look up this phone number for pending appointment confirmations in database
  console.log('Confirming Appointment for Recipient @', recipientPhone);

  return confirmAppointmentTwiml;
}

/**
 * Disconnect call via press of #3
 * Returns Twiml
 * @return {String}
 */
function disconnectCall(body) {
  // Based on the direction of the call figure out who called/we called
  let recipientPhone;
  if(body.Direction == 'inbound')
    recipientPhone = body.Caller;
  else recipientPhone = body.To;

  // Look up this phone number for pending appointment confirmations in database
  console.log('disconnectCall Appointment for Recipient @', recipientPhone);


  return disconnectTwiml;
}

