const _ = require('lodash');

const initial = (firstName, program, upcomingTerm) => {
	
	let career = '';
	let skill = '';
	
	if (_.includes(_.toLower(program), 'javascript')) {
		career = 'junior web developer';
		skill = 'websites';
	}
	
	if (_.includes(_.toLower(program), 'python')) {
		career = 'Python developer';
		skill = 'programs';
	}
	
	let str = `<div dir="ltr"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt">Hello ${firstName},</p>
		<br>
		<p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt">Thank you for your application to the Code Immersives program at the Digital Film Academy in New York City. Our accredited, eleven-month program prepares you for a career as a ${career}, starting from the very basics of programming. By the end of the program, you will be able to write ${skill} from scratch and deploy them on the cloud.</p>
		<br>
		<p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt">Unlike a coding “boot camp,” which typically runs for three to six months, our program takes a slower approach to make sure that everyone can follow along. We have an excellent group of fun and engaging instructors who are happy to meet after class for additional assistance.</p>
		<br>
		<p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt">Tuition for the three-term program is $17,995. We accept GI Bill benefits and financial aid, including Pell Grants, government student loans and private student loans through <a href="https://climbcredit.com/">Climb</a>. Whether you are a United States civilian, veteran, or international student, we will work with you to manage the cost of tuition.</p>
		<br>
		<p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt">Classes run Monday - Thursday, from 10:30 AM to 4:00 PM, with an hour lunch break in the afternoon.</p>
		<br>
		<p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt">We are currently enrolling students in our upcoming ${upcomingTerm} term. <b>If you are interested in attending, we encourage you to respond to this email to continue the application process.</b> Simply reply with an indication that you’d like to proceed and I will send you the relevant materials!</p>
		<br>
		<p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt">Warm regards,</p>
		<p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt">Jay Vachon</p></div>`;

	return str;
};

module.exports = {
	initial,
};