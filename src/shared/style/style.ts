export const style = `
 body,
      div,
      a {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        margin: 0;
        padding: 0;
      }
      img {
        -ms-interpolation-mode: bicubic;
        border: 0;
        outline: none;
        text-decoration: none;
      }
      body {
        width: 100% !important;
        background: #f8f9fa;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        color: #343a40;
      }
      a {
        text-decoration: none;
      }
      /* Email Container */
      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        border: 2px dashed #e99026;
        overflow: hidden;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      }
      /* Header with Gradient */
      .email-header {
        background: linear-gradient(135deg, #e99026, #f2c470);
        text-align: center;
        padding: 30px;
        color: #ffffff;
      }
      .email-header img {
        width: 80px;
        height: auto;
        margin-bottom: 10px;
      }
      .email-header h1 {
        margin: 0;
        font-size: 28px;
        letter-spacing: 1px;
      }
      /* Content Area */
      .email-content {
        padding: 30px 20px;
        text-align: left;
        line-height: 1.6;
      }
      .email-content h2 {
        font-size: 22px;
        color: #ff7e5f;
        margin-bottom: 10px;
      }
      .email-content p {
        font-size: 16px;
        margin: 10px 0;
      }
      .otp-code {
        display: block;
        font-size: 36px;
        font-weight: bold;
        color: #f2c470;
        background: #fefefe;
        border: 2px dashed #e99026;
        padding: 20px;
        margin: 20px 0;
        text-align: center;
        border-radius: 4px;
        letter-spacing: 2px;
      }
      .btn {
        display: inline-block;
        background: #e99026;
        color: #fff;
        padding: 12px 30px;
        font-size: 16px;
        border-radius: 4px;
        transition: background 0.3s ease;
      }
      .btn:hover {
        background: #f2c470;
      }
      /* Footer Area */
      .email-footer {
        background: #e99026;
        color: #fff;
        text-align: center;
        padding: 15px;
        font-size: 14px;
      }
      /* Preheader (hidden preview text) */
      .preheader {
        display: none;
        font-size: 1px;
        color: #f8f9fa;
        line-height: 1px;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
      }

      @media screen and (max-width: 600px) {
        .email-container {
          width: 100% !important;
        }
      }
`;
