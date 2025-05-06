import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../common/Footer';

const TermsAndConditions = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-poppins">
      {/* Header Banner */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-lg">Guidelines for using our website and services</p>
          <div className="flex gap-2 mt-4 text-sm">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="opacity-70">Terms and Conditions</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Agreement to Terms</h2>
            <p className="mb-4">
              Welcome to Ligaya and UST Volunteers for UNICEF website. These Terms and Conditions constitute a legally binding 
              agreement made between you and Ligaya ("we," "us," or "our"), concerning your access to and use of our website.
            </p>
            <p className="mb-4">
              By accessing or using our website, you agree to be bound by these Terms and Conditions. If you disagree with any 
              part of these terms, you may not access the website.
            </p>
            <p>
              Last Updated: May 6, 2025
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Intellectual Property Rights</h2>
            <p className="mb-4">
              Unless otherwise indicated, the website is our proprietary property and all source code, databases, functionality, 
              software, website designs, audio, video, text, photographs, and graphics on the site (collectively, the "Content") 
              and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or 
              licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.
            </p>
            <p className="mb-4">
              The Content and Marks are provided on the website "AS IS" for your information and personal use only. Except as 
              expressly provided in these Terms and Conditions, no part of the website and no Content or Marks may be copied, 
              reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, 
              distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express 
              prior written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">User Representations</h2>
            <p className="mb-4">
              By using the website, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>All information you provide is true, accurate, current, and complete.</li>
              <li>You have the legal capacity to agree to these Terms and Conditions.</li>
              <li>You are not a minor in the jurisdiction in which you reside, or if you are a minor, you have received parental permission to use the site.</li>
              <li>You will not access the website through automated or non-human means.</li>
              <li>You will not use the website for any illegal or unauthorized purpose.</li>
              <li>Your use of the website will not violate any applicable law or regulation.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Volunteer Registration</h2>
            <p className="mb-4">
              To register as a volunteer, you may be asked to provide certain information, including your name, email address, 
              phone number, and other relevant details. You agree to provide accurate and complete information during the 
              registration process and to update such information to keep it accurate and current.
            </p>
            <p className="mb-4">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept 
              responsibility for all activities that occur under your account or password. We reserve the right to refuse 
              service, terminate accounts, remove or edit content, or cancel volunteer opportunities at our sole discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Donations</h2>
            <p className="mb-4">
              All donations made through our website are voluntary and non-refundable. By making a donation, you represent 
              and warrant that:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>The donation is made voluntarily and without expectation of return.</li>
              <li>You have the legal authority to make the donation.</li>
              <li>Your donation comes from a legitimate source and is not the proceeds of any illegal activity.</li>
              <li>All information you provide in connection with your donation is accurate and complete.</li>
            </ul>
            <p className="mb-4">
              We will issue appropriate receipts for tax purposes as required by law. We reserve the right to decline any donation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Prohibited Activities</h2>
            <p className="mb-4">
              You may not access or use the website for any purpose other than that for which we make the website available. 
              The website may not be used in connection with any commercial endeavors except those that are specifically 
              endorsed or approved by us.
            </p>
            <p className="mb-4">
              As a user of the website, you agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Systematically retrieve data or other content from the website to create or compile, directly or indirectly, a collection, compilation, database, or directory.</li>
              <li>Make any unauthorized use of the website, including collecting usernames and/or email addresses of users by electronic or other means.</li>
              <li>Use the website to advertise or offer to sell goods and services.</li>
              <li>Circumvent, disable, or otherwise interfere with security-related features of the website.</li>
              <li>Engage in unauthorized framing of or linking to the website.</li>
              <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information.</li>
              <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
              <li>Engage in any automated use of the system, such as using scripts to send comments or messages.</li>
              <li>Interfere with, disrupt, or create an undue burden on the website or the networks or services connected to the website.</li>
              <li>Attempt to impersonate another user or person.</li>
              <li>Use any information obtained from the website in order to harass, abuse, or harm another person.</li>
              <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material that interferes with any party's uninterrupted use and enjoyment of the website.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">User Generated Contributions</h2>
            <p className="mb-4">
              The website may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and 
              other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, 
              publish, distribute, or broadcast content and materials to us or on the website, including but not limited to text, 
              writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material 
              (collectively, "Contributions").
            </p>
            <p className="mb-4">
              Any Contribution you post to the site will be considered non-confidential and non-proprietary. By posting any 
              Contribution to the site, you grant us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, 
              transferable, royalty-free, fully-paid, worldwide right, and license to host, use, copy, reproduce, disclose, 
              sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform, publicly display, reformat, 
              translate, transmit, excerpt (in whole or in part), and distribute such Contributions for any purpose, commercial, 
              advertising, or otherwise, and to prepare derivative works of, or incorporate into other works, such Contributions, 
              and grant and authorize sublicenses of the foregoing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Third-Party Website and Content</h2>
            <p className="mb-4">
              The website may contain links to other websites ("Third-Party Websites") as well as articles, photographs, text, 
              graphics, pictures, designs, music, sound, video, information, applications, software, and other content or 
              items belonging to or originating from third parties ("Third-Party Content").
            </p>
            <p className="mb-4">
              Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, 
              appropriateness, or completeness by us, and we are not responsible for any Third-Party Websites accessed through 
              the website or any Third-Party Content posted on, available through, or installed from the website, including 
              the content, accuracy, offensiveness, opinions, reliability, privacy practices, or other policies of or contained 
              in the Third-Party Websites or the Third-Party Content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Site Management</h2>
            <p className="mb-4">
              We reserve the right, but not the obligation, to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Monitor the website for violations of these Terms and Conditions.</li>
              <li>Take appropriate legal action against anyone who, in our sole discretion, violates the law or these Terms and Conditions.</li>
              <li>Refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof.</li>
              <li>In our sole discretion and without limitation, notice, or liability, to remove from the website or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems.</li>
              <li>Otherwise manage the website in a manner designed to protect our rights and property and to facilitate the proper functioning of the website.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Disclaimer</h2>
            <p className="mb-4">
              THE WEBSITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE WEBSITE AND OUR 
              SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS 
              OR IMPLIED, IN CONNECTION WITH THE WEBSITE AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED 
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="mb-4">
              WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE WEBSITE'S CONTENT OR THE 
              CONTENT OF ANY WEBSITES LINKED TO THE WEBSITE AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS.</li>
              <li>PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE WEBSITE.</li>
              <li>ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN.</li>
              <li>ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE WEBSITE.</li>
              <li>ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE WEBSITE BY ANY THIRD PARTY.</li>
              <li>ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE WEBSITE.</li>
            </ul>
            <p className="mb-4">
              WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED 
              BY A THIRD PARTY THROUGH THE WEBSITE, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED 
              IN ANY BANNER OR OTHER ADVERTISING.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Limitations of Liability</h2>
            <p className="mb-4">
              IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, 
              INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, 
              LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE WEBSITE, EVEN IF WE HAVE BEEN ADVISED OF THE 
              POSSIBILITY OF SUCH DAMAGES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Indemnification</h2>
            <p className="mb-4">
              You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our 
              respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or 
              demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Your Contributions.</li>
              <li>Use of the website.</li>
              <li>Breach of these Terms and Conditions.</li>
              <li>Any breach of your representations and warranties set forth in these Terms and Conditions.</li>
              <li>Your violation of the rights of a third party, including but not limited to intellectual property rights.</li>
              <li>Any overt harmful act toward any other user of the website with whom you connected via the website.</li>
            </ul>
            <p className="mb-4">
              Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defense and control 
              of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our 
              defense of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding 
              which is subject to this indemnification upon becoming aware of it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Term and Termination</h2>
            <p className="mb-4">
              These Terms and Conditions shall remain in full force and effect while you use the website. WITHOUT LIMITING ANY 
              OTHER PROVISION OF THESE TERMS AND CONDITIONS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT 
              NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE WEBSITE (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY 
              PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, 
              OR COVENANT CONTAINED IN THESE TERMS AND CONDITIONS OR OF ANY APPLICABLE LAW OR REGULATION.
            </p>
            <p className="mb-4">
              If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new 
              account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on 
              behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take 
              appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Modifications and Interruptions</h2>
            <p className="mb-4">
              We reserve the right to change, modify, or remove the contents of the website at any time or for any reason at 
              our sole discretion without notice. However, we have no obligation to update any information on our website. 
              We also reserve the right to modify or discontinue all or part of the website without notice at any time.
            </p>
            <p className="mb-4">
              We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance 
              of the website.
            </p>
            <p className="mb-4">
              We cannot guarantee the website will be available at all times. We may experience hardware, software, or other 
              problems or need to perform maintenance related to the website, resulting in interruptions, delays, or errors. 
              We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the website at any 
              time or for any reason without notice to you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Governing Law</h2>
            <p className="mb-4">
              These Terms and Conditions shall be governed by and defined following the laws of the Philippines. Ligaya and 
              yourself irrevocably consent that the courts of the Philippines shall have exclusive jurisdiction to resolve 
              any dispute which may arise in connection with these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="mb-2"><strong>Ligaya & UST Volunteers for UNICEF</strong></p>
              <p className="mb-2">Email: legal@ligaya.org</p>
              <p className="mb-2">Phone: (02) 8-123-4567</p>
              <p>Address: University of Santo Tomas, España Blvd, Sampaloc, Manila, Philippines</p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;